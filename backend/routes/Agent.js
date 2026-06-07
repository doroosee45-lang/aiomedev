import express from 'express';
import axios from 'axios';
import { protect } from '../middleware/Auth.js';
import { processAgentRequest, executeCode } from '../services/agentService.js';
import { dispatchTool } from '../services/toolsEngine.js';
import { detectDomains } from '../services/knowledgeBase.js';

const router = express.Router();

// ── POST /api/agent/chat (streaming SSE) ───────────
// Endpoint principal connecté au frontend Next.js
router.post('/chat', async (req, res) => {
  try {
    const { messages = [], mode = 'general', model, language = 'fr', agent } = req.body;
    if (!messages.length) return res.status(400).json({ error: 'Messages requis' });

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.flushHeaders();

    const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

    // Extraire le dernier message user
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) { send({ type: 'error', error: 'Aucun message utilisateur' }); return res.end(); }

    // Historique (tout sauf le dernier)
    const conversationHistory = messages.slice(0, -1).map(m => ({ role: m.role, content: m.content }));

    // Résoudre le mode — si agent, mapper vers un mode backend
    const agentToMode = { devops: 'devops', security: 'security', data: 'data', formation: 'formation', business: 'business', legal: 'legal', web: 'general' };
    const resolvedMode = agent ? (agentToMode[agent] || 'general') : (mode || 'general');

    send({ type: 'start', model: model || 'ollama' });

    let accumulated = '';
    const result = await processAgentRequest({
      message: lastUserMsg.content,
      conversationHistory,
      mode: resolvedMode,
      model,
      language,
      stream: true,
      onChunk: (chunk) => {
        accumulated += chunk;
        send({ type: 'text', content: chunk });
      },
      enableTools: true,
    });

    // Si engine demo ou non-streaming, envoyer d'un coup
    if (!accumulated && result.content) {
      const words = result.content.split(/(\s+)/);
      for (const word of words) {
        send({ type: 'text', content: word });
      }
    }

    send({ type: 'done', engine: result.engine, model: result.model, tokens: result.tokens, domains: result.domains });
    res.end();
  } catch (err) {
    try {
      res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
      res.end();
    } catch { /* client disconnected */ }
  }
});

// ── POST /api/agent/execute ─────────────────────────
router.post('/execute', protect, async (req, res) => {
  try {
    const { task, context, mode } = req.body;
    if (!task) return res.status(400).json({ error: 'Le champ "task" est requis.' });
    const result = await processAgentRequest({ message: task, conversationHistory: [], mode: mode || 'agent', stream: false, enableTools: true });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/agent/analyze ─────────────────────────
router.post('/analyze', protect, async (req, res) => {
  try {
    const { content, type, fileName } = req.body;
    if (!content) return res.status(400).json({ error: 'Le champ "content" est requis.' });
    const result = await processAgentRequest({ message: `Analyse ce ${type || 'contenu'} "${fileName || 'document'}":\n\n${content}`, conversationHistory: [], mode: 'general', stream: false, enableTools: true });
    res.json({ success: true, data: { analysis: result.content, tokens: result.tokens, engine: result.engine, domains: result.domains } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/agent/code/execute ────────────────────
router.post('/code/execute', protect, async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) return res.status(400).json({ error: '"code" et "language" requis.' });
    const result = await executeCode(code, language);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/agent/tool ────────────────────────────
router.post('/tool', protect, async (req, res) => {
  try {
    const { tool, args } = req.body;
    if (!tool) return res.status(400).json({ error: '"tool" requis.' });
    const result = await dispatchTool(tool, args || {});
    res.json({ success: true, data: { tool, result } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/agent/detect-domains ─────────────────
router.post('/detect-domains', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: '"message" requis.' });
    const domains = detectDomains(message);
    res.json({ success: true, data: { message: message.slice(0, 100), domains } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/agent/engine/status ───────────────────
router.get('/engine/status', async (req, res) => {
  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  let ollamaAvailable = false;
  let ollamaModels = [];
  try {
    const response = await axios.get(`${ollamaUrl}/api/tags`, { timeout: 3000 });
    ollamaAvailable = true;
    ollamaModels = (response.data.models || []).map(m => ({ name: m.name, size: m.size }));
  } catch { /* not running */ }

  const claudeKey = process.env.ANTHROPIC_API_KEY;
  const claudeAvailable = !!(claudeKey && claudeKey !== 'your_anthropic_api_key_here');
  const engineMode = process.env.AI_ENGINE || 'auto';
  const activeEngine = engineMode === 'claude' ? 'claude' : engineMode === 'ollama' ? 'ollama' : ollamaAvailable ? 'ollama' : claudeAvailable ? 'claude' : 'demo';

  res.json({
    success: true,
    data: {
      activeEngine, engineMode,
      engines: {
        ollama: { available: ollamaAvailable, url: ollamaUrl, models: ollamaModels, activeModel: process.env.OLLAMA_MODEL || 'llama3.1', description: 'IA locale — gratuite, privée, sans internet' },
        claude: { available: claudeAvailable, model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514', description: 'Anthropic API — requiert clé API' },
        demo: { available: true, description: 'Mode démo — réponses basiques' }
      },
      features: { toolsEnabled: true, knowledgeBase: true, autonomousLoop: true, codeExecution: true, streamingChat: true },
      tools: ['calculator', 'subnet', 'convertisseur', 'electronique', 'base', 'code', 'hash', 'liaison', 'regex', 'algorithme']
    }
  });
});

// ── GET /api/agent/modes ────────────────────────────
router.get('/modes', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'general',       name: 'Mode Général',              icon: '🧠', description: 'Encyclopédique — tous les domaines informatique & technologie', color: '#00D4FF', category: 'general' },
      { id: 'code',          name: 'Expert Code',               icon: '💻', description: 'Génération — 100+ langages, code production complet', color: '#00FF88', category: 'dev' },
      { id: 'programmation', name: 'Expert Programmation',      icon: '⌨️', description: 'Algorithmes, structures de données, paradigmes, design patterns', color: '#22C55E', category: 'dev' },
      { id: 'devops',        name: 'Expert DevOps',             icon: '⚙️', description: 'Docker, Kubernetes, CI/CD, Terraform, monitoring, cloud', color: '#3B82F6', category: 'dev' },
      { id: 'data',          name: 'Expert Data & IA',          icon: '📊', description: 'ML, Deep Learning, NLP, visualisation, MLOps', color: '#10B981', category: 'dev' },
      { id: 'telecom',       name: 'Expert Télécommunications', icon: '📡', description: '2G/3G/4G/5G, protocoles 3GPP, RF, VoIP, fibre, satellite', color: '#8B5CF6', category: 'tech' },
      { id: 'reseaux',       name: 'Expert Réseaux',            icon: '🌐', description: 'TCP/IP, Cisco IOS, routing, switching, VPN — niveau CCNP', color: '#06B6D4', category: 'tech' },
      { id: 'maintenance',   name: 'Expert Maintenance',        icon: '🔧', description: 'Diagnostic hardware, réparation, récupération données', color: '#F59E0B', category: 'tech' },
      { id: 'sciences',      name: 'Expert Sciences',           icon: '🔬', description: 'Mathématiques, Physique, Chimie, Électronique, Algèbre, RO', color: '#EC4899', category: 'sciences' },
      { id: 'security',      name: 'Expert Sécurité',           icon: '🔒', description: 'Cybersécurité défensive, audit OWASP, cryptographie', color: '#EF4444', category: 'security' },
      { id: 'strategie',     name: 'Stratégie Tech',            icon: '🚀', description: 'IA/ML, Cloud, IoT, Blockchain, transformation digitale Afrique', color: '#F97316', category: 'strategy' },
      { id: 'business',      name: 'Expert Business',           icon: '💼', description: 'Conseil stratégique, Mobile Money, marché africain, OHADA', color: '#D97706', category: 'business' },
      { id: 'analyst',       name: 'Analyste Stratégique',      icon: '📈', description: 'SWOT, modélisation financière, KPI, études de marché', color: '#A78BFA', category: 'business' },
      { id: 'legal',         name: 'Mode Juridique',            icon: '⚖️', description: 'Droit OHADA, RDC, contrats, fiscalité', color: '#FFD700', category: 'business' },
      { id: 'agent',         name: 'Agent Autonome',            icon: '🤖', description: 'Exécution autonome multi-étapes avec outils intégrés', color: '#FB923C', category: 'agent' },
      { id: 'formation',     name: 'Mode Formation',            icon: '📚', description: 'Contenus pédagogiques structurés, modules, quiz', color: '#FF6B6B', category: 'education' },
      { id: 'conception',    name: 'Conception Application',    icon: '🎨', description: 'Conçoit toute application: architecture, stack, schéma BDD, wireframes, API', color: '#00E5FF', category: 'conception' },
      { id: 'cahier',        name: 'Cahier des Charges',        icon: '📋', description: 'Génère CDC complets professionnels — toutes sections, user stories, risques', color: '#B39DDB', category: 'conception' },
      { id: 'architecture',  name: 'Architecture Logicielle',   icon: '🏗️', description: 'Patterns (C4, Clean, DDD, microservices), diagrammes ASCII, ADR', color: '#80DEEA', category: 'conception' },
      { id: 'planification', name: 'Planification Projet',      icon: '📅', description: 'WBS, Gantt ASCII, sprints, backlog MoSCoW, analyse risques, métriques', color: '#A5D6A7', category: 'conception' }
    ]
  });
});

// ── GET /api/agent/tools ────────────────────────────
router.get('/tools', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'calculator',  name: 'Calculatrice',         icon: '🔢', description: 'Évalue des expressions mathématiques complexes (π, e, √, puissances)', example: '[OUTIL: calculator | 2*PI*5]', category: 'math' },
      { id: 'subnet',      name: 'Subnet Calculator',    icon: '🌐', description: 'Calcul complet de sous-réseaux IP (réseau, broadcast, masque, hôtes)', example: '[OUTIL: subnet | 192.168.1.0/24]', category: 'network' },
      { id: 'convertisseur', name: 'Convertisseur',      icon: '🔄', description: 'Longueur, masse, fréquence, débit, stockage, puissance, température...', example: '[OUTIL: convertisseur | 100 | mbps | gbps]', category: 'general' },
      { id: 'electronique', name: 'Électronique',        icon: '⚡', description: 'Ohm, résistances série/parallèle, RC, résonance LC, code couleur, dBm', example: '[OUTIL: electronique | ohm | v=12 | r=470]', category: 'electronics' },
      { id: 'base',        name: 'Convertisseur Bases',  icon: '🔢', description: 'Binaire, octal, décimal, hexadécimal', example: '[OUTIL: base | FF | hex | dec]', category: 'math' },
      { id: 'code',        name: 'Exécuteur Code',       icon: '▶️', description: 'Exécute JavaScript, Python, Bash en sandbox sécurisé', example: '[OUTIL: code | python | print(2+2)]', category: 'dev' },
      { id: 'hash',        name: 'Générateur Hash',      icon: '🔐', description: 'MD5, SHA1, SHA256, SHA512, SHA384', example: '[OUTIL: hash | motdepasse | sha256]', category: 'security' },
      { id: 'liaison',     name: 'Bilan Liaison Radio',  icon: '📡', description: 'Calcul bilan de liaison RF (formule de Friis, FSPL, marge de liaison)', example: '[OUTIL: liaison | eirp=43 | freq=2600 | dist=5 | sensi=-100]', category: 'telecom' },
      { id: 'regex',       name: 'Testeur Regex',        icon: '🔍', description: 'Teste des expressions régulières avec résultats détaillés', example: '[OUTIL: regex | \\d{4} | code2024]', category: 'dev' },
      { id: 'algorithme',  name: 'Info Algorithme',      icon: '📋', description: 'Complexité temporelle/spatiale et description des algorithmes classiques', example: '[OUTIL: algorithme | quicksort]', category: 'dev' }
    ]
  });
});

export default router;
