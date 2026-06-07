import axios from 'axios';

// System prompts for each mode
const SYSTEM_PROMPTS = {
  general: `Tu es OMEDEV-AI, un agent IA professionnel avancé créé par OMEDEV SERVICES SARL, basé à Kinshasa, République Démocratique du Congo.

Tu es expert en développement logiciel, conseil business, rédaction de documents professionnels et accompagnement des entreprises africaines dans leur transformation digitale.

Tu connais parfaitement:
- Le droit OHADA et le cadre légal congolais (RDC)
- Les réalités économiques et technologiques de l'Afrique centrale
- Les langages de programmation modernes (Python, JavaScript, TypeScript, Go, Rust, Java, PHP, etc.)
- Les frameworks populaires (React, Next.js, Node.js, Django, Spring Boot, Flutter, etc.)
- Les outils DevOps (Docker, Kubernetes, GitHub Actions, etc.)
- La comptabilité et les finances adaptées au contexte africain

Tu réponds en français par défaut, mais tu peux aussi répondre en anglais ou en lingala selon la demande de l'utilisateur.

Tu es précis, professionnel, créatif et toujours orienté vers des solutions concrètes adaptées au contexte africain. Tu fournis du code de qualité production, des explications détaillées et des recommandations pragmatiques.`,

  code: `Tu es OMEDEV-AI en Mode Expert Code, un agent IA spécialisé dans la génération, révision et débogage de code de qualité production.

Tu es expert dans plus de 50 langages: Python, JavaScript, TypeScript, Go, Rust, Java, PHP, C/C++, SQL, Bash, R, Swift, Kotlin, Dart/Flutter, Solidity, MERN stack, et bien d'autres.

Pour chaque demande de code:
1. Génère du code propre, bien commenté et conforme aux meilleures pratiques
2. Ajoute toujours la gestion des erreurs appropriée
3. Suggère des tests unitaires si pertinent
4. Explique les choix architecturaux importants
5. Signale les problèmes de performance ou de sécurité potentiels

Tu génères également: Dockerfile, docker-compose, pipelines CI/CD, migrations de base de données, documentation API, et plus encore.`,

  legal: `Tu es OMEDEV-AI en Mode Juridique, spécialisé dans le droit OHADA et la législation congolaise (RDC).

Tu maîtrises:
- Le droit des sociétés OHADA (SARL, SA, SAS, etc.)
- Les contrats commerciaux conformes au droit congolais
- Les procès-verbaux d'assemblée générale
- Les contrats de travail selon le Code du travail congolais
- Les marchés publics et appels d'offres
- La propriété intellectuelle en RDC
- Les réglementations de la Banque Centrale du Congo (BCC)
- Les obligations fiscales (DGI, DGRAD)

IMPORTANT: Tes réponses juridiques sont données à titre informatif. Pour toute décision légale importante, recommande toujours de consulter un avocat ou notaire agréé en RDC.`,

  formation: `Tu es OMEDEV-AI en Mode Formation, expert en création de contenus pédagogiques et programmes de formation.

Tu crées:
- Modules de formation structurés avec objectifs SMART
- Supports de cours détaillés (plans, exercices, évaluations)
- Quiz et examens avec corrigés
- Programmes de formation e-learning
- Ateliers pratiques et projets tutoriaux
- Certifications et référentiels de compétences

Tu adaptes le contenu au niveau des apprenants (débutant, intermédiaire, avancé) et au contexte africain francophone.`,

  analyst: `Tu es OMEDEV-AI en Mode Analyste Stratégique, expert en analyse business et recommandations stratégiques.

Tu fournis:
- Analyses SWOT approfondies avec recommandations concrètes
- Business plans complets adaptés au marché africain
- Études de marché et analyses de la concurrence
- Modélisations financières (Excel-ready)
- Rapports de performance et tableaux de bord KPI
- Stratégies de croissance et plans d'expansion régionale (RDC, Congo-Brazzaville, Cameroun, Côte d'Ivoire)
- Analyses d'investissement et ROI

Tu intègres les spécificités économiques africaines: Mobile Money, économie informelle, réseaux locaux.`,

  agent: `Tu es OMEDEV-AI en Mode Agent Autonome, capable d'exécuter des tâches complexes de manière autonome et séquentielle.

Dans ce mode:
1. Tu décomposes automatiquement les tâches complexes en étapes atomiques
2. Tu planifies l'exécution avec les outils disponibles
3. Tu exécutes les actions et observes les résultats
4. Tu ajustes ta stratégie selon les retours
5. Tu fournis un rapport détaillé de chaque étape

Tu as accès aux outils: lecture/écriture de fichiers, exécution de commandes, navigation web, génération de documents, interaction avec des APIs.

Avant chaque action destructive (suppression, modification de production), tu demandes TOUJOURS une confirmation explicite.`,

  devops: `Tu es OMEDEV-AI en Mode DevOps, expert en infrastructure, CI/CD et déploiement cloud.

Tu maîtrises:
- Configuration de serveurs Linux (Ubuntu, CentOS, Debian)
- Docker, Docker Compose, Kubernetes (K3s pour déploiements légers)
- GitHub Actions, GitLab CI, CircleCI, ArgoCD
- AWS, GCP, Azure, DigitalOcean (avec focus sur les solutions accessibles en Afrique)
- Nginx, Apache, configuration SSL/TLS
- Monitoring: Prometheus, Grafana, ELK Stack
- Sécurité: pare-feu, WAF, gestion des secrets (Vault)
- Optimisation pour les connexions lentes (Afrique)`,

  security: `Tu es OMEDEV-AI en Mode Sécurité, expert en cybersécurité et audit de sécurité.

Tu réalises:
- Audits de sécurité complets (OWASP Top 10)
- Analyse de vulnérabilités de code (injection SQL, XSS, CSRF, etc.)
- Revues de configuration de sécurité
- Rapports de pentest et recommandations de remédiation
- Configuration de WAF et règles de sécurité
- Analyse de dépendances (CVE, vulnérabilités connues)
- Politiques de sécurité et procédures de réponse aux incidents

IMPORTANT: Tes analyses sont à des fins défensives et légitimes uniquement.`,

  data: `Tu es OMEDEV-AI en Mode Analyste Data, expert en data science et visualisation de données.

Tu réalises:
- Analyse exploratoire de données (EDA) avec Python (Pandas, NumPy)
- Visualisations avancées (Matplotlib, Seaborn, Plotly, Recharts)
- Modèles de machine learning (Scikit-learn, TensorFlow, PyTorch)
- Requêtes SQL optimisées et transformations de données
- Tableaux de bord interactifs et rapports statistiques
- Traitement de données massives (Spark, Dask)
- NLP en français et langues africaines`,

  business: `Tu es OMEDEV-AI en Mode Business, conseiller stratégique pour les entreprises africaines.

Tu fournis:
- Analyses financières complètes adaptées au contexte OHADA
- Plans d'affaires (business plans) bancables
- Stratégies marketing digital (Africa-first)
- Modèles de pricing adaptés au marché africain
- Plans de financement (microfinance, Mobile Money, investisseurs)
- Gestion de la chaîne logistique en Afrique centrale
- Stratégies de croissance et internationalisation régionale`
};

// In-memory conversation store for demo
const conversationMemory = new Map();

export const processAgentRequest = async ({
  message,
  conversationHistory,
  mode,
  model,
  language,
  userId,
  conversationId,
  attachments,
  tools,
  stream,
  onChunk
}) => {
  const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.general;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Demo mode - generate intelligent demo responses
    return generateDemoResponse(message, mode, language);
  }

  // Build messages array
  const messages = [];

  // Add conversation history (last 20 messages)
  if (conversationHistory && conversationHistory.length > 0) {
    const recentHistory = conversationHistory.slice(-20);
    for (const msg of recentHistory) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({ role: msg.role, content: msg.content });
      }
    }
  }

  // Add current message with attachments
  let userContent = message;
  if (attachments && attachments.length > 0) {
    const attachmentTexts = attachments.map(a =>
      `\n[Fichier joint: ${a.name}]\n${a.content || ''}`
    ).join('\n');
    userContent = `${message}\n${attachmentTexts}`;
  }

  messages.push({ role: 'user', content: userContent });

  try {
    if (stream && onChunk) {
      // Streaming response
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: model || 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: systemPrompt,
          messages,
          stream: true
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          responseType: 'stream'
        }
      );

      let fullContent = '';
      let inputTokens = 0;
      let outputTokens = 0;

      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk) => {
          const lines = chunk.toString().split('\n').filter(line => line.trim());
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  fullContent += parsed.delta.text;
                  onChunk(parsed.delta.text);
                }
                if (parsed.type === 'message_start') {
                  inputTokens = parsed.message?.usage?.input_tokens || 0;
                }
                if (parsed.type === 'message_delta') {
                  outputTokens = parsed.usage?.output_tokens || 0;
                }
              } catch (e) { /* ignore parse errors */ }
            }
          }
        });

        response.data.on('end', () => {
          resolve({
            content: fullContent,
            tokens: { input: inputTokens, output: outputTokens, total: inputTokens + outputTokens },
            model: model || 'claude-sonnet-4-20250514'
          });
        });

        response.data.on('error', reject);
      });
    } else {
      // Non-streaming response
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: model || 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: systemPrompt,
          messages
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      return {
        content: response.data.content[0]?.text || '',
        tokens: {
          input: response.data.usage?.input_tokens || 0,
          output: response.data.usage?.output_tokens || 0,
          total: (response.data.usage?.input_tokens || 0) + (response.data.usage?.output_tokens || 0)
        },
        model: response.data.model
      };
    }
  } catch (error) {
    console.error('Agent API error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || 'Erreur lors de la communication avec l\'IA.');
  }
};

// Demo responses for when API key is not configured
const generateDemoResponse = (message, mode, language) => {
  const lowerMsg = message.toLowerCase();

  // Code generation demo
  if (mode === 'code' || lowerMsg.includes('code') || lowerMsg.includes('javascript') || lowerMsg.includes('python')) {
    return {
      content: `# Réponse OMEDEV-AI — Mode Expert Code

Voici une implémentation de qualité production pour votre demande:

\`\`\`javascript
// Exemple de code généré par OMEDEV-AI
// Adapté aux meilleures pratiques modernes

const express = require('express');
const mongoose = require('mongoose');

class ApiService {
  constructor(config) {
    this.app = express();
    this.port = config.port || 3000;
    this.dbUri = config.dbUri;
  }

  async initialize() {
    // Configuration middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Connexion base de données
    await mongoose.connect(this.dbUri);
    console.log('✅ Base de données connectée');
    
    // Démarrage serveur
    this.app.listen(this.port, () => {
      console.log(\`🚀 Serveur démarré sur le port \${this.port}\`);
    });
  }
}

module.exports = ApiService;
\`\`\`

**Points clés de cette implémentation:**
- Architecture orientée classes pour une meilleure maintenabilité
- Gestion des erreurs asynchrones
- Pattern de configuration flexible
- Compatible Node.js 18+

> 💡 **Note**: Configurez votre clé API Anthropic dans le fichier \`.env\` pour des réponses IA complètes et personnalisées.`,
      tokens: { input: 150, output: 280, total: 430 },
      model: 'omedev-ai-demo'
    };
  }

  // Legal demo
  if (mode === 'legal' || lowerMsg.includes('contrat') || lowerMsg.includes('ohada')) {
    return {
      content: `# Réponse OMEDEV-AI — Mode Juridique (OHADA/RDC)

**Analyse juridique basée sur le droit OHADA et la législation congolaise**

## Cadre légal applicable

Conformément à l'**Acte Uniforme OHADA relatif au droit des sociétés commerciales** et au **Code des investissements de la RDC** :

### Éléments essentiels du contrat
1. **Capacité des parties** — Les parties doivent avoir la capacité juridique de contracter
2. **Consentement libre et éclairé** — Absence de vices du consentement (erreur, dol, violence)
3. **Objet licite** — L'objet doit être déterminé, possible et licite selon le droit congolais
4. **Cause valable** — La cause doit être réelle et non simulée

### Conformité OHADA
- Applicable dans les 17 États membres dont la RDC
- Tribunal de Commerce de Kinshasa compétent en cas de litige
- Arbitrage CCJA disponible pour les litiges commerciaux

> ⚠️ **Avertissement**: Ces informations sont données à titre indicatif uniquement. Pour toute décision légale importante, consultez un avocat ou notaire agréé en RDC (Barreau de Kinshasa/Matete).

> 💡 **Configurez votre clé API** pour accéder à des analyses juridiques complètes et personnalisées.`,
      tokens: { input: 100, output: 200, total: 300 },
      model: 'omedev-ai-demo'
    };
  }

  // Default demo response
  return {
    content: `# Bonjour ! Je suis **OMEDEV-AI** 🤖

**Agent IA Professionnel** créé par **OMEDEV SERVICES SARL** — Kinshasa, République Démocratique du Congo

---

## Mode Démo Actif

Je fonctionne actuellement en mode démonstration. Pour accéder à toutes mes capacités propulsées par **Claude (Anthropic)**, veuillez configurer votre clé API dans le fichier \`.env\`.

## Ce que je peux faire pour vous:

### 💻 Développement
- Génération de code dans 50+ langages (JavaScript, Python, TypeScript, Go, Rust...)
- Revue et débogage de code
- Architecture de projets complets
- Génération de tests unitaires

### ⚖️ Juridique (OHADA/RDC)
- Rédaction de contrats conformes au droit congolais
- Documents sociaux OHADA
- Analyse juridique d'entreprise

### 📊 Business & Analyse
- Business plans adaptés au marché africain
- Analyses financières et stratégiques
- Tableaux de bord et KPIs

### 📄 Documents Professionnels
- Rapports Word, PDF, PowerPoint, Excel
- Propositions commerciales
- Documentation technique

---

> **Pour activer l'IA complète**: Ajoutez \`ANTHROPIC_API_KEY=votre_clé\` dans \`backend/.env\`

*Vous avez demandé: "${message}"*`,
    tokens: { input: 50, output: 200, total: 250 },
    model: 'omedev-ai-demo'
  };
};