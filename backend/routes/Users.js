import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, (req, res) => {
  res.json({ success: true, data: req.user });
});

router.put('/profile', protect, async (req, res) => {
  const { firstName, lastName, language, preferences } = req.body;
  const user = req.user;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (language) user.language = language;
  if (preferences) user.preferences = { ...(user.preferences || {}), ...preferences };
  try { await user.save?.({ validateBeforeSave: false }); } catch {}
  res.json({ success: true, data: user });
});

router.get('/stats', protect, (req, res) => {
  res.json({ success: true, data: req.user.stats || {} });
});

export default router;