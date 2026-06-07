export interface KnowledgeEntry {
  id: string
  category: string
  keywords: string[]
  response: string
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // ─── IDENTITÉ OMEDEV ───────────────────────────────────────────────────────
  {
    id: 'omedev-identity',
    category: 'identity',
    keywords: ['omedev','qui','identite','assistant','presente','présente','ia','intelligence'],
    response: `## Je suis OMEDEV-AI 🤖

Assistant IA professionnel développé par **OMEDEV SERVICES SARL** à Kinshasa, République Démocratique du Congo.

### Mes 6 modes spécialisés
| Mode | Domaine d'expertise |
|------|---------------------|
| 💬 **Général** | Questions ouvertes, conseils, explications |
| 💻 **Code** | Développement, debug, architecture logicielle |
| ⚖️ **Juridique** | Droit OHADA, contrats, législation RDC |
| 🎓 **Formation** | Cours, quiz, exercices pratiques |
| 📊 **Analyste** | Données, rapports, business intelligence |
| 🤖 **Autonome** | Tâches complexes, projets multi-étapes |

### Mes capacités
- Écrire et débugger du code dans 15+ langages
- Rédiger des contrats conformes au droit OHADA
- Analyser des données et produire des rapports
- Créer des plans de cours et formations
- Répondre en français, anglais, et langues locales

Je suis propulsé par **Claude Opus 4.8** d'Anthropic — le modèle IA le plus avancé pour les tâches professionnelles.`,
  },
  {
    id: 'omedev-company',
    category: 'identity',
    keywords: ['omedev','services','sarl','entreprise','societe','kinshasa','rdc','coordonnees','contact','adresse','gerant'],
    response: `## OMEDEV SERVICES SARL

Entreprise technologique leader en intelligence artificielle et développement logiciel à Kinshasa.

### Informations officielles
| Champ | Détail |
|-------|--------|
| **Raison sociale** | OMEDEV SERVICES SARL |
| **Siège social** | 75, avenue Kabambare, Kinshasa, RDC |
| **Gérant** | M. DORODORO Meya Osée |
| **Email** | oseedoro@gmail.com |
| **Secteur** | Technologies de l'information |

### Services proposés
- 🤖 **IA & Automatisation** — Développement d'outils IA sur mesure
- 💻 **Développement logiciel** — Applications web, mobiles, APIs
- 🎓 **Formation tech** — Initiation, perfectionnement, certifications
- 📊 **Conseil digital** — Stratégie de transformation numérique
- ⚖️ **Legaltech** — Outils juridiques adaptés au contexte OHADA

### Vision
*Démocratiser l'accès aux technologies de pointe en Afrique centrale et contribuer au développement économique de la RDC par l'innovation.*`,
  },
  {
    id: 'omedev-apikey',
    category: 'identity',
    keywords: ['cle','api','key','anthropic','configurer','env','local','demarrer','serveur','activer'],
    response: `## Configurer la clé API Anthropic

Pour activer OMEDEV-AI avec Claude Opus 4.8, vous avez besoin d'une clé API Anthropic.

### Étape 1 — Obtenir la clé
1. Aller sur **https://console.anthropic.com**
2. Se connecter ou créer un compte
3. Menu **API Keys** → **Create Key**
4. Copier la clé (format : \`sk-ant-api03-xxxxx...\`)

### Étape 2 — Configurer le projet
Ouvrir le fichier **\`.env.local\`** à la racine du projet et remplacer :
\`\`\`env
# Avant (ne fonctionne pas)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Après (votre vraie clé)
ANTHROPIC_API_KEY=sk-ant-api03-VOTRE-CLE-ICI
\`\`\`

### Étape 3 — Redémarrer
\`\`\`bash
# Arrêter le serveur (Ctrl+C), puis relancer
npm run dev
\`\`\`

> ⚠️ **Important** : Next.js ne recharge pas automatiquement les variables d'environnement. Le redémarrage est obligatoire.

### Sans clé API
OMEDEV-AI fonctionne quand même en **mode mémoire locale** — il répond depuis sa base de connaissance intégrée.`,
  },

  // ─── JAVASCRIPT ────────────────────────────────────────────────────────────
  {
    id: 'javascript-fondamentaux',
    category: 'code',
    keywords: ['javascript','js','variable','fonction','objet','tableau','array','boucle','condition','classe','module','import','export','async','await','promise'],
    response: `## JavaScript — Fondamentaux

Langage de programmation universel du web, côté client (navigateur) et serveur (Node.js).

### Types et variables
\`\`\`javascript
// Déclaration moderne
const nom = "OMEDEV"        // immuable
let compteur = 0             // mutable
// var est obsolète — éviter

// Types primitifs
const texte = "Kinshasa"     // string
const nombre = 42            // number
const actif = true           // boolean
const vide = null            // null
const inconnu = undefined    // undefined

// Destructuration
const { prenom, age } = utilisateur
const [premier, ...reste] = tableau
\`\`\`

### Fonctions
\`\`\`javascript
// Fonction classique
function additionner(a, b) { return a + b }

// Fonction fléchée (arrow function)
const multiplier = (a, b) => a * b

// Paramètres par défaut
const saluer = (nom = "ami") => \`Bonjour \${nom} !\`

// Reste des paramètres
const somme = (...nombres) => nombres.reduce((a, b) => a + b, 0)
\`\`\`

### Asynchrone (Promises / async-await)
\`\`\`javascript
// Fetch API avec async/await
async function chargerDonnees(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erreur :", error.message)
    throw error
  }
}

// Parallèle
const [users, produits] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/produits').then(r => r.json()),
])
\`\`\`

### Manipulation de tableaux
\`\`\`javascript
const ventes = [120, 350, 89, 450, 230]

const total = ventes.reduce((sum, v) => sum + v, 0)      // 1239
const grandes = ventes.filter(v => v > 200)              // [350, 450, 230]
const doubles = ventes.map(v => v * 2)                   // [240, 700, ...]
const max = Math.max(...ventes)                          // 450
\`\`\``,
  },
  {
    id: 'typescript',
    category: 'code',
    keywords: ['typescript','ts','type','interface','generique','enum','union','intersection','tuple','decorateur','narrowing'],
    response: `## TypeScript — Typage statique pour JavaScript

TypeScript ajoute des types statiques à JavaScript, détectant les bugs avant l'exécution.

### Types de base
\`\`\`typescript
// Primitifs
const nom: string = "OMEDEV"
const age: number = 5
const actif: boolean = true

// Tableaux
const villes: string[] = ["Kinshasa", "Goma", "Lubumbashi"]
const scores: Array<number> = [98, 87, 95]

// Tuple
const coordonnees: [number, number] = [-4.3, 15.3]

// Union
let id: string | number = "abc123"
id = 42 // ✅ les deux sont valides

// Literal types
type Direction = "nord" | "sud" | "est" | "ouest"
type Statut = 200 | 201 | 400 | 401 | 404 | 500
\`\`\`

### Interfaces et types
\`\`\`typescript
interface Utilisateur {
  id: number
  nom: string
  email: string
  role: "admin" | "user" | "guest"
  adresse?: {           // optionnel
    ville: string
    pays: string
  }
  readonly createdAt: Date  // lecture seule
}

// Extension d'interface
interface Admin extends Utilisateur {
  permissions: string[]
  niveau: 1 | 2 | 3
}

// Type alias avec générique
type ApiResponse<T> = {
  data: T
  error: string | null
  status: number
  timestamp: Date
}

// Utilisation
async function getUser(id: number): Promise<ApiResponse<Utilisateur>> {
  const res = await fetch(\`/api/users/\${id}\`)
  return res.json()
}
\`\`\`

### Utilitaires TypeScript
\`\`\`typescript
// Partial — tous les champs optionnels
type MajUser = Partial<Utilisateur>

// Required — tous les champs obligatoires
type CompletUser = Required<Utilisateur>

// Pick — sélectionner des champs
type UserPreview = Pick<Utilisateur, "id" | "nom">

// Omit — exclure des champs
type UserSansId = Omit<Utilisateur, "id">

// Record
type RolesMap = Record<string, string[]>
\`\`\``,
  },

  // ─── PYTHON ────────────────────────────────────────────────────────────────
  {
    id: 'python',
    category: 'code',
    keywords: ['python','py','pandas','numpy','liste','dictionnaire','classe','pip','virtualenv','fastapi','django','flask','script','automation'],
    response: `## Python — Polyvalent et puissant

Python est le langage #1 pour l'IA, la data science et l'automatisation.

### Fondamentaux
\`\`\`python
# Listes et compréhension
villes = ["Kinshasa", "Goma", "Bukavu", "Lubumbashi"]
longues = [v for v in villes if len(v) > 5]  # ['Kinshasa', 'Lubumbashi']
majuscules = [v.upper() for v in villes]

# Dictionnaires
user = {"nom": "Osée", "ville": "Kinshasa", "age": 30}
print(user.get("email", "non renseigné"))  # valeur par défaut

# Déballage
prenom, *reste = ["Osée", "Meya", "Dorodoro"]

# Classes
class Entreprise:
    def __init__(self, nom: str, ville: str):
        self.nom = nom
        self.ville = ville

    def __repr__(self) -> str:
        return f"Entreprise({self.nom!r}, {self.ville!r})"
\`\`\`

### Analyse de données — Pandas
\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("ventes.csv")

# Exploration rapide
print(df.shape)           # (lignes, colonnes)
print(df.info())          # types des colonnes
print(df.describe())      # statistiques

# Nettoyage
df = df.dropna(subset=["montant"])
df["montant"] = pd.to_numeric(df["montant"], errors="coerce")

# Analyse
par_ville = df.groupby("ville")["montant"].agg(["sum","mean","count"])
par_ville.columns = ["Total", "Moyenne", "Transactions"]

# Visualisation
par_ville["Total"].sort_values().plot(kind="barh", color="#00A878")
plt.title("Ventes par ville")
plt.tight_layout()
plt.savefig("ventes.png", dpi=150)
\`\`\`

### API avec FastAPI
\`\`\`python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="OMEDEV API")

class Client(BaseModel):
    nom: str
    email: str
    ville: str = "Kinshasa"

@app.post("/clients", status_code=201)
async def creer_client(client: Client):
    # Sauvegarder en BDD...
    return {"id": 1, **client.dict()}

@app.get("/clients/{id}")
async def get_client(id: int):
    if id <= 0:
        raise HTTPException(status_code=404, detail="Client introuvable")
    return {"id": id, "nom": "Jean Mbala"}
\`\`\``,
  },

  // ─── REACT ─────────────────────────────────────────────────────────────────
  {
    id: 'react',
    category: 'code',
    keywords: ['react','reactjs','composant','component','jsx','hooks','usestate','useeffect','useref','context','redux','zustand','props','state','rendu'],
    response: `## React — Bibliothèque UI de référence

React construit des interfaces utilisateur avec des composants réutilisables.

### Composant fonctionnel avec hooks
\`\`\`tsx
import { useState, useEffect, useCallback } from 'react'

interface PropsCard {
  titre: string
  url: string
}

export function CarteUtilisateur({ titre, url }: PropsCard) {
  const [data, setData] = useState<{ nom: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch(url)
      .then(r => r.json())
      .then(d => { if (!cancelled) { setData(d); setLoading(false) } })
    return () => { cancelled = true }
  }, [url])

  if (loading) return <div className="animate-pulse">Chargement...</div>

  return (
    <div className="p-4 rounded-xl border bg-card">
      <h2 className="font-bold text-lg">{titre}</h2>
      <p>{data?.nom}</p>
    </div>
  )
}
\`\`\`

### Hooks essentiels
\`\`\`tsx
// useState — état local
const [count, setCount] = useState(0)
setCount(c => c + 1)  // mise à jour fonctionnelle

// useRef — référence DOM / valeur stable
const inputRef = useRef<HTMLInputElement>(null)
inputRef.current?.focus()

// useCallback — mémoriser une fonction
const handleClick = useCallback(() => {
  setCount(c => c + 1)
}, [])  // ne se recrée que si les dépendances changent

// useMemo — mémoriser un calcul coûteux
const total = useMemo(() =>
  items.reduce((sum, item) => sum + item.prix, 0),
  [items]
)

// useContext — partager un état global
const { user, setUser } = useContext(AuthContext)
\`\`\`

### Gestion d'état global avec Zustand
\`\`\`tsx
import { create } from 'zustand'

interface AppStore {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const useAppStore = create<AppStore>((set) => ({
  theme: 'dark',
  toggleTheme: () => set(s => ({
    theme: s.theme === 'dark' ? 'light' : 'dark'
  })),
}))

// Dans un composant
const { theme, toggleTheme } = useAppStore()
\`\`\``,
  },

  // ─── NEXT.JS ────────────────────────────────────────────────────────────────
  {
    id: 'nextjs',
    category: 'code',
    keywords: ['nextjs','next','next.js','app','router','server','component','layout','page','middleware','metadata','image','streaming','ssr','ssg','isr'],
    response: `## Next.js 15 — Framework full-stack React

Next.js est utilisé pour construire OMEDEV-AI. Il combine frontend et backend dans un seul projet.

### Architecture App Router
\`\`\`
app/
├── layout.tsx          # Layout racine (html, body, providers)
├── page.tsx            # Route / (page d'accueil)
├── loading.tsx         # UI pendant le chargement
├── error.tsx           # Gestion des erreurs
├── not-found.tsx       # Page 404
├── (auth)/             # Groupe de routes (sans segment d'URL)
│   ├── login/page.tsx  # Route /login
│   └── register/page.tsx
├── dashboard/
│   ├── layout.tsx      # Layout imbriqué
│   └── page.tsx        # Route /dashboard
└── api/
    └── chat/
        └── route.ts    # API Route POST/GET /api/chat
\`\`\`

### Server Components vs Client Components
\`\`\`tsx
// Server Component (par défaut) — s'exécute sur le serveur
// Peut lire la BDD directement, pas de useState/useEffect
async function PageUtilisateurs() {
  const users = await db.query('SELECT * FROM users')  // accès direct BDD
  return <ul>{users.map(u => <li key={u.id}>{u.nom}</li>)}</ul>
}

// Client Component — s'exécute dans le navigateur
'use client'
import { useState } from 'react'

export function CompteurInteractif() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
\`\`\`

### API Route avec streaming SSE
\`\`\`typescript
// app/api/stream/route.ts
export async function POST(req: Request) {
  const { message } = await req.json()

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const words = message.split(' ')
      for (const word of words) {
        controller.enqueue(encoder.encode(\`data: \${JSON.stringify({ text: word })}\n\n\`))
        await new Promise(r => setTimeout(r, 50))
      }
      controller.close()
    }
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
  })
}
\`\`\`

### Metadata et SEO
\`\`\`typescript
// app/layout.tsx
export const metadata = {
  title: { default: 'OMEDEV-AI', template: '%s | OMEDEV-AI' },
  description: 'Assistant IA professionnel par OMEDEV SERVICES SARL',
  openGraph: { type: 'website', locale: 'fr_CD' }
}
\`\`\``,
  },

  // ─── NODE.JS / EXPRESS ─────────────────────────────────────────────────────
  {
    id: 'nodejs',
    category: 'code',
    keywords: ['nodejs','node','express','backend','serveur','server','middleware','route','npm','package','module'],
    response: `## Node.js & Express — Backend JavaScript

Node.js exécute JavaScript côté serveur. Express est le framework web le plus utilisé.

### Serveur Express complet
\`\`\`javascript
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

const app = express()

// Middlewares de sécurité
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(express.json({ limit: '10mb' }))

// Rate limiting — 100 requêtes par 15 min par IP
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use('/api/', limiter)

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.post('/api/clients', async (req, res) => {
  const { nom, email } = req.body
  if (!nom || !email) {
    return res.status(400).json({ error: 'nom et email requis' })
  }
  // Sauvegarder...
  res.status(201).json({ id: Date.now(), nom, email })
})

// Middleware d'erreur global
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Erreur interne du serveur' })
})

app.listen(3001, () => console.log('Serveur sur :3001'))
\`\`\``,
  },

  // ─── SQL & BASE DE DONNÉES ──────────────────────────────────────────────────
  {
    id: 'sql-postgresql',
    category: 'code',
    keywords: ['sql','postgresql','postgres','mysql','base','donnees','database','table','select','insert','update','delete','jointure','index','transaction','query'],
    response: `## SQL & PostgreSQL

PostgreSQL est la base de données relationnelle la plus avancée — recommandée pour tous les projets sérieux.

### DDL — Définir les tables
\`\`\`sql
-- Créer un schéma
CREATE TABLE clients (
  id          SERIAL PRIMARY KEY,
  nom         VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  telephone   VARCHAR(20),
  ville       VARCHAR(100) DEFAULT 'Kinshasa',
  actif       BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE commandes (
  id          SERIAL PRIMARY KEY,
  client_id   INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  montant     DECIMAL(12,2) NOT NULL CHECK (montant > 0),
  devise      CHAR(3) DEFAULT 'USD',
  statut      VARCHAR(20) DEFAULT 'pending'
              CHECK (statut IN ('pending','paid','cancelled')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_commandes_client ON commandes(client_id);
CREATE INDEX idx_commandes_statut ON commandes(statut);
\`\`\`

### DML — Manipuler les données
\`\`\`sql
-- Insérer plusieurs lignes
INSERT INTO clients (nom, email, ville) VALUES
  ('Jean Mbala',  'jean@example.cd',  'Kinshasa'),
  ('Marie Lelo',  'marie@example.cd', 'Goma'),
  ('Pierre Kolo', 'pierre@example.cd','Lubumbashi');

-- Lire avec filtre et tri
SELECT c.nom, c.email, COUNT(o.id) AS nb_commandes,
       SUM(o.montant) AS total_achats
FROM clients c
LEFT JOIN commandes o ON c.id = o.client_id
WHERE c.actif = true
GROUP BY c.id, c.nom, c.email
HAVING COUNT(o.id) > 0
ORDER BY total_achats DESC
LIMIT 10;

-- Mettre à jour
UPDATE commandes
SET statut = 'paid', updated_at = NOW()
WHERE id = 42 AND statut = 'pending'
RETURNING id, statut;

-- Transaction atomique
BEGIN;
  UPDATE comptes SET solde = solde - 500 WHERE id = 1;
  UPDATE comptes SET solde = solde + 500 WHERE id = 2;
  INSERT INTO transactions (de_compte, vers_compte, montant) VALUES (1, 2, 500);
COMMIT;
-- En cas d'erreur : ROLLBACK;
\`\`\`

### Prisma ORM (TypeScript)
\`\`\`typescript
// prisma/schema.prisma
model Client {
  id         Int        @id @default(autoincrement())
  nom        String
  email      String     @unique
  commandes  Commande[]
  createdAt  DateTime   @default(now())
}

// Utilisation
const clients = await prisma.client.findMany({
  where: { actif: true },
  include: { commandes: { where: { statut: 'paid' } } },
  orderBy: { createdAt: 'desc' },
  take: 10,
})
\`\`\``,
  },

  // ─── GIT ───────────────────────────────────────────────────────────────────
  {
    id: 'git',
    category: 'code',
    keywords: ['git','github','commit','branch','branche','push','pull','merge','rebase','stash','tag','fork','clone','conflict','version'],
    response: `## Git — Contrôle de version

### Workflow professionnel
\`\`\`bash
# Initialiser et connecter
git init
git remote add origin https://github.com/omedev/projet.git

# Workflow quotidien
git status                          # état du repo
git diff                            # voir les modifications
git add src/components/Header.tsx   # ajouter un fichier spécifique
git add .                           # ajouter tout
git commit -m "feat: ajouter sidebar mobile responsive"
git push origin feature/mobile

# Workflow avec branches (Git Flow)
git checkout -b feature/paiement-mobile    # créer + basculer
git checkout main && git pull origin main  # mettre à jour main
git merge feature/paiement-mobile          # fusionner
git branch -d feature/paiement-mobile      # nettoyer
\`\`\`

### Conventions de commits (Conventional Commits)
\`\`\`
feat:     nouvelle fonctionnalité
fix:      correction de bug
docs:     documentation
style:    formatage (pas de logique)
refactor: refactoring sans nouveau comportement
test:     ajout/modification de tests
chore:    maintenance, dépendances
perf:     amélioration de performances

Exemples :
git commit -m "feat: intégration API M-Pesa"
git commit -m "fix: correction crash sidebar sur iPhone SE"
git commit -m "docs: mise à jour README installation"
\`\`\`

### Résoudre un conflit
\`\`\`bash
git pull origin main          # déclenche le conflit
# Éditer les fichiers marqués <<<<<<< HEAD
git add fichier-résolu.ts
git commit -m "merge: résolution conflit Header.tsx"
\`\`\`

### Commandes avancées utiles
\`\`\`bash
git log --oneline --graph       # historique visuel
git stash                       # sauvegarder sans committer
git stash pop                   # restaurer
git reset --soft HEAD~1         # annuler le dernier commit (garder modifications)
git reset --hard HEAD~1         # annuler le dernier commit (perdre modifications)
git cherry-pick abc1234         # appliquer un commit spécifique
git blame fichier.ts            # voir qui a modifié chaque ligne
\`\`\``,
  },

  // ─── DOCKER ────────────────────────────────────────────────────────────────
  {
    id: 'docker',
    category: 'devops',
    keywords: ['docker','conteneur','container','image','compose','dockerfile','kubernetes','devops','deploy','deploiement','production','build'],
    response: `## Docker — Conteneurisation

Docker empaquète votre application et toutes ses dépendances dans un conteneur portable.

### Dockerfile optimisé pour Next.js
\`\`\`dockerfile
# Multi-stage build pour réduire la taille finale
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

### docker-compose.yml (dev + prod)
\`\`\`yaml
version: '3.9'
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      - ANTHROPIC_API_KEY=\${ANTHROPIC_API_KEY}
      - DATABASE_URL=\${DATABASE_URL}
    depends_on: [db, redis]
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    volumes: [postgres_data:/var/lib/postgresql/data]
    environment:
      POSTGRES_DB: omedev_ai
      POSTGRES_PASSWORD: \${DB_PASSWORD}

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass \${REDIS_PASSWORD}

volumes:
  postgres_data:
\`\`\`

### Commandes essentielles
\`\`\`bash
docker build -t omedev-ai:latest .
docker run -p 3000:3000 --env-file .env omedev-ai:latest
docker-compose up -d          # lancer en arrière-plan
docker-compose logs -f app    # voir les logs
docker-compose down -v        # arrêter et supprimer
docker exec -it container_id sh  # entrer dans le conteneur
docker system prune -a        # nettoyer les images inutilisées
\`\`\``,
  },

  // ─── REST API ───────────────────────────────────────────────────────────────
  {
    id: 'rest-api',
    category: 'tech',
    keywords: ['api','rest','restful','endpoint','http','requete','request','response','json','crud','status','code','header','cors','pagination'],
    response: `## Concevoir une API REST professionnelle

### Conventions de nommage
\`\`\`
GET    /api/v1/clients          → lister les clients
POST   /api/v1/clients          → créer un client
GET    /api/v1/clients/:id      → obtenir un client
PUT    /api/v1/clients/:id      → remplacer entièrement
PATCH  /api/v1/clients/:id      → mise à jour partielle
DELETE /api/v1/clients/:id      → supprimer

GET    /api/v1/clients/:id/commandes  → ressource imbriquée
GET    /api/v1/clients?ville=Kinshasa&page=1&limit=20  → filtres + pagination
\`\`\`

### Codes HTTP corrects
| Code | Situation |
|------|-----------|
| 200 | Succès (GET, PUT, PATCH) |
| 201 | Ressource créée (POST) |
| 204 | Succès sans corps (DELETE) |
| 400 | Données invalides |
| 401 | Non authentifié (pas de token) |
| 403 | Non autorisé (token valide mais pas les droits) |
| 404 | Ressource introuvable |
| 409 | Conflit (email déjà existant) |
| 422 | Validation échouée |
| 429 | Trop de requêtes |
| 500 | Erreur serveur |

### Format de réponse standardisé
\`\`\`json
// Succès
{ "data": { "id": 1, "nom": "Jean Mbala" }, "meta": { "timestamp": "..." } }

// Liste avec pagination
{
  "data": [...],
  "meta": { "total": 150, "page": 1, "limit": 20, "totalPages": 8 }
}

// Erreur
{
  "error": { "code": "VALIDATION_ERROR", "message": "Email invalide",
             "fields": { "email": "Format incorrect" } }
}
\`\`\`

### Implémentation Next.js avec validation Zod
\`\`\`typescript
import { z } from 'zod'

const ClientSchema = z.object({
  nom: z.string().min(2).max(100),
  email: z.string().email(),
  telephone: z.string().regex(/^\+?[0-9]{9,15}$/).optional(),
})

export async function POST(req: Request) {
  const body = await req.json()
  const result = ClientSchema.safeParse(body)

  if (!result.success) {
    return Response.json(
      { error: { code: 'VALIDATION_ERROR', fields: result.error.flatten().fieldErrors } },
      { status: 422 }
    )
  }
  // Sauvegarder result.data...
  return Response.json({ data: { id: 1, ...result.data } }, { status: 201 })
}
\`\`\``,
  },

  // ─── AUTHENTIFICATION ──────────────────────────────────────────────────────
  {
    id: 'authentification',
    category: 'tech',
    keywords: ['authentification','auth','jwt','token','session','oauth','oauth2','login','connexion','mot','passe','password','bcrypt','cookie','nextauth','middleware'],
    response: `## Authentification sécurisée

### JWT (JSON Web Token) avec Next.js
\`\`\`typescript
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const SECRET = process.env.JWT_SECRET!

// Hacher le mot de passe à l'inscription
const hashMotDePasse = async (mdp: string) => bcrypt.hash(mdp, 12)

// Vérifier à la connexion
const verifierMotDePasse = (mdp: string, hash: string) => bcrypt.compare(mdp, hash)

// Créer un token
const creerToken = (userId: number) =>
  jwt.sign({ sub: userId, iat: Math.floor(Date.now() / 1000) }, SECRET, {
    expiresIn: '7d',
    algorithm: 'HS256'
  })

// Vérifier un token
const verifierToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET) as { sub: number }
  } catch {
    return null
  }
}

// Route de connexion
export async function POST(req: Request) {
  const { email, motDePasse } = await req.json()

  const user = await db.findUserByEmail(email)
  if (!user) return Response.json({ error: 'Identifiants incorrects' }, { status: 401 })

  const valide = await verifierMotDePasse(motDePasse, user.motDePasseHash)
  if (!valide) return Response.json({ error: 'Identifiants incorrects' }, { status: 401 })

  const token = creerToken(user.id)

  // Envoyer en cookie httpOnly (plus sécurisé que localStorage)
  return new Response(JSON.stringify({ user: { id: user.id, nom: user.nom } }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': \`token=\${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/\`
    }
  })
}
\`\`\`

### Middleware de protection des routes
\`\`\`typescript
// middleware.ts (à la racine du projet Next.js)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const isProtected = req.nextUrl.pathname.startsWith('/dashboard')

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*', '/api/admin/:path*'] }
\`\`\``,
  },

  // ─── SÉCURITÉ ───────────────────────────────────────────────────────────────
  {
    id: 'securite-web',
    category: 'tech',
    keywords: ['securite','security','owasp','injection','xss','csrf','https','ssl','tls','vulnerability','faille','protection','sanitize','escape'],
    response: `## Sécurité Web — OWASP Top 10

### 1. Injection SQL → Requêtes paramétrées
\`\`\`typescript
// ❌ DANGEREUX — injection possible
const q = \`SELECT * FROM users WHERE email = '\${email}'\`

// ✅ SÉCURISÉ — paramètre séparé
const user = await db.query('SELECT * FROM users WHERE email = $1', [email])
// Ou avec Prisma (automatiquement sécurisé)
const user = await prisma.user.findUnique({ where: { email } })
\`\`\`

### 2. XSS → Échapper les sorties
\`\`\`typescript
// React échappe automatiquement les variables dans JSX
<p>{userInput}</p>  // ✅ sécurisé

// Éviter dangerouslySetInnerHTML sauf si nécessaire
// Si vous devez l'utiliser, sanitiser d'abord :
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
\`\`\`

### 3. CSRF → Tokens CSRF ou SameSite cookies
\`\`\`typescript
// Cookie SameSite=Strict empêche les requêtes cross-site
'Set-Cookie': 'token=xxx; SameSite=Strict; HttpOnly; Secure'
\`\`\`

### 4. Exposition de données → Variables d'environnement
\`\`\`bash
# .env.local — JAMAIS sur Git
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://...
JWT_SECRET=secret-aleatoire-long

# .gitignore
.env
.env.local
.env.*.local
\`\`\`

### 5. Headers de sécurité (Next.js)
\`\`\`javascript
// next.config.js
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=()' },
]
\`\`\`

### Checklist sécurité
- ✅ HTTPS en production (Vercel/Railway le font automatiquement)
- ✅ Mots de passe hashés avec bcrypt (coût ≥ 12)
- ✅ Secrets dans variables d'environnement
- ✅ Rate limiting sur les APIs (/api)
- ✅ Validation des entrées côté serveur (Zod)
- ✅ Headers de sécurité configurés`,
  },

  // ─── CLOUD & DÉPLOIEMENT ────────────────────────────────────────────────────
  {
    id: 'cloud-deploiement',
    category: 'devops',
    keywords: ['cloud','deploiement','deploy','vercel','railway','heroku','aws','azure','google','hebergement','production','scalable','serverless','cdn'],
    response: `## Cloud & Déploiement

### Vercel — Le plus simple pour Next.js
\`\`\`bash
# Installation et connexion
npm install -g vercel
vercel login

# Déployer
vercel          # preview deployment
vercel --prod   # production

# Variables d'environnement
vercel env add ANTHROPIC_API_KEY
\`\`\`
Vercel fournit automatiquement : HTTPS, CDN mondial, déploiement depuis GitHub.

### Railway — Full-stack avec BDD
1. railway.app → **New Project** → **Deploy from GitHub**
2. Ajouter le service PostgreSQL → copier \`DATABASE_URL\`
3. Configurer les variables d'environnement dans le dashboard
4. Déploiement automatique à chaque push sur \`main\`

### VPS Ubuntu (contrôle total)
\`\`\`bash
# Sur le serveur
sudo apt update && sudo apt install nodejs npm nginx certbot

git clone https://github.com/votre/projet.git && cd projet
npm install && npm run build

# PM2 — gestionnaire de processus
npm install -g pm2
pm2 start npm --name "omedev-ai" -- start
pm2 startup && pm2 save  # démarrage automatique au reboot

# Nginx comme reverse proxy
sudo nano /etc/nginx/sites-available/omedev
# → proxy_pass http://localhost:3000;
sudo certbot --nginx -d votre-domaine.com  # HTTPS gratuit
\`\`\`

### Comparaison
| Plateforme | Prix | Difficulté | Idéal pour |
|------------|------|-----------|------------|
| Vercel | Gratuit (hobby) | ⭐ | Next.js, front |
| Railway | ~5$/mois | ⭐⭐ | Full-stack + BDD |
| AWS EC2 | Variable | ⭐⭐⭐⭐ | Contrôle total |
| VPS (Contabo) | ~4$/mois | ⭐⭐⭐ | Budget + contrôle |`,
  },

  // ─── INTELLIGENCE ARTIFICIELLE ─────────────────────────────────────────────
  {
    id: 'intelligence-artificielle',
    category: 'tech',
    keywords: ['intelligence','artificielle','ia','ai','machine','learning','deep','learning','neural','llm','modele','entrainement','classification','nlp','gpt','claude','anthropic','openai'],
    response: `## Intelligence Artificielle — Vue d'ensemble

### Branches principales

**Machine Learning (ML)** — Apprendre à partir de données
\`\`\`python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Préparer les données
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Entraîner le modèle
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Évaluer
accuracy = model.score(X_test, y_test)
print(f"Précision : {accuracy:.2%}")
\`\`\`

**Deep Learning** — Réseaux de neurones artificiels
- Reconnaissance d'images (ResNet, Vision Transformer)
- Traduction automatique (Transformer)
- Génération de texte (GPT, Claude)

**Large Language Models (LLM)**
| Modèle | Fournisseur | Forces |
|--------|------------|--------|
| Claude Opus 4.8 | Anthropic | Raisonnement, code, français |
| GPT-4o | OpenAI | Général, multimodal |
| Gemini 1.5 Pro | Google | Contexte très long |
| Llama 3.1 | Meta | Open source, auto-hébergement |

### Intégrer Claude dans une app
\`\`\`typescript
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const message = await client.messages.create({
  model: 'claude-opus-4-8',
  max_tokens: 4096,
  thinking: { type: 'adaptive' },
  messages: [{ role: 'user', content: 'Analyse ce contrat OHADA...' }]
})
console.log(message.content[0].text)
\`\`\`

### IA en Afrique centrale
- Secteurs porteurs : agriculture, santé, éducation, finance
- Défis : données locales rares, connectivité
- Opportunités : premier à créer des datasets en langues locales`,
  },

  // ─── OHADA ─────────────────────────────────────────────────────────────────
  {
    id: 'ohada',
    category: 'legal',
    keywords: ['ohada','droit','affaires','uniforme','acte','traite','juridique','commercial','afrique','harmonisation','ccja','ersuma'],
    response: `## Droit OHADA — Guide complet

L'**OHADA** (Organisation pour l'Harmonisation en Afrique du Droit des Affaires) unifie le droit des affaires dans 17 États africains dont la RDC.

### Les 10 Actes Uniformes en vigueur
| Acte Uniforme | Abréviation | Domaine |
|---------------|-------------|---------|
| Droit commercial général | AUDCG | Commerçants, fonds de commerce |
| Sociétés commerciales et GIE | AUSC | SARL, SA, SAS, GIE |
| Sûretés | AUS | Hypothèques, nantissements, garanties |
| Procédures simplifiées de recouvrement | AUPSRVE | Injonction de payer |
| Voies d'exécution | AUVE | Saisies, exécution forcée |
| Procédures collectives | AUPCAP | Faillite, concordat |
| Arbitrage | AUA | Arbitrage commercial |
| Organisation comptable | SYSCOHADA | Comptabilité harmonisée |
| Contrat de transport de marchandises | AUTMR | Transport routier |
| Droit des sociétés coopératives | AUSC-COOP | Coopératives |

### Organes de l'OHADA
- **Conférence des Chefs d'État** — Autorité suprême
- **Conseil des Ministres** — Adopte les Actes Uniformes
- **CCJA** (Cour Commune de Justice et d'Arbitrage) — Juridiction supranationale
- **ERSUMA** (École Régionale Supérieure de la Magistrature) — Formation

### Application en RDC
- Les Actes Uniformes s'appliquent **directement** en RDC dès leur adoption
- En cas de conflit, le droit OHADA **prime** sur le droit national
- La CCJA est la juridiction d'appel suprême pour les litiges commerciaux OHADA

### Ressources
- Textes officiels : **ohada.com**
- Jurisprudence CCJA : **ccja-ohada.org**`,
  },

  // ─── SARL ──────────────────────────────────────────────────────────────────
  {
    id: 'sarl-creation',
    category: 'legal',
    keywords: ['sarl','societe','creation','constituer','fonder','responsabilite','limitee','associes','gerant','statuts','capital','rccm','nif','inss'],
    response: `## Créer une SARL en RDC — Procédure complète

La SARL (Société à Responsabilité Limitée) est régie par l'**Acte Uniforme OHADA sur les Sociétés Commerciales** (AUSC).

### Caractéristiques essentielles
| Critère | Détail |
|---------|--------|
| Nombre d'associés | 1 à 50 |
| Responsabilité | Limitée aux apports |
| Capital social | Librement fixé dans les statuts |
| Direction | 1 ou plusieurs gérants |
| Fiscalité | Impôt sur les Bénéfices des Sociétés (IBS) |

### Documents à préparer
1. **Statuts notariés** (obligatoirement devant notaire)
2. **Déclaration de souscription et versement du capital**
3. **Attestation de dépôt de capital** (banque agréée)
4. **Casier judiciaire** du/des gérant(s) — moins de 3 mois
5. **Pièces d'identité** de tous les associés
6. **Justificatif de domicile** du siège social

### Étapes de création
1. **Rédiger les statuts** → notaire à Kinshasa (~200-500 USD)
2. **Ouvrir un compte bancaire** et déposer le capital
3. **Enregistrement au Guichet Unique** (ANAPI ou Greffe)
4. **RCCM** — Registre du Commerce et du Crédit Mobilier
5. **NIF** — Numéro d'Identification Fiscale (Direction des Impôts)
6. **INSS** — Numéro de sécurité sociale si vous avez des employés
7. **Obtenir les licences sectorielles** si nécessaires

### Clauses obligatoires dans les statuts
- Dénomination sociale, siège, objet social
- Durée (généralement 99 ans)
- Montant du capital et répartition des parts
- Modalités de cession des parts sociales
- Règles de gérance et pouvoirs du gérant

### Délai et coût approximatifs
- Délai : **2 à 6 semaines** selon la fluidité administrative
- Coût : **500 à 2 000 USD** (notaire + frais officiels)`,
  },

  // ─── CONTRAT COMMERCIAL ─────────────────────────────────────────────────────
  {
    id: 'contrat-commercial',
    category: 'legal',
    keywords: ['contrat','accord','convention','prestation','services','clause','obligation','penalite','resiliation','propriete','intellectuelle','nda','confidentialite'],
    response: `## Rédiger un Contrat Commercial

### Structure type d'un contrat de prestation de services IT

**PRÉAMBULE**
\`\`\`
Entre :
[Société X], SARL au capital de [...], RCCM [N°], NIF [N°],
sise à [adresse], représentée par [Gérant], ci-après "le PRESTATAIRE",

Et :
[Client Y], ci-après "le CLIENT",

Il a été convenu ce qui suit :
\`\`\`

**Article 1 — Objet**
Description précise des services : développement d'une application web de gestion de stock comprenant [liste des fonctionnalités], selon le cahier des charges joint en Annexe A.

**Article 2 — Délais et livrables**
| Livrable | Date limite | Critères d'acceptation |
|----------|-------------|------------------------|
| Maquettes UI | J+15 | Validées par le CLIENT |
| Version beta | J+45 | Tests fonctionnels passés |
| Mise en production | J+60 | Recette complète |

**Article 3 — Rémunération**
- Montant total : **X USD / X CDF** (HT)
- Acompte : 40% à la signature (non remboursable)
- 30% à la livraison beta
- Solde 30% à la mise en production

**Article 4 — Propriété intellectuelle**
Le code source livré devient propriété du CLIENT après paiement intégral. Le PRESTATAIRE conserve le droit de mentionner la réalisation dans son portfolio.

**Article 5 — Confidentialité**
Durée : 3 ans après la fin du contrat. Couvre : données métier, code source, processus internes.

**Article 6 — Résiliation**
- Par le CLIENT : préavis de 30 jours + paiement du travail effectué
- Par le PRESTATAIRE : remboursement de l'acompte si non-commencement

**Article 7 — Litiges**
Droit applicable : Actes Uniformes OHADA + droit congolais. Arbitrage CCJA de préférence à la voie judiciaire.

> 💡 Ce modèle est indicatif. Faites toujours relire par un juriste qualifié.`,
  },

  // ─── DROIT DU TRAVAIL ──────────────────────────────────────────────────────
  {
    id: 'droit-travail',
    category: 'legal',
    keywords: ['travail','employe','employeur','salaire','conge','licenciement','contrat','travail','cnss','inss','code','travail','rdc'],
    response: `## Droit du Travail en RDC

Le droit du travail en RDC est régi par la **Loi N° 015/2002 portant Code du Travail** et les textes OHADA applicables.

### Types de contrats de travail
| Type | Durée | Renouvellement | Usage |
|------|-------|----------------|-------|
| **CDI** | Indéterminée | N/A | Poste permanent |
| **CDD** | Déterminée | Max 2 renouvellements | Projet limité |
| **Contrat journalier** | Journée | Possible | Travaux ponctuels |
| **Contrat de stage** | 3-6 mois | 1 fois | Apprentissage |

### Obligations de l'employeur
- **Déclaration INSS** : dans les 8 jours suivant l'embauche
- **Cotisations sociales** : 5% part salariale + 13% part patronale
- **Salaire minimum** (SMIG) : fixé par arrêté ministériel
- **Congés annuels** : 12 jours ouvrables/an (+ 2 jours/5 ans d'ancienneté)
- **Bulletin de paie** mensuel obligatoire

### Procédure de licenciement
1. **Motif légal** requis (faute grave, réduction d'effectifs, inaptitude)
2. **Convocation** en entretien préalable (lettre recommandée)
3. **Délai de réflexion** de 5 jours ouvrables
4. **Notification écrite** du licenciement
5. **Indemnités** : préavis + ancienneté (sauf faute grave)

### Calcul des indemnités de fin de contrat
- Préavis : 1 mois (cadre), 15 jours (agent de maîtrise), 8 jours (ouvrier)
- Indemnité d'ancienneté : 1 mois de salaire par 2 ans d'ancienneté (max 12 mois)

### Juridiction compétente
**Tribunal du Travail** de Kinshasa pour les litiges individuels.`,
  },

  // ─── STARTUP KINSHASA ──────────────────────────────────────────────────────
  {
    id: 'startup-kinshasa',
    category: 'business',
    keywords: ['startup','entrepreneur','kinshasa','rdc','congo','business','investissement','financement','capital','risque','incubateur','accelerateur','pitch'],
    response: `## Créer une Startup Tech à Kinshasa

### Secteurs porteurs en 2025
| Secteur | Opportunité | Exemple |
|---------|------------|---------|
| **Fintech** | 80% non-bancarisés | Néobanque, microfinance |
| **EdTech** | 60% de la population < 25 ans | E-learning offline |
| **HealthTech** | Pénurie médecins | Télémédecine |
| **AgriTech** | 70% emplois agri | Marchés agricoles |
| **LogiTech** | Boom e-commerce | Livraison last-mile |
| **LegalTech** | Formalisation PME | Contrats automatisés |

### Méthodologie Lean Startup
\`\`\`
1. IDÉE → "Quel problème douloureux je résous ?"
2. VALIDATION → Interviewer 20 clients potentiels (pas la famille !)
3. MVP → Construire la version minimale en 6-8 semaines
4. MESURE → Tracker les métriques clés (DAU, conversion, churn)
5. ITÉRATION → Pivoter si nécessaire
\`\`\`

### Sources de financement en RDC
- **Bootstrapping** — Autofinancement (le plus courant)
- **FPI** — Fonds de Promotion de l'Industrie (prêts)
- **ANAPI** — Guichet investissement + avantages fiscaux
- **Accélérateurs** — Hive Kinshasa, African Innovation Foundation
- **Diaspora** — Financement familial (très courant)
- **Impact investors** — Acumen, Omidyar Network Africa

### Checklist de lancement
- [ ] Business plan validé par 10 clients-cibles
- [ ] SARL créée (RCCM + NIF)
- [ ] Compte bancaire entreprise
- [ ] Intégration Mobile Money (M-Pesa / Airtel Money)
- [ ] App mobile-first (> 80% d'usage via mobile en RDC)
- [ ] Mode offline partiel (connexion instable)
- [ ] Support en français + lingala ou swahili selon la cible`,
  },

  // ─── MOBILE MONEY ──────────────────────────────────────────────────────────
  {
    id: 'mobile-money',
    category: 'business',
    keywords: ['mobile','money','mpesa','airtel','orange','paiement','transaction','fintech','transfert','wallet','recharge','integration','api'],
    response: `## Mobile Money en RDC — Intégration technique

### Paysage Mobile Money
| Service | Opérateur | Part de marché | API disponible |
|---------|-----------|----------------|----------------|
| M-Pesa | Vodacom/TMoney | ~45% | Oui |
| Airtel Money | Airtel | ~30% | Oui |
| Orange Money | Orange | ~15% | Oui |
| Afrimoney | Africell | ~10% | En cours |

### Flux d'intégration standard
\`\`\`
Client → Votre App → Votre Serveur → API Mobile Money → Réseau Opérateur
                          ↓
                   Webhook callback ← Confirmation paiement
\`\`\`

### Exemple d'implémentation (M-Pesa)
\`\`\`typescript
// lib/mpesa.ts
interface PaiementParams {
  telephone: string      // format: 243XXXXXXXXX
  montant: number        // en CDF
  reference: string      // votre référence interne
  description: string
}

async function initierPaiement(params: PaiementParams) {
  const token = await obtenirToken()

  const response = await fetch(process.env.MPESA_API_URL + '/payment/c2b', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      businessShortCode: process.env.MPESA_SHORTCODE,
      phoneNumber: params.telephone,
      amount: params.montant,
      accountReference: params.reference,
      transactionDesc: params.description,
      callBackURL: \`\${process.env.APP_URL}/api/mpesa/callback\`,
    })
  })

  return response.json()
}

// Webhook de confirmation
// app/api/mpesa/callback/route.ts
export async function POST(req: Request) {
  const payload = await req.json()
  const { ResultCode, CheckoutRequestID, Amount } = payload.Body.stkCallback

  if (ResultCode === 0) {
    await db.commandes.update({
      where: { mpesaRef: CheckoutRequestID },
      data: { statut: 'payee', montantRecu: Amount }
    })
  }
  return Response.json({ ResultCode: 0 })
}
\`\`\`

### Considérations importantes
- Les APIs Mobile Money en RDC nécessitent un **agrément BCC**
- Tester en sandbox avant la production
- Gérer les timeouts (réseau instable)
- Implémenter des **webhook idempotents** (la même notif peut arriver 2 fois)`,
  },

  // ─── REACT NATIVE ──────────────────────────────────────────────────────────
  {
    id: 'react-native',
    category: 'mobile',
    keywords: ['react','native','mobile','android','ios','expo','app','smartphone','application','flutter','kotlin','swift'],
    response: `## React Native & Développement Mobile

### Démarrer avec Expo (recommandé)
\`\`\`bash
npx create-expo-app MonApp --template blank-typescript
cd MonApp
npx expo start     # scan QR code avec Expo Go sur votre phone
\`\`\`

### Composants natifs de base
\`\`\`tsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useState } from 'react'

export default function AccueilScreen() {
  const [compteur, setCompteur] = useState(0)

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titre}>OMEDEV-AI Mobile</Text>

      <TouchableOpacity
        style={styles.bouton}
        onPress={() => setCompteur(c => c + 1)}
        activeOpacity={0.7}
      >
        <Text style={styles.boutonTexte}>Clics : {compteur}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117', padding: 20 },
  titre: { fontSize: 24, fontWeight: 'bold', color: '#00A878', marginBottom: 20 },
  bouton: { backgroundColor: '#00A878', padding: 16, borderRadius: 12 },
  boutonTexte: { color: 'white', textAlign: 'center', fontWeight: '600' },
})
\`\`\`

### Navigation avec Expo Router
\`\`\`
app/
├── (tabs)/
│   ├── index.tsx    → /
│   ├── chat.tsx     → /chat
│   └── profil.tsx   → /profil
└── modal.tsx        → /modal
\`\`\`

### Conseils pour le marché africain
- **Taille APK** : < 30 MB (stockage limité)
- **Mode offline** : utiliser AsyncStorage ou SQLite local
- **Mobile Money** : intégrer M-Pesa, Airtel Money
- **Langues** : i18n pour français + langues locales
- **Performance** : optimiser pour appareils bas de gamme (2 Go RAM)`,
  },

  // ─── DESIGN PATTERNS ───────────────────────────────────────────────────────
  {
    id: 'architecture',
    category: 'tech',
    keywords: ['architecture','pattern','solid','clean','code','mvc','repository','service','factory','singleton','observer','microservice','monolithe'],
    response: `## Architecture & Design Patterns

### Principes SOLID
| Principe | Signification | Exemple |
|----------|---------------|---------|
| **S** — Single Responsibility | Une classe = une responsabilité | \`UserService\` gère uniquement les users |
| **O** — Open/Closed | Ouvert à l'extension, fermé à la modification | Utiliser l'héritage plutôt que modifier |
| **L** — Liskov Substitution | Les sous-classes remplacent les classes mères | |
| **I** — Interface Segregation | Petites interfaces spécialisées | |
| **D** — Dependency Inversion | Dépendre des abstractions | Injection de dépendances |

### Pattern Repository (séparation BDD / logique)
\`\`\`typescript
// Interface (abstraction)
interface IClientRepository {
  findById(id: number): Promise<Client | null>
  findAll(filters: ClientFilters): Promise<Client[]>
  create(data: CreateClientDto): Promise<Client>
  update(id: number, data: UpdateClientDto): Promise<Client>
  delete(id: number): Promise<void>
}

// Implémentation Prisma
class PrismaClientRepository implements IClientRepository {
  constructor(private readonly db: PrismaClient) {}

  async findById(id: number) {
    return this.db.client.findUnique({ where: { id } })
  }

  async create(data: CreateClientDto) {
    return this.db.client.create({ data })
  }
}

// Service — logique métier pure
class ClientService {
  constructor(private readonly repo: IClientRepository) {}

  async creerClient(data: CreateClientDto) {
    const existant = await this.repo.findByEmail(data.email)
    if (existant) throw new ConflictError('Email déjà utilisé')
    return this.repo.create(data)
  }
}
\`\`\`

### Clean Architecture (couches)
\`\`\`
Présentation (UI / API Routes)
    ↕
Application (Use Cases / Services)
    ↕
Domaine (Entités / Interfaces)
    ↕
Infrastructure (BDD / APIs externes / Cache)
\`\`\`
La règle : les couches internes ne connaissent pas les externes.`,
  },

  // ─── TESTS ─────────────────────────────────────────────────────────────────
  {
    id: 'tests',
    category: 'tech',
    keywords: ['test','testing','jest','vitest','playwright','cypress','tdd','bdd','unitaire','integration','e2e','mock','coverage'],
    response: `## Tests — Stratégie et implémentation

### La pyramide des tests
\`\`\`
        /\\
       /E2E\\          (5%) — Playwright, Cypress
      /------\\
     /Intégr. \\       (20%) — Supertest, Testing Library
    /----------\\
   / Unitaires  \\     (75%) — Vitest, Jest
  /--------------\\
\`\`\`

### Tests unitaires avec Vitest
\`\`\`typescript
import { describe, it, expect, vi } from 'vitest'
import { ClientService } from './ClientService'

describe('ClientService', () => {
  const mockRepo = {
    findByEmail: vi.fn(),
    create: vi.fn(),
  }
  const service = new ClientService(mockRepo as any)

  it('crée un client si email non existant', async () => {
    mockRepo.findByEmail.mockResolvedValue(null)
    mockRepo.create.mockResolvedValue({ id: 1, nom: 'Jean', email: 'jean@test.cd' })

    const result = await service.creerClient({ nom: 'Jean', email: 'jean@test.cd' })

    expect(result.id).toBe(1)
    expect(mockRepo.create).toHaveBeenCalledWith({ nom: 'Jean', email: 'jean@test.cd' })
  })

  it('rejette si email déjà utilisé', async () => {
    mockRepo.findByEmail.mockResolvedValue({ id: 99 })
    await expect(service.creerClient({ nom: 'Test', email: 'existant@test.cd' }))
      .rejects.toThrow('Email déjà utilisé')
  })
})
\`\`\`

### Tests d'API avec Supertest
\`\`\`typescript
import request from 'supertest'
import app from '../app'

describe('POST /api/clients', () => {
  it('crée un client avec données valides', async () => {
    const res = await request(app)
      .post('/api/clients')
      .send({ nom: 'Marie', email: 'marie@test.cd' })

    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({ nom: 'Marie' })
  })

  it('rejette des données invalides', async () => {
    const res = await request(app).post('/api/clients').send({ nom: '' })
    expect(res.status).toBe(422)
  })
})
\`\`\``,
  },

  // ─── TAILWIND ───────────────────────────────────────────────────────────────
  {
    id: 'tailwind-css',
    category: 'code',
    keywords: ['tailwind','css','style','design','responsive','classe','dark','mode','animation','gradient','flexbox','grid','breakpoint'],
    response: `## Tailwind CSS — Système de design utilitaire

Tailwind est utilisé dans tout OMEDEV-AI. Chaque classe = une propriété CSS.

### Bases et responsive
\`\`\`html
<!-- Flexbox / Grid -->
<div class="flex items-center justify-between gap-4">
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

<!-- Responsive (mobile-first) -->
<p class="text-sm sm:text-base lg:text-xl">
<div class="hidden md:block">    <!-- caché sur mobile, visible md+ -->
<div class="block md:hidden">    <!-- visible seulement mobile -->

<!-- Espacement -->
<div class="p-4 sm:p-6 lg:p-8">          <!-- padding responsive -->
<div class="mt-4 space-y-4">             <!-- marge et espace entre enfants -->
\`\`\`

### Composants courants
\`\`\`html
<!-- Bouton primaire -->
<button class="px-4 py-2 bg-omedev-green hover:bg-omedev-green-dark
               text-white font-medium rounded-lg transition-colors
               disabled:opacity-50 disabled:cursor-not-allowed">
  Envoyer
</button>

<!-- Carte -->
<div class="p-4 bg-card border border-border rounded-xl shadow-sm
            hover:shadow-md transition-shadow">
  Contenu
</div>

<!-- Input -->
<input class="w-full px-3 py-2 bg-background border border-border rounded-lg
              text-sm focus:outline-none focus:ring-2 focus:ring-omedev-green/50
              focus:border-omedev-green/50 placeholder:text-muted-foreground">

<!-- Badge -->
<span class="px-2.5 py-0.5 bg-green-500/10 text-green-400
             border border-green-400/30 rounded-full text-xs font-medium">
  Actif
</span>
\`\`\`

### Dark mode et animations
\`\`\`html
<!-- Dark mode automatique -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

<!-- Animations -->
<div class="animate-pulse">   <!-- loading skeleton -->
<div class="animate-spin">    <!-- spinner -->
<div class="animate-bounce">  <!-- bounce -->

<!-- Transition personnalisée -->
<div class="transition-all duration-300 ease-in-out
            hover:scale-105 hover:-translate-y-1">
\`\`\``,
  },

  // ─── REDIS ─────────────────────────────────────────────────────────────────
  {
    id: 'redis-cache',
    category: 'tech',
    keywords: ['redis','cache','caching','performance','session','queue','pub','sub','memoire','upstash'],
    response: `## Redis — Cache et sessions hautes performances

Redis stocke les données en mémoire → accès en < 1ms.

### Cas d'usage principaux
- **Cache** : stocker les résultats d'API/BDD coûteux
- **Sessions** : stockage de sessions utilisateurs
- **Rate limiting** : compteur de requêtes par IP
- **Queue** : file de tâches asynchrones (BullMQ)

### Utilisation avec ioredis en TypeScript
\`\`\`typescript
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

// Cache simple avec TTL (Time To Live)
async function getClientAvecCache(id: number) {
  const cacheKey = \`client:\${id}\`

  // Vérifier le cache
  const cached = await redis.get(cacheKey)
  if (cached) return JSON.parse(cached)

  // Charger depuis la BDD
  const client = await prisma.client.findUnique({ where: { id } })
  if (!client) return null

  // Mettre en cache pour 1 heure (3600 secondes)
  await redis.setex(cacheKey, 3600, JSON.stringify(client))
  return client
}

// Invalider le cache
async function mettreAJourClient(id: number, data: Partial<Client>) {
  await prisma.client.update({ where: { id }, data })
  await redis.del(\`client:\${id}\`)  // invalider le cache
}

// Rate limiting
async function verifierRateLimit(ip: string): Promise<boolean> {
  const key = \`rate:\${ip}\`
  const count = await redis.incr(key)
  if (count === 1) await redis.expire(key, 60) // fenêtre de 60 secondes
  return count <= 100  // max 100 requêtes/minute
}
\`\`\`

### Upstash — Redis serverless (pour Vercel)
\`\`\`typescript
import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv()  // UPSTASH_REDIS_REST_URL + TOKEN
\`\`\``,
  },

  // ─── MONGODB ───────────────────────────────────────────────────────────────
  {
    id: 'mongodb',
    category: 'tech',
    keywords: ['mongodb','mongo','nosql','document','collection','bson','mongoose','atlas','aggregation','index'],
    response: `## MongoDB — Base de données NoSQL orientée documents

MongoDB stocke des données en documents JSON (BSON) au lieu de tables relationnelles.

### Quand utiliser MongoDB vs PostgreSQL
| MongoDB | PostgreSQL |
|---------|------------|
| Schéma flexible (données variables) | Schéma fixe (données structurées) |
| Imbrication naturelle (blog → commentaires) | Relations complexes (JOINs) |
| Scale horizontal facile | Transactions ACID complètes |
| CMS, catalogues, logs | Finance, ERP, inventaire |

### Mongoose avec TypeScript
\`\`\`typescript
import mongoose, { Schema, Document } from 'mongoose'

// Schéma et modèle
interface IArticle extends Document {
  titre: string
  contenu: string
  auteur: string
  tags: string[]
  vues: number
  createdAt: Date
}

const ArticleSchema = new Schema<IArticle>({
  titre: { type: String, required: true, maxlength: 200 },
  contenu: { type: String, required: true },
  auteur: { type: Schema.Types.ObjectId, ref: 'User' },
  tags: [{ type: String, lowercase: true }],
  vues: { type: Number, default: 0 },
}, { timestamps: true })

// Index pour les performances
ArticleSchema.index({ titre: 'text', contenu: 'text' })  // recherche full-text
ArticleSchema.index({ tags: 1, createdAt: -1 })

export const Article = mongoose.model<IArticle>('Article', ArticleSchema)

// Opérations CRUD
const articles = await Article
  .find({ tags: 'nextjs' })
  .sort({ createdAt: -1 })
  .limit(10)
  .select('titre auteur vues createdAt')

await Article.findByIdAndUpdate(id, { $inc: { vues: 1 } }, { new: true })
\`\`\``,
  },

  // ─── GRAPHQL ───────────────────────────────────────────────────────────────
  {
    id: 'graphql',
    category: 'tech',
    keywords: ['graphql','gql','schema','query','mutation','subscription','apollo','resolver','type','field'],
    response: `## GraphQL — API déclarative

GraphQL permet au client de demander exactement les données dont il a besoin.

### REST vs GraphQL
\`\`\`
REST :  GET /users/1    → { id, nom, email, adresse, commandes, ... }
                          (surcharge : données inutiles incluses)

GraphQL :
query {
  user(id: 1) {
    nom          ← seulement ce dont on a besoin
    email
    commandes(limit: 5) {
      montant
      statut
    }
  }
}
\`\`\`

### Schéma et resolvers
\`\`\`typescript
// schema.graphql
type Query {
  client(id: ID!): Client
  clients(ville: String, page: Int): [Client!]!
}

type Mutation {
  creerClient(input: CreateClientInput!): Client!
  supprimerClient(id: ID!): Boolean!
}

type Client {
  id: ID!
  nom: String!
  email: String!
  commandes: [Commande!]!
}

// resolvers.ts
const resolvers = {
  Query: {
    client: async (_: any, { id }: { id: string }) =>
      prisma.client.findUnique({ where: { id: Number(id) } }),

    clients: async (_: any, { ville, page = 1 }: any) =>
      prisma.client.findMany({
        where: ville ? { ville } : undefined,
        take: 20,
        skip: (page - 1) * 20,
      }),
  },
  Mutation: {
    creerClient: (_: any, { input }: any) =>
      prisma.client.create({ data: input }),
  },
  Client: {
    // Resolver imbriqué — chargé seulement si demandé
    commandes: (parent: any) =>
      prisma.commande.findMany({ where: { clientId: parent.id } }),
  },
}
\`\`\``,
  },

  // ─── WEBSOCKETS ─────────────────────────────────────────────────────────────
  {
    id: 'websockets',
    category: 'tech',
    keywords: ['websocket','ws','socket','temps','reel','realtime','chat','notification','live','streaming','sse','server','sent','events'],
    response: `## Temps réel — WebSockets & SSE

### Server-Sent Events (SSE) — flux unidirectionnel
*Utilisé par OMEDEV-AI pour le streaming des réponses IA.*

\`\`\`typescript
// Serveur : route SSE
export async function GET() {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i <= 10; i++) {
        const data = JSON.stringify({ progress: i * 10, message: \`Étape \${i}/10\` })
        controller.enqueue(encoder.encode(\`data: \${data}\n\n\`))
        await new Promise(r => setTimeout(r, 500))
      }
      controller.enqueue(encoder.encode('data: {"done":true}\n\n'))
      controller.close()
    }
  })
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
  })
}

// Client : consommer le SSE
const source = new EventSource('/api/progress')
source.onmessage = (event) => {
  const { progress, message, done } = JSON.parse(event.data)
  if (done) source.close()
  else updateProgressBar(progress, message)
}
\`\`\`

### WebSockets bidirectionnels — avec Socket.io
\`\`\`typescript
// Serveur
import { Server } from 'socket.io'
const io = new Server(httpServer)

io.on('connection', (socket) => {
  console.log('Nouveau client :', socket.id)

  socket.on('message', (msg: string) => {
    io.to(socket.data.room).emit('message', {
      id: socket.id, texte: msg, ts: Date.now()
    })
  })

  socket.on('join-room', (room: string) => {
    socket.join(room)
    socket.data.room = room
  })
})

// Client
const socket = io('wss://votre-serveur.com')
socket.emit('join-room', 'salle-kinshasa')
socket.on('message', (msg) => afficherMessage(msg))
\`\`\``,
  },

  // ─── PERFORMANCE WEB ────────────────────────────────────────────────────────
  {
    id: 'performance',
    category: 'tech',
    keywords: ['performance','optimisation','lcp','fcp','cls','bundle','lazy','loading','image','cache','compression','vitesse','core','web','vitals'],
    response: `## Performance Web — Optimisations clés

### Core Web Vitals (métriques Google)
| Métrique | Signification | Objectif |
|----------|---------------|---------|
| **LCP** | Largest Contentful Paint | < 2.5s |
| **FID/INP** | Interaction to Next Paint | < 200ms |
| **CLS** | Cumulative Layout Shift | < 0.1 |

### Optimisations Next.js
\`\`\`typescript
// 1. Images optimisées
import Image from 'next/image'
<Image src="/logo.png" width={200} height={100} alt="Logo" priority />

// 2. Chargement différé des composants
import dynamic from 'next/dynamic'
const ChartLazyLoad = dynamic(() => import('./Chart'), {
  loading: () => <Skeleton />,
  ssr: false  // seulement côté client
})

// 3. Mise en cache des données (App Router)
const data = await fetch('/api/data', {
  next: { revalidate: 3600 }  // revalider toutes les heures
})

// 4. Préchargement des routes critiques
import { prefetch } from 'next/navigation'
prefetch('/dashboard')
\`\`\`

### Techniques JavaScript
\`\`\`typescript
// Débounce — limiter les appels fréquents
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>
  return ((...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T
}

// Utilisation sur une recherche
const rechercheDebounced = debounce(lancerRecherche, 300)

// Virtualisation de listes longues (react-window)
import { FixedSizeList } from 'react-window'
<FixedSizeList height={600} itemCount={10000} itemSize={50}>
  {({ index, style }) => <div style={style}>Item {index}</div>}
</FixedSizeList>
\`\`\`

### Bundle optimization
\`\`\`bash
# Analyser la taille du bundle
npx @next/bundle-analyzer
# ou
npx vite-bundle-visualizer
\`\`\``,
  },

  // ─── DIGITAL MARKETING ─────────────────────────────────────────────────────
  {
    id: 'digital-marketing',
    category: 'business',
    keywords: ['marketing','digital','seo','reseaux','sociaux','publicite','email','conversion','funnel','analytics','google','facebook','tiktok','campagne'],
    response: `## Marketing Digital pour Startups africaines

### Canaux principaux en RDC
| Canal | Portée | Coût | Taux de conversion |
|-------|--------|------|-------------------|
| **WhatsApp Business** | Très élevée | Faible | Élevé (direct) |
| **Facebook/Instagram** | Élevée | Moyen | Moyen |
| **Google Ads** | Ciblée | Élevé | Élevé (intent) |
| **TikTok** | Jeunes | Faible | Variable |
| **SMS Marketing** | Universelle | Faible | Bon |
| **Email** | Faible (usage limité) | Très faible | Variable |

### Stratégie WhatsApp Business (indispensable en RDC)
\`\`\`
1. Créer un compte WhatsApp Business
2. Configurer le catalogue de produits/services
3. Créer des messages automatiques (accueil, absence)
4. Utiliser les listes de diffusion (max 256 contacts)
5. Liens Click-to-WhatsApp dans vos pubs Facebook
\`\`\`

### SEO — Référencement naturel
\`\`\`html
<!-- Balises meta essentielles -->
<title>Développement App Mobile Kinshasa | OMEDEV SERVICES</title>
<meta name="description" content="Développement d'applications web et mobiles à Kinshasa.
  Devis gratuit. OMEDEV SERVICES SARL — experts tech en RDC.">
<meta property="og:image" content="https://omedev.cd/og-image.jpg">

<!-- Contenu : créer du contenu en français sur des mots-clés locaux -->
<!-- "application mobile kinshasa", "développeur web rdc", etc. -->
\`\`\`

### Métriques à suivre (KPIs)
- **CAC** (Coût d'Acquisition Client) = Budget marketing / Nb nouveaux clients
- **LTV** (Lifetime Value) = Revenu moyen par client × Durée de vie
- **Taux de conversion** = Visiteurs payants / Visiteurs totaux × 100
- **Taux de churn** = Clients perdus / Clients totaux × 100`,
  },

  // ─── BUSINESS PLAN ─────────────────────────────────────────────────────────
  {
    id: 'business-plan',
    category: 'business',
    keywords: ['business','plan','strategie','marche','etude','swot','modele','economique','revenue','couts','projection','financiere'],
    response: `## Rédiger un Business Plan

### Structure d'un business plan professionnel

**1. Résumé exécutif** (1 page)
Le plus important — résume tout le document. Écrit en dernier.
- Problème résolu
- Solution proposée
- Marché cible et taille
- Revenus projetés (3 ans)
- Financement recherché

**2. Description de l'entreprise**
- Mission, vision, valeurs
- Statut juridique (SARL, etc.)
- Équipe fondatrice

**3. Analyse de marché**
\`\`\`
Marché Total Adressable (TAM) : Kinshasa → ~12M hab.
Marché Cible (SAM) : PME avec >5 employés → ~50,000 entreprises
Part visée an 1 (SOM) : 200 clients → 0.4% du SAM
\`\`\`

**4. Analyse SWOT**
| Forces | Faiblesses |
|--------|------------|
| Équipe tech locale | Peu de notoriété |
| Prix compétitifs | Capital limité |

| Opportunités | Menaces |
|-------------|---------|
| Boom digital RDC | Concurrence régionale |
| Réglementation favorable | Instabilité économique |

**5. Modèle économique (Business Model)**
- **SaaS** : abonnement mensuel/annuel
- **Project-based** : prix par projet
- **Freemium** : gratuit + premium

**6. Projections financières (3 ans)**
| | An 1 | An 2 | An 3 |
|-|------|------|------|
| Clients | 50 | 150 | 400 |
| Revenu MRR | 5K$ | 15K$ | 40K$ |
| ARR | 60K$ | 180K$ | 480K$ |
| Marge nette | -20% | 15% | 30% |

**7. Plan d'action (12 mois)**
Mois 1-3 : MVP + 10 premiers clients
Mois 4-6 : Marketing + atteindre 50 clients
Mois 7-12 : Optimiser + viser 100 clients`,
  },

  // ─── FISCAL RDC ────────────────────────────────────────────────────────────
  {
    id: 'fiscal-rdc',
    category: 'legal',
    keywords: ['impot','taxe','fiscal','tva','ibs','dgi','dgrad','patente','declaration','fiscal','rdc','congo'],
    response: `## Fiscalité des Entreprises en RDC

### Principaux impôts pour une SARL

| Impôt | Taux | Fréquence | Administration |
|-------|------|-----------|----------------|
| **IBS** (Impôt sur les Bénéfices) | 30% des bénéfices | Annuel | DGI |
| **TVA** | 16% | Mensuel | DGI |
| **IBP** (Impôt sur les Bénéfices des Professions libérales) | 30% | Annuel | DGI |
| **Contribution sur le Revenu Locatif** | 30% | Mensuel | DGI |
| **INSS** (cotisations sociales) | 5% salarial + 13% patronal | Mensuel | CNSS |

### Obligations déclaratives
1. **Déclaration annuelle** : 31 mars de l'année suivante (exercice N)
2. **TVA mensuelle** : déclaration + paiement avant le 15 du mois suivant
3. **Précompte sur salaires** : IPR retenu à la source, versé mensuellement
4. **Bilan comptable** : dépôt auprès de la DGI

### Avantages fiscaux pour startups (ANAPI)
- Exonération IBS pendant 3-5 ans (zones franches)
- Réduction de droits de douane sur équipements importés
- Déduction des investissements dans la recherche

### Exonérations TVA
- Exportations (taux zéro)
- Médicaments, produits alimentaires de base
- Certains services financiers

> ⚠️ La fiscalité congolaise évolue. Consultez toujours un expert-comptable agréé (Ordre National des Experts-Comptables de RDC — ONEC).`,
  },

  // ─── PROPRIÉTÉ INTELLECTUELLE ──────────────────────────────────────────────
  {
    id: 'propriete-intellectuelle',
    category: 'legal',
    keywords: ['propriete','intellectuelle','droit','auteur','copyright','brevet','marque','logiciel','code','license','open','source'],
    response: `## Propriété Intellectuelle — Logiciels et code

### Protection du code en RDC

**Droit d'auteur (copyright)**
Le code source est automatiquement protégé comme œuvre littéraire dès sa création — **sans dépôt obligatoire**.

- **Durée** : vie de l'auteur + 50 ans (droit congolais)
- **Droits patrimoniaux** : reproduction, distribution, modification
- **Droits moraux** : paternité, intégrité de l'œuvre

**Marque commerciale**
- Déposer le nom/logo auprès de l'**OAPI** (Organisation Africaine de la Propriété Intellectuelle)
- Coût : ~250 USD pour 10 ans, valable dans 17 pays africains
- Délai : 6-18 mois

### Clauses PI dans les contrats IT

\`\`\`
OPTION A — Le code appartient au client (le plus courant)
"Le PRESTATAIRE cède au CLIENT l'intégralité des droits patrimoniaux
sur le code source livré, après paiement intégral, à titre exclusif,
irrévocable et sans limitation géographique ou temporelle."

OPTION B — Le code appartient au prestataire (licence)
"Le CLIENT reçoit une licence d'utilisation non-exclusive du logiciel
pour ses seuls besoins internes. Toute reproduction ou cession est
interdite sans accord écrit du PRESTATAIRE."

OPTION C — Partage (open source partiel)
"La partie commune sera publiée sous licence MIT.
Les développements spécifiques au CLIENT restent sa propriété."
\`\`\`

### Licences Open Source courantes
| Licence | Peut utiliser | Doit partager | Commercialisation |
|---------|--------------|---------------|-------------------|
| MIT | ✅ | ❌ | ✅ |
| Apache 2.0 | ✅ | ❌ | ✅ + attribution |
| GPL v3 | ✅ | ✅ (obligatoire) | ✅ mais code ouvert |
| Creative Commons | ✅ | Variable | Variable |`,
  },
]
