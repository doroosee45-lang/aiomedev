import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system', 'tool'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'code', 'document', 'image', 'file', 'tool_use', 'tool_result', 'error'],
    default: 'text'
  },
  metadata: {
    language: String,
    filename: String,
    filePath: String,
    fileSize: Number,
    mimeType: String,
    tokens: Number,
    model: String,
    toolName: String,
    toolInput: mongoose.Schema.Types.Mixed,
    toolOutput: mongoose.Schema.Types.Mixed,
    executionTime: Number,
    error: String
  },
  attachments: [{
    name: String,
    path: String,
    type: String,
    size: Number
  }],
  reactions: {
    thumbsUp: { type: Number, default: 0 },
    thumbsDown: { type: Number, default: 0 }
  },
  isEdited: { type: Boolean, default: false },
  editedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  title: {
    type: String,
    default: 'Nouvelle conversation',
    maxlength: 200
  },
  mode: {
    type: String,
    enum: ['general', 'code', 'legal', 'formation', 'analyst', 'agent', 'devops', 'security', 'data', 'business'],
    default: 'general'
  },
  model: {
    type: String,
    default: 'claude-sonnet-4-20250514'
  },
  language: {
    type: String,
    enum: ['fr', 'en', 'ln', 'auto'],
    default: 'fr'
  },
  messages: [messageSchema],
  systemPrompt: {
    type: String,
    default: null
  },
  isPinned: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  isShared: { type: Boolean, default: false },
  shareToken: { type: String, default: null },
  tags: [String],
  stats: {
    totalMessages: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
  },
  context: {
    files: [{
      name: String,
      path: String,
      content: String
    }],
    urls: [String],
    activeFile: String,
    workingDirectory: String
  }
}, {
  timestamps: true
});

// Auto-generate title from first message
conversationSchema.methods.generateTitle = function() {
  if (this.messages.length > 0) {
    const firstUserMsg = this.messages.find(m => m.role === 'user');
    if (firstUserMsg) {
      const content = firstUserMsg.content;
      this.title = content.length > 60 ? content.substring(0, 60) + '...' : content;
    }
  }
};

// Update stats
conversationSchema.methods.updateStats = function() {
  this.stats.totalMessages = this.messages.length;
  this.stats.lastActivity = new Date();
  let tokens = 0;
  this.messages.forEach(m => {
    if (m.metadata?.tokens) tokens += m.metadata.tokens;
  });
  this.stats.totalTokens = tokens;
};

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;