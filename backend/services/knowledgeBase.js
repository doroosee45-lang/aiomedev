/**
 * OMEDEV-AI — Base de Connaissances Technique Intégrée
 * Connaissances réelles injectées dynamiquement selon le domaine de la question.
 * Permet à l'IA locale d'avoir des réponses précises sans dépendre d'une API externe.
 */

// ══════════════════════════════════════════════════════
//  DÉTECTION DE DOMAINE
// ══════════════════════════════════════════════════════
export const detectDomains = (message) => {
  const msg = message.toLowerCase();
  const domains = [];

  const patterns = {
    telecom:     /\b(gsm|lte|4g|5g|3g|umts|nr|enb|gnb|mme|eps|epc|5gc|sip|voip|imei|sim|imsi|ran|bts|nodeB|fréquence|bande|spectrum|radio|antenne|signal|rssi|rsrp|rsrq|sinr|handover|roaming|itinérance|opérateur|vodacom|airtel|orange|africell|télécom)\b/,
    reseaux:     /\b(tcp|ip|udp|dns|dhcp|http|https|ssh|ftp|smtp|imap|pop3|vlan|vlan|bgp|ospf|eigrp|rip|nat|pat|routeur|switch|cisco|mikrotik|ubiquiti|fortigate|pfsense|firewall|pare-feu|subnet|masque|gateway|passerelle|ping|traceroute|wireshark|snmp|vxlan|mpls|sd-wan|osi|couche)\b/,
    maintenance: /\b(panne|bios|uefi|post|ram|ssd|hdd|nvme|processeur|cpu|gpu|carte mère|psu|alimentation|ventilateur|thermal|thermique|driver|pilote|bluescreen|bsod|erreur|crash|démarrage|boot|repair|sfc|dism|chkdsk|smart|crystal|memtest|benchmark|overheating|surchauffe|condensateur)\b/,
    electronique:/\b(résistance|condensateur|inductance|transistor|mosfet|diode|led|opamp|amplificateur|circuit|pcb|arduino|raspberry|esp32|stm32|pic|avr|fpga|vhdl|verilog|microcontrôleur|gpio|pwm|adc|dac|uart|spi|i2c|can|ohm|volt|ampère|watt|farad|henry|signal|oscilloscope|multimètre)\b/,
    sciences:    /\b(mathématique|physique|chimie|algèbre|calcul|intégrale|dérivée|matrice|vecteur|probabilité|statistique|équation|formule|théorème|démonstration|résoudre|simplifier|factoriser|développer|déterminant|eigenvalue|fourier|laplace|newton|force|énergie|pression|température|thermodynamique|quantum|électromagnétisme|optique)\b/,
    programmation:/\b(algorithme|code|fonction|classe|objet|boucle|récursion|pointeur|heap|stack|compléxité|o\(n\)|pattern|design pattern|solid|poo|oop|fonctionnel|monade|lambda|closure|async|await|promise|thread|concurrent|parallèle|mutex|semaphore|garbage collector|compilateur|interpréteur|bytecode|assembleur)\b/,
    langages:    /\b(python|javascript|typescript|java|c\+\+|c#|golang|rust|php|ruby|swift|kotlin|dart|flutter|haskell|scala|erlang|elixir|clojure|lisp|prolog|r|matlab|julia|fortran|cobol|pascal|assembly|solidity|move|vyper|sql|nosql|graphql|html|css|bash|powershell)\b/,
    devops:      /\b(docker|kubernetes|k8s|helm|terraform|ansible|jenkins|gitlab|github actions|ci\/cd|pipeline|deploy|déploiement|nginx|apache|traefik|caddy|ssl|tls|let's encrypt|prometheus|grafana|elk|loki|monitoring|observabilité|cloud|aws|gcp|azure|digitalocean|serverless|lambda)\b/,
    securite:    /\b(vulnérabilité|exploit|owasp|xss|sql injection|csrf|ssrf|xxe|idor|cve|pentest|audit|firewall|waf|ids|ips|siem|chiffrement|cryptographie|aes|rsa|sha|jwt|oauth|saml|zero trust|rbac|2fa|mfa|phishing|malware|ransomware|forensic|soc)\b/,
    ia_ml:       /\b(intelligence artificielle|machine learning|deep learning|neural network|réseau de neurones|transformer|llm|gpt|bert|rag|embedding|fine-tuning|lora|pytorch|tensorflow|scikit|xgboost|random forest|svm|clustering|classification|régression|nlp|computer vision|yolo|opencv)\b/,
    business:    /\b(business|entreprise|startup|financement|investissement|ohada|business plan|marché africain|mobile money|m-pesa|airtel money|orange money|stratégie|marketing|revenue|profit|kpi|swot|pestel|comptabilité|syscohada|tva|impôt|dgi)\b/
  };

  for (const [domain, pattern] of Object.entries(patterns)) {
    if (pattern.test(msg)) domains.push(domain);
  }

  return domains.length ? domains : ['general'];
};

// ══════════════════════════════════════════════════════
//  BASE DE CONNAISSANCES PAR DOMAINE
// ══════════════════════════════════════════════════════
const KNOWLEDGE = {

  // ── TÉLÉCOMMUNICATIONS ────────────────────────────
  telecom: `
### RÉFÉRENCE TÉLÉCOMMUNICATIONS

**Générations réseau mobile:**
| Gen | Standard | Débit théorique | Fréquences typiques |
|-----|----------|-----------------|---------------------|
| 2G  | GSM/GPRS/EDGE | 384 kbps | 900/1800 MHz |
| 3G  | UMTS/HSPA+ | 42 Mbps | 900/2100 MHz |
| 4G  | LTE Advanced | 1 Gbps | 700/800/1800/2100/2600 MHz |
| 5G  | NR (New Radio) | 20 Gbps | Sub-6 GHz + mmWave (26/28/39 GHz) |

**Architecture LTE (4G):**
- UE → eNB (via Uu) → S-GW → P-GW → Internet
- Plan de contrôle: MME (Mobility Management Entity)
- HSS: Home Subscriber Server (base de données abonnés)
- Protocoles RAN: PDCP / RLC / MAC / PHY

**Architecture 5G:**
- gNB (gNodeB) remplace eNB
- 5GC: AMF (≈MME), SMF, UPF, NRF, AUSF, UDM
- Interface N2 (AMF-gNB), N3 (gNB-UPF)
- Slicing réseau: eMBB / URLLC / mMTC

**Protocoles VoIP:**
- SIP: Session Initiation Protocol (RFC 3261) — signalisation
- RTP/RTCP: transport audio/vidéo en temps réel
- WebRTC: VoIP navigateur (ICE, STUN, TURN)
- CODEC: G.711 (PCM, 64 kbps), G.729 (8 kbps, compressé), Opus (6-510 kbps)

**Bilan de liaison radio (Friis):**
FSPL = 20·log₁₀(d) + 20·log₁₀(f) + 20·log₁₀(4π/c)
≈ 20·log₁₀(d_km) + 20·log₁₀(f_GHz) + 92.44 dB

Puissance reçue: Pr = EIRP - FSPL + Gr_dBi - Pertes

**Formule cellulaire (capacité Erlang B):**
Pour bloquer B = Erlang_B(A, N) avec A = trafic offert, N = canaux
GoS (Grade of Service) typique: 2% en heure de pointe

**Bandes fréquences RDC (ARPTC):**
- Vodacom: 900, 1800, 2100, 2600 MHz (LTE/4G)
- Airtel: 900, 1800, 2100 MHz
- Orange: 900, 1800 MHz
- Africell: 900, 1800 MHz
`,

  // ── RÉSEAUX ───────────────────────────────────────
  reseaux: `
### RÉFÉRENCE RÉSEAUX INFORMATIQUES

**Modèle OSI (7 couches):**
| # | Couche | Protocoles/PDU |
|---|--------|----------------|
| 7 | Application | HTTP, DNS, SMTP, FTP, SNMP |
| 6 | Présentation | TLS/SSL, JPEG, MPEG |
| 5 | Session | NetBIOS, RPC |
| 4 | Transport | TCP, UDP / Segments |
| 3 | Réseau | IP, ICMP, OSPF, BGP / Paquets |
| 2 | Liaison | Ethernet, Wi-Fi, PPP / Trames |
| 1 | Physique | Câbles, fibres, signaux / Bits |

**Adresses IP privées (RFC 1918):**
- 10.0.0.0/8 → 10.255.255.255 (Classe A)
- 172.16.0.0/12 → 172.31.255.255 (Classe B)
- 192.168.0.0/16 → 192.168.255.255 (Classe C)

**Subnetting rapide:**
| /prefix | Masque | Hôtes utiles | Réseaux (/24) |
|---------|--------|--------------|----------------|
| /24 | 255.255.255.0 | 254 | 1 |
| /25 | 255.255.255.128 | 126 | 2 |
| /26 | 255.255.255.192 | 62 | 4 |
| /27 | 255.255.255.224 | 30 | 8 |
| /28 | 255.255.255.240 | 14 | 16 |
| /29 | 255.255.255.248 | 6 | 32 |
| /30 | 255.255.255.252 | 2 | 64 |

**Protocoles de routage:**
- OSPF: Link-State, métrique coût (100Mbps/bande passante), AS interne
- BGP: Path-Vector, attributs AS-PATH/MED/local-pref, inter-AS (Internet)
- EIGRP: Cisco propriétaire, métrique composite, convergence rapide

**Commandes Cisco IOS essentielles:**
\`\`\`
show ip route          # Table de routage
show ip interface brief # Interfaces et IPs
show version           # Informations système
show running-config    # Configuration active
ping 8.8.8.8          # Test connectivité
traceroute 8.8.8.8    # Chemin réseau
show vlan brief        # VLANs configurés
show spanning-tree     # Arbre couvrant
\`\`\`

**Commandes Linux réseau:**
\`\`\`
ip addr show           # Adresses IP
ip route show          # Table de routage
ss -tuln               # Ports en écoute
tcpdump -i eth0        # Capture paquets
nmap -sV 192.168.1.0/24 # Scan réseau
iptables -L -n -v      # Règles firewall
\`\`\`

**Wi-Fi standards:**
| Standard | Bande | Débit max | Wi-Fi |
|----------|-------|-----------|-------|
| 802.11n | 2.4/5 GHz | 600 Mbps | 4 |
| 802.11ac | 5 GHz | 3.5 Gbps | 5 |
| 802.11ax | 2.4/5/6 GHz | 9.6 Gbps | 6 |
| 802.11be | 2.4/5/6 GHz | 46 Gbps | 7 |
`,

  // ── MAINTENANCE ───────────────────────────────────
  maintenance: `
### RÉFÉRENCE MAINTENANCE INFORMATIQUE

**Codes BIOS beep (AMI BIOS):**
| Beeps | Problème |
|-------|---------|
| 1 court | POST OK |
| 1 long | Problème mémoire RAM |
| 1 long + 2 courts | Problème carte graphique |
| 1 long + 3 courts | Problème vidéo |
| 3 longs | Panne RAM (pas détectée) |
| 5 courts | Processeur en panne |

**Diagnostic S.M.A.R.T. — attributs critiques:**
- ID 5: Reallocated Sectors Count → si > 0: secteurs défectueux
- ID 187: Reported Uncorrectable Errors → si > 0: danger
- ID 188: Command Timeout → problème câble/alimentation
- ID 197: Current Pending Sector Count → secteurs à réallouer
- ID 198: Offline Uncorrectable → secteurs irrécupérables

**Procédure diagnostic PC qui ne démarre pas:**
1. Vérifier alimentation → LED carte mère allumée?
2. Reset CMOS (retirer pile CR2032, 5 min)
3. Tester avec 1 seule barrette RAM, puis l'autre
4. Débrancher tous périphériques sauf CPU+RAM+GPU
5. Vérifier condensateurs gonflés (carte mère, PSU)
6. Tester PSU: +12V, +5V, +3.3V avec multimètre
7. Flasher BIOS si carte mère compatible

**Commandes Windows de réparation:**
\`\`\`cmd
sfc /scannow              # Vérification fichiers système
DISM /Online /Cleanup-Image /RestoreHealth  # Réparation image
chkdsk C: /f /r           # Vérification disque
bootrec /fixmbr           # Réparer MBR
bootrec /fixboot          # Réparer secteur boot
bootrec /rebuildbcd       # Reconstruire BCD
\`\`\`

**Températures limites:**
- CPU Intel/AMD: alarme > 85°C, critique > 100°C
- GPU: alarme > 80°C, critique > 95°C
- SSD NVMe: alarme > 70°C
- HDD: optimal < 45°C, alarme > 55°C

**Récupération de données:**
- TestDisk: récupère partitions et MBR perdus
- PhotoRec: récupère fichiers par signature (ignorent filesystem)
- Recuva: GUI Windows, récupération facile
- ddrescue: clonage de disque défaillant bit par bit

**Vitesses RAM:**
| Type | Fréquence | Bande passante |
|------|-----------|---------------|
| DDR3-1600 | 800 MHz | 12.8 GB/s |
| DDR4-3200 | 1600 MHz | 25.6 GB/s |
| DDR5-6400 | 3200 MHz | 51.2 GB/s |
`,

  // ── ÉLECTRONIQUE ─────────────────────────────────
  electronique: `
### RÉFÉRENCE ÉLECTRONIQUE

**Lois fondamentales:**
- Loi d'Ohm: V = R × I → I = V/R → R = V/I
- Puissance: P = V × I = R × I² = V²/R
- Kirchhoff KVL: ΣV = 0 (maille) — KCL: ΣI = 0 (nœud)
- Charge condensateur: Q = C × V → I = C × dV/dt
- Flux inductance: φ = L × I → U = L × dI/dt

**Code couleur résistances (E12):**
| Couleur | Chiffre | Multiplicateur |
|---------|---------|----------------|
| Noir    | 0 | × 1 |
| Marron  | 1 | × 10 |
| Rouge   | 2 | × 100 |
| Orange  | 3 | × 1k |
| Jaune   | 4 | × 10k |
| Vert    | 5 | × 100k |
| Bleu    | 6 | × 1M |
| Violet  | 7 | × 10M |
| Gris    | 8 | — |
| Blanc   | 9 | — |
| Or      | — | × 0.1 (±5%) |
| Argent  | — | × 0.01 (±10%) |

**Série E12 (résistances standard):** 10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82 (et multiples)

**Transistor NPN (BJT) — régimes:**
- Saturation: VBE ≈ 0.7V, VCE ≈ 0.2V → transistor ON (interrupteur fermé)
- Linéaire: IC = β × IB (amplification)
- Blocage: IB = 0, IC = 0 → transistor OFF

**MOSFET N-channel:**
- VGS > Vth → canal ouvert → ID circule
- Utilisé pour: commutation, amplification, régulateurs
- Avantage: pas de courant de grille (haute impédance)

**Circuit 555 (modes):**
- Monostable: 1 impulsion de durée T = 1.1 × R × C
- Astable: oscillateur, f = 1.44 / ((R1 + 2R2) × C), DC = (R1+R2)/(R1+2R2)
- Bistable: bascule RS

**Arduino UNO (ATmega328P):**
- 14 pins numériques (6 PWM: 3,5,6,9,10,11)
- 6 pins analogiques (A0-A5, 10 bits: 0-1023)
- PWM fréquence: ~490 Hz (pins 5,6: ~980 Hz)
- Tension: 5V, courant max pin: 40mA
- Fréquence horloge: 16 MHz

**Raspberry Pi 4 (GPIO):**
- 40 pins: 28 GPIO, 5V×2, 3.3V×2, GND×8
- Courant max GPIO: 16mA par pin, 50mA total
- Protocoles: UART, SPI, I2C, PWM logiciel

**Protocoles communication embarquée:**
- UART: asynchrone, 2 fils (TX/RX), vitesses: 9600/115200 bauds
- SPI: synchrone, 4 fils (MOSI/MISO/SCK/SS), jusqu'à 50 MHz
- I2C: 2 fils (SDA/SCL), adressage 7-bit (127 esclaves), 100k/400k/1M Hz
- CAN: 2 fils différentiels, jusqu'à 1 Mbps, automobiles/industrie
`,

  // ── SCIENCES / MATHÉMATIQUES ──────────────────────
  sciences: `
### RÉFÉRENCE MATHÉMATIQUES & PHYSIQUE

**Dérivées courantes:**
| f(x) | f'(x) |
|------|-------|
| xⁿ | n·xⁿ⁻¹ |
| eˣ | eˣ |
| ln(x) | 1/x |
| sin(x) | cos(x) |
| cos(x) | -sin(x) |
| tan(x) | 1/cos²(x) |
| arcsin(x) | 1/√(1-x²) |
| u·v | u'v + uv' |
| u/v | (u'v - uv')/v² |
| f(g(x)) | f'(g(x))·g'(x) |

**Intégrales courantes:**
| f(x) | ∫f(x)dx |
|------|---------|
| xⁿ (n≠-1) | xⁿ⁺¹/(n+1) + C |
| 1/x | ln\|x\| + C |
| eˣ | eˣ + C |
| sin(x) | -cos(x) + C |
| cos(x) | sin(x) + C |
| 1/√(1-x²) | arcsin(x) + C |

**Algèbre linéaire:**
- Déterminant 2×2: det([a,b;c,d]) = ad - bc
- Inverse 2×2: A⁻¹ = (1/det(A))·[d,-b;-c,a]
- Valeur propre: det(A - λI) = 0
- Produit scalaire: u·v = Σuᵢvᵢ = \|u\|\|v\|cos(θ)
- Produit vectoriel: u×v, \|u×v\| = \|u\|\|v\|sin(θ)

**Probabilités:**
- P(A∪B) = P(A) + P(B) - P(A∩B)
- P(A|B) = P(A∩B)/P(B) (Bayes)
- Espérance: E[X] = Σxᵢ·P(xᵢ)
- Variance: Var(X) = E[X²] - (E[X])²
- Loi normale: f(x) = (1/σ√2π)·exp(-(x-μ)²/2σ²)

**Formules physique essentielles:**
- Énergie cinétique: Ec = ½mv²
- Travail: W = F·d·cos(θ)
- Loi de Coulomb: F = k·q₁q₂/r² (k = 9×10⁹ N·m²/C²)
- Champ électrique: E = F/q = kq/r²
- Induction Faraday: e = -N·dΦ/dt
- Équations Maxwell: ∇·E = ρ/ε₀, ∇×B = μ₀J + μ₀ε₀∂E/∂t

**Recherche opérationnelle:**
Simplexe (maximisation): z = c·x, sujet à: Ax ≤ b, x ≥ 0
1. Forme standard (variables d'écart)
2. Tableau simplexe initial
3. Choisir variable entrante (c_j - z_j max positif)
4. Choisir variable sortante (ratio min b_i/a_ij > 0)
5. Pivot → répéter jusqu'à optimalité
`,

  // ── PROGRAMMATION & ALGORITHMES ───────────────────
  programmation: `
### RÉFÉRENCE PROGRAMMATION

**Complexité algorithmique:**
| Notation | Nom | Exemple |
|----------|-----|---------|
| O(1) | Constant | Accès tableau par index |
| O(log n) | Logarithmique | Recherche binaire |
| O(n) | Linéaire | Parcours tableau |
| O(n log n) | Quasi-linéaire | Merge sort, Quick sort (moy) |
| O(n²) | Quadratique | Bubble sort, Insertion sort |
| O(2ⁿ) | Exponentiel | Sous-ensembles, Hanoi |
| O(n!) | Factoriel | Permutations, TSP brute force |

**Design Patterns essentiels:**
- Singleton: 1 seule instance, accès global
- Factory: crée objets sans spécifier la classe
- Observer: notifie les abonnés lors d'événements
- Strategy: algorithmes interchangeables
- Decorator: ajoute comportements dynamiquement
- Repository: abstraction couche données

**Paradigmes principaux:**
- POO: Encapsulation, Héritage, Polymorphisme, Abstraction
- Fonctionnel: fonctions pures, immutabilité, map/filter/reduce, monades
- Réactif: streams, RxJS, observables, événements asynchrones
- Logique: Prolog, faits + règles → déduction

**Structures de données — choix:**
| Besoin | Structure | Complexité |
|--------|-----------|------------|
| Accès rapide par index | Tableau | O(1) |
| Insertion/suppression fréquente | Liste chaînée | O(1) tête |
| LIFO (pile d'appels) | Stack | O(1) |
| FIFO (files de messages) | Queue | O(1) |
| Recherche rapide | Hash Table | O(1) moy |
| Données triées, recherche | BST/AVL | O(log n) |
| Priorité | Heap | O(log n) |
| Graphes | Adj Matrix/List | O(V+E) |

**Git commandes essentielles:**
\`\`\`bash
git init && git clone <url>
git add . && git commit -m "message"
git push origin main && git pull
git branch feature && git checkout feature
git merge feature && git rebase main
git stash && git stash pop
git log --oneline --graph
git diff HEAD~1
git reset --hard HEAD~1  # DANGER: perd les commits
\`\`\`

**SQL avancé:**
\`\`\`sql
-- Window functions
SELECT name, salary, RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rank FROM employees;

-- CTE (Common Table Expression)
WITH monthly AS (SELECT DATE_TRUNC('month', date) AS m, SUM(amount) AS total FROM sales GROUP BY 1)
SELECT * FROM monthly WHERE total > 10000;

-- Index pour performance
CREATE INDEX idx_email ON users(email);
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@omedev.cd';
\`\`\`
`,

  // ── INTELLIGENCE ARTIFICIELLE & ML ───────────────
  ia_ml: `
### RÉFÉRENCE INTELLIGENCE ARTIFICIELLE

**Architecture Transformer (attention):**
- Self-Attention: Attention(Q,K,V) = softmax(QKᵀ/√d_k)·V
- Multi-Head Attention: concat de h têtes d'attention
- Positional Encoding: sin/cos pour encoder positions
- Couches: Embedding → Attention → FFN → LayerNorm

**Modèles LLM — comparaison:**
| Modèle | Paramètres | Contexte | Usage |
|--------|-----------|---------|-------|
| Llama 3.1 8B | 8B | 128K | Local, rapide |
| Llama 3.1 70B | 70B | 128K | Local haute qualité |
| Mistral 7B | 7B | 32K | Local, efficace |
| Qwen2 72B | 72B | 128K | Local multilingue |
| Claude Sonnet 4.6 | ~100B | 200K | API, très capable |

**Métriques ML:**
- Accuracy = (TP+TN)/(TP+TN+FP+FN)
- Précision = TP/(TP+FP)
- Rappel = TP/(TP+FN)
- F1 = 2·(Précision·Rappel)/(Précision+Rappel)
- MSE = (1/n)·Σ(yᵢ - ŷᵢ)²
- MAE = (1/n)·Σ\|yᵢ - ŷᵢ\|

**Optimisation (gradient descent):**
θ = θ - α·∇L(θ)
- SGD: 1 exemple par étape
- Mini-batch: 32-256 exemples
- Adam: α adaptatif, momentum
- Learning rate: 1e-4 typique pour fine-tuning LLM

**RAG (Retrieval-Augmented Generation):**
1. Chunking documents (512-1024 tokens)
2. Embeddings (text-embedding-3-small, nomic-embed)
3. Vector store (Qdrant, Chroma, Pinecone)
4. Retrieval (cosine similarity top-k)
5. Augmentation du prompt avec contexte récupéré
6. Génération LLM avec contexte
`,

  // ── GÉNÉRAL ───────────────────────────────────────
  general: `
### RÉFÉRENCE GÉNÉRALE INFORMATIQUE

**Systèmes d'exploitation:**
- Windows: NT kernel, NTFS, registre, PowerShell, Active Directory
- Linux: kernel monolithique, ext4/btrfs/xfs, systemd, bash
- macOS: Darwin (XNU kernel), APFS, zsh, Homebrew

**Formats de fichiers communs:**
| Extension | Format | Usage |
|-----------|--------|-------|
| .json | JSON | Config, APIs, données |
| .yaml/.yml | YAML | Config DevOps |
| .xml | XML | Config Java/Android |
| .csv | CSV | Données tabulaires |
| .md | Markdown | Documentation |
| .pdf | PDF | Documents fixes |
| .tar.gz | Tar+Gzip | Archives Linux |

**Protocoles Internet essentiels:**
- HTTP/1.1: texte, 1 req/connexion
- HTTP/2: binaire, multiplexé, compression headers
- HTTP/3: QUIC (UDP), plus rapide sur réseaux instables (Afrique)
- HTTPS: HTTP + TLS 1.3 (chiffrement asymétrique + symétrique)

**Cloud — modèles de service:**
- IaaS: VM, stockage brut (AWS EC2, Azure VM)
- PaaS: environnement d'exécution (Heroku, App Engine, Render)
- SaaS: application complète (Gmail, Salesforce)
- FaaS: fonctions serverless (AWS Lambda, Cloud Functions)

**Sécurité — principes fondamentaux:**
- CIA Triad: Confidentialité, Intégrité, Disponibilité
- Defense in Depth: plusieurs couches de sécurité
- Least Privilege: accès minimal nécessaire
- Zero Trust: "ne jamais faire confiance, toujours vérifier"
- Shift-left Security: sécurité dès la conception
`
};

// ══════════════════════════════════════════════════════
//  INJECTION DE CONNAISSANCES
// ══════════════════════════════════════════════════════

/**
 * Injecte les connaissances pertinentes selon les domaines détectés
 */
export const injectKnowledge = (message, maxDomains = 3) => {
  const domains = detectDomains(message);
  const injected = [];

  for (const domain of domains.slice(0, maxDomains)) {
    if (KNOWLEDGE[domain]) {
      injected.push(KNOWLEDGE[domain]);
    }
  }

  if (injected.length === 0 && KNOWLEDGE.general) {
    injected.push(KNOWLEDGE.general);
  }

  return {
    domains,
    knowledge: injected.join('\n\n---\n\n'),
    hasKnowledge: injected.length > 0
  };
};

export default { detectDomains, injectKnowledge };
