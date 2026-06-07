import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import conversationRoutes from './routes/conversations.js';
import agentRoutes from './routes/agent.js';
import codeRoutes from './routes/code.js';
import documentRoutes from './routes/documents.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';
import toolRoutes from './routes/tools.js';

// Socket handlers
import { initSocketHandlers } from './services/socketService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Socket.io configuration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tools', toolRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'OMEDEV-AI API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({
    name: 'OMEDEV-AI API',
    version: '1.0.0',
    description: 'Agent IA Professionnel - OMEDEV SERVICES SARL - Kinshasa, RDC',
    endpoints: {
      auth: '/api/auth',
      conversations: '/api/conversations',
      agent: '/api/agent',
      code: '/api/code',
      documents: '/api/documents',
      users: '/api/users',
      projects: '/api/projects',
      tools: '/api/tools'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée', path: req.originalUrl });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Initialize Socket handlers
initSocketHandlers(io);

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/omedev_ai', {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connecté avec succès');
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error.message);
    console.log('⚠️  Démarrage en mode sans base de données (données en mémoire)');
  }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║           OMEDEV-AI — Agent IA Professionnel             ║
║           OMEDEV SERVICES SARL — Kinshasa, RDC           ║
╠══════════════════════════════════════════════════════════╣
║  🚀 Serveur démarré sur le port ${PORT}                     ║
║  🌍 Environnement: ${(process.env.NODE_ENV || 'development').padEnd(33)}║
║  📡 API: http://localhost:${PORT}/api                       ║
║  🔌 WebSocket: Socket.io actif                           ║
╚══════════════════════════════════════════════════════════╝
    `);
  });
});

export { io };
export default app;