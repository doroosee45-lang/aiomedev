import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'web_search', name: 'Recherche Web', icon: '🌐', status: 'available', description: 'Recherche en temps réel' },
      { id: 'code_executor', name: 'Exécuteur de Code', icon: '⚡', status: 'sandbox_required', description: 'Sandbox Docker requis' },
      { id: 'file_manager', name: 'Gestionnaire Fichiers', icon: '📁', status: 'available', description: 'Lecture/écriture fichiers' },
      { id: 'doc_generator', name: 'Générateur Documents', icon: '📄', status: 'available', description: 'Word, PDF, Excel, PowerPoint' },
      { id: 'git_manager', name: 'Git Manager', icon: '🔀', status: 'available', description: 'Versioning et collaboration' },
      { id: 'browser_agent', name: 'Browser Agent', icon: '🤖', status: 'available', description: 'Navigation web automatisée' },
      { id: 'email_sender', name: 'Email', icon: '✉️', status: 'config_required', description: 'Envoi emails automatisés' },
      { id: 'database', name: 'Base de données', icon: '🗃️', status: 'available', description: 'Interaction SQL/NoSQL' }
    ]
  });
});

export default router;