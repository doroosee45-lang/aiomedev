import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const memProjects = new Map();

router.get('/', protect, (req, res) => {
  const uid = req.user._id?.toString() || req.user.id;
  res.json({ success: true, data: Array.from(memProjects.values()).filter(p => p.owner === uid) });
});

router.post('/', protect, (req, res) => {
  const { name, description, type, color, icon } = req.body;
  const uid = req.user._id?.toString() || req.user.id;
  const p = {
    _id: Date.now().toString(), id: Date.now().toString(),
    name, description, type: type || 'other',
    color: color || '#00D4FF', icon: icon || '💻',
    owner: uid, status: 'active',
    conversations: [], files: [], tasks: [],
    stats: { totalConversations: 0, totalFiles: 0, totalTasks: 0, completedTasks: 0 },
    createdAt: new Date(), updatedAt: new Date()
  };
  memProjects.set(p.id, p);
  res.status(201).json({ success: true, data: p });
});

router.put('/:id', protect, (req, res) => {
  const p = memProjects.get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Projet introuvable.' });
  Object.assign(p, req.body, { updatedAt: new Date() });
  memProjects.set(p.id, p);
  res.json({ success: true, data: p });
});

router.delete('/:id', protect, (req, res) => {
  memProjects.delete(req.params.id);
  res.json({ success: true, message: 'Projet supprimé.' });
});

export default router;