import { rand, randNZ, pick, gcd, num, frac, poly, makeQuestion, MINUS, sort2 } from '../lib/utils.js';

const eq = (a, b, c) => `${poly([[a, 'x²'], [b, 'x'], [c, '']])} = 0`;
const sol2 = (s1, s2) => `x = ${s1} ; x = ${s2}`;

// ---------- LIVELLO 1: equazioni incomplete ----------

function pura() {
  const k = rand(1, 9);
  const a = pick([1, 1, 2, 3, 4, 5]);
  const c = a * k * k;
  const steps = [`Porta il termine noto a destra: ${a === 1 ? '' : a}x² = ${c}`];
  if (a !== 1) steps.push(`Dividi entrambi i membri per ${a}: x² = ${k * k}`);
  steps.push(`Fai la radice quadrata ricordando il ±: x = ±√${k * k} = ±${k}`);
  steps.push(`Soluzioni: x = ${MINUS}${k} ; x = ${k}`);
  return makeQuestion({
    text: "Risolvi l'equazione pura:",
    formula: eq(a, 0, -c),
    correct: sol2(`${MINUS}${k}`, k),
    wrong: [
      { text: `x = ${k}`, why: `Hai trovato solo la soluzione positiva. Anche (${MINUS}${k})² = ${k * k}: la radice quadrata dà sempre due risultati, + e ${MINUS}.` },
      { text: sol2(`${MINUS}${k * k}`, k * k), why: `Ti sei fermato a x² = ${k * k}: devi ancora fare la radice quadrata! √${k * k} = ${k}.` },
      { text: 'Nessuna soluzione reale', why: `L'equazione è impossibile solo se x² deve essere uguale a un numero NEGATIVO. Qui x² = ${k * k}, che è positivo.` },
      { text: sol2(0, k), why: 'x = 0 è soluzione solo delle equazioni spurie (quelle senza termine noto). Prova a sostituire x = 0: non ottieni 0.' },
    ],
    solution: steps,
  });
}

function impossibile() {
  const k = rand(1, 7);
  const a = pick([1, 2, 3]);
  const c = a * k * k;
  return makeQuestion({
    text: "Risolvi l'equazione:",
    formula: eq(a, 0, c),
    correct: 'Nessuna soluzione reale (impossibile)',
    wrong: [
      { text: sol2(`${MINUS}${k}`, k), why: `Attenzione al segno! Portando ${c} a destra diventa negativo: ${a === 1 ? '' : a}x² = ${MINUS}${c}. Nessun numero elevato al quadrato dà un risultato negativo.` },
      { text: 'x = 0', why: `Sostituisci x = 0: ottieni ${c} = 0, che è falso.` },
      { text: `x = ${MINUS}${k}`, why: `Prova a sostituire: ${a === 1 ? '' : a + '·'}(${MINUS}${k})² + ${c} = ${2 * c}, non 0. Un quadrato non è mai negativo.` },
    ],
    solution: [
      `Porta il termine noto a destra: ${a === 1 ? '' : a}x² = ${MINUS}${c}`,
      `x² dovrebbe essere ${a === 1 ? '' : 'uguale a '}${frac(-c, a)}, cioè un numero negativo`,
      'Un quadrato non può mai essere negativo ⇒ l’equazione è impossibile in ℝ.',
    ],
  });
}

function spuria() {
  const a = pick([1, 1, 2, 3, 4, 5]);
  const b = randNZ(-12, 12);
  const r = frac(-b, a);
  return makeQuestion({
    text: "Risolvi l'equazione spuria:",
    formula: eq(a, b, 0),
    correct: sol2(0, r),
    wrong: [
      { text: sol2(0, frac(b, a)), why: `Errore di segno: da ${poly([[a, 'x'], [b, '']])} = 0 si ottiene ${a === 1 ? '' : `${a}x = ${num(-b)}, quindi `}x = ${r}.` },
      { text: 'x = 0', why: `Hai trovato solo x = 0. Raccogliendo x ottieni x·(${poly([[a, 'x'], [b, '']])}) = 0: anche il secondo fattore può valere zero.` },
      { text: `x = ${r}`, why: 'Hai perso la soluzione x = 0: probabilmente hai diviso per x. Non si divide mai per x, si raccoglie!' },
      { text: sol2(0, frac(-a, b)), why: `Hai capovolto la frazione: x = ${MINUS}b/a = ${r}.` },
    ],
    solution: [
      `Raccogli x: x·(${poly([[a, 'x'], [b, '']])}) = 0`,
      'Legge di annullamento del prodotto: un prodotto è zero se almeno un fattore è zero',
      `Primo fattore: x = 0`,
      `Secondo fattore: ${poly([[a, 'x'], [b, '']])} = 0 ⇒ x = ${r}`,
    ],
  });
}

// ---------- LIVELLO 2: formula risolutiva e discriminante ----------

function completaA1() {
  let r1, r2;
  do {
    r1 = randNZ(-9, 9);
    r2 = randNZ(-9, 9);
  } while (r1 === r2 || r1 === -r2);
  [r1, r2] = sort2(r1, r2);
  const b = -(r1 + r2);
  const c = r1 * r2;
  const D = b * b - 4 * c;
  const sq = Math.sqrt(D);
  const [n1, n2] = sort2(-r1, -r2);
  return makeQuestion({
    text: "Risolvi l'equazione di secondo grado:",
    formula: eq(1, b, c),
    correct: sol2(num(r1), num(r2)),
    wrong: [
      { text: sol2(num(n1), num(n2)), why: `Errore di segno: nella formula c'è ${MINUS}b. Con b = ${num(b)} si ha ${MINUS}b = ${num(-b)}.` },
      { text: 'Nessuna soluzione reale', why: `Δ = b² ${MINUS} 4ac = ${D}, che è positivo: le soluzioni sono due.` },
      { text: sol2(num(2 * r1), num(2 * r2)), why: 'Hai dimenticato di dividere per 2a (qui 2a = 2).' },
      { text: sol2(num(Math.min(r1, -r2)), num(Math.max(r1, -r2))), why: 'Una delle due soluzioni ha il segno sbagliato. Verifica sempre sostituendo nell’equazione!' },
    ],
    solution: [
      `a = 1, b = ${num(b)}, c = ${num(c)}`,
      `Δ = b² ${MINUS} 4ac = (${num(b)})² ${MINUS} 4·1·(${num(c)}) = ${D}`,
      `√Δ = ${sq}`,
      `x = (${MINUS}b ± √Δ) / 2a = (${num(-b)} ± ${sq}) / 2`,
      `x₁ = ${num(r1)} ; x₂ = ${num(r2)}`,
    ],
    tip: `Controllo veloce: la somma delle soluzioni è ${MINUS}b/a = ${num(-b)}, il prodotto è c/a = ${num(c)}.`,
  });
}

function delta() {
  const a = rand(1, 3);
  const b = randNZ(-8, 8);
  const c = randNZ(-9, 9);
  const D = b * b - 4 * a * c;
  return makeQuestion({
    text: 'Quanto vale il discriminante Δ della seguente equazione?',
    formula: eq(a, b, c),
    correct: `Δ = ${num(D)}`,
    wrong: [
      { text: `Δ = ${num(b * b + 4 * a * c)}`, why: `Errore nel segno: Δ = b² ${MINUS} 4ac. Qui 4ac = 4·${a}·(${num(c)}) = ${num(4 * a * c)}, quindi va SOTTRATTO.` },
      { text: `Δ = ${num(-b * b - 4 * a * c)}`, why: `b² è sempre positivo: (${num(b)})² = ${b * b}, non ${MINUS}${b * b}.` },
      { text: `Δ = ${num(b * b - 2 * a * c)}`, why: 'La formula usa 4ac, non 2ac.' },
      { text: `Δ = ${num(b - 4 * a * c)}`, why: 'Hai dimenticato di elevare b al quadrato.' },
    ],
    solution: [
      `a = ${a}, b = ${num(b)}, c = ${num(c)}`,
      `Δ = b² ${MINUS} 4ac`,
      `Δ = (${num(b)})² ${MINUS} 4·${a}·(${num(c)}) = ${b * b} ${4 * a * c >= 0 ? MINUS + ' ' + 4 * a * c : '+ ' + -4 * a * c} = ${num(D)}`,
    ],
  });
}

const N_OPTS = {
  due: 'Due soluzioni reali distinte',
  coinc: 'Due soluzioni coincidenti (una sola soluzione)',
  nessuna: 'Nessuna soluzione reale',
  inf: 'Infinite soluzioni',
};

function quanteSoluzioni() {
  const kind = pick(['due', 'coinc', 'nessuna']);
  let a, b, c;
  if (kind === 'due') {
    a = rand(1, 3);
    b = randNZ(-7, 7);
    c = randNZ(-9, 9);
    if (b * b - 4 * a * c <= 0) throw new Error('retry');
  } else if (kind === 'coinc') {
    const p = rand(1, 3);
    const q = randNZ(-5, 5);
    a = p * p;
    b = -2 * p * q;
    c = q * q;
  } else {
    a = rand(1, 3);
    b = rand(-6, 6);
    c = rand(1, 12);
    if (b * b - 4 * a * c >= 0) throw new Error('retry');
  }
  const D = b * b - 4 * a * c;
  const dStr = `Δ = ${num(D)}`;
  const whyFor = {
    due: `${dStr}. Ci sono due soluzioni distinte solo se Δ > 0.`,
    coinc: `${dStr}. Le soluzioni sono coincidenti solo se Δ = 0.`,
    nessuna: `${dStr}. Non ci sono soluzioni reali solo se Δ < 0.`,
    inf: 'Un’equazione di secondo grado non ha mai infinite soluzioni: al massimo ne ha due.',
  };
  return makeQuestion({
    text: 'Senza risolverla, quante soluzioni reali ha questa equazione?',
    formula: eq(a, b, c),
    correct: N_OPTS[kind],
    wrong: Object.keys(N_OPTS)
      .filter((k) => k !== kind)
      .map((k) => ({ text: N_OPTS[k], why: whyFor[k] })),
    solution: [
      `Calcola il discriminante: Δ = b² ${MINUS} 4ac = (${num(b)})² ${MINUS} 4·${a}·(${num(c)}) = ${num(D)}`,
      'Δ > 0 ⇒ due soluzioni distinte;  Δ = 0 ⇒ due soluzioni coincidenti;  Δ < 0 ⇒ nessuna soluzione reale',
      `Qui ${D > 0 ? 'Δ > 0' : D === 0 ? 'Δ = 0' : 'Δ < 0'} ⇒ ${N_OPTS[kind]}`,
    ],
  });
}

// ---------- LIVELLO 3: stile esame ----------

function completaAnon1() {
  // (p x − q)(x − r) = 0
  const p = pick([2, 3, 4, 5]);
  let q;
  do q = randNZ(-5, 5);
  while (gcd(p, q) !== 1);
  const r = randNZ(-6, 6);
  const a = p;
  const b = -(p * r + q);
  const c = q * r;
  const D = b * b - 4 * a * c;
  const sq = Math.sqrt(D);
  const roots = [
    { v: q / p, s: frac(q, p) },
    { v: r, s: num(r) },
  ].sort((x, y) => x.v - y.v);
  const neg = [
    { v: -q / p, s: frac(-q, p) },
    { v: -r, s: num(-r) },
  ].sort((x, y) => x.v - y.v);
  const by2 = [
    { v: q, s: num(q) },
    { v: p * r, s: num(p * r) },
  ].sort((x, y) => x.v - y.v);
  const noDiv = [
    { v: 2 * q, s: num(2 * q) },
    { v: 2 * p * r, s: num(2 * p * r) },
  ].sort((x, y) => x.v - y.v);
  return makeQuestion({
    text: "Individua quale fra le seguenti rappresenta la soluzione dell'equazione:",
    formula: eq(a, b, c),
    correct: sol2(roots[0].s, roots[1].s),
    wrong: [
      { text: sol2(neg[0].s, neg[1].s), why: `Errore di segno: nella formula si usa ${MINUS}b = ${num(-b)}.` },
      { text: sol2(by2[0].s, by2[1].s), why: `Hai diviso per 2 invece che per 2a = ${2 * a}.` },
      { text: sol2(noDiv[0].s, noDiv[1].s), why: `Hai dimenticato di dividere per 2a = ${2 * a}.` },
      { text: 'Non si può risolvere perché il discriminante è negativo', why: `Δ = ${D}, che è positivo.` },
    ],
    solution: [
      `a = ${a}, b = ${num(b)}, c = ${num(c)}`,
      `Δ = (${num(b)})² ${MINUS} 4·${a}·(${num(c)}) = ${D} ⇒ √Δ = ${sq}`,
      `x = (${num(-b)} ± ${sq}) / ${2 * a}`,
      `x₁ = (${num(-b)} ${MINUS} ${sq}) / ${2 * a} = ${frac(-b - sq, 2 * a)} ; x₂ = (${num(-b)} + ${sq}) / ${2 * a} = ${frac(-b + sq, 2 * a)}`,
    ],
  });
}

function coincidenti() {
  const p = rand(1, 3);
  const q = randNZ(-5, 5);
  const A = p * p;
  const B = -2 * p * q;
  const C = q * q;
  const D = (a, b, c) => b * b - 4 * a * c;
  const m = rand(1, 3);
  const cands = [
    [A, 0, -C],
    [A, B, C - m],
    [A, B, C + m],
    [A, B + 2 * Math.sign(B), C],
  ];
  const wrong = cands.map(([a, b, c]) => {
    const d = D(a, b, c);
    return {
      text: eq(a, b, c),
      why: `Δ = (${num(b)})² ${MINUS} 4·${a}·(${num(c)}) = ${num(d)} ${d > 0 ? '> 0: due soluzioni DISTINTE.' : '< 0: nessuna soluzione reale.'}`,
    };
  });
  return makeQuestion({
    text: 'Quale delle seguenti equazioni ammette due soluzioni coincidenti?',
    correct: eq(A, B, C),
    wrong,
    solution: [
      'Due soluzioni coincidenti ⇔ Δ = 0',
      `Per ${eq(A, B, C)}: Δ = (${num(B)})² ${MINUS} 4·${A}·${C} = ${B * B} ${MINUS} ${4 * A * C} = 0 ✔`,
      `Infatti è un quadrato di binomio: (${poly([[p, 'x'], [-q, '']])})² = 0 ⇒ x = ${frac(q, p)}`,
    ],
  });
}

function soluzioneComune() {
  const p = pick([2, 3, 4]);
  let q;
  do q = randNZ(-5, 5);
  while (gcd(p, q) !== 1);
  let r;
  do r = randNZ(-4, 4);
  while (r === q / p);
  const a = p;
  const b = -(p * r + q);
  const c = q * r;
  const k = pick([2, 3, 4, 8]);
  const lin = `${poly([[k * p, 'x'], [-k * q, '']])} = 0`;
  const D = b * b - 4 * a * c;
  return makeQuestion({
    text: `Considera l'equazione di secondo grado ${eq(a, b, c)} e l'equazione di primo grado ${lin}. Individua la soluzione comune.`,
    correct: `x = ${frac(q, p)}`,
    wrong: [
      { text: `x = ${num(r)}`, why: `x = ${num(r)} risolve l'equazione di secondo grado ma NON quella di primo grado: sostituisci e verifica.` },
      { text: `x = ${frac(-q, p)}`, why: `Errore di segno: da ${lin} si ottiene ${k * p}x = ${num(k * q)}, quindi x = ${frac(q, p)}.` },
      { text: `x = ${frac(p, q)}`, why: `Hai capovolto la frazione: ${k * p}x = ${num(k * q)} ⇒ x = ${frac(k * q, k * p)}.` },
      { text: `x = ${num(-r)}`, why: 'Questo valore non risolve nessuna delle due equazioni.' },
    ],
    solution: [
      `Equazione di primo grado: ${k * p}x = ${num(k * q)} ⇒ x = ${frac(q, p)}`,
      `Verifica nella seconda: Δ = ${D}, √Δ = ${Math.sqrt(D)}, soluzioni x = ${frac(q, p)} e x = ${num(r)}`,
      `La soluzione comune è x = ${frac(q, p)}; l'altra soluzione dell'equazione di secondo grado è x = ${num(r)}`,
    ],
  });
}

function aiuola() {
  const L = rand(8, 14);
  const W = rand(5, L - 1);
  const x = pick([0.5, 1, 1.5, 2]);
  const A = (L + 2 * x) * (W + 2 * x);
  const Astr = num(A);
  return makeQuestion({
    text: `Un'aiuola rettangolare è lunga ${L} m e larga ${W} m. È circondata da un passaggio pedonale largo x metri (su tutti i lati). La superficie totale di aiuola e passaggio è ${Astr} m². Quale equazione permette di calcolare x?`,
    visual: { type: 'frame', L, W },
    correct: `(${L} + 2x)·(${W} + 2x) = ${Astr}`,
    wrong: [
      { text: `(${L} + x)·(${W} + x) = ${Astr}`, why: 'Il passaggio c’è su entrambi i lati: la lunghezza aumenta di x a sinistra e di x a destra, cioè di 2x.' },
      { text: `${L * W} + 2x = ${Astr}`, why: 'Non si può sommare una lunghezza (2x) a un’area: l’area totale è (lunghezza totale)·(larghezza totale).' },
      { text: `${L} + 2x + ${W} + 2x = ${Astr}`, why: 'Questo è il semiperimetro del rettangolo grande, non la sua area.' },
    ],
    solution: [
      `Lunghezza totale: ${L} + 2x;  larghezza totale: ${W} + 2x`,
      `Area totale = lunghezza · larghezza ⇒ (${L} + 2x)·(${W} + 2x) = ${Astr}`,
      `Risolvendo si trova x = ${num(x)} m (la soluzione negativa si scarta)`,
    ],
  });
}

function consecutivi() {
  const n = rand(4, 15);
  const N = n * (n + 1);
  const D = 1 + 4 * N;
  return makeQuestion({
    text: `Il prodotto di due numeri naturali consecutivi è ${N}. Quali sono i due numeri?`,
    correct: `${n} e ${n + 1}`,
    wrong: [
      { text: `${n - 1} e ${n}`, why: `Verifica: ${n - 1}·${n} = ${(n - 1) * n}, non ${N}.` },
      { text: `${n + 1} e ${n + 2}`, why: `Verifica: ${n + 1}·${n + 2} = ${(n + 1) * (n + 2)}, non ${N}.` },
      { text: `${n} e ${n + 2}`, why: `${n} e ${n + 2} non sono consecutivi (e ${n}·${n + 2} = ${n * (n + 2)}).` },
    ],
    solution: [
      'Chiamo x il primo numero, x + 1 il successivo',
      `x·(x + 1) = ${N} ⇒ x² + x ${MINUS} ${N} = 0`,
      `Δ = 1 + 4·${N} = ${D} ⇒ √Δ = ${Math.sqrt(D)}`,
      `x = (${MINUS}1 ± ${Math.sqrt(D)}) / 2 ⇒ x = ${n} oppure x = ${MINUS}${n + 1} (non naturale, si scarta)`,
      `I numeri sono ${n} e ${n + 1}`,
    ],
  });
}

function rettangoloArea() {
  const h = rand(3, 12);
  const d = rand(1, 6);
  const A = h * (h + d);
  const D = d * d + 4 * A;
  return makeQuestion({
    text: `In un rettangolo la base supera l'altezza di ${d} cm e l'area è ${A} cm². Quanto misura l'altezza?`,
    correct: `${h} cm`,
    wrong: [
      { text: `${h + d} cm`, why: `${h + d} cm è la base, non l'altezza.` },
      { text: `${MINUS}${h + d} cm`, why: 'Questa è la soluzione negativa dell’equazione: una lunghezza non può essere negativa, va scartata.' },
      { text: `${h + 1} cm`, why: `Verifica: ${h + 1}·${h + 1 + d} = ${(h + 1) * (h + 1 + d)}, non ${A}.` },
      { text: `${h - 1} cm`, why: `Verifica: ${h - 1}·${h - 1 + d} = ${(h - 1) * (h - 1 + d)}, non ${A}.` },
    ],
    solution: [
      `Altezza = x, base = x + ${d}`,
      `x·(x + ${d}) = ${A} ⇒ x² + ${d}x ${MINUS} ${A} = 0`,
      `Δ = ${d}² + 4·${A} = ${D} ⇒ √Δ = ${Math.sqrt(D)}`,
      `x = (${MINUS}${d} ± ${Math.sqrt(D)}) / 2 ⇒ x = ${h} (accettabile) oppure x = ${MINUS}${h + d} (da scartare)`,
    ],
  });
}

export default {
  id: 'equazioni',
  title: 'Equazioni di 2° grado',
  icon: 'x²',
  color: '#4f46e5',
  description: 'Pure, spurie, complete: discriminante e formula risolutiva.',
  levels: [
    { id: 'eq1', title: 'Equazioni incomplete', description: 'Pure, spurie e impossibili', pool: [pura, pura, spuria, spuria, impossibile] },
    { id: 'eq2', title: 'Formula risolutiva', description: 'Δ, numero di soluzioni e formula', pool: [completaA1, completaA1, delta, quanteSoluzioni] },
    { id: 'eq3', title: 'Stile esame', description: 'Equazioni con a ≠ 1 e problemi', pool: [completaAnon1, coincidenti, soluzioneComune, aiuola, consecutivi, rettangoloArea] },
  ],
};
