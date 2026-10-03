import { rand, randNZ, pick, num, poly, makeQuestion, MINUS, pt, shuffle } from '../lib/utils.js';

const P = (x, y) => pt(num(x), num(y));
const sq = (v, a) => (a === 0 ? `${v}²` : `(${a > 0 ? `${v} ${MINUS} ${a}` : `${v} + ${-a}`})²`);
const canon = (a, b, r2) => `${sq('x', a)} + ${sq('y', b)} = ${num(r2)}`;
const general = (al, be, ga) => `${poly([[1, 'x²'], [1, 'y²'], [al, 'x'], [be, 'y'], [ga, '']])} = 0`;
const CR = (a, b, r) => `C${P(a, b)}, r = ${r}`;
const center = () => {
  let a, b;
  do {
    a = rand(-5, 5);
    b = rand(-5, 5);
  } while (a === 0 && b === 0);
  return [a, b];
};

// ---------- LIVELLO 1 ----------

function centroRaggio() {
  let [a, b] = center();
  if (a === 0 || b === 0) [a, b] = [randNZ(-5, 5), randNZ(-5, 5)];
  const r = rand(2, 7);
  return makeQuestion({
    text: 'Individua centro e raggio della circonferenza:',
    formula: canon(a, b, r * r),
    correct: CR(a, b, r),
    wrong: [
      { text: CR(-a, -b, r), why: `Attenzione ai segni: (x ${MINUS} a)² ha centro con ascissa +a. Da ${sq('x', a)} si legge x_C = ${num(a)}.` },
      { text: CR(a, b, r * r), why: `Nell'equazione compare r² = ${r * r}: il raggio è la radice, r = √${r * r} = ${r}.` },
      { text: CR(-a, -b, r * r), why: 'Doppio errore: i segni del centro vanno cambiati rispetto a quelli nelle parentesi, e il raggio è la radice del termine a destra.' },
    ],
    solution: ['Forma: (x − x_C)² + (y − y_C)² = r²', `Da ${sq('x', a)} ⇒ x_C = ${num(a)};  da ${sq('y', b)} ⇒ y_C = ${num(b)}`, `r² = ${r * r} ⇒ r = ${r}`],
  });
}

function equazioneDa() {
  let [a, b] = center();
  if (a === 0 || b === 0) [a, b] = [randNZ(-5, 5), randNZ(-5, 5)];
  const r = rand(2, 7);
  return makeQuestion({
    text: `Qual è l'equazione della circonferenza con centro C${P(a, b)} e raggio r = ${r}?`,
    correct: canon(a, b, r * r),
    wrong: [
      { text: canon(-a, -b, r * r), why: `Il centro (${num(a)}; ${num(b)}) va scritto come (x ${MINUS} x_C) e (y ${MINUS} y_C): i segni nelle parentesi sono opposti a quelli delle coordinate.` },
      { text: canon(a, b, r), why: `A destra va il raggio AL QUADRATO: r² = ${r * r}.` },
      { text: canon(-a, -b, r), why: 'Segni del centro sbagliati e raggio non elevato al quadrato.' },
      { text: canon(a, b, 2 * r), why: `A destra va r² = ${r}² = ${r * r}, non 2r.` },
    ],
    solution: ['Formula: (x − x_C)² + (y − y_C)² = r²', `Sostituisco x_C = ${num(a)}, y_C = ${num(b)}, r² = ${r * r}`, canon(a, b, r * r)],
  });
}

function origine() {
  const [p, q, r] = pick([
    [3, 4, 5],
    [4, 3, 5],
    [6, 8, 10],
    [5, 12, 13],
    [0, 4, 4],
    [6, 0, 6],
  ]);
  const x = p * pick([1, -1]);
  const y = q * pick([1, -1]);
  return makeQuestion({
    text: `Una circonferenza ha centro nell'origine e passa per il punto P${P(x, y)}. Qual è la sua equazione?`,
    correct: `x² + y² = ${r * r}`,
    wrong: [
      { text: `x² + y² = ${r}`, why: `${r} è il raggio; nell'equazione serve r² = ${r * r}.` },
      { text: `x² + y² = ${p + q}`, why: `Hai sommato le coordinate. Devi sommare i loro QUADRATI: (${num(x)})² + (${num(y)})² = ${r * r}.` },
      { text: `x² + y² = ${(p + q) ** 2}`, why: `(x + y)² non è x² + y²: (${num(x)})² + (${num(y)})² = ${p * p} + ${q * q} = ${r * r}.` },
      { text: `x² + y² = ${2 * r * r}`, why: `Sostituisci P: ${p * p} + ${q * q} = ${r * r}.` },
    ],
    solution: ['Centro nell’origine ⇒ equazione x² + y² = r²', `P appartiene alla circonferenza: r² = (${num(x)})² + (${num(y)})² = ${p * p} + ${q * q} = ${r * r}`, `x² + y² = ${r * r}  (raggio ${r})`],
  });
}

function appartiene() {
  const [a, b] = center();
  const [dx, dy, r] = pick([
    [3, 4, 5],
    [4, 3, 5],
    [0, 5, 5],
    [5, 0, 5],
    [0, 3, 3],
    [3, 0, 3],
  ]);
  const sx = pick([1, -1]);
  const sy = pick([1, -1]);
  const good = [a + sx * dx, b + sy * dy];
  const val = ([x, y]) => (x - a) ** 2 + (y - b) ** 2;
  const cands = shuffle([
    [a + sx * dx, b + sy * (dy + 1)],
    [a + sx * (dx + 1), b + sy * dy],
    [a + sx * dy, b + sy * (dx + 1)],
    [a + sx * dx + 1, b + sy * dy + 1],
    [a, b],
  ]).filter((p) => val(p) !== r * r);
  return makeQuestion({
    text: 'Quale dei seguenti punti appartiene alla circonferenza?',
    formula: canon(a, b, r * r),
    correct: P(...good),
    wrong: cands.map((p) => ({
      text: P(...p),
      why: val(p) === 0 ? 'Questo è il centro: si trova DENTRO la circonferenza, non su di essa.' : `Sostituisci: (${num(p[0])} ${MINUS} (${num(a)}))² + (${num(p[1])} ${MINUS} (${num(b)}))² = ${val(p)} ≠ ${r * r}.`,
    })),
    solution: ['Un punto appartiene alla circonferenza se le sue coordinate verificano l’equazione', `(${num(good[0])} ${MINUS} (${num(a)}))² + (${num(good[1])} ${MINUS} (${num(b)}))² = ${dx * dx} + ${dy * dy} = ${r * r} ✔`],
  });
}

// ---------- LIVELLO 2 ----------

function daGenerale() {
  let a, b;
  do {
    a = randNZ(-5, 5);
    b = randNZ(-5, 5);
  } while (Math.abs(a) === Math.abs(b) && Math.random() < 0.5);
  const r = rand(1, 6);
  const al = -2 * a;
  const be = -2 * b;
  const ga = a * a + b * b - r * r;
  return makeQuestion({
    text: 'Individua centro e raggio della circonferenza:',
    formula: general(al, be, ga),
    correct: CR(a, b, r),
    wrong: [
      { text: CR(-a, -b, r), why: `Il centro è C(${MINUS}a/2; ${MINUS}b/2): devi cambiare il segno dei coefficienti di x e y. Qui C(${num(-al)}/2; ${num(-be)}/2) = ${P(a, b)}.` },
      { text: CR(-al, -be, r), why: 'Hai dimenticato di dividere per 2: C(−a/2; −b/2).' },
      { text: CR(a, b, r * r), why: `r = √(x_C² + y_C² − c) = √${r * r} = ${r}: hai dimenticato la radice.` },
      { text: ga > 0 && ga !== r * r ? CR(a, b, `√${ga}`) : CR(a, b, r + 1), why: `Il raggio è r = √(x_C² + y_C² ${MINUS} c) = √(${a * a} + ${b * b} ${MINUS} (${num(ga)})) = ${r}.` },
    ],
    solution: [`Coefficienti: a = ${num(al)}, b = ${num(be)}, c = ${num(ga)}`, `Centro C(−a/2; −b/2) = ${P(a, b)}`, `r = √(x_C² + y_C² − c) = √(${a * a} + ${b * b} ${MINUS} (${num(ga)})) = √${r * r} = ${r}`],
  });
}

function versoGenerale() {
  const [a, b] = center();
  const r = rand(1, 6);
  const al = -2 * a;
  const be = -2 * b;
  const ga = a * a + b * b - r * r;
  return makeQuestion({
    text: `Scrivi in forma normale (x² + y² + ax + by + c = 0) l'equazione della circonferenza con centro C${P(a, b)} e raggio ${r}.`,
    correct: general(al, be, ga),
    wrong: [
      { text: general(-al, -be, ga), why: `I coefficienti di x e y sono −2·x_C e −2·y_C: ${num(al)} e ${num(be)}.` },
      { text: general(al, be, a * a + b * b + r * r), why: `Il termine noto è c = x_C² + y_C² ${MINUS} r² = ${a * a + b * b} ${MINUS} ${r * r} = ${num(ga)}.` },
      { text: general(al / 2, be / 2, ga), why: 'Sviluppando (x − x_C)² si ottiene −2·x_C·x: hai dimenticato il 2 del doppio prodotto.' },
      { text: general(al, be, a * a + b * b - r), why: `Nel termine noto va sottratto r² = ${r * r}, non r.` },
    ],
    solution: [
      `Parto da ${canon(a, b, r * r)}`,
      'Sviluppo i quadrati: x² − 2·x_C·x + x_C² + y² − 2·y_C·y + y_C² − r² = 0',
      `a = −2·(${num(a)}) = ${num(al)};  b = −2·(${num(b)}) = ${num(be)};  c = ${a * a} + ${b * b} ${MINUS} ${r * r} = ${num(ga)}`,
      general(al, be, ga),
    ],
  });
}

function eCirconferenza() {
  const [a, b] = center();
  const r = rand(2, 5);
  const al = -2 * a;
  const be = -2 * b;
  const ga = a * a + b * b - r * r;
  const k = rand(1, 9);
  const al2 = randNZ(-6, 6);
  return makeQuestion({
    text: 'Quale delle seguenti equazioni rappresenta una circonferenza reale?',
    correct: general(al, be, ga),
    wrong: [
      { text: `${poly([[1, 'x²'], [2, 'y²'], [al2, 'x'], [-k, '']])} = 0`, why: 'Nell’equazione della circonferenza x² e y² devono avere lo STESSO coefficiente.' },
      { text: `${poly([[1, 'x²'], [1, 'y²'], [k, '']])} = 0`, why: `x² + y² = ${MINUS}${k}: una somma di quadrati non può essere negativa ⇒ r² < 0, non esiste nessun punto.` },
      { text: `${poly([[1, 'x²'], [-1, 'y²'], [al2, 'x'], [-k, '']])} = 0`, why: 'C’è un segno meno davanti a y²: non è una circonferenza (è un’iperbole).' },
      { text: `${poly([[1, 'x²'], [1, 'y²'], [1, 'xy'], [-k, '']])} = 0`, why: 'Nell’equazione della circonferenza non può comparire il termine xy.' },
    ],
    solution: ['Condizioni: x² e y² con lo stesso coefficiente, niente termine xy, e r² = x_C² + y_C² − c > 0', `Per ${general(al, be, ga)}: C${P(a, b)}, r² = ${a * a} + ${b * b} ${MINUS} (${num(ga)}) = ${r * r} > 0 ✔`],
  });
}

// ---------- LIVELLO 3 ----------

function graficoCirconferenza() {
  let a, b;
  do {
    a = rand(-3, 3);
    b = rand(-3, 3);
  } while (a === 0 && b === 0);
  const r = rand(2, 4);
  const R = Math.max(Math.abs(a), Math.abs(b)) + r + 1;
  return makeQuestion({
    text: 'Quale equazione corrisponde alla circonferenza disegnata?',
    visual: { type: 'plot', xmin: -R, xmax: R, ymin: -R, ymax: R, curves: [{ kind: 'circle', cx: a, cy: b, r }], points: [{ x: a, y: b, label: 'C' }] },
    correct: canon(a, b, r * r),
    wrong: [
      { text: canon(-a, -b, r * r), why: `Il centro nel grafico è ${P(a, b)}: nelle parentesi i segni sono opposti, (x ${MINUS} x_C) e (y ${MINUS} y_C).` },
      { text: canon(a, b, r), why: `Il raggio letto dal grafico è ${r}: a destra dell'uguale va r² = ${r * r}.` },
      { text: canon(b, a, r * r), why: 'Hai scambiato le coordinate del centro.' },
      { text: canon(a, b, (r + 1) ** 2), why: `Conta i quadretti: dal centro al bordo ci sono ${r} unità, quindi r = ${r}.` },
    ],
    solution: [`Dal grafico: centro C${P(a, b)}`, `Distanza dal centro al bordo (raggio): ${r}`, `Equazione: ${canon(a, b, r * r)}`],
  });
}

function diametro() {
  const a = rand(-4, 4);
  const b = rand(-4, 4);
  const [dx, dy, r] = pick([
    [3, 4, 5],
    [4, 3, 5],
    [0, 3, 3],
    [4, 0, 4],
    [0, 2, 2],
    [6, 8, 10],
  ]);
  const A = [a - dx, b - dy];
  const B = [a + dx, b + dy];
  return makeQuestion({
    text: `Il segmento di estremi A${P(...A)} e B${P(...B)} è un diametro di una circonferenza. Quali sono centro e raggio?`,
    correct: CR(a, b, r),
    wrong: [
      { text: CR(a, b, 2 * r), why: `${2 * r} è la lunghezza del DIAMETRO AB; il raggio è la metà: ${r}.` },
      { text: CR(B[0] - A[0], B[1] - A[1], r), why: 'Il centro è il punto medio: si sommano le coordinate e si divide per 2.' },
      { text: CR(a, b, r * r), why: `r = AB/2 = ${r}; ${r * r} sarebbe r².` },
      { text: CR(b, a, r), why: 'Hai scambiato le coordinate del centro.' },
    ],
    solution: [`Centro = punto medio di AB = ((${num(A[0])} + (${num(B[0])}))/2; (${num(A[1])} + (${num(B[1])}))/2) = ${P(a, b)}`, `AB = √(${2 * dx}² + ${2 * dy}²) = ${2 * r} ⇒ r = AB/2 = ${r}`],
  });
}

function posizioneRetta() {
  const [a, b] = center();
  const r = rand(2, 5);
  const kind = pick(['sec', 'tan', 'est']);
  const horiz = Math.random() < 0.5;
  const c0 = horiz ? b : a;
  const s = pick([1, -1]);
  const d = kind === 'sec' ? rand(0, r - 1) : kind === 'tan' ? r : rand(r + 1, r + 3);
  const k = c0 + s * d;
  const lineStr = `${horiz ? 'y' : 'x'} = ${num(k)}`;
  const opts = {
    sec: 'Secante (2 punti in comune)',
    tan: 'Tangente (1 punto in comune)',
    est: 'Esterna (nessun punto in comune)',
  };
  const dist = `La distanza del centro dalla retta è |${num(k)} ${MINUS} (${num(c0)})| = ${d}, il raggio è ${r}.`;
  const rule = { sec: 'Secante ⇔ distanza < raggio.', tan: 'Tangente ⇔ distanza = raggio.', est: 'Esterna ⇔ distanza > raggio.' };
  return makeQuestion({
    text: `Qual è la posizione della retta ${lineStr} rispetto alla circonferenza ${canon(a, b, r * r)}?`,
    correct: opts[kind],
    wrong: [
      ...Object.keys(opts)
        .filter((x) => x !== kind)
        .map((x) => ({ text: opts[x], why: `${dist} ${rule[x]}` })),
      { text: 'Non si può stabilire senza il grafico', why: 'Basta confrontare la distanza centro–retta con il raggio.' },
    ],
    solution: [`Centro C${P(a, b)}, raggio r = ${r}`, `La retta ${lineStr} è ${horiz ? 'orizzontale' : 'verticale'}: distanza dal centro = |${num(k)} ${MINUS} (${num(c0)})| = ${d}`, `${d} ${d < r ? '<' : d === r ? '=' : '>'} ${r} ⇒ ${opts[kind]}`],
  });
}

export default {
  id: 'circonferenza',
  title: 'La circonferenza',
  icon: '◯',
  color: '#db2777',
  description: 'Centro, raggio, equazione e posizione rispetto a una retta.',
  levels: [
    { id: 'cir1', title: 'Centro e raggio', description: 'Forma (x − a)² + (y − b)² = r²', pool: [centroRaggio, centroRaggio, equazioneDa, origine, appartiene] },
    { id: 'cir2', title: 'Forma normale', description: 'x² + y² + ax + by + c = 0', pool: [daGenerale, daGenerale, versoGenerale, eCirconferenza] },
    { id: 'cir3', title: 'Grafici e posizioni', description: 'Leggere il grafico, diametri, rette', pool: [graficoCirconferenza, graficoCirconferenza, diametro, posizioneRetta, posizioneRetta] },
  ],
};
