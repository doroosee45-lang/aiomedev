import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import { memoryUsers } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'omedev_secret_2026';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

const createUserResponse = (user, token) => ({
  success: true,
  token,
  user: {
    _id: user._id || user.id,
    id: user._id || user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    plan: user.plan,
    language: user.language,
    preferences: user.preferences,
    stats: user.stats,
    createdAt: user.createdAt
  }
});

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, language } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' });
    }

    // Try MongoDB
    try {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: 'Un compte avec cet email existe déjà.' });
      }

      const user = await User.create({
        firstName, lastName, email: email.toLowerCase(), password,
        language: language || 'fr'
      });

      const token = generateToken(user._id);
      return res.status(201).json(createUserResponse(user, token));
    } catch (dbError) {
      // Fallback to memory store
      const existingUser = Array.from(memoryUsers.values()).find(u => u.email === email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ error: 'Un compte avec cet email existe déjà.' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const userId = uuidv4();
      const user = {
        _id: userId, id: userId,
        firstName, lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'developer', plan: 'free',
        language: language || 'fr',
        preferences: {
          theme: 'dark', codeTheme: 'oneDark',
          fontSize: 14, defaultModel: 'claude-sonnet-4-20250514',
          streamingEnabled: true, soundEnabled: false, defaultMode: 'general'
        },
        stats: { totalConversations: 0, totalMessages: 0, totalTokensUsed: 0, codeGenerated: 0, documentsCreated: 0 },
        isActive: true, createdAt: new Date()
      };
      memoryUsers.set(userId, user);
      const token = generateToken(userId);
      return res.status(201).json(createUserResponse(user, token));
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erreur lors de la création du compte.' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    // Try MongoDB
    try {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      }
      await user.updateLastLogin();
      const token = generateToken(user._id);
      return res.json(createUserResponse(user, token));
    } catch (dbError) {
      // Fallback to memory store
      const user = Array.from(memoryUsers.values()).find(u => u.email === email.toLowerCase());
      if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

      const token = generateToken(user.id);
      return res.json(createUserResponse(user, token));
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @desc    Logout
// @route   POST /api/auth/logout
export const logout = (req, res) => {
  res.json({ success: true, message: 'Déconnexion réussie.' });
};

// @desc    Update password
// @route   PUT /api/auth/password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Mot de passe actuel et nouveau requis.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect.' });
    }

    user.password = newPassword;
    await user.save();
    const token = generateToken(user._id);
    res.json({ success: true, token, message: 'Mot de passe modifié avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la modification du mot de passe.' });
  }
};