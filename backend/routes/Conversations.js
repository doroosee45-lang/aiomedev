import express from 'express';
import { protect } from '../middleware/auth.js';
import Conversation from '../models/Conversation.js';
import { processAgentRequest } from '../services/agentService.js';

const router = express.Router();

// In-memory store for demo
const memoryConversations = new Map();

const getConversations = async (userId) => {
  try {
    return await Conversation.find({ user: userId, isArchived: false })
      .sort({ 'stats.lastActivity': -1 })
      .select('-messages')
      .limit(50);
  } catch {
    return Array.from(memoryConversations.values())
      .filter(c => c.userId === userId && !c.isArchived)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
};

// GET /api/conversations
router.get('/', protect, async (req, res) => {
  try {
    const conversations = await getConversations(req.user._id || req.user.id);
    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des conversations.' });
  }
});

// POST /api/conversations
router.post('/', protect, async (req, res) => {
  try {
    const { title, mode, model, language, projectId } = req.body;
    const userId = req.user._id || req.user.id;

    try {
      const conv = await Conversation.create({
        user: userId,
        title: title || 'Nouvelle conversation',
        mode: mode || 'general',
        model: model || 'claude-sonnet-4-20250514',
        language: language || 'fr',
        project: projectId || null
      });
      return res.status(201).json({ success: true, data: conv });
    } catch {
      // Memory fallback
      const conv = {
        _id: Date.now().toString(),
        id: Date.now().toString(),
        userId,
        title: title || 'Nouvelle conversation',
        mode: mode || 'general',
        model: model || 'claude-sonnet-4-20250514',
        language: language || 'fr',
        messages: [],
        isArchived: false,
        isPinned: false,
        tags: [],
        stats: { totalMessages: 0, totalTokens: 0, lastActivity: new Date() },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryConversations.set(conv.id, conv);
      return res.status(201).json({ success: true, data: conv });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la conversation.' });
  }
});

// GET /api/conversations/:id
router.get('/:id', protect, async (req, res) => {
  try {
    let conv;
    try {
      conv = await Conversation.findOne({ _id: req.params.id, user: req.user._id || req.user.id });
    } catch {
      conv = memoryConversations.get(req.params.id);
    }

    if (!conv) return res.status(404).json({ error: 'Conversation introuvable.' });
    res.json({ success: true, data: conv });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération.' });
  }
});

// POST /api/conversations/:id/messages - Send message (non-streaming)
router.post('/:id/messages', protect, async (req, res) => {
  try {
    const { message, attachments } = req.body;
    const userId = req.user._id || req.user.id;

    let conv;
    try {
      conv = await Conversation.findOne({ _id: req.params.id, user: userId });
    } catch {
      conv = memoryConversations.get(req.params.id);
    }

    if (!conv) return res.status(404).json({ error: 'Conversation introuvable.' });

    // Add user message
    const userMsg = {
      role: 'user',
      content: message,
      type: 'text',
      createdAt: new Date()
    };

    if (conv.messages) {
      conv.messages.push(userMsg);
    }

    // Process with AI
    const result = await processAgentRequest({
      message,
      conversationHistory: conv.messages?.slice(-20) || [],
      mode: conv.mode,
      model: conv.model,
      language: conv.language,
      userId,
      conversationId: req.params.id,
      attachments: attachments || [],
      stream: false
    });

    // Add assistant message
    const assistantMsg = {
      role: 'assistant',
      content: result.content,
      type: 'text',
      metadata: { tokens: result.tokens?.total, model: result.model },
      createdAt: new Date()
    };

    if (conv.messages) {
      conv.messages.push(assistantMsg);
    }

    // Auto-generate title from first exchange
    if (conv.messages?.length <= 3 && conv.title === 'Nouvelle conversation') {
      conv.title = message.length > 50 ? message.substring(0, 50) + '...' : message;
    }

    // Update stats
    if (conv.stats) {
      conv.stats.totalMessages = (conv.stats.totalMessages || 0) + 2;
      conv.stats.lastActivity = new Date();
    }
    conv.updatedAt = new Date();

    // Save
    try {
      await conv.save();
    } catch {
      memoryConversations.set(conv._id || conv.id, conv);
    }

    res.json({
      success: true,
      data: {
        userMessage: userMsg,
        assistantMessage: assistantMsg,
        conversation: { _id: conv._id || conv.id, title: conv.title, stats: conv.stats }
      }
    });
  } catch (error) {
    console.error('Message error:', error);
    res.status(500).json({ error: error.message || 'Erreur lors du traitement du message.' });
  }
});

// PUT /api/conversations/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, isPinned, isArchived, tags, mode } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (isPinned !== undefined) updates.isPinned = isPinned;
    if (isArchived !== undefined) updates.isArchived = isArchived;
    if (tags !== undefined) updates.tags = tags;
    if (mode !== undefined) updates.mode = mode;

    let conv;
    try {
      conv = await Conversation.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id || req.user.id },
        updates,
        { new: true }
      );
    } catch {
      conv = memoryConversations.get(req.params.id);
      if (conv) { Object.assign(conv, updates); memoryConversations.set(conv.id, conv); }
    }

    if (!conv) return res.status(404).json({ error: 'Conversation introuvable.' });
    res.json({ success: true, data: conv });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

// DELETE /api/conversations/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    try {
      await Conversation.findOneAndDelete({ _id: req.params.id, user: req.user._id || req.user.id });
    } catch {
      memoryConversations.delete(req.params.id);
    }
    res.json({ success: true, message: 'Conversation supprimée.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

export default router;