import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// In-memory user store for demo (when MongoDB not available)
const memoryUsers = new Map();

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Accès non autorisé. Veuillez vous connecter.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'omedev_secret_2026');

    // Try MongoDB first, fallback to memory
    let user = null;
    try {
      user = await User.findById(decoded.id).select('-password');
    } catch (dbError) {
      // MongoDB not available, use memory store
      user = memoryUsers.get(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur introuvable.' });
    }

    if (user.isActive === false) {
      return res.status(401).json({ error: 'Compte désactivé.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token invalide.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré. Veuillez vous reconnecter.' });
    }
    return res.status(500).json({ error: 'Erreur d\'authentification.' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Le rôle "${req.user.role}" n'a pas accès à cette ressource.`
      });
    }
    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'omedev_secret_2026');
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch {
        req.user = memoryUsers.get(decoded.id);
      }
    }
  } catch (e) { /* optional, skip errors */ }
  next();
};

// Export memoryUsers for auth controller
export { memoryUsers };