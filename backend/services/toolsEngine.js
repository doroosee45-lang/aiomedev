/**
 * OMEDEV-AI — Moteur d'Outils Autonomes
 * Outils exécutables que l'agent peut appeler sans dépendre d'une IA externe
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { createHash } from 'crypto';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

// ══════════════════════════════════════════════════════
//  OUTIL 1 — CALCULATRICE MATHÉMATIQUE
// ══════════════════════════════════════════════════════
export const calculator = (expression) => {
  try {
    // Sanitize: only allow math characters
    const safe = expression.replace(/[^0-9+\-*/().,^%\s√πe]/g, '');
    if (!safe.trim()) return { error: 'Expression invalide' };

    // Replace math symbols
    const normalized = safe
      .replace(/π/g, 'Math.PI')
      .replace(/e(?!\d)/g, 'Math.E')
      .replace(/√(\d+\.?\d*)/g, 'Math.sqrt($1)')
      .replace(/\^/g, '**');

    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + normalized + ')')();
    if (!isFinite(result)) return { error: 'Résultat non fini (division par zéro?)' };

    return {
      expression,
      result: Number.isInteger(result) ? result : parseFloat(result.toFixed(10)),
      formatted: result.toLocaleString('fr-FR')
    };
  } catch (err) {
    return { error: `Erreur de calcul: ${err.message}` };
  }
};

// ══════════════════════════════════════════════════════
//  OUTIL 2 — CALCULATEUR RÉSEAU / SUBNETTING
// ══════════════════════════════════════════════════════
export const subnetCalculator = (cidr) => {
  try {
    const match = cidr.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
    if (!match) return { error: 'Format invalide. Exemple: 192.168.1.0/24' };

    const [, a, b, c, d, prefix] = match.map(Number);
    if ([a, b, c, d].some(o => o > 255) || prefix > 32) return { error: 'Adresse ou préfixe invalide' };

    const ip = (a << 24) | (b << 16) | (c << 8) | d;
    const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const network = (ip & mask) >>> 0;
    const broadcast = (network | ~mask) >>> 0;
    const firstHost = prefix < 31 ? network + 1 : network;
    const lastHost = prefix < 31 ? broadcast - 1 : broadcast;
    const totalHosts = Math.pow(2, 32 - prefix);
    const usableHosts = prefix < 31 ? totalHosts - 2 : totalHosts;

    const toIP = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
    const toMask = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');

    return {
      input: cidr,
      network: toIP(network),
      broadcast: toIP(broadcast),
      mask: toMask(mask),
      wildcardMask: toMask(~mask >>> 0),
      prefix: `/${prefix}`,
      firstHost: toIP(firstHost),
      lastHost: toIP(lastHost),
      totalHosts,
      usableHosts,
      ipClass: a < 128 ? 'A' : a < 192 ? 'B' : a < 224 ? 'C' : a < 240 ? 'D (Multicast)' : 'E (Réservé)',
      isPrivate: (a === 10) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168),
      binaryMask: mask.toString(2).replace(/(.{8})/g, '$1.').slice(0, -1)
    };
  } catch (err) {
    return { error: err.message };
  }
};

// ══════════════════════════════════════════════════════
//  OUTIL 3 — CONVERTISSEUR D'UNITÉS
// ══════════════════════════════════════════════════════
const CONVERSIONS = {
  // Longueur → mètres
  longueur: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, ft: 0.3048, in: 0.0254, nm: 1e-9, µm: 1e-6 },
  // Masse → kilogrammes
  masse: { kg: 1, g: 0.001, mg: 1e-6, t: 1000, lb: 0.453592, oz: 0.0283495 },
  // Fréquence → Hz
  frequence: { hz: 1, khz: 1e3, mhz: 1e6, ghz: 1e9, thz: 1e12 },
  // Débit → bits/s
  debit: { bps: 1, kbps: 1e3, mbps: 1e6, gbps: 1e9, tbps: 1e12 },
  // Stockage → bytes
  stockage: { b: 1, kb: 1024, mb: 1024**2, gb: 1024**3, tb: 1024**4, pb: 1024**5, kio: 1024, mio: 1024**2, gio: 1024**3 },
  // Puissance → watts
  puissance: { w: 1, kw: 1000, mw: 1e6, cv: 735.499, hp: 745.7, mw_milli: 0.001 },
  // Pression → Pa
  pression: { pa: 1, kpa: 1000, mpa: 1e6, bar: 1e5, atm: 101325, psi: 6894.76, mmhg: 133.322 },
  // Temps → secondes
  temps: { s: 1, ms: 0.001, µs: 1e-6, ns: 1e-9, min: 60, h: 3600, d: 86400 },
  // Angle → radians
  angle: { rad: 1, deg: Math.PI / 180, grad: Math.PI / 200, tr: 2 * Math.PI }
};

export const unitConverter = (value, fromUnit, toUnit) => {
  try {
    const val = parseFloat(value);
    if (isNaN(val)) return { error: 'Valeur numérique invalide' };

    const from = fromUnit.toLowerCase();
    const to = toUnit.toLowerCase();

    // Température — cas spécial
    if (['c', '°c', 'celsius'].includes(from) || ['c', '°c', 'celsius'].includes(to)) {
      let celsius;
      if (['c', '°c', 'celsius'].includes(from)) celsius = val;
      else if (['f', '°f', 'fahrenheit'].includes(from)) celsius = (val - 32) * 5 / 9;
      else if (['k', 'kelvin'].includes(from)) celsius = val - 273.15;
      else return { error: `Unité source inconnue: ${fromUnit}` };

      let result;
      if (['c', '°c', 'celsius'].includes(to)) result = celsius;
      else if (['f', '°f', 'fahrenheit'].includes(to)) result = celsius * 9 / 5 + 32;
      else if (['k', 'kelvin'].includes(to)) result = celsius + 273.15;
      else return { error: `Unité cible inconnue: ${toUnit}` };

      return { value: val, fromUnit, toUnit, result: parseFloat(result.toFixed(6)), formula: `${val}${fromUnit} = ${result.toFixed(4)}${toUnit}` };
    }

    // Find category
    for (const [category, units] of Object.entries(CONVERSIONS)) {
      if (units[from] !== undefined && units[to] !== undefined) {
        const inBase = val * units[from];
        const result = inBase / units[to];
        return {
          value: val, fromUnit, toUnit,
          result: parseFloat(result.toFixed(10)),
          category,
          formula: `${val} ${fromUnit} × ${units[from]} ÷ ${units[to]} = ${result.toFixed(6)} ${toUnit}`
        };
      }
    }

    return { error: `Conversion ${fromUnit} → ${toUnit} non supportée. Catégories: longueur, masse, fréquence, débit, stockage, puissance, pression, temps, angle, température` };
  } catch (err) {
    return { error: err.message };
  }
};

// ══════════════════════════════════════════════════════
//  OUTIL 4 — CALCULATEUR ÉLECTRONIQUE
// ══════════════════════════════════════════════════════
export const electronicsCalc = (formula, ...params) => {
  const f = formula.toLowerCase();

  // Ohm's Law: V=RI, I=V/R, R=V/I
  if (f === 'ohm') {
    const [known1, val1, known2, val2] = params;
    const vars = { [known1.toLowerCase()]: parseFloat(val1), [known2.toLowerCase()]: parseFloat(val2) };
    const { v, i, r } = vars;
    if (v && i) return { formula: 'Loi d\'Ohm', result: { R: `${v / i} Ω`, V: `${v} V`, I: `${i} A`, P: `${v * i} W` } };
    if (v && r) return { formula: 'Loi d\'Ohm', result: { I: `${v / r} A`, V: `${v} V`, R: `${r} Ω`, P: `${v * v / r} W` } };
    if (i && r) return { formula: 'Loi d\'Ohm', result: { V: `${i * r} V`, I: `${i} A`, R: `${r} Ω`, P: `${i * i * r} W` } };
    return { error: 'Fournir 2 valeurs parmi V (tension), I (courant), R (résistance)' };
  }

  // Résistances en série
  if (f === 'serie') {
    const values = params.map(Number);
    const total = values.reduce((a, b) => a + b, 0);
    return { formula: 'Résistances en série', values: values.map(v => `${v}Ω`), result: `${total} Ω`, formula_text: 'R_total = R1 + R2 + ... + Rn' };
  }

  // Résistances en parallèle
  if (f === 'parallele') {
    const values = params.map(Number);
    const total = 1 / values.reduce((a, b) => a + 1 / b, 0);
    return { formula: 'Résistances en parallèle', values: values.map(v => `${v}Ω`), result: `${total.toFixed(4)} Ω`, formula_text: '1/R_total = 1/R1 + 1/R2 + ...' };
  }

  // Condensateur — charge/décharge RC
  if (f === 'rc') {
    const [r, c] = params.map(Number);
    const tau = r * c;
    return {
      formula: 'Constante de temps RC',
      R: `${r} Ω`, C: `${c} F`, tau: `${tau} s`,
      charge63: `${tau.toFixed(4)} s (63.2% de charge)`,
      charge99: `${(5 * tau).toFixed(4)} s (99.3% de charge — 5τ)`,
      freqCoupure: `${(1 / (2 * Math.PI * tau)).toFixed(4)} Hz`
    };
  }

  // Fréquence de résonance LC
  if (f === 'resonance') {
    const [l, c] = params.map(Number);
    const f0 = 1 / (2 * Math.PI * Math.sqrt(l * c));
    return { formula: 'Fréquence de résonance LC', L: `${l} H`, C: `${c} F`, f0: `${f0.toFixed(4)} Hz`, omega0: `${(2 * Math.PI * f0).toFixed(4)} rad/s` };
  }

  // Diviseur de tension
  if (f === 'diviseur') {
    const [vin, r1, r2] = params.map(Number);
    const vout = vin * r2 / (r1 + r2);
    return { formula: 'Diviseur de tension', Vin: `${vin} V`, R1: `${r1} Ω`, R2: `${r2} Ω`, Vout: `${vout.toFixed(4)} V`, ratio: `${(vout / vin * 100).toFixed(2)}%` };
  }

  // Code couleur résistance (3-4 bandes)
  if (f === 'couleur') {
    const colors = { noir: 0, marron: 1, rouge: 2, orange: 3, jaune: 4, vert: 5, bleu: 6, violet: 7, gris: 8, blanc: 9 };
    const tolerance = { or: '±5%', argent: '±10%', marron: '±1%', rouge: '±2%', vert: '±0.5%' };
    const [c1, c2, c3, c4] = params.map(p => p.toLowerCase());
    if (colors[c1] === undefined || colors[c2] === undefined || colors[c3] === undefined) {
      return { error: 'Couleurs valides: noir, marron, rouge, orange, jaune, vert, bleu, violet, gris, blanc' };
    }
    const value = (colors[c1] * 10 + colors[c2]) * Math.pow(10, colors[c3]);
    return {
      formula: 'Code couleur résistance',
      bandes: params,
      valeur: value >= 1000000 ? `${value / 1000000} MΩ` : value >= 1000 ? `${value / 1000} kΩ` : `${value} Ω`,
      tolerance: c4 ? (tolerance[c4] || 'inconnu') : '±20%'
    };
  }

  // dBm ↔ mW conversion
  if (f === 'dbm') {
    const [val, dir] = params;
    const n = parseFloat(val);
    if (dir === 'mw') return { formula: 'dBm → mW', input: `${n} dBm`, result: `${(Math.pow(10, n / 10)).toFixed(6)} mW` };
    return { formula: 'mW → dBm', input: `${n} mW`, result: `${(10 * Math.log10(n)).toFixed(4)} dBm` };
  }

  return { error: `Formule inconnue: "${formula}". Disponibles: ohm, serie, parallele, rc, resonance, diviseur, couleur, dbm` };
};

// ══════════════════════════════════════════════════════
//  OUTIL 5 — CONVERTISSEUR DE BASE NUMÉRIQUE
// ══════════════════════════════════════════════════════
export const baseConverter = (value, fromBase, toBase) => {
  try {
    const bases = { bin: 2, oct: 8, dec: 10, hex: 16, '2': 2, '8': 8, '10': 10, '16': 16 };
    const from = bases[fromBase.toLowerCase()];
    const to = bases[toBase.toLowerCase()];
    if (!from || !to) return { error: 'Bases valides: bin(2), oct(8), dec(10), hex(16)' };

    const decimal = parseInt(value.replace(/^0x/i, ''), from);
    if (isNaN(decimal)) return { error: `"${value}" n'est pas valide en base ${from}` };

    return {
      input: { value, base: from },
      binaire: decimal.toString(2).padStart(8, '0'),
      octal: decimal.toString(8),
      decimal: decimal.toString(10),
      hexadecimal: decimal.toString(16).toUpperCase(),
      result: decimal.toString(to).toUpperCase()
    };
  } catch (err) {
    return { error: err.message };
  }
};

// ══════════════════════════════════════════════════════
//  OUTIL 6 — EXÉCUTION DE CODE EN SANDBOX
// ══════════════════════════════════════════════════════
export const codeExecutor = async (code, language) => {
  const supported = {
    javascript: { cmd: 'node', ext: 'js' },
    python: { cmd: 'python', ext: 'py' },
    python3: { cmd: 'python3', ext: 'py' },
    bash: { cmd: 'bash', ext: 'sh' },
    sh: { cmd: 'sh', ext: 'sh' }
  };

  const lang = supported[language?.toLowerCase()];
  if (!lang) {
    return {
      success: false,
      output: `Langage "${language}" non supporté pour l'exécution locale.\nLangages disponibles: JavaScript, Python, Bash\nAutres langages: le code est affiché mais non exécuté.`,
      language
    };
  }

  const tmpFile = join(tmpdir(), `omedev_exec_${Date.now()}.${lang.ext}`);
  try {
    writeFileSync(tmpFile, code, 'utf8');
    const { stdout, stderr } = await execAsync(`${lang.cmd} "${tmpFile}"`, {
      timeout: 15000,
      maxBuffer: 1024 * 1024
    });
    try { unlinkSync(tmpFile); } catch { /* ignore */ }

    return {
      success: true,
      output: stdout || stderr || '(aucune sortie)',
      exitCode: 0,
      language,
      executionTime: 'OK'
    };
  } catch (err) {
    try { unlinkSync(tmpFile); } catch { /* ignore */ }
    return {
      success: false,
      output: err.stdout || err.stderr || err.message,
      exitCode: err.code || 1,
      language,
      timeout: err.killed
    };
  }
};

// ══════════════════════════════════════════════════════
//  OUTIL 7 — GÉNÉRATEUR DE HASH
// ══════════════════════════════════════════════════════
export const hashGenerator = (text, algorithm = 'sha256') => {
  try {
    const algos = ['md5', 'sha1', 'sha256', 'sha512', 'sha384'];
    const algo = algorithm.toLowerCase();
    if (!algos.includes(algo)) return { error: `Algorithme non supporté. Disponibles: ${algos.join(', ')}` };

    const hash = createHash(algo).update(text, 'utf8').digest('hex');
    return {
      input: text.length > 50 ? text.slice(0, 50) + '...' : text,
      algorithm: algo.toUpperCase(),
      hash,
      length: `${hash.length * 4} bits`
    };
  } catch (err) {
    return { error: err.message };
  }
};

// ══════════════════════════════════════════════════════
//  OUTIL 8 — CALCULATEUR RÉSEAU TÉLÉCOM (BILAN DE LIAISON)
// ══════════════════════════════════════════════════════
export const linkBudget = (params) => {
  const {
    eirp_dbm,        // Puissance rayonnée isotrope équivalente (dBm)
    frequency_mhz,   // Fréquence (MHz)
    distance_km,     // Distance (km)
    rx_sensitivity_dbm, // Sensibilité récepteur (dBm)
    rx_gain_dbi = 0, // Gain antenne RX (dBi)
    cable_loss_db = 0, // Perte câbles (dB)
    margin_db = 10   // Marge système (dB)
  } = params;

  // Free Space Path Loss (Friis): FSPL = 20log(d) + 20log(f) + 20log(4π/c)
  const fspl_db = 20 * Math.log10(distance_km) + 20 * Math.log10(frequency_mhz * 1e6) + 20 * Math.log10(4 * Math.PI / 3e8);

  const rx_power_dbm = eirp_dbm - fspl_db + rx_gain_dbi - cable_loss_db;
  const link_margin = rx_power_dbm - rx_sensitivity_dbm;
  const viable = link_margin >= margin_db;

  return {
    outil: 'Bilan de liaison radio (Friis)',
    parametres: { eirp_dbm, frequency_mhz, distance_km, rx_sensitivity_dbm },
    resultats: {
      fspl_db: `${fspl_db.toFixed(2)} dB`,
      rx_power_dbm: `${rx_power_dbm.toFixed(2)} dBm`,
      link_margin: `${link_margin.toFixed(2)} dB`,
      viable: viable ? `✅ Liaison viable (marge ${link_margin.toFixed(1)} dB ≥ ${margin_db} dB)` : `❌ Liaison insuffisante (marge ${link_margin.toFixed(1)} dB < ${margin_db} dB)`
    },
    formule: 'FSPL = 20·log(d) + 20·log(f) + 92.44 (d en km, f en GHz)'
  };
};

// ══════════════════════════════════════════════════════
//  OUTIL 9 — VÉRIFICATEUR DE CODE / REGEX
// ══════════════════════════════════════════════════════
export const regexTester = (pattern, testString, flags = '') => {
  try {
    const regex = new RegExp(pattern, flags);
    const matches = [...testString.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))];

    return {
      pattern,
      flags,
      testString: testString.slice(0, 200),
      isMatch: regex.test(testString),
      matchCount: matches.length,
      matches: matches.slice(0, 10).map(m => ({
        match: m[0],
        index: m.index,
        groups: m.groups || null
      }))
    };
  } catch (err) {
    return { error: `Regex invalide: ${err.message}` };
  }
};

// ══════════════════════════════════════════════════════
//  OUTIL 10 — ANALYSEUR DE COMPLEXITÉ ALGORITHME
// ══════════════════════════════════════════════════════
export const algorithmInfo = (name) => {
  const algorithms = {
    'bubble sort': { time: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)', stable: true, description: 'Compare et échange les éléments adjacents. Simple mais inefficace.' },
    'insertion sort': { time: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)', stable: true, description: 'Insère chaque élément à sa bonne position. Efficace pour petits tableaux.' },
    'selection sort': { time: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)', stable: false, description: 'Sélectionne le minimum et le place au début.' },
    'merge sort': { time: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(n)', stable: true, description: 'Diviser pour régner. Garantit O(n log n) dans tous les cas.' },
    'quicksort': { time: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)' }, space: 'O(log n)', stable: false, description: 'Pivot, partition, récursion. Très rapide en pratique.' },
    'heapsort': { time: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(1)', stable: false, description: 'Basé sur un tas binaire. Garantit O(n log n), in-place.' },
    'binary search': { time: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)' }, space: 'O(1)', stable: null, description: 'Recherche dans un tableau trié. Divise l\'espace de recherche par 2.' },
    'bfs': { time: { best: 'O(V+E)', avg: 'O(V+E)', worst: 'O(V+E)' }, space: 'O(V)', stable: null, description: 'Parcours en largeur. Trouve le plus court chemin (non-pondéré).' },
    'dfs': { time: { best: 'O(V+E)', avg: 'O(V+E)', worst: 'O(V+E)' }, space: 'O(V)', stable: null, description: 'Parcours en profondeur. Utile pour détection de cycles, topologie.' },
    'dijkstra': { time: { best: 'O(E log V)', avg: 'O(E log V)', worst: 'O(E log V)' }, space: 'O(V)', stable: null, description: 'Plus court chemin dans graphe pondéré positif.' },
    'dynamic programming': { time: { best: 'Dépend du problème', avg: 'Polynomial', worst: 'Polynomial' }, space: 'O(n) à O(n²)', stable: null, description: 'Mémoïsation ou tabulation pour éviter recalculs. Optimal pour sous-problèmes.' }
  };

  const key = name.toLowerCase();
  const algo = algorithms[key];
  if (!algo) {
    return { error: `Algorithme "${name}" non trouvé. Disponibles: ${Object.keys(algorithms).join(', ')}` };
  }
  return { name, ...algo };
};

// ══════════════════════════════════════════════════════
//  DISPATCH — Appelle l'outil par nom
// ══════════════════════════════════════════════════════
export const dispatchTool = async (toolName, args) => {
  const tools = {
    calculator: () => calculator(args.expression || args[0]),
    subnet: () => subnetCalculator(args.cidr || args[0]),
    convertisseur: () => unitConverter(args.value || args[0], args.from || args[1], args.to || args[2]),
    electronique: () => electronicsCalc(args.formula || args[0], ...(args.params || args.slice ? args.slice(1) : [])),
    base: () => baseConverter(args.value || args[0], args.from || args[1], args.to || args[2]),
    code: async () => await codeExecutor(args.code || args[0], args.language || args[1]),
    hash: () => hashGenerator(args.text || args[0], args.algorithm || args[1]),
    liaison: () => linkBudget(args),
    regex: () => regexTester(args.pattern || args[0], args.test || args[1], args.flags || args[2]),
    algorithme: () => algorithmInfo(args.name || args[0])
  };

  const tool = tools[toolName];
  if (!tool) return { error: `Outil "${toolName}" inconnu. Disponibles: ${Object.keys(tools).join(', ')}` };

  try {
    return await tool();
  } catch (err) {
    return { error: `Erreur dans ${toolName}: ${err.message}` };
  }
};

// ══════════════════════════════════════════════════════
//  LISTE DES OUTILS (pour le system prompt)
// ══════════════════════════════════════════════════════
export const TOOLS_DESCRIPTION = `
## OUTILS DISPONIBLES — Appelle-les avec: [OUTIL: nom | paramètres]

| Outil | Syntaxe | Exemple |
|-------|---------|---------|
| calculator | [OUTIL: calculator \| 2*pi*r] | [OUTIL: calculator \| 2*3.14159*5] |
| subnet | [OUTIL: subnet \| 192.168.1.0/24] | Calcul subnetting complet |
| convertisseur | [OUTIL: convertisseur \| 100 \| km \| mi] | Convertit 100 km en miles |
| electronique | [OUTIL: electronique \| ohm \| v=12 \| r=220] | Loi d'Ohm |
| electronique | [OUTIL: electronique \| couleur \| marron \| noir \| rouge \| or] | Code couleur résistance |
| electronique | [OUTIL: electronique \| rc \| 1000 \| 0.000001] | Constante RC |
| base | [OUTIL: base \| FF \| hex \| dec] | Convertit hex FF en décimal |
| code | [OUTIL: code \| javascript \| console.log("test")] | Exécute du code |
| hash | [OUTIL: hash \| motdepasse \| sha256] | Hash SHA256 |
| liaison | [OUTIL: liaison \| eirp=43 \| freq=2600 \| dist=5] | Bilan liaison radio |
| regex | [OUTIL: regex \| \\d{4} \| test2024 \| g] | Test regex |
| algorithme | [OUTIL: algorithme \| quicksort] | Info complexité |

IMPORTANT: Utilise ces outils AUTOMATIQUEMENT quand l'utilisateur pose une question qui nécessite un calcul, une conversion, ou une exécution de code. Ne simule pas les calculs — appelle l'outil.
`;
