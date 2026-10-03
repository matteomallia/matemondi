import { rand, randNZ, pick, num, frac, poly, makeQuestion, MINUS, pt, shuffle, TRIPLES } from '../lib/utils.js';

const line = (m, q) => `y = ${poly([[m, 'x'], [q, '']])}`;
const P = (x, y) => pt(num(x), num(y));

// ---------- LIVELLO 1 ----------

function mq() {
  let m, q;
  do {
    m = randNZ(-6, 6);
    q = randNZ(-9, 9);
  } while (Math.abs(m) === Math.abs(q));
  const swapped = Math.random() < 0.35;
  const eqStr = swapped ? `y = ${poly([[q, ''], [m, 'x']])}` : line(m, q);
  const askM = Math.random() < 0.5;
  if (askM) {
    return makeQuestion({
      text: 'Qual è il coefficiente angolare della retta?',
      formula: eqStr,
      correct: `m = ${num(m)}`,
      wrong: [
        { text: `m = ${num(q)}`, why: `${num(q)} è il termine noto q: indica dove la retta taglia l'asse y. Il coefficiente angolare è il numero che moltiplica x.` },
        { text: `m = ${num(-m)}`, why: 'Il segno fa parte del coefficiente angolare: va preso così com’è davanti alla x.' },
        { text: `m = ${num(-q)}`, why: 'Il coefficiente angolare è il numero che moltiplica la x, non il termine noto.' },
      ],
      solution: ['Nella forma y = mx + q, m è il numero che moltiplica x', `Qui il numero davanti a x è ${num(m)} ⇒ m = ${num(m)}`],
    });
  }
  return makeQuestion({
    text: "In quale punto la retta taglia l'asse y (ordinata all'origine)?",
    formula: eqStr,
    correct: P(0, q),
    wrong: [
      { text: P(q, 0), why: 'Hai scambiato le coordinate: sull’asse y la x vale 0, quindi il punto è (0; q).' },
      { text: P(0, m), why: `${num(m)} è il coefficiente angolare (pendenza), non l'intercetta.` },
      { text: P(0, -q), why: 'Attenzione al segno del termine noto.' },
    ],
    solution: ["Sull'asse y si ha x = 0", `Sostituisco: y = ${num(m)}·0 ${q >= 0 ? '+' : MINUS} ${Math.abs(q)} = ${num(q)}`, `Il punto è ${P(0, q)}`],
  });
}

function paralleleAssi() {
  const k = randNZ(-6, 6);
  const askX = Math.random() < 0.5;
  // forme diverse: "y = k" oppure "y + c = 0" oppure "2y − c = 0"
  const form = pick([0, 1, 2]);
  const horiz = form === 0 ? `y = ${num(k)}` : form === 1 ? `${poly([[1, 'y'], [-k, '']])} = 0` : `${poly([[2, 'y'], [-2 * k, '']])} = 0`;
  const vert = form === 0 ? `x = ${num(k)}` : form === 1 ? `${poly([[1, 'x'], [-k, '']])} = 0` : `${poly([[2, 'x'], [-2 * k, '']])} = 0`;
  const m = randNZ(-3, 3);
  const obl = `${poly([[m, 'x'], [-1, 'y'], [k, '']])} = 0`;
  const bis = pick(['x + y = 0', `x ${MINUS} y = 0`]);
  if (askX) {
    return makeQuestion({
      text: "Quale delle seguenti equazioni è di una retta parallela all'asse delle ascisse (asse x)?",
      correct: horiz,
      wrong: [
        { text: vert, why: 'Questa retta contiene solo la x: è del tipo x = numero, cioè una retta VERTICALE, parallela all’asse y.' },
        { text: obl, why: 'Contiene sia x che y: è una retta obliqua (inclinata).' },
        { text: bis, why: 'Questa è una bisettrice dei quadranti: passa per l’origine ed è inclinata di 45°.' },
      ],
      solution: ["Una retta parallela all'asse x è orizzontale: y = numero (manca la x)", `${horiz} ⇒ y = ${num(k)} ✔`],
    });
  }
  return makeQuestion({
    text: "Quale delle seguenti equazioni è di una retta parallela all'asse delle ordinate (asse y)?",
    correct: vert,
    wrong: [
      { text: horiz, why: 'Questa contiene solo la y: è del tipo y = numero, cioè una retta ORIZZONTALE, parallela all’asse x.' },
      { text: obl, why: 'Contiene sia x che y: è una retta obliqua (inclinata).' },
      { text: bis, why: 'Questa è una bisettrice dei quadranti: passa per l’origine ed è inclinata di 45°.' },
    ],
    solution: ["Una retta parallela all'asse y è verticale: x = numero (manca la y)", `${vert} ⇒ x = ${num(k)} ✔`],
  });
}

function appartiene() {
  const m = randNZ(-4, 4);
  const q = rand(-6, 6);
  const x0 = randNZ(-4, 4);
  if (m * x0 + q === x0) throw new Error('retry');
  const y0 = m * x0 + q;
  const f = (x) => m * x + q;
  const cands = [
    [y0, x0],
    [x0, y0 + pick([1, -1, 2])],
    [-x0, y0],
    [x0, -y0],
  ];
  return makeQuestion({
    text: `Quale dei seguenti punti appartiene alla retta ${line(m, q)}?`,
    correct: P(x0, y0),
    wrong: cands.filter(([x, y]) => f(x) !== y).map(([x, y]) => ({
      text: P(x, y),
      why: `Sostituisci x = ${num(x)}: y = ${num(m)}·(${num(x)}) ${q >= 0 ? '+' : MINUS} ${Math.abs(q)} = ${num(f(x))}, non ${num(y)}.${x === y0 && y === x0 ? ' Forse hai scambiato x e y: il punto si scrive (x; y).' : ''}`,
    })),
    solution: [`Un punto appartiene alla retta se le sue coordinate verificano l'equazione`, `x = ${num(x0)} ⇒ y = ${num(m)}·(${num(x0)}) ${q >= 0 ? '+' : MINUS} ${Math.abs(q)} = ${num(y0)}`, `Il punto ${P(x0, y0)} appartiene alla retta ✔`],
  });
}

function affermazioni() {
  const m = randNZ(-5, 5);
  const q = randNZ(-6, 6);
  const correct = m > 0 ? 'Il suo coefficiente angolare è positivo' : 'Il suo coefficiente angolare è negativo';
  return makeQuestion({
    text: `Data la funzione ${line(m, q)}, individua l'affermazione corretta.`,
    correct,
    wrong: [
      { text: "È una retta parallela all'asse x", why: `Una retta parallela all'asse x ha m = 0 (y = numero). Qui m = ${num(m)}.` },
      { text: "Passa per l'origine degli assi", why: `Per x = 0 si ottiene y = ${num(q)} ≠ 0: non passa per l'origine.` },
      { text: `Taglia l'asse y nel punto ${P(0, -q)}`, why: `Per x = 0 si ha y = q = ${num(q)}: il punto è ${P(0, q)}.` },
      { text: m > 0 ? 'Il suo coefficiente angolare è negativo' : 'Il suo coefficiente angolare è positivo', why: `Il coefficiente angolare è m = ${num(m)}, che è ${m > 0 ? 'positivo' : 'negativo'}.` },
    ],
    solution: [`m = ${num(m)}, q = ${num(q)}`, `m ${m > 0 ? '> 0 ⇒ la retta “sale” da sinistra a destra' : '< 0 ⇒ la retta “scende” da sinistra a destra'}`],
  });
}

// ---------- LIVELLO 2 ----------

function duePuntiPts() {
  const m = randNZ(-4, 4);
  const x1 = rand(-5, 3);
  const dx = pick([1, 2, 3]);
  const y1 = rand(-5, 5);
  const x2 = x1 + dx;
  const y2 = y1 + m * dx;
  const q = y1 - m * x1;
  return { m, x1, y1, x2, y2, q, dx, dy: m * dx };
}

function coeffDuePunti() {
  const { m, x1, y1, x2, y2, dx, dy } = duePuntiPts();
  return makeQuestion({
    text: `Calcola il coefficiente angolare della retta passante per A${P(x1, y1)} e B${P(x2, y2)}.`,
    correct: `m = ${num(m)}`,
    wrong: [
      { text: `m = ${frac(dx, dy)}`, why: 'Hai capovolto la formula: m = (y₂ − y₁)/(x₂ − x₁), cioè variazione di y diviso variazione di x.' },
      { text: `m = ${num(-m)}`, why: 'Errore di segno: fai attenzione a sottrarre nello stesso ordine sopra e sotto.' },
      { text: x1 + x2 !== 0 ? `m = ${frac(y1 + y2, x1 + x2)}` : `m = ${num(y1 + y2)}`, why: 'Nella formula si fanno le DIFFERENZE delle coordinate, non le somme.' },
      { text: `m = ${num(dy)}`, why: `Hai calcolato solo y₂ − y₁ = ${num(dy)}: devi dividere per x₂ − x₁ = ${dx}.` },
    ],
    solution: ['m = (y₂ − y₁) / (x₂ − x₁)', `m = (${num(y2)} ${MINUS} (${num(y1)})) / (${num(x2)} ${MINUS} (${num(x1)})) = ${num(dy)} / ${dx} = ${num(m)}`],
  });
}

function duePunti() {
  const { m, x1, y1, x2, y2, dx, dy, q } = duePuntiPts();
  const mInv = [dx, dy];
  return makeQuestion({
    text: `Qual è l'equazione della retta passante per A${P(x1, y1)} e B${P(x2, y2)}?`,
    correct: line(m, q),
    wrong: [
      { text: line(m, -q), why: `Il coefficiente angolare è giusto, ma q è sbagliato. Sostituisci A: ${num(y1)} = ${num(m)}·(${num(x1)}) + q ⇒ q = ${num(q)}.` },
      { text: line(-m, y1 + m * x1), why: `Coefficiente angolare sbagliato: m = (${num(y2)} ${MINUS} (${num(y1)})) / (${num(x2)} ${MINUS} (${num(x1)})) = ${num(m)}.` },
      { text: `y = ${poly([[mInv, 'x'], [q, '']])}`, why: 'Hai capovolto la formula del coefficiente angolare: m = Δy / Δx.' },
      { text: line(m, y1), why: `q non è l'ordinata di A: q è il valore di y quando x = 0. Calcolalo sostituendo A nell'equazione.` },
    ],
    solution: [
      `m = (y₂ − y₁)/(x₂ − x₁) = ${num(dy)}/${dx} = ${num(m)}`,
      `y ${MINUS} y₁ = m(x ${MINUS} x₁) ⇒ y ${MINUS} (${num(y1)}) = ${num(m)}(x ${MINUS} (${num(x1)}))`,
      `Semplificando: ${line(m, q)}`,
      `Verifica con B: ${num(m)}·(${num(x2)}) ${q >= 0 ? '+' : MINUS} ${Math.abs(q)} = ${num(y2)} ✔`,
    ],
  });
}

function parallela() {
  const m = randNZ(-4, 4);
  const q = rand(-6, 6);
  const x0 = randNZ(-4, 4);
  const y0 = rand(-6, 6);
  const q2 = y0 - m * x0;
  if (q2 === q) throw new Error('P sulla retta');
  return makeQuestion({
    text: `Qual è la retta parallela a ${line(m, q)} passante per P${P(x0, y0)}?`,
    correct: line(m, q2),
    wrong: [
      { text: `y = ${poly([[[-1, m], 'x'], [y0 + x0 / m === Math.round(y0 + x0 / m) ? y0 + x0 / m : q2, '']])}`, why: 'Il coefficiente −1/m si usa per le rette PERPENDICOLARI. Le parallele hanno lo stesso m.' },
      { text: line(m, q), why: `Questa è la retta di partenza: non passa per P (sostituisci x = ${num(x0)}: ottieni y = ${num(m * x0 + q)}, non ${num(y0)}).` },
      { text: line(m, y0 + m * x0), why: `Errore di segno nel calcolo di q: q = y₀ ${MINUS} m·x₀ = ${num(y0)} ${MINUS} (${num(m * x0)}) = ${num(q2)}.` },
      { text: line(-m, q2), why: 'Rette parallele hanno lo STESSO coefficiente angolare, segno compreso.' },
    ],
    solution: [`Rette parallele ⇒ stesso coefficiente angolare: m = ${num(m)}`, `Passaggio per P: ${num(y0)} = ${num(m)}·(${num(x0)}) + q ⇒ q = ${num(q2)}`, `Retta cercata: ${line(m, q2)}`],
  });
}

function perpendicolare() {
  const m = pick([-4, -3, -2, 2, 3, 4]);
  const k = randNZ(-2, 2);
  const x0 = m * k; // multiplo di m => q intero
  const y0 = rand(-5, 5);
  const q2 = y0 + x0 / m;
  const q = rand(-5, 5);
  const mp = [-1, m];
  return makeQuestion({
    text: `Qual è la retta perpendicolare a ${line(m, q)} passante per P${P(x0, y0)}?`,
    correct: `y = ${poly([[mp, 'x'], [q2, '']])}`,
    wrong: [
      { text: `y = ${poly([[m, 'x'], [q2, '']])}`, why: 'Stesso coefficiente angolare ⇒ rette PARALLELE, non perpendicolari.' },
      { text: `y = ${poly([[[1, m], 'x'], [q2, '']])}`, why: `Hai fatto l'inverso ma dimenticato di cambiare il segno: m⊥ = −1/m = ${frac(-1, m)}.` },
      { text: `y = ${poly([[-m, 'x'], [q2, '']])}`, why: `Hai cambiato il segno ma dimenticato di fare l'inverso: m⊥ = −1/m = ${frac(-1, m)}.` },
    ],
    solution: [`Perpendicolare ⇒ m⊥ = −1/m = ${MINUS}1/${num(m)} = ${frac(-1, m)}`, `Passaggio per P: ${num(y0)} = ${frac(-1, m)}·(${num(x0)}) + q ⇒ q = ${num(q2)}`, `Retta: y = ${poly([[mp, 'x'], [q2, '']])}`],
  });
}

function implicita() {
  let a, b, c;
  do {
    a = randNZ(-6, 6);
    b = randNZ(-4, 4);
    c = rand(-8, 8);
  } while (Math.abs(a) === Math.abs(b));
  const eqs = `${poly([[a, 'x'], [b, 'y'], [c, '']])} = 0`;
  return makeQuestion({
    text: 'Qual è il coefficiente angolare della retta?',
    formula: eqs,
    correct: `m = ${frac(-a, b)}`,
    wrong: [
      { text: `m = ${frac(a, b)}`, why: `Errore di segno: portando ${poly([[a, 'x']])} dall'altra parte cambia segno. m = −a/b.` },
      { text: `m = ${frac(-b, a)}`, why: 'Hai capovolto la frazione: m = −a/b (coefficiente di x fratto coefficiente di y, col meno).' },
      { text: `m = ${num(a)}`, why: `Prima devi isolare y: ${b === 1 ? '' : num(b)}y = ${poly([[-a, 'x'], [-c, '']])}, poi dividere per ${num(b)}.` },
    ],
    solution: [
      `Isolo y: ${b === 1 ? 'y' : b === -1 ? MINUS + 'y' : num(b) + 'y'} = ${poly([[-a, 'x'], [-c, '']])}`,
      `Divido per ${num(b)}: y = ${poly([[[-a, b], 'x'], [[-c, b], '']])}`,
      `m = ${frac(-a, b)}  (formula rapida: m = −a/b)`,
    ],
  });
}

function intersezioneAssi() {
  const m = randNZ(-4, 4);
  const k = randNZ(-4, 4);
  const q = -m * k; // radice x = k
  if (q === 0) throw new Error('retry');
  return makeQuestion({
    text: `In quale punto la retta ${line(m, q)} interseca l'asse x?`,
    correct: P(k, 0),
    wrong: [
      { text: P(0, q), why: "Questo è il punto d'intersezione con l'asse y (x = 0)." },
      { text: P(-k, 0), why: `Errore di segno: ${num(m)}x ${q >= 0 ? '+' : MINUS} ${Math.abs(q)} = 0 ⇒ x = ${num(k)}.` },
      { text: P(0, k), why: 'Le coordinate sono scambiate: sull’asse x è la y a valere 0.' },
    ],
    solution: ["Sull'asse x si ha y = 0", `${poly([[m, 'x'], [q, '']])} = 0 ⇒ x = ${frac(-q, m)}`, `Il punto è ${P(k, 0)}`],
  });
}

// ---------- LIVELLO 3 ----------

function graficoRetta() {
  const m = pick([-3, -2, -1, 1, 2, 3]);
  let q;
  do q = randNZ(-4, 4);
  while (Math.abs(q) === Math.abs(m));
  return makeQuestion({
    text: "Quale equazione corrisponde alla retta disegnata nel grafico?",
    visual: { type: 'plot', xmin: -6, xmax: 6, ymin: -6, ymax: 6, curves: [{ kind: 'line', m, q }] },
    correct: line(m, q),
    wrong: [
      { text: line(-m, q), why: `Guarda la pendenza: la retta ${m > 0 ? 'SALE' : 'SCENDE'} da sinistra a destra, quindi m è ${m > 0 ? 'positivo' : 'negativo'}.` },
      { text: line(m, -q), why: `Guarda dove taglia l'asse y: nel punto (0; ${num(q)}), quindi q = ${num(q)}.` },
      { text: line(q, m), why: 'Hai scambiato m e q: q si legge sull’asse y, m è di quanto sale/scende la retta per ogni passo a destra.' },
      { text: line(-m, -q), why: 'Sia la pendenza che l’intercetta hanno il segno sbagliato.' },
    ],
    solution: [`La retta taglia l'asse y in (0; ${num(q)}) ⇒ q = ${num(q)}`, `Spostandoti di 1 a destra, la retta ${m > 0 ? 'sale' : 'scende'} di ${Math.abs(m)} ⇒ m = ${num(m)}`, `Equazione: ${line(m, q)}`],
  });
}

function intersezioneRette() {
  const x0 = rand(-4, 4);
  const y0 = rand(-5, 5);
  if (x0 === y0) throw new Error('retry');
  let m1, m2;
  do {
    m1 = randNZ(-3, 3);
    m2 = randNZ(-3, 3);
  } while (m1 === m2);
  const q1 = y0 - m1 * x0;
  const q2 = y0 - m2 * x0;
  const check = (x, y) =>
    m1 * x + q1 === m2 * x + q2
      ? `Per x = ${num(x)} entrambe le rette danno y = ${num(m1 * x + q1)}, non ${num(y)}.`
      : `Sostituendo x = ${num(x)}: nella prima retta y = ${num(m1 * x + q1)}, nella seconda y = ${num(m2 * x + q2)}. Il punto deve verificare ENTRAMBE le equazioni.`;
  const cands = [
    [y0, x0],
    [-x0, y0],
    [x0, -y0],
    [x0 + 1, m1 * (x0 + 1) + q1],
  ];
  return makeQuestion({
    text: `Trova il punto d'intersezione tra le rette r: ${line(m1, q1)} e s: ${line(m2, q2)}.`,
    correct: P(x0, y0),
    wrong: cands.map(([x, y]) => ({ text: P(x, y), why: check(x, y) })),
    solution: [
      'Metto a sistema le due equazioni (metodo del confronto):',
      `${poly([[m1, 'x'], [q1, '']])} = ${poly([[m2, 'x'], [q2, '']])}`,
      `${poly([[m1 - m2, 'x']])} = ${num(q2 - q1)} ⇒ x = ${num(x0)}`,
      `y = ${num(m1)}·(${num(x0)}) ${q1 >= 0 ? '+' : MINUS} ${Math.abs(q1)} = ${num(y0)}`,
      `Punto d'intersezione: ${P(x0, y0)}`,
    ],
  });
}

function areaTrapezio() {
  const b = rand(4, 8);
  const d = rand(1, b - 2);
  const h = rand(3, 6);
  const top = b - d;
  const area = ((b + top) * h) / 2;
  return makeQuestion({
    text: `Sul piano cartesiano è disegnato il quadrilatero di vertici A(0; 0), B(${b}; 0), C(${b}; ${h}) e D(${d}; ${h}). Considerando ogni unità pari a 1 cm, quanto misura la sua area?`,
    visual: {
      type: 'plot',
      xmin: -1,
      xmax: Math.max(b, h) + 2,
      ymin: -1,
      ymax: Math.max(b, h) + 2,
      polygon: [
        [0, 0],
        [b, 0],
        [b, h],
        [d, h],
      ],
      points: [
        { x: 0, y: 0, label: 'A' },
        { x: b, y: 0, label: 'B' },
        { x: b, y: h, label: 'C' },
        { x: d, y: h, label: 'D' },
      ],
    },
    correct: `${num(area)} cm²`,
    wrong: [
      { text: `${num(b * h)} cm²`, why: `Non è un rettangolo: il lato in alto DC misura ${top} cm, non ${b} cm. È un trapezio rettangolo.` },
      { text: `${num((b + top) * h)} cm²`, why: 'Nella formula del trapezio bisogna dividere per 2: A = (B + b)·h / 2.' },
      { text: `${num((b * h) / 2)} cm²`, why: 'Questa è l’area di un triangolo con base AB, non del quadrilatero.' },
      { text: `${num(top * h)} cm²`, why: 'Hai usato solo la base minore: per il trapezio serve (B + b)·h / 2.' },
    ],
    solution: [`Base maggiore AB = ${b} cm, base minore DC = ${b} ${MINUS} ${d} = ${top} cm, altezza BC = ${h} cm`, `Area trapezio = (B + b)·h / 2 = (${b} + ${top})·${h} / 2 = ${num(area)} cm²`],
  });
}

function distanza() {
  const [dx, dy, d] = pick(TRIPLES);
  const x1 = rand(-4, 3);
  const y1 = rand(-4, 3);
  const sx = pick([1, -1]);
  const sy = pick([1, -1]);
  const x2 = x1 + sx * dx;
  const y2 = y1 + sy * dy;
  return makeQuestion({
    text: `Calcola la distanza tra i punti A${P(x1, y1)} e B${P(x2, y2)}.`,
    correct: `${d}`,
    wrong: [
      { text: `${dx + dy}`, why: 'Non si sommano le differenze: la distanza è l’ipotenusa di un triangolo rettangolo, serve il teorema di Pitagora.' },
      { text: `${d * d}`, why: `Hai dimenticato la radice quadrata: √${d * d} = ${d}.` },
      { text: `${Math.abs(dx - dy)}`, why: 'La distanza si calcola con Pitagora: √(Δx² + Δy²).' },
      { text: `${d + 1}`, why: `Ricontrolla i calcoli: √(${dx}² + ${dy}²) = √${d * d} = ${d}.` },
    ],
    solution: [`Δx = |${num(x2)} ${MINUS} (${num(x1)})| = ${dx};  Δy = |${num(y2)} ${MINUS} (${num(y1)})| = ${dy}`, `d = √(Δx² + Δy²) = √(${dx * dx} + ${dy * dy}) = √${d * d} = ${d}`],
  });
}

function puntoMedio() {
  const x1 = rand(-6, 6);
  const y1 = rand(-6, 6);
  const x2 = x1 + 2 * randNZ(-4, 4);
  const y2 = y1 + 2 * randNZ(-4, 4);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return makeQuestion({
    text: `Trova il punto medio M del segmento di estremi A${P(x1, y1)} e B${P(x2, y2)}.`,
    correct: P(mx, my),
    wrong: [
      { text: P(x1 + x2, y1 + y2), why: 'Devi dividere per 2: M = ((x₁ + x₂)/2; (y₁ + y₂)/2).' },
      { text: P((x2 - x1) / 2, (y2 - y1) / 2), why: 'Per il punto medio si fa la SOMMA delle coordinate, non la differenza.' },
      { text: P(my, mx), why: 'Hai scambiato x e y.' },
    ],
    solution: [`x_M = (${num(x1)} + (${num(x2)}))/2 = ${num(mx)}`, `y_M = (${num(y1)} + (${num(y2)}))/2 = ${num(my)}`, `M${P(mx, my)}`],
  });
}

export default {
  id: 'retta',
  title: 'La retta',
  icon: 'y=mx+q',
  color: '#16a34a',
  description: 'Coefficiente angolare, rette parallele e perpendicolari, grafici.',
  levels: [
    { id: 'ret1', title: 'Leggere l’equazione', description: 'm, q, rette parallele agli assi, punti', pool: [mq, mq, paralleleAssi, appartiene, affermazioni] },
    { id: 'ret2', title: 'Costruire rette', description: 'Due punti, parallele, perpendicolari', pool: [coeffDuePunti, duePunti, parallela, perpendicolare, implicita, intersezioneAssi] },
    { id: 'ret3', title: 'Piano cartesiano', description: 'Grafici, intersezioni, aree e distanze', pool: [graficoRetta, graficoRetta, intersezioneRette, areaTrapezio, distanza, puntoMedio] },
  ],
};
