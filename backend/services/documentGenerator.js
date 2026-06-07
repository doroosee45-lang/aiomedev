/**
 * OMEDEV-AI — Générateur de Documents Professionnels
 * Génère: Cahier de charges, specs techniques, architecture, plans de projet
 * 100% autonome, sans IA externe requise pour les templates de base
 */

// ══════════════════════════════════════════════════════
//  TEMPLATES DE BASE — Remplissage automatique sans IA
// ══════════════════════════════════════════════════════

/**
 * Génère un cahier de charges complet en Markdown
 */
export const generateCahierDeCharges = (data) => {
  const {
    nomProjet, client, dateDebut, dateLivraison, version = '1.0',
    contexte, objectifs = [], fonctionnalites = [], nonFonctionnels = [],
    utilisateurs = [], contraintes = [], technologies = [],
    budget, equipe = [], risques = []
  } = data;

  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  return `# CAHIER DES CHARGES
## ${nomProjet?.toUpperCase() || 'PROJET INFORMATIQUE'}

---

| Champ | Valeur |
|-------|--------|
| **Projet** | ${nomProjet || 'À définir'} |
| **Client** | ${client || 'À définir'} |
| **Version** | ${version} |
| **Date de rédaction** | ${today} |
| **Début estimé** | ${dateDebut || 'À définir'} |
| **Livraison prévue** | ${dateLivraison || 'À définir'} |
| **Statut** | En cours de rédaction |

---

## 1. PRÉSENTATION DU PROJET

### 1.1 Contexte et problématique
${contexte || '_Décrire ici le contexte général, la problématique à résoudre et les enjeux du projet._'}

### 1.2 Objectifs du projet
${objectifs.length > 0
  ? objectifs.map((o, i) => `${i + 1}. ${o}`).join('\n')
  : `1. _Objectif principal à définir_
2. _Objectif secondaire à définir_
3. _Objectif tertiaire à définir_`}

### 1.3 Périmètre du projet
Le présent cahier de charges couvre l'ensemble des fonctionnalités et contraintes techniques relatives au développement et au déploiement de **${nomProjet || 'la solution'}**.

---

## 2. PARTIES PRENANTES

### 2.1 Utilisateurs cibles
${utilisateurs.length > 0
  ? utilisateurs.map(u => `| **${u.role || 'Rôle'}** | ${u.description || ''} | ${u.frequence || 'Quotidien'} |`).join('\n')
  : `| **Rôle** | **Description** | **Fréquence d'utilisation** |
|----------|-----------------|----------------------------|
| Administrateur | Gestion complète de la plateforme | Quotidien |
| Utilisateur standard | Consultation et utilisation des fonctionnalités | Quotidien |
| Superviseur | Suivi et reporting | Hebdomadaire |`}

---

## 3. BESOINS FONCTIONNELS

${fonctionnalites.length > 0
  ? fonctionnalites.map((f, i) => `### 3.${i + 1} ${f.nom || `Fonctionnalité ${i + 1}`}
- **Description**: ${f.description || ''}
- **Priorité**: ${f.priorite || 'Haute'}
- **Acteur**: ${f.acteur || 'Utilisateur'}
- **Préconditions**: ${f.preconditions || 'Utilisateur authentifié'}
- **Résultat attendu**: ${f.resultat || ''}
`).join('\n')
  : `### 3.1 Authentification et gestion des comptes
- **Description**: Permettre aux utilisateurs de créer un compte, se connecter et gérer leur profil
- **Priorité**: Haute (Must Have)
- **User Story**: En tant qu'utilisateur, je veux m'inscrire et me connecter pour accéder à mes données personnelles
- **Critères d'acceptation**:
  - L'utilisateur peut s'inscrire avec email/mot de passe
  - Le mot de passe est hashé (bcrypt ou Argon2)
  - Un email de confirmation est envoyé
  - La réinitialisation de mot de passe est possible

### 3.2 Tableau de bord principal
- **Description**: Vue d'ensemble des informations clés pour l'utilisateur connecté
- **Priorité**: Haute (Must Have)
- **Critères d'acceptation**:
  - Chargement en moins de 2 secondes
  - Données actualisées en temps réel ou toutes les 30 secondes
  - Responsive (mobile, tablette, desktop)

### 3.3 Gestion des données métier
- **Description**: CRUD complet sur les entités principales du domaine
- **Priorité**: Haute (Must Have)
- **Critères d'acceptation**:
  - Création, lecture, modification, suppression
  - Validation des formulaires côté client et serveur
  - Confirmation avant suppression irréversible
  - Historique des modifications

### 3.4 Recherche et filtrage
- **Description**: Permettre de rechercher et filtrer les données
- **Priorité**: Moyenne (Should Have)
- **Critères d'acceptation**:
  - Recherche full-text instantanée
  - Filtres par catégorie, date, statut
  - Export des résultats (CSV/Excel)

### 3.5 Notifications et alertes
- **Description**: Informer les utilisateurs des événements importants
- **Priorité**: Moyenne (Should Have)
- **Critères d'acceptation**:
  - Notifications in-app en temps réel
  - Notifications email pour les événements critiques
  - Préférences de notification paramétrables`}

---

## 4. BESOINS NON-FONCTIONNELS

### 4.1 Performance
| Critère | Exigence |
|---------|---------|
| Temps de réponse API | < 200ms pour 95% des requêtes |
| Chargement page initiale | < 3 secondes (LCP) |
| Disponibilité (SLA) | 99.5% (uptime mensuel) |
| Utilisateurs simultanés | ${nonFonctionnels.find(n => n.type === 'charge')?.valeur || '500 minimum'} |

### 4.2 Sécurité
- Authentification: JWT avec refresh tokens (expiration 15min / 7 jours)
- Chiffrement: HTTPS obligatoire (TLS 1.3), données sensibles chiffrées AES-256
- Protection: Rate limiting, CORS configuré, headers sécurisés (Helmet)
- Conformité: RGPD — consentement, droit à l'effacement, portabilité des données
- Audit: Logs de toutes les actions sensibles (connexion, modification, suppression)

### 4.3 Compatibilité et accessibilité
- Navigateurs: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile: iOS 14+, Android 10+
- Accessibilité: WCAG 2.1 niveau AA
- Internationalisation: Français (principal)${nonFonctionnels.find(n => n.type === 'i18n')?.langues ? ', ' + nonFonctionnels.find(n => n.type === 'i18n').langues : ''}

### 4.4 Maintenabilité
- Couverture de tests: ≥ 80%
- Documentation: README + API docs (OpenAPI/Swagger) + guide déploiement
- Code: Linting ESLint/Prettier, revues de code obligatoires
- CI/CD: Pipeline automatisé avec tests avant déploiement

---

## 5. CONTRAINTES TECHNIQUES

${contraintes.length > 0
  ? contraintes.map(c => `- **${c.type || 'Contrainte'}**: ${c.description || ''}`).join('\n')
  : `- **Budget**: ${budget || 'À définir avec le client'}
- **Délai**: Livraison impérative avant ${dateLivraison || 'la date convenue'}
- **Technologie**: Compatibilité avec l'infrastructure existante du client
- **Équipe**: ${equipe.length > 0 ? equipe.length + ' développeurs disponibles' : 'Équipe à constituer'}
- **Hébergement**: Solution cloud préférable (faible investissement initial)
- **Contexte local**: Optimisation pour connexions lentes (Afrique centrale)`}

---

## 6. STACK TECHNIQUE RECOMMANDÉE

${technologies.length > 0
  ? technologies.map(t => `- **${t.couche}**: ${t.technologie} — ${t.justification || ''}`).join('\n')
  : `| Couche | Technologie | Justification |
|--------|-------------|---------------|
| **Frontend** | Next.js 15 + TypeScript + Tailwind CSS | SSR/SSG, performance, écosystème React |
| **Backend** | Node.js + Express | JavaScript fullstack, rapidité de développement |
| **Base de données** | PostgreSQL + Prisma ORM | ACID, relations complexes, robustesse |
| **Cache** | Redis | Sessions, cache API, temps réel |
| **Auth** | JWT + bcrypt | Standard industrie, sécurisé |
| **Temps réel** | Socket.io | WebSocket, fallback long-polling |
| **Stockage fichiers** | S3-compatible (MinIO local / Cloudflare R2) | Scalable, coût maîtrisé |
| **Déploiement** | Docker + Render/Railway | Conteneurisé, déploiement simple |
| **CI/CD** | GitHub Actions | Automatisation tests et déploiement |
| **Monitoring** | Sentry + Logtail | Erreurs temps réel, logs centralisés |`}

---

## 7. ARCHITECTURE SYSTÈME

\`\`\`
┌─────────────────────────────────────────────────┐
│                   CLIENT                         │
│  [Browser/PWA] ←──── HTTPS ────→ [CDN/Cloudflare]│
└─────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│              COUCHE PRÉSENTATION                 │
│  Next.js (SSR/CSR) + React + Tailwind CSS        │
│  Port 3000  │  Static Assets sur CDN             │
└─────────────────────────────────────────────────┘
                         │ API REST / WebSocket
                         ▼
┌─────────────────────────────────────────────────┐
│              COUCHE MÉTIER (API)                 │
│  Node.js + Express  │  Port 5000                 │
│  ┌─────────┐ ┌────────────┐ ┌────────────────┐  │
│  │ Auth    │ │ Business   │ │ WebSocket      │  │
│  │ Module  │ │ Logic      │ │ (Socket.io)    │  │
│  └─────────┘ └────────────┘ └────────────────┘  │
└─────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│              COUCHE DONNÉES                      │
│  ┌──────────────┐  ┌──────┐  ┌────────────────┐ │
│  │ PostgreSQL   │  │Redis │  │ Stockage S3    │ │
│  │ (principal)  │  │(cache│  │ (fichiers)     │ │
│  └──────────────┘  └──────┘  └────────────────┘ │
└─────────────────────────────────────────────────┘
\`\`\`

---

## 8. MODÈLE DE DONNÉES (ENTITÉS PRINCIPALES)

\`\`\`sql
-- Exemple de structure principale
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,  -- Argon2/bcrypt
  first_name  VARCHAR(100),
  last_name   VARCHAR(100),
  role        VARCHAR(50) DEFAULT 'user',
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Ajouter les entités métier spécifiques au projet
\`\`\`

---

## 9. PLAN DE PROJET

### 9.1 Phases et jalons

| Phase | Durée | Livrables |
|-------|-------|-----------|
| **Phase 0 — Cadrage** | 1 semaine | CDC validé, maquettes validées, environnements configurés |
| **Phase 1 — Fondations** | 2 semaines | Auth, base de données, CI/CD, déploiement staging |
| **Phase 2 — Core** | 3-4 semaines | Fonctionnalités Must Have développées et testées |
| **Phase 3 — Enrichissement** | 2 semaines | Fonctionnalités Should Have, optimisations |
| **Phase 4 — Recette** | 1 semaine | Tests UAT, corrections bugs, documentation |
| **Phase 5 — Déploiement** | 3 jours | Mise en production, formation, handover |

### 9.2 Équipe projet
${equipe.length > 0
  ? equipe.map(m => `| ${m.role} | ${m.nom || 'À recruter'} | ${m.responsabilites || ''} |`).join('\n')
  : `| **Rôle** | **Nom** | **Responsabilités** |
|----------|---------|---------------------|
| Chef de projet | À définir | Coordination, planning, reporting client |
| Développeur Full-Stack | À définir | Architecture, développement backend et frontend |
| Développeur Frontend | À définir | UI/UX, intégration, responsive |
| Testeur QA | À définir | Tests fonctionnels, non-régressions, rapports |`}

---

## 10. ESTIMATION BUDGÉTAIRE

| Poste | Estimation | Notes |
|-------|-----------|-------|
| Développement | ${budget || '— USD'} | Selon complexité validée |
| Hébergement (annuel) | ~$200-600/an | Cloud (Render/Railway + PostgreSQL) |
| Nom de domaine | ~$15/an | .com ou .cd |
| SSL | Gratuit | Let's Encrypt |
| Monitoring | $0-50/mois | Sentry gratuit, Logtail trial |
| **TOTAL ESTIMÉ** | **${budget || 'À valider'}** | Hors maintenance |

---

## 11. ANALYSE DES RISQUES

| # | Risque | Probabilité | Impact | Mitigation |
|---|--------|-------------|--------|------------|
${risques.length > 0
  ? risques.map((r, i) => `| ${i + 1} | ${r.risque} | ${r.probabilite || 'Moyenne'} | ${r.impact || 'Moyen'} | ${r.mitigation || ''} |`).join('\n')
  : `| 1 | Dérive du périmètre (scope creep) | Élevée | Élevé | CDC figé, gestion des modifications formelle |
| 2 | Délais de validation client | Moyenne | Moyen | Délais contractuels pour retours (48-72h) |
| 3 | Disponibilité réseau (contexte africain) | Élevée | Moyen | Mode offline, compression, cache agressif |
| 4 | Évolutions réglementaires | Faible | Élevé | Veille juridique, architecture extensible |
| 5 | Turnover équipe | Faible | Élevé | Documentation complète, onboarding structuré |`}

---

## 12. CONDITIONS D'ACCEPTATION

Le projet sera considéré comme livré et accepté lorsque:
- [ ] Toutes les fonctionnalités Must Have sont implémentées et testées
- [ ] Les tests de performance sont validés (< 200ms API, < 3s chargement)
- [ ] La couverture de tests est ≥ 80%
- [ ] La documentation technique est complète (README, API docs, guide déploiement)
- [ ] La formation des utilisateurs finaux est réalisée
- [ ] Le déploiement en production est effectif et stable pendant 48h
- [ ] Aucun bug bloquant ou majeur en production

---

## 13. SIGNATURES ET VALIDATION

| Rôle | Nom | Date | Signature |
|------|-----|------|-----------|
| Maître d'ouvrage (Client) | | | |
| Chef de projet (OMEDEV) | | | |
| Responsable technique | | | |

---

*Document généré par OMEDEV-AI — OMEDEV SERVICES SARL, Kinshasa, RDC*
*Version ${version} — ${today}*
`;
};

/**
 * Génère une spec technique d'application
 */
export const generateSpecTechnique = (data) => {
  const { nomProjet, type, stack, modules = [], apis = [] } = data;
  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  return `# SPÉCIFICATION TECHNIQUE
## ${nomProjet?.toUpperCase() || 'PROJET'}

**Date**: ${today} | **Type**: ${type || 'Application Web'} | **Version**: 1.0

---

## 1. ARCHITECTURE DÉTAILLÉE

### Pattern architectural
\`\`\`
${type?.includes('mobile') || type?.includes('Mobile') ? `
MOBILE (Flutter/React Native)
├── Presentation Layer
│   ├── Screens/Pages
│   ├── Widgets/Components
│   └── Navigation
├── Business Logic Layer
│   ├── BLoC / Provider / Riverpod
│   └── Use Cases
├── Data Layer
│   ├── Repositories
│   ├── Remote DataSource (API)
│   └── Local DataSource (SQLite/Hive)
└── Domain Layer
    ├── Entities
    └── Interfaces
` : `
WEB APPLICATION — Clean Architecture
├── Frontend (${stack?.frontend || 'Next.js'})
│   ├── pages/ ou app/ (routage)
│   ├── components/ (UI réutilisables)
│   ├── hooks/ (logique réutilisable)
│   ├── store/ (état global — Zustand/Redux)
│   ├── lib/ (utilitaires, helpers)
│   └── types/ (TypeScript interfaces)
│
└── Backend (${stack?.backend || 'Node.js + Express'})
    ├── routes/ (endpoints API)
    ├── controllers/ (logique HTTP)
    ├── services/ (logique métier)
    ├── models/ (entités DB)
    ├── middleware/ (auth, validation, logging)
    └── utils/ (helpers, constants)
`}
\`\`\`

---

## 2. SPÉCIFICATION DES APIs

### Convention REST
- Base URL: \`/api/v1\`
- Format: JSON
- Auth: Bearer Token (JWT)
- Pagination: \`?page=1&limit=20\`
- Tri: \`?sort=createdAt&order=desc\`

### Endpoints principaux

#### Authentification
\`\`\`
POST   /api/v1/auth/register     → Créer un compte
POST   /api/v1/auth/login        → Connexion (retourne JWT)
POST   /api/v1/auth/refresh      → Renouveler le token
POST   /api/v1/auth/logout       → Déconnexion
GET    /api/v1/auth/me           → Profil utilisateur connecté
PUT    /api/v1/auth/password     → Modifier mot de passe
POST   /api/v1/auth/forgot       → Demander réinitialisation
POST   /api/v1/auth/reset        → Réinitialiser le mot de passe
\`\`\`

#### Ressource principale (exemple CRUD)
\`\`\`
GET    /api/v1/resources          → Liste (paginée, filtrée)
POST   /api/v1/resources          → Créer
GET    /api/v1/resources/:id      → Détail
PUT    /api/v1/resources/:id      → Modifier (complet)
PATCH  /api/v1/resources/:id      → Modifier (partiel)
DELETE /api/v1/resources/:id      → Supprimer
GET    /api/v1/resources/export   → Export CSV/Excel
\`\`\`

### Format de réponse standard
\`\`\`json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "message": "Opération réussie"
}

// Erreur:
{
  "success": false,
  "error": "MESSAGE_CODE",
  "message": "Description lisible de l'erreur",
  "details": [{ "field": "email", "message": "Email invalide" }]
}
\`\`\`

---

## 3. MODÈLE DE DONNÉES

\`\`\`typescript
// Types TypeScript / Interfaces principales

interface User {
  id: string;           // UUID
  email: string;        // Unique
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Ajouter les entités métier spécifiques
\`\`\`

---

## 4. SÉCURITÉ — IMPLÉMENTATION

\`\`\`typescript
// Middleware d'authentification
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Non authentifié' });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { error: 'Trop de requêtes' }
});

// Validation avec Zod
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  firstName: z.string().min(2).max(50),
});
\`\`\`

---

## 5. TESTS — STRATÉGIE

\`\`\`
Tests unitaires (Jest/Vitest):
  ✓ Services métier (logique isolée)
  ✓ Utilitaires et helpers
  ✓ Validation des données

Tests d'intégration:
  ✓ Routes API avec base de données de test
  ✓ Flux d'authentification complet
  ✓ CRUD sur entités principales

Tests E2E (Playwright/Cypress):
  ✓ Parcours utilisateur critique
  ✓ Scénarios d'erreur
  ✓ Responsive design

Objectif: Couverture ≥ 80%
\`\`\`

---

## 6. DÉPLOIEMENT

\`\`\`yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports: ['3000:3000']
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000

  backend:
    build: ./backend
    ports: ['5000:5000']
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/dbname
      - JWT_SECRET=\${JWT_SECRET}
    depends_on: [db, redis]

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=dbname
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes: ['pgdata:/var/lib/postgresql/data']

  redis:
    image: redis:7-alpine

volumes:
  pgdata:
\`\`\`

---

*Spécification générée par OMEDEV-AI — ${today}*
`;
};

/**
 * Génère un plan d'architecture complet
 */
export const generateArchitectureDoc = (data) => {
  const { nomProjet, type = 'web', scale = 'startup', modules = [] } = data;
  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  const architectures = {
    startup: {
      nom: 'Monolithe Modulaire',
      desc: 'Architecture simple et évolutive — idéale pour démarrer rapidement',
      avantages: ['Développement rapide', 'Déploiement simple', 'Debugging facile', 'Coût d\'infrastructure minimal'],
      inconvenients: ['Scalabilité limitée au-delà de 100K users', 'Couplage fort entre modules']
    },
    scale: {
      nom: 'Microservices',
      desc: 'Architecture distribuée — idéale pour les grands volumes',
      avantages: ['Scalabilité indépendante par service', 'Déploiements indépendants', 'Technologies hétérogènes'],
      inconvenients: ['Complexité opérationnelle', 'Latence réseau inter-services', 'Debugging distribué difficile']
    },
    serverless: {
      nom: 'Serverless / FaaS',
      desc: 'Architecture sans serveur — paiement à l\'usage',
      avantages: ['Zéro maintenance serveur', 'Auto-scaling natif', 'Coût à l\'usage (pay-per-request)'],
      inconvenients: ['Cold starts', 'Vendor lock-in', 'Limitations de durée d\'exécution']
    }
  };

  const arch = architectures[scale] || architectures.startup;

  return `# DOCUMENT D'ARCHITECTURE
## ${nomProjet?.toUpperCase() || 'PROJET'}

**Date**: ${today} | **Scale**: ${scale} | **Pattern**: ${arch.nom}

---

## 1. VUE D'ENSEMBLE

### Architecture choisie: ${arch.nom}
> ${arch.desc}

**Avantages**: ${arch.avantages.join(' • ')}
**Limitations**: ${arch.inconvenients.join(' • ')}

---

## 2. DIAGRAMME D'ARCHITECTURE

\`\`\`
╔══════════════════════════════════════════════════════════╗
║                    INTERNET                              ║
╚══════════════════════════╦═══════════════════════════════╝
                           ║ HTTPS
                    ┌──────▼──────┐
                    │   CDN /     │
                    │  Cloudflare │ ← DDoS protection, SSL
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Load       │
                    │  Balancer   │ ← Nginx / Traefik
                    └──────┬──────┘
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼───┐ ┌──────▼───┐ ┌────▼──────┐
       │Frontend  │ │Frontend  │ │ Frontend  │
       │Instance 1│ │Instance 2│ │ Instance N│ ← Horizontal scaling
       └──────────┘ └──────────┘ └───────────┘
              │            │
       ┌──────▼────────────▼──────────────────┐
       │           API Gateway                 │
       │  Auth • Rate Limit • Routing          │
       └──────┬──────────────────┬─────────────┘
              │                  │
       ┌──────▼───┐       ┌──────▼───┐
       │  Backend │       │ WebSocket│
       │  API     │       │ Server   │ ← Socket.io
       └──────┬───┘       └──────────┘
              │
    ┌─────────┼─────────┐
    │         │         │
┌───▼──┐  ┌──▼───┐  ┌──▼──────┐
│ DB   │  │Redis │  │ Storage  │
│(PG)  │  │Cache │  │(S3/MinIO)│
└──────┘  └──────┘  └──────────┘
\`\`\`

---

## 3. COMPOSANTS DÉTAILLÉS

### 3.1 Frontend
| Aspect | Choix | Raison |
|--------|-------|--------|
| Framework | Next.js 15 | SSR, App Router, performance |
| Language | TypeScript | Typage fort, maintenabilité |
| UI | Tailwind CSS + Radix UI | Rapidité, accessibilité |
| État global | Zustand | Léger, simple, performant |
| Data fetching | TanStack Query | Cache, revalidation, optimiste |
| Forms | React Hook Form + Zod | Performant, validation typée |

### 3.2 Backend
| Aspect | Choix | Raison |
|--------|-------|--------|
| Runtime | Node.js 22 | JavaScript fullstack, ecosystem |
| Framework | Express + Fastify | Flexibilité, performance |
| ORM | Prisma | Type-safe, migrations, DX |
| Validation | Zod | TypeScript-first, composable |
| Auth | JWT + Argon2 | Standard, sécurisé |
| Queue | BullMQ + Redis | Jobs async, retry, scheduling |

### 3.3 Infrastructure
| Composant | Outil | Raison |
|-----------|-------|--------|
| Conteneurs | Docker | Portabilité, isolation |
| Orchestration | Docker Compose (dev) / K3s (prod) | Simple à opérer |
| CI/CD | GitHub Actions | Gratuit, intégré |
| Monitoring | Prometheus + Grafana | Open source, puissant |
| Logs | Loki + Grafana | Stack complète |
| Alerting | Alertmanager | Intégré à Prometheus |

---

## 4. FLUX DE DONNÉES CRITIQUES

### 4.1 Authentification
\`\`\`
Client → POST /api/auth/login
  → Validation (Zod)
  → Vérification email/password (bcrypt.compare)
  → Génération JWT (15min) + Refresh Token (7j)
  → Stockage Refresh Token (Redis)
  → Réponse: { accessToken, refreshToken, user }

Client → Requête protégée (Authorization: Bearer <token>)
  → Middleware JWT verify()
  → Si expiré: 401 → Client demande refresh
  → Si valide: req.user = payload → next()
\`\`\`

### 4.2 Gestion des erreurs
\`\`\`typescript
// Global error handler
app.use((err: Error, req, res, next) => {
  const status = err instanceof AppError ? err.status : 500;
  const message = err instanceof AppError ? err.message : 'Erreur interne';

  logger.error({ err, req: { method: req.method, url: req.url, userId: req.user?.id } });

  res.status(status).json({ success: false, error: message });
});
\`\`\`

---

## 5. SCALABILITÉ ET PERFORMANCES

### Stratégies de caching
\`\`\`
L1 — Cache mémoire (in-process): données très fréquentes, TTL < 1min
L2 — Redis: sessions, API responses, TTL 5-60min
L3 — CDN (Cloudflare): assets statiques, pages publiques, TTL 24h+
\`\`\`

### Optimisations base de données
\`\`\`sql
-- Index essentiels
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_resources_user_id ON resources(user_id);
CREATE INDEX CONCURRENTLY idx_resources_created_at ON resources(created_at DESC);

-- Connexions: Pool de 10-20 connexions max
-- Requêtes lentes: EXPLAIN ANALYZE, slow query log
-- Pagination: cursor-based pour grandes tables
\`\`\`

---

## 6. PLAN DE REPRISE D'ACTIVITÉ (PRA)

| Scénario | RTO | RPO | Procédure |
|----------|-----|-----|-----------|
| Panne serveur | < 5min | 0 | Auto-restart (Docker restart:always) |
| Perte base de données | < 1h | < 24h | Restauration backup S3 |
| Panne datacenter | < 4h | < 1h | Basculement région secondaire |
| Compromission sécurité | < 2h | 0 | Rotation secrets, audit logs |

**Sauvegardes**: PostgreSQL dump quotidien → S3 (rétention 30 jours)

---

*Architecture conçue par OMEDEV-AI — OMEDEV SERVICES SARL, Kinshasa, RDC*
*${today}*
`;
};

/**
 * Génère les user stories pour un projet
 */
export const generateUserStories = (features = []) => {
  if (features.length === 0) {
    features = [
      { role: 'utilisateur', action: 'créer un compte', benefice: 'accéder à mes données personnelles' },
      { role: 'utilisateur', action: 'me connecter', benefice: 'retrouver mes informations' },
      { role: 'administrateur', action: 'gérer les utilisateurs', benefice: 'contrôler les accès à la plateforme' }
    ];
  }

  let md = `# USER STORIES\n\n`;
  features.forEach((f, i) => {
    md += `## US-${String(i + 1).padStart(3, '0')}\n`;
    md += `**En tant que** ${f.role}, **je veux** ${f.action} **afin de** ${f.benefice}.\n\n`;
    md += `**Critères d'acceptation (Gherkin):**\n`;
    md += `\`\`\`gherkin\nGiven [contexte initial]\nWhen [action de l'utilisateur]\nThen [résultat attendu]\nAnd [condition supplémentaire]\n\`\`\`\n\n`;
    md += `**Priorité**: Must Have | **Points**: 3 | **Sprint**: 1\n\n---\n\n`;
  });
  return md;
};

/**
 * Dispatch — génère le document selon le type demandé
 */
export const generateDocument = (type, data = {}) => {
  switch (type) {
    case 'cdc':
    case 'cahier_de_charges':
      return { type: 'cahier_de_charges', content: generateCahierDeCharges(data), format: 'markdown' };
    case 'spec_technique':
    case 'spec':
      return { type: 'spec_technique', content: generateSpecTechnique(data), format: 'markdown' };
    case 'architecture':
      return { type: 'architecture', content: generateArchitectureDoc(data), format: 'markdown' };
    case 'user_stories':
      return { type: 'user_stories', content: generateUserStories(data.features), format: 'markdown' };
    default:
      return { error: `Type de document inconnu: "${type}". Types disponibles: cdc, spec_technique, architecture, user_stories` };
  }
};
