import express from 'express';
import { protect } from '../middleware/auth.js';
import { processAgentRequest } from '../services/agentService.js';

const router = express.Router();

router.post('/generate', protect, async (req, res) => {
  try {
    const { prompt, language, framework, includeTests } = req.body;
    const result = await processAgentRequest({
      message: `Génère du code ${language || ''} ${framework ? `avec ${framework}` : ''}: ${prompt}${includeTests ? '\nInclure des tests unitaires.' : ''}`,
      conversationHistory: [], mode: 'code', stream: false
    });
    res.json({ success: true, data: { code: result.content, tokens: result.tokens } });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/review', protect, async (req, res) => {
  try {
    const { code, language } = req.body;
    const result = await processAgentRequest({
      message: `Effectue une revue de code ${language || ''}: \n\`\`\`\n${code}\n\`\`\``,
      conversationHistory: [], mode: 'code', stream: false
    });
    res.json({ success: true, data: { review: result.content } });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/debug', protect, async (req, res) => {
  try {
    const { code, error: err, language } = req.body;
    const result = await processAgentRequest({
      message: `Débogue ce code ${language || ''} avec erreur "${err}": \n\`\`\`\n${code}\n\`\`\``,
      conversationHistory: [], mode: 'code', stream: false
    });
    res.json({ success: true, data: { solution: result.content } });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get('/languages', (req, res) => {
  res.json({ success: true, data: ['JavaScript','TypeScript','Python','Java','Go','Rust','PHP','C','C++','SQL','Bash','Swift','Kotlin','Dart','R','Scala','Solidity','HTML','CSS','GraphQL','Dockerfile'] });
});

export default router;