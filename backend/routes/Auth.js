import express from 'express';
import { register, login, getMe, logout, updatePassword } from '../controller/Authcontroller.js';
import { protect } from '../middleware/Auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);

export default router;