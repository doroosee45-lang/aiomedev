import express from 'express';
import { protect } from '../middleware/auth.js';
import { processAgentRequest } from '../services/agentService.js';

const router = express.Router();

router.get('/templates', protect, (req, res) => {
  res.json({ success: true, data: [
    { id: 'contract_sarl', name: 'Statuts SARL', category: 'legal', icon: '📜' },
    { id: 'employment', name: 'Contrat de travail', category: 'legal', icon: '📋' },
    { id: 'business_proposal', name: 'Proposition commerciale', category: 'business', icon: '💼' },
    { id: 'business_plan', name: 'Business Plan', category: 'business', icon: '📊' },
    { id: 'invoice', name: 'Facture', category: 'finance', icon: '🧾' },
    { id: 'training', name: 'Module Formation', category: 'formation', icon: '📚' },
    { id: 'report', name: 'Rapport Technique', category: 'technical', icon: '🔧' },
    { id: 'minutes', name: 'PV Assemblée Générale', category: 'legal', icon: '📝' }
  ]});
});

router.post('/generate', protect, async (req, res) => {
  try {
    const { templateId, data, title } = req.body;
    const result = await processAgentRequest({
      message: `Génère un document professionnel "${title || templateId}" avec: ${JSON.stringify(data)}. Document complet, conforme aux standards RDC/OHADA.`,
      conversationHistory: [], mode: 'legal', stream: false
    });
    res.json({ success: true, data: { content: result.content, title: title || 'Document', generatedAt: new Date().toISOString() } });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

export default router;