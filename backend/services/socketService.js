import jwt from 'jsonwebtoken';
import { processAgentRequest, executeCode } from './agentService.js';

const connectedUsers = new Map();

export const initSocketHandlers = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'omedev_secret_2026');
        socket.userId = decoded.id;
      } catch { /* allow anonymous */ }
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connecté: ${socket.id} (user: ${socket.userId || 'anonymous'})`);
    if (socket.userId) connectedUsers.set(socket.userId, socket.id);

    // ── CHAT STREAMING ──
    socket.on('chat:message', async (data) => {
      try {
        const { message, conversationId, conversationHistory, mode, model, language, attachments } = data;

        if (!message?.trim()) {
          socket.emit('chat:error', { error: 'Message vide.' });
          return;
        }

        socket.emit('chat:thinking', { conversationId });

        let fullContent = '';
        const result = await processAgentRequest({
          message,
          conversationHistory: conversationHistory || [],
          mode: mode || 'general',
          model,
          language: language || 'fr',
          userId: socket.userId,
          conversationId,
          attachments: attachments || [],
          stream: true,
          onChunk: (chunk) => {
            fullContent += chunk;
            socket.emit('chat:chunk', { conversationId, chunk, content: fullContent });
          }
        });

        socket.emit('chat:complete', {
          conversationId,
          content: result.content || fullContent,
          tokens: result.tokens,
          model: result.model,
          engine: result.engine
        });

      } catch (error) {
        console.error('Socket chat error:', error);
        socket.emit('chat:error', {
          error: error.message || 'Erreur lors du traitement.',
          conversationId: data.conversationId
        });
      }
    });

    // ── CODE EXECUTION ──
    socket.on('code:execute', async (data) => {
      const { code, language, conversationId } = data;
      socket.emit('code:running', { conversationId, language });

      const result = await executeCode(code, language);
      socket.emit('code:output', { conversationId, ...result, language });
    });

    // ── FILE ANALYSIS ──
    socket.on('file:analyze', async (data) => {
      const { fileContent, fileName, conversationId } = data;
      const result = await processAgentRequest({
        message: `Analyse ce fichier "${fileName}" et fournis un résumé détaillé, les problèmes éventuels et des recommandations:\n\n${fileContent}`,
        conversationHistory: [],
        mode: 'general',
        stream: false
      });
      socket.emit('file:analyzed', { conversationId, analysis: result.content, fileName, engine: result.engine });
    });

    // ── AGENT AUTONOME ──
    socket.on('agent:task', async (data) => {
      const { task, context, conversationId } = data;
      socket.emit('agent:start', { conversationId, task });

      const result = await processAgentRequest({
        message: `[MODE AGENT AUTONOME]\n\nTâche: ${task}\nContexte: ${JSON.stringify(context || {})}`,
        conversationHistory: [],
        mode: 'agent',
        stream: true,
        onChunk: (chunk) => socket.emit('agent:chunk', { conversationId, chunk })
      });

      socket.emit('agent:complete', { conversationId, result: result.content, tokens: result.tokens, engine: result.engine });
    });

    // ── TYPING INDICATORS ──
    socket.on('typing:start', (data) => socket.to(data.conversationId).emit('typing:start', { userId: socket.userId }));
    socket.on('typing:stop', (data) => socket.to(data.conversationId).emit('typing:stop', { userId: socket.userId }));

    socket.on('disconnect', () => {
      console.log(`🔌 Socket déconnecté: ${socket.id}`);
      if (socket.userId) connectedUsers.delete(socket.userId);
    });
  });

  return io;
};

export const sendToUser = (io, userId, event, data) => {
  const socketId = connectedUsers.get(userId);
  if (socketId) io.to(socketId).emit(event, data);
};
