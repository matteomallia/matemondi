import { rand, randNZ, pick, num, poly, makeQuestion, MINUS, sort2, shuffle } from '../lib/utils.js';

const OPS = ['>', '<', '≥', '≤'];
const strict = (op) => op === '>' || op === '<';
const lt = (s) => (s ? '<' : '≤');
const gt = (s) => (s ? '>' : '≥');
const outside = (r1, r2, s) => `x ${lt(s)} ${num(r1)} oppure x ${gt(s)} ${num(r2)}`;
const inside = (r1, r2, s) => `${num(r1)} ${lt(s)} x ${lt(s)} ${num(r2)}`;
const ALL = 'Per ogni x reale';
const NONE = 'Nessuna soluzione reale';
const flip = { '>': '<', '<': '>', '≥': '≤', '≤': '≥' };
const isGreater = (op) => op === '>' || op === '≥';
const dis = (a, b, c, op) => `${poly([[a, 'x²'], [b, 'x'], [c, '']])} ${op} 0`;

// ---------- LIVELLO 1 ----------

function pura() {
  const k = rand(1, 7);
  const a = pick([1, 1, 2, 3]);
  const op = pick(OPS);
  const s = strict(op);
  const g = isGreater(op);
  const correct = g ? outside(-k, k, s) : inside(-k, k, s);
  return makeQuestion({
    text: 'Risolvi la disequazione:',
    formula: dis(a, 0, -a * k * k, op),
    correct,
    wrong: [
      { text: g ? inside(-k, k, s) : outside(-k, k, s), why: `Regione sbagliata. La parabola y = ${poly([[a, 'x²'], [-a * k * k, '']])} è rivolta verso l'alto: è positiva FUORI dalle radici e negativa DENTRO.` },
      { text: `x ${op} ${k}`, why: `Non è un'equazione di primo grado! Prova x = ${g ? MINUS + (k + 3) : MINUS + (k + 3)}: ${g ? `(${MINUS}${k + 3})² = ${(k + 3) ** 2} è maggiore di ${k * k}, quindi anche i numeri negativi “grandi” vanno bene.` : `(${MINUS}${k + 3})² = ${(k + 3) ** 2} NON è minore di ${k * k}, eppure ${MINUS}${k + 3} < ${k}.`}` },
      { text: g ? outside(-k, k, !s) : inside(-k, k, !s), why: `Attenzione al simbolo: con ${s ? '> o <' : '≥ o ≤'} gli estremi ${s ? 'NON sono inclusi (si usa < o >)' : 'SONO inclusi (si usa ≤ o ≥)'}.` },
      { text: ALL, why: `Prova x = 0: ottieni ${num(-a * k * k)} ${op} 0, che è falso.` },
    ],
    solution: [
      `Equazione associata: ${poly([[a, 'x²'], [-a * k * k, '']])} = 0 ⇒ x = ±${k}`,
      'a > 0: la parabola è rivolta verso l’alto',
      g ? `Cerco dove è ${op === '>' ? 'positiva' : 'positiva o nulla'}: valori esterni alle radici` : `Cerco dove è ${op === '<' ? 'negativa' : 'negativa o nulla'}: valori interni alle radici`,
      `Soluzione: ${correct}`,
    ],
  });
}

function sempreMai() {
  const k = rand(1, 9);
  const op = pick(OPS);
  const g = isGreater(op);
  const correct = g ? ALL : NONE;
  return makeQuestion({
    text: 'Risolvi la disequazione:',
    formula: dis(1, 0, k, op),
    correct,
    wrong: [
      { text: g ? NONE : ALL, why: `x² è sempre ≥ 0, quindi x² + ${k} è sempre ≥ ${k}: è SEMPRE positivo. ${g ? 'La disequazione è quindi sempre verificata.' : 'Non può mai essere negativo.'}` },
      { text: `x ${g ? '>' : '<'} ${MINUS}${k}`, why: `Non puoi trattarla come un'equazione di primo grado: x² ${g ? '>' : '<'} ${MINUS}${k} è ${g ? 'vera per ogni x' : 'sempre falsa'}, perché un quadrato non è mai negativo.` },
      { text: 'x ≠ 0', why: `Prova x = 0: 0 + ${k} = ${k} ${op} 0 è ${g ? 'VERO, quindi x = 0 è una soluzione' : 'falso, ma lo è anche per tutti gli altri x'}.` },
      { text: outside(-k, k, strict(op)), why: `Le radici ±${k} non esistono: x² + ${k} = 0 non ha soluzioni reali.` },
    ],
    solution: [
      `Equazione associata x² + ${k} = 0: Δ = ${MINUS}${4 * k} < 0, nessuna radice reale`,
      'La parabola è rivolta verso l’alto e non tocca l’asse x ⇒ è sempre positiva',
      `Quindi x² + ${k} ${op} 0 è ${g ? 'sempre vera' : 'sempre falsa'}: ${correct}`,
    ],
  });
}

function sostituzione() {
  let r1, r2;
  do {
    r1 = rand(-6, 5);
    r2 = rand(-5, 7);
  } while (r2 - r1 < 4);
  const b = -(r1 + r2);
  const c = r1 * r2;
  const f = (x) => x * x + b * x + c;
  const op = pick(['<', '>']);
  let good;
  let bad;
  if (op === '<') {
    good = rand(r1 + 1, r2 - 1);
    bad = shuffle([r1, r2, r1 - 1, r2 + 1, r1 - 2, r2 + 2]);
  } else {
    good = pick([r1 - rand(1, 2), r2 + rand(1, 2)]);
    const ins = [];
    for (let v = r1 + 1; v < r2; v++) ins.push(v);
    bad = shuffle([r1, r2, ...shuffle(ins).slice(0, 3)]);
  }
  const wrong = bad.map((v) => ({
    text: `x = ${num(v)}`,
    why: `Sostituendo x = ${num(v)}: (${num(v)})² ${b >= 0 ? '+' : MINUS} ${Math.abs(b)}·(${num(v)}) ${c >= 0 ? '+' : MINUS} ${Math.abs(c)} = ${num(f(v))}, e ${num(f(v))} ${op} 0 è FALSO.${f(v) === 0 ? ' Con il simbolo stretto gli estremi non sono soluzioni.' : ''}`,
  }));
  return makeQuestion({
    text: 'Quale dei seguenti valori di x soddisfa la disequazione?',
    formula: dis(1, b, c, op),
    correct: `x = ${num(good)}`,
    wrong,
    solution: [
      `Sostituisci x = ${num(good)}: ottieni ${num(f(good))}`,
      `${num(f(good))} ${op} 0 è vero ✔`,
      `In generale: radici x = ${num(r1)} e x = ${num(r2)}; ${op === '<' ? 'la parabola è negativa tra le radici' : 'la parabola è positiva fuori dalle radici'}.`,
    ],
  });
}

// ---------- LIVELLO 2 ----------

function rootsPair() {
  let r1, r2;
  do {
    r1 = randNZ(-7, 7);
    r2 = randNZ(-7, 7);
  } while (r1 === r2 || r1 === -r2);
  return sort2(r1, r2);
}

function completa() {
  const [r1, r2] = rootsPair();
  const b = -(r1 + r2);
  const c = r1 * r2;
  const op = pick(OPS);
  const s = strict(op);
  const g = isGreater(op);
  const correct = g ? outside(r1, r2, s) : inside(r1, r2, s);
  const [n1, n2] = sort2(-r1, -r2);
  const factored = Math.random() < 0.3;
  const D = b * b - 4 * c;
  return makeQuestion({
    text: 'Risolvi la disequazione:',
    formula: factored ? `(${poly([[1, 'x'], [-r1, '']])})·(${poly([[1, 'x'], [-r2, '']])}) ${op} 0` : dis(1, b, c, op),
    correct,
    wrong: [
      { text: g ? inside(r1, r2, s) : outside(r1, r2, s), why: `Regione sbagliata. Con a > 0 la parabola è rivolta verso l'alto: è POSITIVA all'esterno delle radici e NEGATIVA all'interno. Qui cerchi dove è ${g ? 'positiva' : 'negativa'}.` },
      { text: g ? outside(n1, n2, s) : inside(n1, n2, s), why: `Le radici hanno il segno sbagliato. Risolvi ${poly([[1, 'x²'], [b, 'x'], [c, '']])} = 0: trovi x = ${num(r1)} e x = ${num(r2)}.` },
      { text: g ? outside(r1, r2, !s) : inside(r1, r2, !s), why: `Il simbolo ${op} ${s ? 'NON include' : 'INCLUDE'} gli estremi: devi usare ${s ? '< e >' : '≤ e ≥'}.` },
      { text: g ? inside(n1, n2, s) : outside(n1, n2, s), why: 'Sia le radici che la regione sono sbagliate. Ricalcola le radici e ricorda: a > 0 ⇒ positiva fuori, negativa dentro.' },
    ],
    solution: [
      factored ? `Le radici si leggono dai fattori: x = ${num(r1)} e x = ${num(r2)}` : `Equazione associata: Δ = ${D}, radici x = ${num(r1)} e x = ${num(r2)}`,
      'a = 1 > 0 ⇒ parabola rivolta verso l’alto',
      g ? 'Cerco dove la parabola sta sopra l’asse x ⇒ valori esterni' : 'Cerco dove la parabola sta sotto l’asse x ⇒ valori interni',
      `Soluzione: ${correct}`,
    ],
    tip: 'Regola rapida (a > 0): segno > ⇒ “esterni”, segno < ⇒ “interni”.',
  });
}

function grafico() {
  const [r1, r2] = rootsPair();
  if (r2 - r1 < 2) throw new Error('radici troppo vicine per il grafico');
  const a = pick([1, -1]);
  const b = -a * (r1 + r2);
  const c = a * r1 * r2;
  const above = Math.random() < 0.5;
  const wantPos = above; // y > 0
  const pos = a > 0 ? outside(r1, r2, true) : inside(r1, r2, true);
  const neg = a > 0 ? inside(r1, r2, true) : outside(r1, r2, true);
  const correct = wantPos ? pos : neg;
  const xv = (r1 + r2) / 2;
  const yv = a * (xv - r1) * (xv - r2);
  const span = Math.max(r2 - r1 + 4, 8);
  const xmin = Math.floor(xv - span / 2);
  const xmax = Math.ceil(xv + span / 2);
  const ymid = yv / 2;
  const h = Math.max(Math.abs(yv) + 3, xmax - xmin);
  return makeQuestion({
    text: `Osserva il grafico della parabola y = ${poly([[a, 'x²'], [b, 'x'], [c, '']])}. Per quali valori di x si ha ${wantPos ? 'y > 0' : 'y < 0'}?`,
    visual: {
      type: 'plot',
      xmin,
      xmax,
      ymin: Math.floor(ymid - h / 2),
      ymax: Math.ceil(ymid + h / 2),
      curves: [{ kind: 'parabola', a, b, c }],
      points: [
        { x: r1, y: 0, label: num(r1) },
        { x: r2, y: 0, label: num(r2) },
      ],
    },
    correct,
    wrong: [
      { text: wantPos ? neg : pos, why: `Questi sono i valori in cui la parabola sta ${wantPos ? 'SOTTO' : 'SOPRA'} l'asse x, cioè dove y ${wantPos ? '<' : '>'} 0.` },
      { text: wantPos ? (a > 0 ? outside(r1, r2, false) : inside(r1, r2, false)) : a > 0 ? inside(r1, r2, false) : outside(r1, r2, false), why: `Nei punti x = ${num(r1)} e x = ${num(r2)} si ha y = 0, che non è ${wantPos ? '> 0' : '< 0'}: gli estremi vanno esclusi.` },
      { text: ALL, why: 'La parabola attraversa l’asse x: non sta sempre dalla stessa parte.' },
      { text: NONE, why: `La parabola ha dei tratti ${wantPos ? 'sopra' : 'sotto'} l’asse x, quindi le soluzioni esistono.` },
    ],
    solution: [
      `La parabola taglia l'asse x in x = ${num(r1)} e x = ${num(r2)}`,
      `È rivolta verso ${a > 0 ? "l'alto" : 'il basso'} (a ${a > 0 ? '> 0' : '< 0'})`,
      `${wantPos ? 'y > 0 dove il grafico sta sopra l’asse x' : 'y < 0 dove il grafico sta sotto l’asse x'}: ${correct}`,
    ],
  });
}

// ---------- LIVELLO 3 ----------

function deltaZero() {
  const r = randNZ(-6, 6);
  const op = pick(OPS);
  const res = { '>': `x ≠ ${num(r)}`, '≥': ALL, '<': NONE, '≤': `x = ${num(r)}` };
  const why = {
    '>': `Il quadrato (${poly([[1, 'x'], [-r, '']])})² è positivo per ogni x tranne x = ${num(r)}, dove vale 0.`,
    '≥': 'Un quadrato è sempre positivo o nullo: la disequazione ≥ 0 è sempre vera.',
    '<': 'Un quadrato non è mai negativo: la disequazione < 0 non ha soluzioni.',
    '≤': `Un quadrato non è mai negativo; può solo valere 0, e questo succede solo per x = ${num(r)}.`,
  };
  return makeQuestion({
    text: 'Risolvi la disequazione:',
    formula: dis(1, -2 * r, r * r, op),
    correct: res[op],
    wrong: OPS.filter((o) => o !== op).map((o) => ({ text: res[o], why: `${why[op]} Questa risposta sarebbe giusta per il simbolo ${o}.` })),
    solution: [
      `Δ = (${num(-2 * r)})² ${MINUS} 4·${r * r} = 0 ⇒ il trinomio è un quadrato perfetto`,
      `${poly([[1, 'x²'], [-2 * r, 'x'], [r * r, '']])} = (${poly([[1, 'x'], [-r, '']])})²`,
      why[op],
      `Soluzione: ${res[op]}`,
    ],
  });
}

function deltaNeg() {
  const b = rand(-6, 6);
  const c = rand(Math.floor((b * b) / 4) + 1, Math.floor((b * b) / 4) + 8);
  const op = pick(OPS);
  const g = isGreater(op);
  const D = b * b - 4 * c;
  return makeQuestion({
    text: 'Risolvi la disequazione:',
    formula: dis(1, b, c, op),
    correct: g ? ALL : NONE,
    wrong: [
      { text: g ? NONE : ALL, why: `Δ = ${num(D)} < 0 e a > 0: la parabola è tutta SOPRA l'asse x, quindi il trinomio è sempre positivo.` },
      { text: `x ${op} ${num(-c)}`, why: 'Non puoi “isolare la x” come in una disequazione di primo grado. Calcola Δ e ragiona sulla parabola.' },
      { text: 'x ≠ 0', why: `Prova x = 0: ${c} ${op} 0 è ${g ? 'vero' : 'falso'}. Il valore 0 non è un caso speciale.` },
      { text: 'Non si può risolvere perché Δ < 0', why: 'Si può risolvere eccome! Δ < 0 vuol dire che la parabola non tocca l’asse x, quindi ha sempre lo stesso segno (quello di a).' },
    ],
    solution: [
      `Δ = (${num(b)})² ${MINUS} 4·1·${c} = ${num(D)} < 0 ⇒ nessuna radice reale`,
      'a > 0 e nessuna intersezione con l’asse x ⇒ la parabola è sempre sopra l’asse x',
      `Il trinomio è sempre positivo ⇒ ${g ? ALL : NONE}`,
    ],
  });
}

function aNegativo() {
  const [r1, r2] = rootsPair();
  const b = r1 + r2;
  const c = -r1 * r2;
  const op = pick(OPS);
  const s = strict(op);
  // −(x−r1)(x−r2) op 0  ⇔  (x−r1)(x−r2) flip(op) 0
  const op2 = flip[op];
  const g2 = isGreater(op2);
  const correct = g2 ? outside(r1, r2, s) : inside(r1, r2, s);
  return makeQuestion({
    text: 'Risolvi la disequazione:',
    formula: dis(-1, b, c, op),
    correct,
    wrong: [
      { text: g2 ? inside(r1, r2, s) : outside(r1, r2, s), why: 'Moltiplicando per −1 per rendere positivo il coefficiente di x² devi INVERTIRE il verso della disequazione!' },
      { text: g2 ? outside(r1, r2, !s) : inside(r1, r2, !s), why: `Attenzione agli estremi: con ${op} ${s ? 'non sono inclusi' : 'sono inclusi'}.` },
      { text: ALL, why: 'Δ > 0: la parabola attraversa l’asse x, quindi il segno cambia.' },
      { text: NONE, why: 'Le soluzioni esistono: prova a sostituire un valore della regione corretta.' },
    ],
    solution: [
      `Moltiplico per ${MINUS}1 e INVERTO il verso: ${dis(1, -b, -c, op2)}`,
      `Radici: x = ${num(r1)} e x = ${num(r2)}`,
      `Ora a > 0: segno ${op2} ⇒ valori ${g2 ? 'esterni' : 'interni'}`,
      `Soluzione: ${correct}`,
    ],
    tip: 'In alternativa: con a < 0 la parabola è rivolta verso il basso, quindi è positiva DENTRO le radici.',
  });
}

function profitto() {
  let r1, r2;
  do {
    r1 = rand(1, 6);
    r2 = rand(4, 14);
  } while (r2 - r1 < 3);
  const b = r1 + r2;
  const c = -r1 * r2;
  return makeQuestion({
    text: `Il profitto di un'azienda (in migliaia di €) è P(x) = ${poly([[-1, 'x²'], [b, 'x'], [c, '']])}, dove x sono le centinaia di pezzi prodotti. Per quali valori di x il profitto è positivo?`,
    correct: inside(r1, r2, true),
    wrong: [
      { text: outside(r1, r2, true), why: 'Il coefficiente di x² è negativo: la parabola è rivolta verso il basso, quindi è positiva TRA le radici.' },
      { text: `x > ${r1}`, why: `Se produci troppo il profitto torna negativo: prova x = ${r2 + 2}, ottieni P = ${num(-((r2 + 2) ** 2) + b * (r2 + 2) + c)}.` },
      { text: inside(r1, r2, false), why: `Per x = ${r1} e x = ${r2} il profitto è 0, non positivo: gli estremi vanno esclusi.` },
    ],
    solution: [
      `Pongo P(x) > 0: ${dis(-1, b, c, '>')}`,
      `Moltiplico per ${MINUS}1 e inverto: ${dis(1, -b, -c, '<')}`,
      `Radici: x = ${r1} e x = ${r2}; segno < ⇒ valori interni`,
      `Profitto positivo per ${inside(r1, r2, true)}`,
    ],
  });
}

export default {
  id: 'disequazioni',
  title: 'Disequazioni di 2° grado',
  icon: 'x² > 0',
  color: '#0891b2',
  description: 'Studio del segno con la parabola: interni ed esterni.',
  levels: [
    { id: 'dis1', title: 'Primi passi', description: 'Disequazioni pure e verifica con sostituzione', pool: [pura, pura, sempreMai, sostituzione, sostituzione] },
    { id: 'dis2', title: 'Interni o esterni?', description: 'Disequazioni complete e lettura del grafico', pool: [completa, completa, completa, grafico, grafico] },
    { id: 'dis3', title: 'Casi speciali', description: 'Δ = 0, Δ < 0, a negativo e problemi', pool: [deltaZero, deltaNeg, aNegativo, aNegativo, profitto] },
  ],
};
