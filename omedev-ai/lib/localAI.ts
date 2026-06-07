import { KNOWLEDGE_BASE } from './knowledge'

// ─── Normalisation ──────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'le','la','les','de','du','des','un','une','et','ou','mais','donc','or','ni','car',
  'ce','que','qui','quoi','dont','je','tu','il','elle','nous','vous','ils','elles',
  'me','te','se','lui','mon','ton','son','ma','ta','sa','nos','vos','leurs',
  'si','ne','pas','plus','très','bien','aussi','sur','dans','par','pour','avec',
  'sans','sous','entre','vers','ici','là','cela','ceci','tout','tous','même',
  'the','a','an','is','are','was','be','have','has','do','does','to','of',
  'in','for','on','with','at','by','from','this','that','it','its','can','will',
  'how','what','when','where','why','which',
])

function normaliser(texte: string): string {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')  // supprimer les accents
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokeniser(texte: string): string[] {
  return normaliser(texte)
    .split(' ')
    .filter(t => t.length > 2 && !STOP_WORDS.has(t))
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

function scorer(keywords: string[], tokens: string[]): number {
  let score = 0
  const normKeywords = keywords.map(normaliser)

  for (const token of tokens) {
    for (const kw of normKeywords) {
      if (kw === token) {
        score += 4          // correspondance exacte
      } else if (kw.startsWith(token) || token.startsWith(kw)) {
        score += 2          // correspondance de préfixe
      } else if (kw.includes(token) || token.includes(kw)) {
        score += 1          // correspondance partielle
      }
    }
  }

  // Bonus si plusieurs tokens différents matchent (diversité)
  const uniqueMatches = new Set(
    tokens.filter(t => normKeywords.some(k => k.includes(t) || t.includes(k)))
  )
  if (uniqueMatches.size >= 3) score += 4
  else if (uniqueMatches.size >= 2) score += 2

  return score
}

function boostParCategorie(category: string, mode: string): number {
  const MAP: Record<string, string[]> = {
    code:       ['code','identity'],
    legal:      ['legal','identity'],
    analyst:    ['tech','business','identity'],
    formation:  ['code','tech','legal','business','identity'],
    autonomous: ['code','devops','tech','identity'],
    general:    ['identity','business','tech'],
  }
  return (MAP[mode] || []).includes(category) ? 1.3 : 1.0
}

// ─── Patterns conversationnels ───────────────────────────────────────────────

const PATTERNS: Array<{ re: RegExp; reponse: (msg: string) => string }> = [
  {
    re: /^(bonjour|salut|hello|hi|bonsoir|bonne journee|hey|coucou|bjr|slt)\b/i,
    reponse: () => buildGreeting(),
  },
  {
    re: /(qui es.?tu|tu es qui|qui etes.?vous|tu es quoi|c.?est quoi omedev|présente.?toi|presente.?toi|identit)/i,
    reponse: () => buildIdentity(),
  },
  {
    re: /^(merci|thank|parfait|super|excellent|bravo|genial|très bien|tres bien|ok merci|d.?accord)\b/i,
    reponse: () => '## Avec plaisir ! 😊\n\nN\'hésitez pas à poser d\'autres questions — je suis là pour vous aider.\n\nY a-t-il autre chose sur laquelle vous souhaitez de l\'assistance ?',
  },
  {
    re: /^(au revoir|bye|a bientot|à bientôt|bonne soiree|bonne nuit|adieu)\b/i,
    reponse: () => '## À bientôt ! 👋\n\nN\'hésitez pas à revenir si vous avez des questions. Je serai là.\n\n*OMEDEV-AI — Développé par OMEDEV SERVICES SARL, Kinshasa, RDC*',
  },
  {
    re: /(aide|help|que peux.?tu|tu peux|tes capacit|fonctionnalit|que sais.?tu)/i,
    reponse: () => buildHelp(),
  },
  {
    re: /(cle api|api key|anthropic|activer|configurer|ne fonctionne pas|repond pas|pas de reponse)/i,
    reponse: () => buildApiKeyHelp(),
  },
]

// ─── Réponses dynamiques ─────────────────────────────────────────────────────

function buildGreeting(): string {
  const h = new Date().getHours()
  const salut = h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir'

  return `## ${salut} ! Je suis OMEDEV-AI 👋

Assistant IA professionnel développé par **OMEDEV SERVICES SARL** — Kinshasa, RDC.

**Je fonctionne en mode mémoire locale** (sans API Claude). Voici ce que je peux faire pour vous :

| Domaine | Exemples de questions |
|---------|-----------------------|
| 💻 **Développement** | JavaScript, React, Python, SQL, Git, Docker |
| ⚖️ **Droit OHADA** | Créer une SARL, rédiger un contrat, droit du travail |
| 🏢 **Business RDC** | Startup Kinshasa, Mobile Money, financement |
| 🤖 **IA & Cloud** | Claude, Machine Learning, déploiement |
| 🔒 **Sécurité** | Authentification, OWASP, HTTPS |
| 📊 **Architecture** | Patterns, microservices, tests |

**Comment puis-je vous aider aujourd'hui ?**

---
*💾 Mode mémoire locale · [Activez Claude](https://console.anthropic.com) pour des réponses encore plus complètes*`
}

function buildIdentity(): string {
  return `## Je suis OMEDEV-AI 🤖

**Assistant IA professionnel** conçu et développé par **OMEDEV SERVICES SARL**

### Coordonnées
| | |
|-|-|
| 📍 **Adresse** | 75, avenue Kabambare, Kinshasa, RDC |
| 👤 **Gérant** | M. DORODORO Meya Osée |
| 📧 **Email** | oseedoro@gmail.com |

### Mes 6 modes d'expertise
| Mode | Ce que je fais |
|------|----------------|
| 💬 **Général** | Répondre à toute question, donner des conseils |
| 💻 **Code** | Écrire, débugger et expliquer du code |
| ⚖️ **Juridique** | Droit OHADA, contrats, création d'entreprise |
| 🎓 **Formation** | Cours structurés, quiz, plans d'apprentissage |
| 📊 **Analyste** | Analyser des données, créer des rapports |
| 🤖 **Autonome** | Réaliser des projets complexes en autonomie |

### Technologies
Je suis propulsé par **Claude Opus 4.8** d'Anthropic — le modèle le plus avancé pour le raisonnement et le code.

En ce moment, je fonctionne en **mode mémoire locale** — je réponds depuis ma base de connaissance intégrée.`
}

function buildHelp(): string {
  return `## Ce que je peux faire pour vous

### Développement logiciel
- Écrire du code en **JavaScript, TypeScript, Python, SQL, Java, Go**
- Expliquer **React, Next.js, Node.js, Docker, Git**
- Concevoir des APIs REST et GraphQL
- Architecturer des bases de données (PostgreSQL, MongoDB, Redis)
- Implémenter l'authentification et la sécurité

### Droit & Juridique (contexte OHADA/RDC)
- Expliquer les **Actes Uniformes OHADA**
- Guider la **création d'une SARL** en RDC
- Rédiger des **modèles de contrats** commerciaux
- Informer sur le **droit du travail** et la fiscalité

### Business & Entrepreneuriat
- Rédiger un **business plan**
- Stratégie **marketing digital** pour l'Afrique
- Intégration **Mobile Money** (M-Pesa, Airtel)
- Analyse de marché et **SWOT**

### Comment utiliser OMEDEV-AI
- **Ctrl+B** — afficher/masquer la sidebar
- **Changer de mode** — cliquer sur le badge dans le header
- **Joindre des fichiers** — icône trombone dans la zone de saisie
- **Entrée** — envoyer · **Maj+Entrée** — nouvelle ligne`
}

function buildApiKeyHelp(): string {
  return `## Configurer la clé API pour activer Claude

OMEDEV-AI utilise **Claude Opus 4.8** d'Anthropic. Sans clé API valide, je réponds depuis ma mémoire locale.

### Obtenir votre clé (gratuite pour commencer)
1. Aller sur **https://console.anthropic.com**
2. Créer un compte avec votre email
3. **API Keys** → **Create Key**
4. Copier la clé (format : \`sk-ant-api03-...\`)

### L'ajouter dans le projet
Ouvrir **\`.env.local\`** à la racine du projet :
\`\`\`env
ANTHROPIC_API_KEY=sk-ant-api03-VOTRE-CLE-ICI
\`\`\`

### Redémarrer le serveur
\`\`\`bash
# Arrêter (Ctrl+C) puis relancer
npm run dev
\`\`\`

> ⚠️ **Obligatoire** : Next.js doit être redémarré pour prendre en compte les nouvelles variables d'environnement.

### En attendant
Je continue à répondre depuis ma mémoire locale — posez vos questions !`
}

function buildDefaultResponse(query: string, mode: string): string {
  const hints: Record<string, string> = {
    code:
      '**Questions que je peux traiter** : JavaScript, TypeScript, Python, React, Next.js, SQL, Git, Docker, authentification, tests, architecture…',
    legal:
      '**Questions que je peux traiter** : droit OHADA, création SARL, contrats commerciaux, droit du travail, propriété intellectuelle, fiscalité RDC…',
    analyst:
      '**Questions que je peux traiter** : analyse de données avec Python/Pandas, métriques KPI, business plan, étude de marché, SWOT…',
    formation:
      '**Questions que je peux traiter** : cours de programmation, plans d\'apprentissage, explications de concepts, exercices pratiques…',
    autonomous:
      '**Questions que je peux traiter** : conception d\'architectures, stratégie technique, déploiement, automatisation, projets full-stack…',
    general:
      '**Questions que je peux traiter** : technologie, business en RDC, droit OHADA, développement logiciel, IA, Mobile Money…',
  }

  return `## Information non trouvée dans ma mémoire locale

Je n\'ai pas de réponse précise pour : *"${query}"*

${hints[mode] || hints.general}

### Pour des réponses complètes sur n'importe quel sujet
Activez **Claude Opus 4.8** en configurant votre clé API :
\`\`\`bash
# Dans .env.local
ANTHROPIC_API_KEY=sk-ant-api03-VOTRE-CLE
# Puis redémarrer
npm run dev
\`\`\`

Obtenez votre clé sur **console.anthropic.com** (compte gratuit disponible).`
}

// ─── Fonction principale ─────────────────────────────────────────────────────

export function getLocalResponse(
  userMessage: string,
  mode: string = 'general'
): string {
  const trimmed = userMessage.trim()
  if (!trimmed) return buildGreeting()

  // 1. Tester les patterns conversationnels en premier
  for (const { re, reponse } of PATTERNS) {
    if (re.test(trimmed)) {
      return reponse(trimmed)
    }
  }

  // 2. Scorer toutes les entrées de la base de connaissance
  const tokens = tokeniser(trimmed)
  if (tokens.length === 0) return buildHelp()

  const scores = KNOWLEDGE_BASE.map(entry => ({
    entry,
    score: scorer(entry.keywords, tokens) * boostParCategorie(entry.category, mode),
  }))
    .filter(s => s.score >= 2)
    .sort((a, b) => b.score - a.score)

  if (scores.length === 0) {
    return buildDefaultResponse(trimmed, mode)
  }

  // 3. Retourner la meilleure réponse avec footer
  const meilleure = scores[0].entry.response
  return (
    meilleure +
    '\n\n---\n*💾 Réponse depuis la mémoire locale OMEDEV-AI · [Activez Claude Opus 4.8](https://console.anthropic.com) pour des réponses encore plus complètes*'
  )
}
