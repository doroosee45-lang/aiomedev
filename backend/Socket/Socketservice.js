import jwt from 'jsonwebtoken';
import { processAgentRequest } from './agentService.js';

const connectedUsers = new Map();

export const initSocketHandlers = (io) => {
  // Authentication middleware for sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'omedev_secret_2026');
        socket.userId = decoded.id;
        next();
      } catch (err) {
        next(); // Allow connection without auth (demo mode)
      }
    } else {
      next();
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connecté: ${socket.id} (user: ${socket.userId || 'anonymous'})`);

    if (socket.userId) {
      connectedUsers.set(socket.userId, socket.id);
    }

    // Handle chat message with streaming
    socket.on('chat:message', async (data) => {
      try {
        const {
          message,
          conversationId,
          conversationHistory,
          mode,
          model,
          language,
          attachments
        } = data;

        if (!message?.trim()) {
          socket.emit('chat:error', { error: 'Message vide.' });
          return;
        }

        // Emit thinking status
        socket.emit('chat:thinking', { conversationId });

        let fullContent = '';

        // Process with streaming
        const result = await processAgentRequest({
          message,
          conversationHistory: conversationHistory || [],
          mode: mode || 'general',
          model: model || 'claude-sonnet-4-20250514',
          language: language || 'fr',
          userId: socket.userId,
          conversationId,
          attachments: attachments || [],
          stream: true,
          onChunk: (chunk) => {
            fullContent += chunk;
            socket.emit('chat:chunk', {
              conversationId,
              chunk,
              content: fullContent
            });
          }
        });

        // Emit completion
        socket.emit('chat:complete', {
          conversationId,
          content: result.content || fullContent,
          tokens: result.tokens,
          model: result.model
        });

      } catch (error) {
        console.error('Socket chat error:', error);
        socket.emit('chat:error', {
          error: error.message || 'Erreur lors du traitement de votre message.',
          conversationId: data.conversationId
        });
      }
    });

    // Handle code execution request
    socket.on('code:execute', async (data) => {
      const { code, language, conversationId } = data;
      socket.emit('code:output', {
        conversationId,
        output: `⚠️ L'exécution de code en sandbox nécessite la configuration Docker.\n\nCode reçu (${language}):\n${code.substring(0, 200)}...`,
        status: 'sandbox_required'
      });
    });

    // Handle file analysis
    socket.on('file:analyze', async (data) => {
      const { fileContent, fileName, conversationId } = data;

      const result = await processAgentRequest({
        message: `Analyse ce fichier "${fileName}" et fournis un résumé détaillé de son contenu:\n\n${fileContent}`,
        conversationHistory: [],
        mode: 'general',
        stream: false
      });

      socket.emit('file:analyzed', {
        conversationId,
        analysis: result.content,
        fileName
      });
    });

    // Agent task execution
    socket.on('agent:task', async (data) => {
      const { task, context, conversationId } = data;

      socket.emit('agent:start', { conversationId, task });

      const result = await processAgentRequest({
        message: `[MODE AGENT AUTONOME]\n\nTâche à exécuter: ${task}\n\nContexte: ${JSON.stringify(context || {})}`,
        conversationHistory: [],
        mode: 'agent',
        stream: true,
        onChunk: (chunk) => {
          socket.emit('agent:chunk', { conversationId, chunk });
        }
      });

      socket.emit('agent:complete', {
        conversationId,
        result: result.content,
        tokens: result.tokens
      });
    });

    // Typing indicators
    socket.on('typing:start', (data) => {
      socket.to(data.conversationId).emit('typing:start', { userId: socket.userId });
    });

    socket.on('typing:stop', (data) => {
      socket.to(data.conversationId).emit('typing:stop', { userId: socket.userId });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Socket déconnecté: ${socket.id}`);
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
      }
    });
  });

  return io;
};

export const sendToUser = (io, userId, event, data) => {
  const socketId = connectedUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};