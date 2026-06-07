import express from 'express';
import { protect } from '../middleware/auth.js';

// Users router
export const usersRouter = express.Router();
usersRouter.get('/profile', protect, (req, res) => res.json({ success: true, data: req.user }));
usersRouter.put('/profile', protect, async (req, res) => {
  const { firstName, lastName, language, preferences } = req.body;
  const user = req.user;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (language) user.language = language;
  if (preferences) user.preferences = { ...(user.preferences || {}), ...preferences };
  try { await user.save?.({ validateBeforeSave: false }); } catch {}
  res.json({ success: true, data: user });
});
usersRouter.get('/stats', protect, (req, res) => res.json({ success: true, data: req.user.stats || {} }));

// Projects router
export const projectsRouter = express.Router();
const memProjects = new Map();
projectsRouter.get('/', protect, (req, res) => {
  const uid = req.user._id?.toString() || req.user.id;
  res.json({ success: true, data: Array.from(memProjects.values()).filter(p => p.owner === uid) });
});
projectsRouter.post('/', protect, (req, res) => {
  const { name, description, type, color, icon } = req.body;
  const uid = req.user._id?.toString() || req.user.id;
  const p = { _id: Date.now().toString(), id: Date.now().toString(), name, description, type: type||'other', color: color||'#00D4FF', icon: icon||'💻', owner: uid, status: 'active', conversations: [], files: [], tasks: [], stats: {}, createdAt: new Date(), updatedAt: new Date() };
  memProjects.set(p.id, p);
  res.status(201).json({ success: true, data: p });
});
projectsRouter.delete('/:id', protect, (req, res) => { memProjects.delete(req.params.id); res.json({ success: true }); });

// Tools router
export const toolsRouter = express.Router();
toolsRouter.get('/', protect, (req, res) => res.json({ success: true, data: [
  { id: 'web_search', name: 'Recherche Web', icon: '🌐', status: 'available' },
  { id: 'code_executor', name: 'Exécuteur de Code', icon: '⚡', status: 'sandbox_required' },
  { id: 'file_manager', name: 'Gestionnaire Fichiers', icon: '📁', status: 'available' },
  { id: 'doc_generator', name: 'Générateur Documents', icon: '📄', status: 'available' },
  { id: 'git_manager', name: 'Git Manager', icon: '🔀', status: 'available' },
  { id: 'browser_agent', name: 'Browser Agent', icon: '🤖', status: 'available' }
]}));

// Default exports for individual route files
export default usersRouter;