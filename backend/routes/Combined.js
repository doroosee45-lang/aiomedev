import express from 'express';
import { protect } from '../middleware/auth.js';
import { processAgentRequest } from '../services/agentService.js';

const codeRouter = express.Router();
const documentRouter = express.Router();
const userRouter = express.Router();
const projectRouter = express.Router();
const toolRouter = express.Router();

// ==================== CODE ROUTES ====================

codeRouter.post('/generate', protect, async (req, res) => {
  try {
    const { prompt, language, framework, includeTests, includeDocumentation } = req.body;
    const enhancedPrompt = `Génère du code ${language || ''} ${framework ? `avec ${framework}` : ''}:
${prompt}
${includeTests ? '\n- Inclure des tests unitaires' : ''}
${includeDocumentation ? '\n- Inclure la documentation JSDoc/docstrings' : ''}

Fournis du code de qualité production, bien commenté, avec gestion des erreurs.`;

    const result = await processAgentRequest({
      message: enhancedPrompt,
      conversationHistory: [],
      mode: 'code',
      stream: false
    });

    res.json({ success: true, data: { code: result.content, tokens: result.tokens } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

codeRouter.post('/review', protect, async (req, res) => {
  try {
    const { code, language, focus } = req.body;
    const prompt = `Effectue une revue de code approfondie de ce code ${language || ''}:

\`\`\`${language || ''}
${code}
\`\`\`

Analyse: bugs potentiels, vulnérabilités de sécurité, performances, bonnes pratiques, refactoring suggéré.
${focus ? `Focus particulier sur: ${focus}` : ''}`;

    const result = await processAgentRequest({
      message: prompt,
      conversationHistory: [],
      mode: 'code',
      stream: false
    });

    res.json({ success: true, data: { review: result.content, tokens: result.tokens } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

codeRouter.post('/debug', protect, async (req, res) => {
  try {
    const { code, error: codeError, language } = req.body;
    const prompt = `Débogue ce code ${language || ''} qui produit l'erreur suivante:

Erreur: ${codeError}

Code:
\`\`\`${language || ''}
${code}
\`\`\`

Identifie le problème, explique la cause et fournis le code corrigé.`;

    const result = await processAgentRequest({
      message: prompt,
      conversationHistory: [],
      mode: 'code',
      stream: false
    });

    res.json({ success: true, data: { solution: result.content, tokens: result.tokens } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

codeRouter.get('/languages', (req, res) => {
  res.json({
    success: true,
    data: [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#',
      'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart',
      'SQL', 'Bash', 'Shell', 'PowerShell', 'R', 'Scala', 'Elixir',
      'Haskell', 'Clojure', 'Erlang', 'F#', 'Solidity', 'Move',
      'HTML', 'CSS', 'SCSS', 'SASS', 'XML', 'JSON', 'YAML', 'TOML',
      'GraphQL', 'Dockerfile', 'Nginx', 'Apache', 'Terraform', 'Ansible'
    ]
  });
});

// ==================== DOCUMENT ROUTES ====================

documentRouter.get('/templates', protect, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'contract_sarl', name: 'Statuts SARL', category: 'legal', icon: '📜', description: 'Statuts de SARL conformes au droit OHADA' },
      { id: 'employment_contract', name: 'Contrat de travail', category: 'legal', icon: '📋', description: 'Contrat de travail selon le Code du travail RDC' },
      { id: 'commercial_proposal', name: 'Proposition commerciale', category: 'business', icon: '💼', description: 'Proposition commerciale professionnelle' },
      { id: 'business_plan', name: 'Business Plan', category: 'business', icon: '📊', description: 'Plan d\'affaires complet' },
      { id: 'invoice', name: 'Facture professionnelle', category: 'finance', icon: '🧾', description: 'Facture conforme aux normes congolaises' },
      { id: 'training_module', name: 'Module de formation', category: 'formation', icon: '📚', description: 'Module e-learning structuré' },
      { id: 'technical_report', name: 'Rapport technique', category: 'technical', icon: '🔧', description: 'Rapport technique et audit' },
      { id: 'minutes', name: 'Procès-verbal AG', category: 'legal', icon: '📝', description: 'PV d\'assemblée générale OHADA' }
    ]
  });
});

documentRouter.post('/generate', protect, async (req, res) => {
  try {
    const { templateId, data, format, title } = req.body;
    const prompt = `Génère un document professionnel "${title || templateId}" avec les données suivantes:
${JSON.stringify(data, null, 2)}

Format souhaité: ${format || 'Markdown structuré'}
Ce document doit être conforme aux standards professionnels et légaux en vigueur en RDC/OHADA.
Fournis un document complet, bien structuré avec toutes les sections nécessaires.`;

    const result = await processAgentRequest({
      message: prompt,
      conversationHistory: [],
      mode: 'legal',
      stream: false
    });

    res.json({
      success: true,
      data: {
        content: result.content,
        title: title || 'Document OMEDEV-AI',
        format: format || 'markdown',
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER ROUTES ====================

userRouter.get('/profile', protect, (req, res) => {
  res.json({ success: true, data: req.user });
});

userRouter.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, language, preferences } = req.body;
    const user = req.user;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (language) user.language = language;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    try {
      await user.save({ validateBeforeSave: false });
    } catch { /* memory mode */ }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil.' });
  }
});

userRouter.get('/stats', protect, (req, res) => {
  res.json({
    success: true,
    data: req.user.stats || {
      totalConversations: 0,
      totalMessages: 0,
      totalTokensUsed: 0,
      codeGenerated: 0,
      documentsCreated: 0
    }
  });
});

// ==================== PROJECT ROUTES ====================

const memoryProjects = new Map();

projectRouter.get('/', protect, (req, res) => {
  const userId = req.user._id?.toString() || req.user.id;
  const projects = Array.from(memoryProjects.values()).filter(p => p.owner === userId);
  res.json({ success: true, data: projects });
});

projectRouter.post('/', protect, (req, res) => {
  const { name, description, type, color, icon } = req.body;
  const userId = req.user._id?.toString() || req.user.id;
  const project = {
    _id: Date.now().toString(),
    id: Date.now().toString(),
    name, description, type: type || 'other',
    color: color || '#00D4FF', icon: icon || '💻',
    owner: userId, members: [], status: 'active',
    conversations: [], files: [], tasks: [],
    stats: { totalConversations: 0, totalFiles: 0, totalTasks: 0, completedTasks: 0 },
    createdAt: new Date(), updatedAt: new Date()
  };
  memoryProjects.set(project.id, project);
  res.status(201).json({ success: true, data: project });
});

projectRouter.delete('/:id', protect, (req, res) => {
  memoryProjects.delete(req.params.id);
  res.json({ success: true, message: 'Projet supprimé.' });
});

// ==================== TOOLS ROUTES ====================

toolRouter.get('/', protect, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'web_search', name: 'Recherche Web', icon: '🌐', status: 'available', description: 'Recherche en temps réel' },
      { id: 'code_executor', name: 'Exécuteur de Code', icon: '⚡', status: 'sandbox_required', description: 'Exécution sécurisée en sandbox Docker' },
      { id: 'file_manager', name: 'Gestionnaire de Fichiers', icon: '📁', status: 'available', description: 'Lecture et écriture de fichiers' },
      { id: 'doc_generator', name: 'Générateur de Documents', icon: '📄', status: 'available', description: 'Génération Word, PDF, Excel, PowerPoint' },
      { id: 'git_manager', name: 'Git Manager', icon: '🔀', status: 'available', description: 'Versioning et collaboration' },
      { id: 'browser_agent', name: 'Browser Agent', icon: '🌐', status: 'available', description: 'Navigation web automatisée' },
      { id: 'email_sender', name: 'Email', icon: '✉️', status: 'config_required', description: 'Envoi d\'emails automatisés' },
      { id: 'database_tool', name: 'Database', icon: '🗃️', status: 'available', description: 'Interaction avec bases de données' }
    ]
  });
});

export { codeRouter, documentRouter, userRouter, projectRouter, toolRouter };