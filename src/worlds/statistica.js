import { rand, pick, num, numFixed, perc, makeQuestion, MINUS, shuffle, euro } from '../lib/utils.js';

const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
const listStr = (a) => a.map((x) => num(x)).join('  ·  ');

// dati con moda unica
function dataWithMode(n) {
  for (;;) {
    const a = Array.from({ length: n }, () => rand(3, 15));
    const m = rand(3, 15);
    a[0] = m;
    a[1] = m;
    const cnt = {};
    a.forEach((x) => (cnt[x] = (cnt[x] || 0) + 1));
    const max = Math.max(...Object.values(cnt));
    const modes = Object.keys(cnt).filter((k) => cnt[k] === max);
    if (modes.length === 1) return { a: shuffle(a), mode: Number(modes[0]), freq: max };
  }
}

// ---------- LIVELLO 1 ----------

function media() {
  const n = rand(5, 7);
  const a = Array.from({ length: n }, () => rand(2, 20));
  const m = mean(a);
  const S = a.reduce((s, x) => s + x, 0);
  return makeQuestion({
    text: 'Calcola la media aritmetica dei seguenti dati (arrotonda a 1 decimale):',
    formula: listStr(a),
    correct: numFixed(m, 1),
    wrong: [
      { text: numFixed(S / (n - 1), 1), why: `Devi dividere per il numero di dati, che è ${n}, non ${n - 1}.` },
      { text: numFixed(median(a), 1), why: 'Questa è la mediana (il valore centrale dei dati ordinati), non la media.' },
      { text: numFixed(S / (n + 1), 1), why: `Devi dividere per il numero di dati, che è ${n}.` },
      { text: numFixed((Math.max(...a) + Math.min(...a)) / 2, 1), why: 'La media usa TUTTI i dati, non solo il più grande e il più piccolo.' },
      { text: num(S), why: `${S} è la somma: va divisa per ${n}.` },
    ],
    solution: [`Somma: ${a.join(' + ')} = ${S}`, `Numero di dati: ${n}`, `Media = ${S} / ${n} = ${numFixed(m, 1)}`],
  });
}

function mediana() {
  const n = pick([5, 7, 6, 8]);
  let a, sorted, med, unsortedMid;
  do {
    a = Array.from({ length: n }, () => rand(1, 30));
    sorted = [...a].sort((x, y) => x - y);
    med = median(a);
    unsortedMid = n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2;
  } while (unsortedMid === med);
  const m = mean(a);
  return makeQuestion({
    text: 'Qual è la mediana dei seguenti dati?',
    formula: listStr(a),
    correct: num(med, 1),
    wrong: [
      { text: num(unsortedMid, 1), why: 'Prima di cercare il valore centrale bisogna ORDINARE i dati dal più piccolo al più grande!' },
      { text: numFixed(m, 1), why: 'Questa è la media aritmetica, non la mediana.' },
      { text: num(n % 2 ? sorted[(n + 1) / 2] : sorted[n / 2 - 1], 1), why: n % 2 ? 'Questo non è il valore centrale: conta bene le posizioni.' : 'Con un numero PARI di dati la mediana è la media dei due valori centrali.' },
      { text: num(sorted[Math.floor(n / 2) - 1] ?? sorted[0], 1), why: 'Questo non è il valore centrale dei dati ordinati.' },
    ],
    solution: [`Dati ordinati: ${listStr(sorted)}`, n % 2 ? `Sono ${n} dati (dispari): la mediana è il ${(n + 1) / 2}° valore = ${num(med)}` : `Sono ${n} dati (pari): la mediana è la media del ${n / 2}° e del ${n / 2 + 1}° valore: (${sorted[n / 2 - 1]} + ${sorted[n / 2]}) / 2 = ${num(med)}`],
  });
}

function moda() {
  const { a, mode, freq } = dataWithMode(rand(7, 9));
  const mx = Math.max(...a);
  return makeQuestion({
    text: 'Qual è la moda dei seguenti dati?',
    formula: listStr(a),
    correct: num(mode),
    wrong: [
      { text: num(freq), why: `${freq} è QUANTE VOLTE compare la moda. La moda è il valore stesso: ${mode}.` },
      { text: num(mx), why: 'La moda non è il valore più grande, ma quello che compare più volte.' },
      { text: numFixed(mean(a), 1), why: 'Questa è la media, non la moda.' },
      { text: num(median(a), 1), why: 'Questa è la mediana, non la moda.' },
      { text: num(Math.min(...a)), why: 'La moda è il valore più frequente.' },
    ],
    solution: ['La moda è il valore che compare più volte', `${mode} compare ${freq} volte, più di ogni altro valore ⇒ moda = ${mode}`],
  });
}

function trisMmm() {
  const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio'];
  const { a, mode } = dataWithMode(5);
  const vals = a.map((x) => x + 30);
  const mo = mode + 30;
  const me = mean(vals);
  const md = median(vals);
  if (md === mo) throw new Error('retry');
  const f = (x, y, z) => `Moda = ${num(x)} | Media = ${numFixed(y, 1)} | Mediana = ${num(z, 1)}`;
  return makeQuestion({
    text: 'La tabella mostra il fatturato mensile (in migliaia di €). Calcola moda, media e mediana (media arrotondata a 1 decimale).',
    visual: { type: 'table', headers: ['Mese', 'Fatturato (migliaia di €)'], rows: months.map((m, i) => [m, vals[i]]) },
    correct: f(mo, me, md),
    wrong: [
      { text: f(Math.max(...vals), me, md), why: `La moda è il valore più frequente (${mo}), non il più grande.` },
      { text: f(mo, me, vals[2]), why: `La mediana è il valore centrale dei dati ORDINATI: ${num(md)}.` },
      { text: f(mo, me + 1, md), why: `Ricontrolla la media: somma / 5 = ${numFixed(me, 1)}.` },
      { text: f(md, me, mo), why: 'Hai scambiato moda e mediana.' },
    ],
    solution: [`Moda: ${mo} (compare più volte)`, `Media: (${vals.join(' + ')}) / 5 = ${numFixed(me, 1)}`, `Dati ordinati: ${[...vals].sort((x, y) => x - y).join(', ')} ⇒ mediana = ${md}`],
  });
}

// ---------- LIVELLO 2 ----------

function frequenzeFalsa() {
  const N = pick([20, 25, 40, 50]);
  const f = [1, 1, 1, 1, 1];
  for (let r = 5; r < N; r++) f[rand(0, 4)]++;
  if (new Set(f).size < 4) throw new Error('retry');
  const votes = [1, 2, 3, 4, 5];
  const below4 = f[0] + f[1] + f[2];
  const i = rand(0, 4);
  let j;
  do j = rand(0, 4);
  while (j === i || f[j] === f[i]);
  const st = [];
  st.push({ t: `I partecipanti sono stati ${N}`, ok: true, w: `${f.join(' + ')} = ${N}` });
  st.push({ t: `I partecipanti sono stati ${N + pick([-5, 5, 10])}`, ok: false, w: `${f.join(' + ')} = ${N}` });
  st.push({ t: `La frequenza relativa del voto ${votes[i]} è ${num(f[i] / N, 2)}`, ok: true, w: `${f[i]}/${N} = ${num(f[i] / N, 2)}` });
  st.push({ t: `La frequenza relativa del voto ${votes[i]} è ${num(f[i] / 10, 2)}`, ok: f[i] / 10 === f[i] / N, w: `${f[i]}/${N} = ${num(f[i] / N, 2)}` });
  st.push({ t: `La frequenza assoluta del voto ${votes[i]} è maggiore di quella del voto ${votes[j]}`, ok: f[i] > f[j], w: `voto ${votes[i]}: ${f[i]}, voto ${votes[j]}: ${f[j]}` });
  st.push({ t: 'Quelli con voto inferiore a 4 sono più della metà del totale', ok: below4 > N / 2, w: `${f[0]} + ${f[1]} + ${f[2]} = ${below4}, metà di ${N} = ${num(N / 2)}` });
  st.push({ t: `Il ${num((f[4] / N) * 100)}% dei partecipanti ha preso 5`, ok: true, w: `${f[4]}/${N} = ${num((f[4] / N) * 100)}%` });
  const falses = st.filter((x) => !x.ok);
  const trues = shuffle(st.filter((x) => x.ok));
  if (falses.length === 0 || trues.length < 3) throw new Error('retry');
  const F = pick(falses);
  return makeQuestion({
    text: 'A un concorso ogni partecipante ha ricevuto un voto da 1 a 5. In tabella sono riportate le frequenze dei voti. Individua l’affermazione FALSA.',
    visual: { type: 'table', headers: ['Voto', ...votes], rows: [['Frequenza', ...f]] },
    correct: F.t,
    wrong: trues.map((x) => ({ text: x.t, why: `Questa è VERA (${x.w}). La domanda chiede quella FALSA.` })),
    solution: [`Totale: ${f.join(' + ')} = ${N}`, 'Frequenza relativa = frequenza assoluta / totale', `L'affermazione falsa è “${F.t}”: ${F.w}.`],
  });
}

const BRANDS = [
  ['Ferrari', 'Porsche', 'Lamborghini', 'Aston Martin', 'Maserati'],
  ['Pizza', 'Panino', 'Insalata', 'Sushi', 'Kebab'],
  ['Calcio', 'Basket', 'Pallavolo', 'Nuoto', 'Tennis'],
  ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'],
];
const TITLES = ['Auto sportive vendute nel trimestre', 'Piatti ordinati in mensa in una settimana', 'Sport preferito dagli studenti', 'Clienti in negozio per giorno'];

function barre() {
  const k = rand(0, 3);
  const labels = BRANDS[k];
  const step = pick([5, 10]);
  const vals = labels.map(() => step * rand(2, 12));
  const T = vals.reduce((s, x) => s + x, 0);
  const kind = pick(['tot', 'perc', 'diff', 'media']);
  const visual = { type: 'bars', title: TITLES[k], labels, values: vals };
  const i = rand(0, 4);
  const js = [0, 1, 2, 3, 4].filter((k) => vals[k] !== vals[i]);
  if (js.length === 0) throw new Error('retry');
  const j = pick(js);
  if (kind === 'tot') {
    return makeQuestion({
      text: 'Osserva il grafico. Qual è il totale complessivo?',
      visual,
      correct: `${T}`,
      wrong: [
        { text: `${T - vals[4]}`, why: `Hai dimenticato una colonna (${labels[4]}: ${vals[4]}).` },
        { text: `${T + step}`, why: `Ricontrolla la somma: ${vals.join(' + ')} = ${T}.` },
        { text: `${Math.max(...vals) * 5}`, why: 'Non tutte le colonne hanno la stessa altezza: somma i valori uno per uno.' },
        { text: `${T - step}`, why: `Ricontrolla la somma: ${vals.join(' + ')} = ${T}.` },
      ],
      solution: [`${vals.join(' + ')} = ${T}`],
    });
  }
  if (kind === 'perc') {
    const p = vals[i] / T;
    return makeQuestion({
      text: `Osserva il grafico. Quale percentuale del totale rappresenta “${labels[i]}”? (arrotonda a 1 decimale)`,
      visual,
      correct: perc(p),
      wrong: [
        { text: `${vals[i]}%`, why: `${vals[i]} è il valore assoluto. Per la percentuale: ${vals[i]} / ${T} × 100.` },
        { text: perc(vals[i] / (T - vals[i])), why: `Al denominatore va il TOTALE (${T}), compreso “${labels[i]}”.` },
        { text: perc(1 / 5), why: 'Il 20% sarebbe giusto solo se tutte le colonne fossero uguali.' },
        { text: perc(p + 0.05), why: `${vals[i]} / ${T} = ${num(p, 3)} ⇒ ${perc(p)}.` },
      ],
      solution: [`Totale: ${vals.join(' + ')} = ${T}`, `Percentuale: ${vals[i]} / ${T} × 100 ≈ ${perc(p)}`],
    });
  }
  if (kind === 'diff') {
    const [hi, lo] = vals[i] > vals[j] ? [i, j] : [j, i];
    return makeQuestion({
      text: `Osserva il grafico. Quanto in più ha “${labels[hi]}” rispetto a “${labels[lo]}”?`,
      visual,
      correct: `${vals[hi] - vals[lo]}`,
      wrong: [
        { text: `${vals[hi] + vals[lo]}`, why: '“Quanto in più” chiede una DIFFERENZA, non una somma.' },
        { text: `${vals[hi]}`, why: `Devi sottrarre il valore di “${labels[lo]}” (${vals[lo]}).` },
        { text: `${vals[hi] - vals[lo] + step}`, why: `Leggi bene le altezze: ${vals[hi]} ${MINUS} ${vals[lo]} = ${vals[hi] - vals[lo]}.` },
        { text: `${Math.abs(vals[hi] - vals[lo] - step)}`, why: `Leggi bene le altezze: ${vals[hi]} ${MINUS} ${vals[lo]} = ${vals[hi] - vals[lo]}.` },
      ],
      solution: [`${labels[hi]}: ${vals[hi]};  ${labels[lo]}: ${vals[lo]}`, `Differenza: ${vals[hi]} ${MINUS} ${vals[lo]} = ${vals[hi] - vals[lo]}`],
    });
  }
  const m = T / 5;
  return makeQuestion({
    text: 'Osserva il grafico. Qual è il valore medio delle 5 colonne?',
    visual,
    correct: num(m, 1),
    wrong: [
      { text: num(T, 1), why: `${T} è la somma: va divisa per 5.` },
      { text: num(median(vals), 1) === num(m, 1) ? num(m + step, 1) : num(median(vals), 1), why: 'Questa è la mediana, non la media. La media è la somma divisa per il numero di valori.' },
      { text: num((Math.max(...vals) + Math.min(...vals)) / 2, 1), why: 'La media considera tutti i valori, non solo il massimo e il minimo.' },
      { text: num(T / 4, 1), why: 'Le colonne sono 5.' },
    ],
    solution: [`Somma: ${vals.join(' + ')} = ${T}`, `Media: ${T} / 5 = ${num(m, 1)}`],
  });
}

function frequenzaPerc() {
  const cats = pick([
    ['Autobus', 'Treno', 'Bici', 'A piedi', 'Auto'],
    ['Smartphone', 'Tablet', 'PC', 'Console'],
    ['Inverno', 'Primavera', 'Estate', 'Autunno'],
  ]);
  const N = pick([20, 25, 40, 50]);
  const f = cats.map(() => 1);
  for (let r = cats.length; r < N; r++) f[rand(0, cats.length - 1)]++;
  const i = rand(0, cats.length - 1);
  const p = f[i] / N;
  return makeQuestion({
    text: `In una classe di ${N} studenti è stata fatta un'indagine. Qual è la frequenza relativa percentuale di “${cats[i]}”?`,
    visual: { type: 'table', headers: ['Risposta', 'Frequenza assoluta'], rows: cats.map((c, k) => [c, f[k]]) },
    correct: perc(p),
    wrong: [
      { text: `${f[i]}%`, why: `${f[i]} è la frequenza ASSOLUTA. Quella relativa percentuale è ${f[i]}/${N} × 100.` },
      { text: perc(1 / cats.length), why: 'Le risposte non sono distribuite in parti uguali.' },
      { text: perc(f[i] / 100), why: `Il totale degli studenti è ${N}, non 100.` },
      { text: perc((N - f[i]) / N), why: `Questa è la percentuale di chi NON ha risposto “${cats[i]}”.` },
    ],
    solution: [`Frequenza relativa = ${f[i]} / ${N} = ${num(p, 3)}`, `In percentuale: ${num(p, 3)} × 100 = ${perc(p)}`],
  });
}

// ---------- LIVELLO 3 ----------

function votoNecessario() {
  for (let tries = 0; tries < 200; tries++) {
    const n = rand(5, 7);
    const grades = Array.from({ length: n }, () => pick([4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5]));
    const drop = Math.random() < 0.6;
    const minG = Math.min(...grades);
    const kept = drop ? (() => {
      const g = [...grades];
      g.splice(g.indexOf(minG), 1);
      return g;
    })() : grades;
    const S = kept.reduce((s, x) => s + x, 0);
    const cnt = kept.length + 1;
    const x = 6 * cnt - S;
    if (x < 6 || x > 9 || (x * 2) % 1 !== 0) continue;
    const res = (v) => (S + v) / cnt;
    const opts = [x - 0.5, x + 0.5, x + 1, x - 1].filter((v) => v > 0 && v <= 10);
    return makeQuestion({
      text: `Uno studente ha preso questi voti in matematica: ${grades.map((g) => num(g)).join(' – ')}. ${drop ? "Per aiutarlo, l'insegnante NON considera il voto più basso e" : "L'insegnante"} gli fa fare un'ulteriore prova. Che voto deve prendere, come minimo, per avere 6 di media?`,
      correct: num(x),
      wrong: opts.map((v) => ({ text: num(v), why: `Con ${num(v)} la media sarebbe (${num(S)} + ${num(v)}) / ${cnt} = ${num(res(v), 2)}${res(v) < 6 ? ', insufficiente.' : ': basta anche un voto più basso!'}` })),
      solution: [
        drop ? `Tolgo il voto più basso (${num(minG)}): restano ${kept.length} voti con somma ${num(S)}` : `Somma dei voti: ${num(S)}`,
        `Con la nuova prova i voti diventano ${cnt}: serve una somma di almeno 6 × ${cnt} = ${6 * cnt}`,
        `Voto necessario: ${6 * cnt} ${MINUS} ${num(S)} = ${num(x)}`,
      ],
    });
  }
  throw new Error('retry');
}

function mediaPonderata() {
  const items = pick([
    { what: 'magliette', unit: 'prezzo', names: ['taglia S', 'taglia M', 'taglia L'] },
    { what: 'caffè venduti', unit: 'prezzo', names: ['espresso', 'macchiato', 'cappuccino'] },
  ]);
  const prices = [pick([1, 1.2, 1.5, 8, 10]), 0, 0];
  prices[1] = prices[0] + pick([0.5, 1, 2]);
  prices[2] = prices[1] + pick([0.5, 1, 2]);
  const q = [rand(2, 9), rand(2, 9), rand(2, 9)];
  if (q[0] === q[1] && q[1] === q[2]) throw new Error('retry');
  const tot = prices.reduce((s, p, i) => s + p * q[i], 0);
  const Q = q[0] + q[1] + q[2];
  const pm = tot / Q;
  const simple = (prices[0] + prices[1] + prices[2]) / 3;
  if (Math.abs(simple - pm) < 0.01) throw new Error('retry');
  return makeQuestion({
    text: `Un'attività commerciale ha venduto i prodotti in tabella. Qual è il prezzo medio di un prodotto venduto (media ponderata)?`,
    visual: { type: 'table', headers: ['Prodotto', 'Prezzo', 'Quantità'], rows: items.names.map((nm, i) => [nm, euro(prices[i]), q[i]]) },
    correct: euro(Math.round(pm * 100) / 100),
    wrong: [
      { text: euro(Math.round(simple * 100) / 100), why: 'Hai fatto la media semplice dei prezzi, ma le quantità vendute sono diverse: ogni prezzo va “pesato” con la sua quantità.' },
      { text: euro(Math.round((tot / 3) * 100) / 100), why: `Il totale incassato va diviso per il numero di prodotti venduti (${Q}), non per 3.` },
      { text: euro(tot), why: `${euro(tot)} è l'incasso totale: va diviso per ${Q}.` },
    ],
    solution: [`Incasso: ${prices.map((p, i) => `${num(p)}×${q[i]}`).join(' + ')} = ${euro(tot)}`, `Prodotti venduti: ${q.join(' + ')} = ${Q}`, `Prezzo medio = ${num(tot)} / ${Q} ≈ ${euro(Math.round(pm * 100) / 100)}`],
  });
}

function tabellaAnni() {
  const years = [2019, 2020, 2021, 2022, 2023];
  const cats = ['15-17 anni', '18-19 anni', '20-24 anni'];
  for (let t = 0; t < 300; t++) {
    const data = cats.map(() => {
      let v = rand(440, 600) / 10;
      return years.map(() => {
        v = Math.round((v + rand(-40, 40) / 10) * 10) / 10;
        return v;
      });
    });
    const st = [];
    // 1) calo maggiore per la categoria 0
    const drops = years.slice(1).map((_, k) => data[0][k + 1] - data[0][k]);
    const minDrop = Math.min(...drops);
    const yMin = years[drops.indexOf(minDrop) + 1];
    const yOther = pick(years.slice(1).filter((y) => y !== yMin));
    if (minDrop < 0) {
      st.push({ t: `Nel ${yMin} la classe ${cats[0]} ha avuto il calo maggiore`, ok: true, w: `variazione ${num(minDrop, 1)} punti, la peggiore` });
      st.push({ t: `Nel ${yOther} la classe ${cats[0]} ha avuto il calo maggiore`, ok: false, w: `il calo maggiore è nel ${yMin} (${num(minDrop, 1)} punti)` });
    }
    // 2) ultimo anno tutte in aumento
    const allUp = cats.every((_, c) => data[c][4] > data[c][3]);
    st.push({ t: `Nel ${years[4]} c'è stato un aumento per tutte le classi d'età rispetto al ${years[3]}`, ok: allUp, w: cats.map((c, k) => `${c}: ${num(data[k][3])} → ${num(data[k][4])}`).join('; ') });
    // 3) categoria 1 sempre crescente
    const c1 = data[1].every((v, k) => k === 0 || v > data[1][k - 1]);
    st.push({ t: `La classe ${cats[1]} è sempre cresciuta dal ${years[0]} al ${years[4]}`, ok: c1, w: data[1].map((v) => num(v)).join(' → ') });
    // 4) massimo nel primo anno per cat 2
    const mx = Math.max(...data[2]);
    const yMx = years[data[2].indexOf(mx)];
    st.push({ t: `Per la classe ${cats[2]} il valore più alto è stato nel ${yMx}`, ok: true, w: `il massimo è ${num(mx)}` });
    const yWrong = pick(years.filter((y, k) => y !== yMx && data[2][k] !== mx));
    st.push({ t: `Per la classe ${cats[2]} il valore più alto è stato nel ${yWrong}`, ok: false, w: `il massimo è ${num(mx)}, nel ${yMx}` });
    const trues = st.filter((x) => x.ok);
    const falses = shuffle(st.filter((x) => !x.ok));
    if (trues.length < 1 || falses.length < 3) continue;
    const T = pick(trues);
    return makeQuestion({
      text: "La tabella mostra la percentuale di giovani che hanno letto almeno un libro in un anno, per classe d'età. Individua l'affermazione VERA.",
      visual: { type: 'table', headers: ['Classe', ...years], rows: cats.map((c, k) => [c, ...data[k].map((v) => numFixed(v, 1))]) },
      correct: T.t,
      wrong: falses.map((x) => ({ text: x.t, why: `Falsa: ${x.w}.` })),
      solution: [`L'affermazione vera è “${T.t}”: ${T.w}.`, 'Per confrontare due anni consecutivi calcola la differenza tra i valori.'],
    });
  }
  throw new Error('retry');
}

export default {
  id: 'statistica',
  title: 'Statistica',
  icon: 'x̄',
  color: '#0d9488',
  description: 'Media, moda, mediana, frequenze, tabelle e grafici.',
  levels: [
    { id: 'sta1', title: 'Indici di posizione', description: 'Media, moda e mediana', pool: [media, mediana, moda, trisMmm] },
    { id: 'sta2', title: 'Frequenze e grafici', description: 'Tabelle, percentuali, istogrammi', pool: [frequenzeFalsa, barre, barre, frequenzaPerc] },
    { id: 'sta3', title: 'Stile esame', description: 'Voti, medie ponderate, tabelle', pool: [votoNecessario, mediaPonderata, tabellaAnni, frequenzeFalsa] },
  ],
};
