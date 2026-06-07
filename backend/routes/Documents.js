/**
 * OMEDEV-AI — Routes Documents
 * Génération: CDC, specs techniques, architecture, user stories + templates IA
 */
import express from 'express';
import { generateDocument, generateCahierDeCharges, generateSpecTechnique, generateArchitectureDoc, generateUserStories } from '../services/documentGenerator.js';
import { processAgentRequest } from '../services/agentService.js';

const router = express.Router();

// GET /api/documents/templates — Liste de tous les types disponibles
router.get('/templates', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'cdc', name: 'Cahier des Charges', category: 'conception', icon: '📋', description: 'CDC complet 15+ sections, prêt à soumettre au client' },
      { id: 'spec_technique', name: 'Spécification Technique', category: 'conception', icon: '⚙️', description: 'Architecture, API, BDD, sécurité, déploiement' },
      { id: 'architecture', name: "Document d'Architecture", category: 'conception', icon: '🏗️', description: 'Diagrammes C4, ADR, composants, scalabilité' },
      { id: 'user_stories', name: 'User Stories', category: 'conception', icon: '📝', description: 'Stories Gherkin avec critères d\'acceptation' },
      { id: 'contract_sarl', name: 'Statuts SARL', category: 'legal', icon: '📜', description: 'Statuts OHADA conformes' },
      { id: 'employment', name: 'Contrat de travail', category: 'legal', icon: '👔', description: 'CDI/CDD selon code du travail RDC' },
      { id: 'business_proposal', name: 'Proposition commerciale', category: 'business', icon: '💼', description: 'Proposition client professionnelle' },
      { id: 'business_plan', name: 'Business Plan', category: 'business', icon: '📊', description: 'Plan d\'affaires complet avec projections' },
      { id: 'invoice', name: 'Facture', category: 'finance', icon: '🧾', description: 'Facture conforme OHADA/DGI' },
      { id: 'training', name: 'Module Formation', category: 'formation', icon: '📚', description: 'Contenu pédagogique structuré ADDIE' },
      { id: 'report', name: 'Rapport Technique', category: 'technical', icon: '🔧', description: 'Rapport d\'audit ou d\'analyse' },
      { id: 'minutes', name: 'PV Assemblée Générale', category: 'legal', icon: '📝', description: 'Procès-verbal AG SARL/SA OHADA' }
    ]
  });
});

// POST /api/documents/generate — Dispatch selon type
router.post('/generate', async (req, res) => {
  try {
    const { type, templateId, data = {}, title } = req.body;
    const docType = type || templateId;

    if (!docType) {
      return res.status(400).json({ success: false, error: 'Le champ "type" est requis' });
    }

    // Types générés directement par documentGenerator
    const directTypes = ['cdc', 'cahier_de_charges', 'spec_technique', 'spec', 'architecture', 'user_stories'];

    if (directTypes.includes(docType)) {
      const result = generateDocument(docType, data);
      if (result.error) return res.status(400).json({ success: false, error: result.error });
      return res.json({
        success: true,
        data: { content: result.content, type: result.type, format: result.format, title: title || result.type, generatedAt: new Date().toISOString(), wordCount: result.content?.split(/\s+/).length || 0 }
      });
    }

    // Types générés par IA (Ollama/Claude)
    const modeMap = {
      contract_sarl: { mode: 'legal', prompt: `Génère des statuts SARL OHADA complets pour: ${JSON.stringify(data)}` },
      employment: { mode: 'legal', prompt: `Génère un contrat de travail ${data.type || 'CDI'} conforme au code du travail RDC pour: ${JSON.stringify(data)}` },
      business_proposal: { mode: 'business', prompt: `Génère une proposition commerciale professionnelle pour: ${JSON.stringify(data)}` },
      business_plan: { mode: 'business', prompt: `Génère un business plan complet avec projections financières pour: ${JSON.stringify(data)}` },
      invoice: { mode: 'legal', prompt: `Génère une facture professionnelle conforme OHADA pour: ${JSON.stringify(data)}` },
      training: { mode: 'formation', prompt: `Génère un module de formation complet (méthode ADDIE) sur: ${JSON.stringify(data)}` },
      report: { mode: 'analyst', prompt: `Génère un rapport technique complet sur: ${JSON.stringify(data)}` },
      minutes: { mode: 'legal', prompt: `Génère un procès-verbal d'Assemblée Générale OHADA pour: ${JSON.stringify(data)}` },
    };

    const cfg = modeMap[docType];
    if (!cfg) return res.status(400).json({ success: false, error: `Type inconnu: "${docType}"` });

    const result = await processAgentRequest({ message: cfg.prompt, conversationHistory: [], mode: cfg.mode, stream: false });
    res.json({
      success: true,
      data: { content: result.content, title: title || docType, type: docType, generatedAt: new Date().toISOString() }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/documents/cdc — CDC rapide avec données structurées
router.post('/cdc', async (req, res) => {
  try {
    const content = generateCahierDeCharges(req.body);
    res.json({ success: true, data: { content, type: 'cahier_de_charges', format: 'markdown', generatedAt: new Date().toISOString(), wordCount: content.split(/\s+/).length } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/documents/spec — Spécification technique
router.post('/spec', async (req, res) => {
  try {
    const content = generateSpecTechnique(req.body);
    res.json({ success: true, data: { content, type: 'spec_technique', format: 'markdown', generatedAt: new Date().toISOString() } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/documents/architecture — Document d'architecture
router.post('/architecture', async (req, res) => {
  try {
    const content = generateArchitectureDoc(req.body);
    res.json({ success: true, data: { content, type: 'architecture', format: 'markdown', generatedAt: new Date().toISOString() } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/documents/user-stories — User stories
router.post('/user-stories', async (req, res) => {
  try {
    const { features = [] } = req.body;
    const content = generateUserStories(features);
    res.json({ success: true, data: { content, type: 'user_stories', format: 'markdown', count: features.length || 3, generatedAt: new Date().toISOString() } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
