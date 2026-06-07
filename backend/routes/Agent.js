import express from 'express';
import { protect } from '../middleware/auth.js';
import { processAgentRequest } from '../services/agentService.js';

const router = express.Router();

// POST /api/agent/execute
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

// POST /api/agent/analyze
router.post('/analyze', protect, async (req, res) => {
  try {
    const { content, type, fileName } = req.body;
    const result = await processAgentRequest({
      message: `Analyse ce ${type || 'contenu'} "${fileName || ''}":\n\n${content}`,
      conversationHistory: [],
      mode: 'general',
      stream: false
    });
    res.json({ success: true, data: { analysis: result.content, tokens: result.tokens } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/agent/modes
router.get('/modes', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'general', name: 'Mode Général', icon: '🧠', description: 'Réponses polyvalentes et encyclopédiques', color: '#00D4FF' },
      { id: 'code', name: 'Expert Code', icon: '💻', description: 'Génération et révision de code', color: '#00FF88' },
      { id: 'legal', name: 'Mode Juridique', icon: '⚖️', description: 'Droit OHADA et législation congolaise', color: '#FFD700' },
      { id: 'formation', name: 'Mode Formation', icon: '📚', description: 'Contenus pédagogiques structurés', color: '#FF6B6B' },
      { id: 'analyst', name: 'Mode Analyste', icon: '📊', description: 'Analyse stratégique et business', color: '#A78BFA' },
      { id: 'agent', name: 'Agent Autonome', icon: '🤖', description: 'Exécution autonome de tâches complexes', color: '#F59E0B' },
      { id: 'devops', name: 'Mode DevOps', icon: '⚙️', description: 'Infrastructure et CI/CD', color: '#06B6D4' },
      { id: 'security', name: 'Mode Sécurité', icon: '🔒', description: 'Audit et cybersécurité', color: '#EF4444' },
      { id: 'data', name: 'Mode Data', icon: '📈', description: 'Data science et visualisation', color: '#10B981' },
      { id: 'business', name: 'Mode Business', icon: '💼', description: 'Conseil stratégique entreprises africaines', color: '#F97316' }
    ]
  });
});

export default router;