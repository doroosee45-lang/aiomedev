import express from 'express';
import { protect } from '../middleware/Auth.js';
import { processAgentRequest, executeCode } from '../services/agentService.js';
import axios from 'axios';

const router = express.Router();

// ── POST /api/agent/execute ──
router.post('/execute', protect, async (req, res) => {
  try {
    const { task, context, mode } = req.body;
    const result = await processAgentRequest({
      message: task,
      conversationHistory: [],
      mode: mode || 'agent',
      stream: false
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/agent/analyze ──
router.post('/analyze', protect, async (req, res) => {
  try {
    const { content, type, fileName } = req.body;
    const result = await processAgentRequest({
      message: `Analyse ce ${type || 'contenu'} "${fileName || ''}":\n\n${content}`,
      conversationHistory: [],
      mode: 'general',
      stream: false
    });
    res.json({ success: true, data: { analysis: result.content, tokens: result.tokens, engine: result.engine } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── POST /api/agent/code/execute ──
router.post('/code/execute', protect, async (req, res) => {
  try {
    const { code, language } = req.body;
    const result = await executeCode(code, language);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── GET /api/agent/engine/status ── Vérifie le moteur IA actif
router.get('/engine/status', async (req, res) => {
  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  let ollamaAvailable = false;
  let ollamaModels = [];

  try {
    const response = await axios.get(`${ollamaUrl}/api/tags`, { timeout: 3000 });
    ollamaAvailable = true;
    ollamaModels = (response.data.models || []).map(m => m.name);
  } catch { /* Ollama not running */ }

  const claudeAvailable = !!process.env.ANTHROPIC_API_KEY;
  const activeEngine = process.env.AI_ENGINE === 'claude' ? 'claude'
    : process.env.AI_ENGINE === 'ollama' ? 'ollama'
    : ollamaAvailable ? 'ollama' : claudeAvailable ? 'claude' : 'demo';

  res.json({
    success: true,
    data: {
      activeEngine,
      engines: {
        ollama: { available: ollamaAvailable, url: ollamaUrl, models: ollamaModels, model: process.env.OLLAMA_MODEL || 'llama3.1' },
        claude: { available: claudeAvailable, model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514' },
        demo: { available: true }
      },
      config: { AI_ENGINE: process.env.AI_ENGINE || 'auto' }
    }
  });
});

// ── GET /api/agent/modes ── Tous les modes disponibles
router.get('/modes', (req, res) => {
  res.json({
    success: true,
    data: [
      // Informatique générale
      { id: 'general',       name: 'Mode Général',           icon: '🧠', description: 'Encyclopédique — informatique, technologie, tous domaines', color: '#00D4FF', category: 'general' },
      // Développement
      { id: 'code',          name: 'Expert Code',            icon: '💻', description: 'Génération et révision — 100+ langages de programmation', color: '#00FF88', category: 'dev' },
      { id: 'programmation', name: 'Expert Programmation',   icon: '⌨️', description: 'Tous paradigmes, algorithmes, structures de données, patterns', color: '#22C55E', category: 'dev' },
      // Sciences et technique
      { id: 'telecom',       name: 'Expert Télécommunications', icon: '📡', description: '2G/3G/4G/5G, fibre optique, satellite, VoIP, protocoles', color: '#8B5CF6', category: 'tech' },
      { id: 'reseaux',       name: 'Expert Réseaux',         icon: '🌐', description: 'TCP/IP, Cisco, switching, routing, VPN, sécurité réseau', color: '#06B6D4', category: 'tech' },
      { id: 'maintenance',   name: 'Expert Maintenance',     icon: '🔧', description: 'Diagnostic hardware, réparation, optimisation, récupération', color: '#F59E0B', category: 'tech' },
      { id: 'sciences',      name: 'Expert Sciences',        icon: '🔬', description: 'Maths, Physique, Chimie, Électronique, Électricité, RO', color: '#EC4899', category: 'sciences' },
      // Stratégie et business
      { id: 'strategie',     name: 'Stratégie Tech',         icon: '🚀', description: 'IA, Cloud, IoT, Blockchain, transformation digitale africaine', color: '#F97316', category: 'strategy' },
      { id: 'devops',        name: 'Expert DevOps',          icon: '⚙️', description: 'Docker, Kubernetes, CI/CD, Terraform, monitoring, cloud', color: '#3B82F6', category: 'dev' },
      { id: 'security',      name: 'Expert Sécurité',        icon: '🔒', description: 'Cybersécurité défensive, audit, OWASP, pentest, cryptographie', color: '#EF4444', category: 'security' },
      { id: 'data',          name: 'Expert Data & IA',       icon: '📊', description: 'Data science, ML, Deep Learning, NLP, visualisation', color: '#10B981', category: 'dev' },
      // Contexte africain
      { id: 'legal',         name: 'Mode Juridique',         icon: '⚖️', description: 'Droit OHADA, législation RDC, contrats, propriété intellectuelle', color: '#FFD700', category: 'business' },
      { id: 'business',      name: 'Expert Business',        icon: '💼', description: 'Conseil stratégique, business plans, Mobile Money, marché africain', color: '#D97706', category: 'business' },
      { id: 'analyst',       name: 'Analyste Stratégique',   icon: '📈', description: 'SWOT, études de marché, modélisation financière, KPI', color: '#A78BFA', category: 'business' },
      // Autonome et formation
      { id: 'agent',         name: 'Agent Autonome',         icon: '🤖', description: 'Exécution autonome de tâches complexes multi-étapes', color: '#FB923C', category: 'agent' },
      { id: 'formation',     name: 'Mode Formation',         icon: '📚', description: 'Contenus pédagogiques structurés, modules, quiz, certifications', color: '#FF6B6B', category: 'education' }
    ]
  });
});

export default router;
