// ------------------------------------------------------------
// Utility: numeri casuali, formattazione, costruzione domande
// ------------------------------------------------------------

export const MINUS = '−';

export const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
export const randNZ = (a, b) => {
  let v;
  do v = rand(a, b);
  while (v === 0);
  return v;
};
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const sign = () => (Math.random() < 0.5 ? -1 : 1);

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** Numero in formato italiano (virgola decimale, segno meno tipografico). */
export function num(n, dec = 2) {
  const p = 10 ** dec;
  let r = Math.round(n * p) / p;
  if (Object.is(r, -0)) r = 0;
  const s = String(Math.abs(r)).replace('.', ',');
  return (r < 0 ? MINUS : '') + s;
}

/** Numero con numero fisso di decimali. */
export function numFixed(n, dec = 1) {
  const s = Math.abs(n).toFixed(dec).replace('.', ',');
  return (n < 0 && Number(Math.abs(n).toFixed(dec)) !== 0 ? MINUS : '') + s;
}

/** Euro: 1234.5 -> "1234,50 €" (senza decimali se intero) */
export function euro(n) {
  const r = Math.round(n * 100) / 100;
  if (Number.isInteger(r)) return `${num(r)} €`;
  return `${numFixed(r, 2)} €`;
}

/** Percentuale */
export function perc(p, dec = 1) {
  return `${num(p * 100, dec)}%`;
}

/** Frazione semplificata in sintassi {{n|d}} (resa graficamente da MathText). */
export function frac(n, d) {
  if (d === 0) throw new Error('denominatore zero');
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d) || 1;
  n /= g;
  d /= g;
  if (d === 1) return num(n);
  return (n < 0 ? MINUS : '') + `{{${Math.abs(n)}|${d}}}`;
}

/** Frazione NON semplificata */
export function rawFrac(n, d) {
  return `{{${n}|${d}}}`;
}

/** Valore di una frazione */
export const fv = (n, d) => n / d;

/** Coefficiente: numero intero oppure [n, d] */
function coefParts(c) {
  if (Array.isArray(c)) {
    let [n, d] = c;
    if (d < 0) {
      n = -n;
      d = -d;
    }
    const g = gcd(n, d) || 1;
    n /= g;
    d /= g;
    return { value: n / d, abs: d === 1 ? Math.abs(n) : null, absStr: d === 1 ? num(Math.abs(n)) : `{{${Math.abs(n)}|${d}}}`, neg: n < 0, isOne: Math.abs(n) === 1 && d === 1 };
  }
  return { value: c, absStr: num(Math.abs(c)), neg: c < 0, isOne: Math.abs(c) === 1 };
}

/**
 * Polinomio da una lista di termini [coefficiente, parteLetterale].
 * poly([[2,'x²'],[-3,'x'],[1,'']]) => "2x² − 3x + 1"
 */
export function poly(terms) {
  let s = '';
  for (const [c, v] of terms) {
    const p = coefParts(c);
    if (p.value === 0) continue;
    const cs = p.isOne && v ? '' : p.absStr;
    if (s === '') s = (p.neg ? MINUS : '') + cs + v;
    else s += (p.neg ? ` ${MINUS} ` : ' + ') + cs + v;
  }
  return s || '0';
}

/** "x − 3", "x + 2", "x" */
export function minusTerm(v, a) {
  if (a === 0) return v;
  return a > 0 ? `${v} ${MINUS} ${num(a)}` : `${v} + ${num(-a)}`;
}

/** Punto (x; y) */
export function pt(x, y) {
  return `(${x}; ${y})`;
}
export function ptN(x, y) {
  return `(${num(x)}; ${num(y)})`;
}

/** Valore numerico di un'opzione "pura" (numero, frazione, percentuale), altrimenti null */
export function numericValue(t) {
  let s = String(t).replace(/−/g, '-').replace(/ (€|cm²|cm|m|s|pezzi)$/, '').replace(/^(x|m|Δ) = /, '').trim();
  let pc = false;
  if (s.endsWith('%')) {
    pc = true;
    s = s.slice(0, -1);
  }
  s = s.replace(',', '.');
  const m = s.match(/^(-?)\{\{(\d+)\|(\d+)\}\}$/);
  let v = m ? (m[1] ? -1 : 1) * (Number(m[2]) / Number(m[3])) : /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
  if (v != null && pc) v /= 100;
  return v;
}

/** Normalizza testo per confronto duplicati (anche numerico: 21 = 21,0 = {{42|2}}) */
const norm = (s) => {
  const v = numericValue(s);
  if (v != null) return 'num:' + Math.round(v * 1e6);
  return String(s).replace(/\s+/g, ' ').trim().toLowerCase();
};

/**
 * Costruisce una domanda a scelta multipla con 4 opzioni.
 * spec = {
 *   text: testo domanda, formula?: formula evidenziata, visual?: oggetto grafico,
 *   correct: testo risposta corretta,
 *   wrong: [{ text, why }] (almeno 3 distinte fra loro e dalla corretta),
 *   solution: [passi della soluzione],
 *   tip?: consiglio
 * }
 */
export function makeQuestion(spec) {
  const { correct, wrong } = spec;
  const seen = new Set([norm(correct)]);
  const chosen = [];
  for (const w of wrong) {
    if (chosen.length === 3) break;
    if (w == null || w.text == null) continue;
    const k = norm(w.text);
    if (seen.has(k)) continue;
    if (/NaN|undefined|Infinity/.test(w.text)) continue;
    seen.add(k);
    chosen.push(w);
  }
  if (chosen.length < 3) throw new Error('Distrattori insufficienti: ' + spec.text);
  const options = shuffle([
    { text: correct, correct: true },
    ...chosen.map((w) => ({ text: w.text, why: w.why, correct: false })),
  ]);
  return {
    text: spec.text,
    formula: spec.formula,
    visual: spec.visual,
    options,
    solution: spec.solution || [],
    tip: spec.tip,
  };
}

/** Genera in modo robusto (riprova se i numeri casuali producono casi degeneri). */
export function safeGenerate(gen) {
  let lastErr;
  for (let i = 0; i < 40; i++) {
    try {
      return gen();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

/** Ordina due numeri */
export const sort2 = (a, b) => (a <= b ? [a, b] : [b, a]);

/** Pitagorici semplici [a, b, c] */
export const TRIPLES = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 6, 10],
  [4, 3, 5],
  [12, 5, 13],
  [9, 12, 15],
];
