import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du projet est requis'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['owner', 'admin', 'member', 'viewer'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  type: {
    type: String,
    enum: ['web', 'mobile', 'api', 'data', 'devops', 'ai', 'legal', 'formation', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'paused', 'completed', 'archived'],
    default: 'active'
  },
  color: { type: String, default: '#00D4FF' },
  icon: { type: String, default: '💻' },
  tags: [String],
  workingDirectory: String,
  gitRepository: String,
  conversations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  }],
  files: [{
    name: String,
    path: String,
    type: String,
    size: Number,
    content: String,
    updatedAt: Date
  }],
  tasks: [{
    title: String,
    description: String,
    status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    dueDate: Date,
    createdAt: { type: Date, default: Date.now }
  }],
  stats: {
    totalConversations: { type: Number, default: 0 },
    totalFiles: { type: Number, default: 0 },
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;