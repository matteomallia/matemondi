import { rand, randNZ, pick, num, frac, poly, makeQuestion, MINUS, pt, sort2 } from '../lib/utils.js';

const P = (x, y) => pt(num(x), num(y));
const den = (a) => (a < 0 ? `(${num(2 * a)})` : `${2 * a}`);
const par = (a, b, c) => `y = ${poly([[a, 'x²'], [b, 'x'], [c, '']])}`;

// ---------- LIVELLO 1 ----------

function concavita() {
  const a = randNZ(-5, 5);
  const up = a > 0;
  const b = up ? -rand(1, 6) : rand(1, 6);
  const c = up ? -rand(1, 9) : rand(1, 9);
  const dir = (u) => (u ? "verso l'alto" : 'verso il basso');
  return makeQuestion({
    text: `Considera la parabola ${par(a, b, c)}. Com'è rivolta la sua concavità?`,
    correct: `${up ? "Verso l'alto" : 'Verso il basso'}, perché a ${up ? '>' : '<'} 0`,
    wrong: [
      { text: `${up ? 'Verso il basso' : "Verso l'alto"}, perché a ${up ? '<' : '>'} 0`, why: `Il coefficiente di x² è a = ${num(a)}, che è ${up ? 'positivo' : 'negativo'}.` },
      { text: `${up ? 'Verso il basso' : "Verso l'alto"}, perché c ${up ? '<' : '>'} 0`, why: 'La concavità dipende SOLO dal segno di a (coefficiente di x²). Il termine noto c dice dove la parabola taglia l’asse y.' },
      { text: `${up ? 'Verso il basso' : "Verso l'alto"}, perché b ${up ? '<' : '>'} 0`, why: 'La concavità dipende SOLO dal segno di a (coefficiente di x²), non da b.' },
    ],
    solution: ['La concavità dipende dal segno di a (coefficiente di x²)', `a = ${num(a)} ${up ? '> 0' : '< 0'} ⇒ concavità ${dir(up)}`],
  });
}

function asseY() {
  const a = randNZ(-4, 4);
  const b = rand(-6, 6);
  let c;
  do c = randNZ(-9, 9);
  while (Math.abs(c) === Math.abs(a));
  return makeQuestion({
    text: `In quale punto la parabola ${par(a, b, c)} interseca l'asse y?`,
    correct: P(0, c),
    wrong: [
      { text: P(c, 0), why: "Sull'asse y è la x a valere 0, quindi il punto è (0; c)." },
      { text: P(0, a), why: `a = ${num(a)} è il coefficiente di x²: dice com'è rivolta la parabola, non dove taglia l'asse y.` },
      { text: P(0, -c), why: `Sostituendo x = 0 si ottiene y = c = ${num(c)}, con il suo segno.` },
    ],
    solution: ["Sull'asse y: x = 0", `y = ${num(a)}·0² + ${num(b)}·0 + (${num(c)}) = ${num(c)}`, `Punto: ${P(0, c)}`],
  });
}

function affermazioni() {
  const a = randNZ(-3, 3);
  const kind = pick(['due', 'nessuna', 'una']);
  let c;
  if (kind === 'una') c = 0;
  else if (kind === 'due') c = a > 0 ? -rand(1, 9) : rand(1, 9);
  else c = a > 0 ? rand(1, 9) : -rand(1, 9);
  const S = {
    due: "La parabola ha due intersezioni con l'asse x",
    una: "La parabola interseca l'asse x in un solo punto",
    nessuna: "La parabola non interseca l'asse x",
  };
  const conc = a > 0 ? 'La parabola è rivolta verso il basso' : "La parabola è rivolta verso l'alto";
  const eq0 = `${poly([[a, 'x²'], [c, '']])} = 0`;
  const why0 = c === 0 ? `${eq0} ha l'unica soluzione x = 0 (vertice nell'origine).` : -c / a > 0 ? `${eq0} ⇒ x² = ${frac(-c, a)} > 0: due soluzioni.` : `${eq0} ⇒ x² = ${frac(-c, a)} < 0: nessuna soluzione.`;
  return makeQuestion({
    text: `Considera la parabola ${par(a, 0, c)}. Scegli l'affermazione corretta.`,
    correct: S[kind],
    wrong: [
      ...Object.keys(S)
        .filter((k) => k !== kind)
        .map((k) => ({ text: S[k], why: `Cerca le intersezioni con l'asse x ponendo y = 0: ${why0}` })),
      { text: conc, why: `a = ${num(a)} ${a > 0 ? '> 0 ⇒ rivolta verso l’alto' : '< 0 ⇒ rivolta verso il basso'}.` },
    ],
    solution: [`Intersezioni con l'asse x: y = 0 ⇒ ${eq0}`, why0, `Vertice: V(0; ${num(c)}); concavità ${a > 0 ? "verso l'alto" : 'verso il basso'}`],
  });
}

// ---------- LIVELLO 2 ----------

function vertexData() {
  const a = pick([-2, -1, 1, 2]);
  const xv = randNZ(-4, 4);
  const yv = rand(-6, 6);
  const b = -2 * a * xv;
  const c = a * xv * xv + yv;
  return { a, b, c, xv, yv, f: (x) => a * x * x + b * x + c };
}

function vertice() {
  const { a, b, c, xv, yv, f } = vertexData();
  return makeQuestion({
    text: 'Determina le coordinate del vertice della parabola:',
    formula: par(a, b, c),
    correct: `V${P(xv, yv)}`,
    wrong: [
      { text: `V${P(-xv, f(-xv))}`, why: `x_V = ${MINUS}b/(2a): con b = ${num(b)} il numeratore è ${num(-b)}. Attenzione al segno!` },
      { text: `V${P(xv, c)}`, why: `y_V non è c: si trova sostituendo x_V nell'equazione: y = ${num(yv)}.` },
      { text: `V${P(2 * xv, f(2 * xv))}`, why: `Hai dimenticato il 2 al denominatore: x_V = ${MINUS}b/(2a) = ${num(-b)}/${den(a)} = ${num(xv)}.` },
      { text: `V${P(yv, xv)}`, why: 'Hai scambiato le coordinate.' },
    ],
    solution: [`a = ${num(a)}, b = ${num(b)}, c = ${num(c)}`, `x_V = ${MINUS}b/(2a) = ${num(-b)}/${den(a)} = ${num(xv)}`, `y_V = ${num(a)}·(${num(xv)})² + (${num(b)})·(${num(xv)}) + (${num(c)}) = ${num(yv)}`, `V${P(xv, yv)}`],
  });
}

function asseSimmetria() {
  const { a, b, c, xv, yv } = vertexData();
  return makeQuestion({
    text: 'Qual è l’asse di simmetria della parabola?',
    formula: par(a, b, c),
    correct: `x = ${num(xv)}`,
    wrong: [
      { text: `x = ${num(-xv)}`, why: `x = ${MINUS}b/(2a) = ${num(-b)}/${den(a)} = ${num(xv)}: attenzione al segno.` },
      { text: `y = ${num(xv)}`, why: "L'asse di simmetria di questa parabola è una retta VERTICALE, quindi si scrive x = numero." },
      { text: yv !== xv ? `x = ${num(yv)}` : `x = ${num(2 * xv)}`, why: `L'asse passa per il vertice ma usa la sua ascissa: x = ${num(xv)}.` },
    ],
    solution: ["L'asse di simmetria è la retta verticale passante per il vertice", `x = ${MINUS}b/(2a) = ${num(-b)}/${den(a)} = ${num(xv)}`],
  });
}

function intersezioniX() {
  const kind = pick(['due', 'una', 'nessuna']);
  let a, b, c;
  if (kind === 'una') {
    const r = randNZ(-4, 4);
    a = pick([1, -1, 2]);
    b = -2 * a * r;
    c = a * r * r;
  } else {
    a = randNZ(-3, 3);
    b = rand(-6, 6);
    c = randNZ(-8, 8);
    const D = b * b - 4 * a * c;
    if ((kind === 'due' && D <= 0) || (kind === 'nessuna' && D >= 0)) throw new Error('retry');
  }
  const D = b * b - 4 * a * c;
  const S = { due: 'In due punti', una: 'In un solo punto (è tangente)', nessuna: 'In nessun punto' };
  const ws = `Δ = (${num(b)})² ${MINUS} 4·(${num(a)})·(${num(c)}) = ${num(D)}`;
  return makeQuestion({
    text: `In quanti punti la parabola ${par(a, b, c)} interseca l'asse x?`,
    correct: S[kind],
    wrong: [
      ...Object.keys(S)
        .filter((k) => k !== kind)
        .map((k) => ({ text: S[k], why: `${ws}. Δ > 0 ⇒ due punti, Δ = 0 ⇒ un punto, Δ < 0 ⇒ nessuno.` })),
      { text: 'In infiniti punti', why: 'Una parabola e una retta hanno al massimo 2 punti in comune.' },
    ],
    solution: [`Pongo y = 0 e calcolo il discriminante: ${ws}`, `${D > 0 ? 'Δ > 0' : D === 0 ? 'Δ = 0' : 'Δ < 0'} ⇒ ${S[kind].toLowerCase()}`],
  });
}

function zeri() {
  let r1, r2;
  do {
    r1 = randNZ(-6, 6);
    r2 = randNZ(-6, 6);
  } while (r1 === r2 || r1 === -r2);
  [r1, r2] = sort2(r1, r2);
  const a = pick([1, -1]);
  const b = -a * (r1 + r2);
  const c = a * r1 * r2;
  const [n1, n2] = sort2(-r1, -r2);
  return makeQuestion({
    text: `Trova i punti in cui la parabola ${par(a, b, c)} interseca l'asse x.`,
    correct: `${P(r1, 0)} e ${P(r2, 0)}`,
    wrong: [
      { text: `${P(0, r1)} e ${P(0, r2)}`, why: "Sull'asse x è la y a valere 0: i punti sono del tipo (x; 0)." },
      { text: `${P(n1, 0)} e ${P(n2, 0)}`, why: `Errore di segno nelle soluzioni di ${poly([[a, 'x²'], [b, 'x'], [c, '']])} = 0.` },
      { text: `${P(0, c)}`, why: "Questo è il punto d'intersezione con l'asse y." },
    ],
    solution: [`Pongo y = 0: ${poly([[a, 'x²'], [b, 'x'], [c, '']])} = 0`, `Δ = ${b * b - 4 * a * c}; soluzioni x = ${num(r1)} e x = ${num(r2)}`, `Punti: ${P(r1, 0)} e ${P(r2, 0)}`],
  });
}

// ---------- LIVELLO 3 ----------

function graficoParabola() {
  const a = pick([-1, 1]);
  const xv = randNZ(-3, 3);
  const yv = randNZ(-4, 4);
  const b = -2 * a * xv;
  const c = a * xv * xv + yv;
  const R = 7;
  return makeQuestion({
    text: 'Quale equazione corrisponde alla parabola disegnata?',
    visual: { type: 'plot', xmin: xv - R, xmax: xv + R, ymin: yv - R, ymax: yv + R, curves: [{ kind: 'parabola', a, b, c }], points: [{ x: xv, y: yv, label: 'V' }] },
    correct: par(a, b, c),
    wrong: [
      { text: par(-a, -b, -c), why: `Guarda la concavità: la parabola è rivolta verso ${a > 0 ? "l'alto ⇒ a > 0" : 'il basso ⇒ a < 0'}.` },
      { text: par(a, -b, c), why: `Con questa equazione il vertice avrebbe x_V = ${num(-xv)}, ma nel grafico x_V = ${num(xv)}.` },
      { text: par(a, b, -c), why: `Guarda dove la parabola taglia l'asse y: in (0; ${num(c)}), quindi c = ${num(c)}.` },
      { text: par(a, b, c + 2), why: `Guarda dove la parabola taglia l'asse y: in (0; ${num(c)}), quindi c = ${num(c)}.` },
    ],
    solution: [`Concavità verso ${a > 0 ? "l'alto ⇒ a > 0" : 'il basso ⇒ a < 0'}`, `Vertice V${P(xv, yv)} ⇒ x_V = −b/(2a) = ${num(xv)}`, `Intersezione con l'asse y: (0; ${num(c)}) ⇒ c = ${num(c)}`, par(a, b, c)],
  });
}

function palla() {
  const v = pick([10, 20, 30, 40]);
  const tMax = v / 10;
  const hMax = (v * v) / 20;
  const tGround = v / 5;
  const askH = Math.random() < 0.5;
  const h = `h(t) = ${poly([[-5, 't²'], [v, 't']])}`;
  if (askH) {
    return makeQuestion({
      text: `Una palla viene lanciata verso l'alto. La sua altezza (in metri) dopo t secondi è ${h}. Qual è l'altezza massima raggiunta?`,
      correct: `${num(hMax)} m`,
      wrong: [
        { text: `${num(tMax)} m`, why: `${num(tMax)} è l'istante (in secondi) in cui la palla raggiunge il massimo, non l'altezza. Va sostituito in h(t).` },
        { text: `${num(v)} m`, why: `${v} è un coefficiente della funzione, non l'altezza massima.` },
        { text: `${num(hMax * 2)} m`, why: `Ricontrolla: h(${num(tMax)}) = ${MINUS}5·${num(tMax * tMax)} + ${v}·${num(tMax)} = ${num(hMax)}.` },
      ],
      solution: ['Il grafico è una parabola rivolta verso il basso: il massimo è nel vertice', `t_V = −b/(2a) = ${MINUS}${v}/(${MINUS}10) = ${num(tMax)} s`, `h(${num(tMax)}) = ${MINUS}5·(${num(tMax)})² + ${v}·${num(tMax)} = ${num(hMax)} m`],
    });
  }
  return makeQuestion({
    text: `Una palla viene lanciata verso l'alto. La sua altezza (in metri) dopo t secondi è ${h}. Dopo quanti secondi ricade a terra?`,
    correct: `${num(tGround)} s`,
    wrong: [
      { text: `${num(tMax)} s`, why: 'In quell’istante la palla è nel punto più alto, non a terra.' },
      { text: `${num(v)} s`, why: `Verifica: h(${v}) = ${num(-5 * v * v + v * v)} m, la palla sarebbe sotto terra!` },
      { text: '0 s', why: 'A t = 0 la palla viene lanciata: cerchiamo il secondo istante in cui h = 0.' },
    ],
    solution: ['A terra h = 0', `${poly([[-5, 't²'], [v, 't']])} = 0 ⇒ t·(${MINUS}5t + ${v}) = 0`, `t = 0 (lancio) oppure t = ${v}/5 = ${num(tGround)} s`],
  });
}

function profittoMax() {
  let r1, r2;
  do {
    r1 = rand(1, 8);
    r2 = rand(6, 20);
  } while (r2 - r1 < 4 || (r1 + r2) % 2 !== 0);
  const S = r1 + r2;
  const K = r1 * r2;
  const xv = S / 2;
  const pmax = -(xv * xv) + S * xv - K;
  return makeQuestion({
    text: `Il profitto (in centinaia di €) di un laboratorio che produce x pezzi al giorno è P(x) = ${poly([[-1, 'x²'], [S, 'x'], [-K, '']])}. Quanti pezzi deve produrre per avere il profitto massimo?`,
    correct: `${xv} pezzi`,
    wrong: [
      { text: `${S} pezzi`, why: `x_V = −b/(2a) = ${MINUS}${S}/(${MINUS}2) = ${xv}: hai dimenticato di dividere per 2a.` },
      { text: `${r2} pezzi`, why: `Per x = ${r2} il profitto è ZERO (è una radice), non massimo.` },
      { text: `${K} pezzi`, why: `${K} è il costo fisso (termine noto), non la quantità di massimo profitto.` },
      { text: `${r1} pezzi`, why: `Per x = ${r1} il profitto è ZERO (è una radice), non massimo.` },
    ],
    solution: ['P(x) è una parabola rivolta verso il basso (a = −1): il massimo è nel vertice', `x_V = −b/(2a) = ${MINUS}${S}/(${MINUS}2) = ${xv}`, `Profitto massimo: P(${xv}) = ${pmax} (centinaia di €)`],
  });
}

export default {
  id: 'parabola',
  title: 'La parabola',
  icon: '∪',
  color: '#ea580c',
  description: 'Concavità, vertice, intersezioni con gli assi e problemi.',
  levels: [
    { id: 'par1', title: 'Prime osservazioni', description: 'Concavità e intersezioni semplici', pool: [concavita, asseY, affermazioni, affermazioni] },
    { id: 'par2', title: 'Vertice e asse', description: 'Vertice, asse di simmetria, Δ', pool: [vertice, vertice, asseSimmetria, intersezioniX, zeri] },
    { id: 'par3', title: 'Grafici e problemi', description: 'Riconoscere il grafico, massimi e minimi', pool: [graficoParabola, graficoParabola, palla, profittoMax] },
  ],
};
