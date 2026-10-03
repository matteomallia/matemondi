import { rand, pick, num, frac, rawFrac, perc, makeQuestion, MINUS, shuffle, gcd } from '../lib/utils.js';

// ---------- LIVELLO 1 ----------

const DIE_EVENTS = [
  { t: 'un numero pari', fav: [2, 4, 6] },
  { t: 'un numero dispari', fav: [1, 3, 5] },
  { t: 'un multiplo di 3', fav: [3, 6] },
  { t: 'un numero primo', fav: [2, 3, 5] },
  { t: 'un numero maggiore di 4', fav: [5, 6] },
  { t: 'un numero minore di 3', fav: [1, 2] },
  { t: 'un numero maggiore o uguale a 3', fav: [3, 4, 5, 6] },
  { t: 'il numero 6', fav: [6] },
  { t: 'un divisore di 6', fav: [1, 2, 3, 6] },
];

function dado() {
  const e = pick(DIE_EVENTS);
  const k = e.fav.length;
  return makeQuestion({
    text: `Si lancia un dado a 6 facce. Qual è la probabilità di ottenere ${e.t}?`,
    correct: frac(k, 6),
    wrong: [
      { text: frac(6 - k, 6), why: `Hai contato i casi CONTRARI. I casi favorevoli sono ${e.fav.join(', ')}: ${k} su 6.` },
      { text: rawFrac(k, 6 - k), why: `Si divide per i casi POSSIBILI (6), non per i casi sfavorevoli (${6 - k}).` },
      { text: frac(1, 6), why: `${k > 1 ? `I casi favorevoli sono ${k} (${e.fav.join(', ')}), non uno solo.` : ''}` },
      { text: frac(k, 10), why: 'Un dado ha 6 facce: i casi possibili sono 6.' },
      { text: frac(1, k + 1), why: 'P = casi favorevoli / casi possibili.' },
    ],
    solution: [`Casi possibili: 6 (le facce del dado)`, `Casi favorevoli: ${e.fav.join(', ')} ⇒ ${k}`, `P = ${k}/6 = ${frac(k, 6)}`],
  });
}

function gettoni() {
  const N = pick([20, 25, 40, 50, 100]);
  let a, b, cnt;
  do {
    a = rand(1, N - 5);
    b = rand(a + 3, N);
    cnt = b - a + 1;
  } while (N === 40 && cnt % 2 !== 0);
  const p = cnt / N;
  return makeQuestion({
    text: `In un sacchetto ci sono ${N} gettoni numerati da 1 a ${N}. Calcola la probabilità che, estraendone uno, esca un numero compreso tra ${a} e ${b} (inclusi).`,
    correct: perc(p),
    wrong: [
      { text: perc((cnt - 1) / N), why: `Gli estremi sono inclusi: i numeri da ${a} a ${b} sono ${b} ${MINUS} ${a} + 1 = ${cnt}, non ${cnt - 1}.` },
      { text: perc(1 - p), why: 'Questa è la probabilità dell’evento contrario (numero FUORI dall’intervallo).' },
      { text: perc((cnt - 2) / N), why: `Hai escluso entrambi gli estremi, ma il testo dice “inclusi”: i numeri sono ${cnt}.` },
      { text: perc((cnt + 1) / N), why: `Conta bene: da ${a} a ${b} ci sono ${cnt} numeri.` },
    ],
    solution: [`Casi favorevoli: da ${a} a ${b} ⇒ ${b} ${MINUS} ${a} + 1 = ${cnt}`, `Casi possibili: ${N}`, `P = ${cnt}/${N} = ${num(p, 4)} = ${perc(p)}`],
  });
}

const COLORS = ['rosse', 'blu', 'verdi', 'gialle', 'nere', 'bianche'];
const SING = { rosse: 'rossa', blu: 'blu', verdi: 'verde', gialle: 'gialla', nere: 'nera', bianche: 'bianca' };
const MASC = { rosse: 'rosso', blu: 'blu', verdi: 'verde', gialle: 'giallo', nere: 'nero', bianche: 'bianco' };

function urna() {
  const cols = shuffle(COLORS).slice(0, 3);
  const n = cols.map(() => rand(2, 9));
  if (n[0] === n[1] && n[1] === n[2]) throw new Error('retry');
  const T = n[0] + n[1] + n[2];
  const i = rand(0, 2);
  const other = T - n[i];
  return makeQuestion({
    text: `Un'urna contiene ${n[0]} palline ${cols[0]}, ${n[1]} ${cols[1]} e ${n[2]} ${cols[2]}. Si estrae una pallina a caso. Qual è la probabilità che sia ${SING[cols[i]]}?`,
    correct: frac(n[i], T),
    wrong: [
      { text: rawFrac(n[i], other), why: `Si divide per TUTTE le palline (${T}), non solo per quelle di altri colori (${other}).` },
      { text: frac(1, 3), why: 'I colori sono 3 ma NON sono equiprobabili: le palline di ogni colore sono in numero diverso.' },
      { text: frac(other, T), why: `Questa è la probabilità di NON estrarre una pallina ${SING[cols[i]]}.` },
      { text: frac(n[(i + 1) % 3], T), why: `${n[(i + 1) % 3]} sono le palline ${cols[(i + 1) % 3]}.` },
    ],
    solution: [`Totale palline: ${n.join(' + ')} = ${T}`, `Palline ${cols[i]}: ${n[i]}`, `P = ${n[i]}/${T} = ${frac(n[i], T)}`],
  });
}

// ---------- LIVELLO 2 ----------

function contrario() {
  const T = pick([20, 30, 40, 50]);
  const k = rand(2, T - 2);
  const what = pick(['difettosi', 'vincenti', 'scaduti']);
  const one = { difettosi: 'difettoso', vincenti: 'vincente', scaduti: 'scaduto' }[what];
  const neg = `non ${one}`;
  return makeQuestion({
    text: `In una scatola ci sono ${T} pezzi, di cui ${k} ${what}. Si prende un pezzo a caso. Qual è la probabilità che sia ${neg}?`,
    correct: frac(T - k, T),
    wrong: [
      { text: frac(k, T), why: `Questa è la probabilità che sia ${one}. Ti serve l'evento CONTRARIO: 1 − ${frac(k, T)}.` },
      { text: rawFrac(T - k, k), why: `Si divide per il totale (${T}).` },
      { text: frac(1, 2), why: 'I due casi non sono ugualmente probabili.' },
    ],
    solution: [`P(${one}) = ${k}/${T}`, `P(${neg}) = 1 ${MINUS} ${k}/${T} = ${T - k}/${T} = ${frac(T - k, T)}`],
    tip: 'P(evento contrario) = 1 − P(evento).',
  });
}

function unione() {
  const cols = shuffle(COLORS).slice(0, 3);
  const n = cols.map(() => rand(2, 6));
  const T = n[0] + n[1] + n[2];
  return makeQuestion({
    text: `In un cassetto ci sono ${n[0]} matite ${cols[0]}, ${n[1]} ${cols[1]} e ${n[2]} ${cols[2]}. Prendendo una matita a caso, qual è la probabilità che sia ${SING[cols[0]]} o ${SING[cols[1]]}?`,
    correct: frac(n[0] + n[1], T),
    wrong: [
      { text: frac(n[0] * n[1], T * T), why: 'Con “o” tra eventi incompatibili (una matita non può avere due colori) le probabilità si SOMMANO, non si moltiplicano.' },
      { text: frac(n[0], T), why: `Hai considerato solo le matite ${cols[0]}: vanno contate anche le ${cols[1]}.` },
      { text: frac(n[2], T), why: `Questa è la probabilità di prendere una matita ${cols[2]}.` },
      { text: frac(2, 3), why: 'I colori non sono equiprobabili: conta le matite, non i colori.' },
    ],
    solution: [`Totale: ${T} matite`, `Favorevoli: ${n[0]} + ${n[1]} = ${n[0] + n[1]}`, `P = ${n[0] + n[1]}/${T} = ${frac(n[0] + n[1], T)}`],
  });
}

const DECK40 = [
  { t: 'una figura (fante, cavallo o re)', k: 12 },
  { t: 'un asso', k: 4 },
  { t: 'una carta di coppe', k: 10 },
  { t: 'un re', k: 4 },
  { t: 'un re o un asso', k: 8 },
  { t: 'un numero pari (2, 4 o 6)', k: 12 },
];
const DECK52 = [
  { t: 'una carta di cuori', k: 13 },
  { t: 'una figura (J, Q o K)', k: 12 },
  { t: 'un asso', k: 4 },
  { t: 'una carta rossa', k: 26 },
  { t: 'un re di picche', k: 1 },
];

function carte() {
  const use40 = Math.random() < 0.55;
  const e = pick(use40 ? DECK40 : DECK52);
  const N = use40 ? 40 : 52;
  const M = use40 ? 52 : 40;
  const info = use40 ? 'Il mazzo da 40 carte ha 4 semi (coppe, denari, spade, bastoni) da 10 carte: 1-7, fante, cavallo, re.' : 'Il mazzo da 52 carte ha 4 semi da 13 carte: A, 2-10, J, Q, K.';
  return makeQuestion({
    text: `Da un mazzo di ${N} carte se ne estrae una. Qual è la probabilità di estrarre ${e.t}?`,
    correct: frac(e.k, N),
    wrong: [
      { text: frac(e.k, M), why: `Il mazzo ha ${N} carte, non ${M}.` },
      { text: frac(N - e.k, N), why: 'Questa è la probabilità dell’evento contrario.' },
      { text: frac(1, e.k === 1 ? 4 : e.k), why: 'P = casi favorevoli / casi possibili: conta quante carte vanno bene e dividi per il totale.' },
      { text: frac(e.k + 4, N), why: `Ricontrolla quante carte vanno bene: sono ${e.k}.` },
    ],
    solution: [info, `Carte favorevoli: ${e.k}`, `P = ${e.k}/${N} = ${frac(e.k, N)}`],
  });
}

function dueDadi() {
  const s = rand(3, 11);
  const ways = 6 - Math.abs(7 - s);
  const list = [];
  for (let a = 1; a <= 6; a++) {
    const b = s - a;
    if (b >= 1 && b <= 6) list.push(`(${a};${b})`);
  }
  return makeQuestion({
    text: `Si lanciano due dadi. Qual è la probabilità che la somma dei due numeri sia ${s}?`,
    correct: frac(ways, 36),
    wrong: [
      { text: frac(1, 11), why: 'Le somme possibili sono 11 (da 2 a 12), ma NON sono equiprobabili: il 7 esce in 6 modi, il 2 in uno solo.' },
      { text: frac(ways, 12), why: 'I casi possibili sono 6 × 6 = 36, non 12.' },
      { text: frac(1, 6) === frac(ways, 36) ? frac(1, 36) : frac(1, 6), why: `Conta le coppie favorevoli: ${list.join(' ')} ⇒ ${ways} su 36.` },
      { text: frac(ways + 1, 36), why: `Conta bene le coppie: ${list.join(' ')} ⇒ ${ways}.` },
    ],
    solution: ['Casi possibili: 6 × 6 = 36 coppie', `Coppie con somma ${s}: ${list.join(' ')} ⇒ ${ways}`, `P = ${ways}/36 = ${frac(ways, 36)}`],
  });
}

// ---------- LIVELLO 3 ----------

function senzaReimmissione() {
  const use40 = Math.random() < 0.5;
  const N = use40 ? 40 : 52;
  const e = pick(use40 ? [{ t: 'due figure', k: 12 }, { t: 'due assi', k: 4 }, { t: 'due carte di denari', k: 10 }] : [{ t: 'due re', k: 4 }, { t: 'due carte di cuori', k: 13 }, { t: 'due figure', k: 12 }]);
  const p = (e.k / N) * ((e.k - 1) / (N - 1));
  const pWith = (e.k / N) ** 2;
  return makeQuestion({
    text: `Da un mazzo di ${N} carte si estrae una carta e, senza rimetterla nel mazzo, se ne estrae una seconda. Qual è la probabilità di ottenere ${e.t}?`,
    correct: perc(p),
    wrong: [
      { text: perc(pWith), why: `Così è CON reimmissione. Senza reimmissione alla seconda estrazione le carte favorevoli sono ${e.k - 1} su ${N - 1}.` },
      { text: perc(e.k / N), why: 'Questa è la probabilità di UNA sola estrazione. Per due estrazioni consecutive si moltiplicano le probabilità.' },
      { text: perc(e.k / N + (e.k - 1) / (N - 1)), why: 'Con “e poi” (entrambe le estrazioni) le probabilità si MOLTIPLICANO, non si sommano.' },
      { text: perc((e.k - 1) / (N - 1)), why: 'Hai considerato solo la seconda estrazione.' },
    ],
    solution: [`1ª estrazione: ${e.k}/${N}`, `2ª estrazione (una carta favorevole in meno, una carta in meno nel mazzo): ${e.k - 1}/${N - 1}`, `P = ${e.k}/${N} × ${e.k - 1}/${N - 1} = ${frac(e.k * (e.k - 1), N * (N - 1))} ≈ ${perc(p)}`],
  });
}

function conReimmissione() {
  const cols = shuffle(COLORS).slice(0, 2);
  const a = rand(2, 8);
  const b = rand(2, 8);
  const T = a + b;
  return makeQuestion({
    text: `Un'urna contiene ${a} palline ${cols[0]} e ${b} ${cols[1]}. Si estrae una pallina, la si rimette nell'urna e se ne estrae un'altra. Qual è la probabilità che siano entrambe ${cols[0]}?`,
    correct: frac(a * a, T * T),
    wrong: [
      { text: frac(a * (a - 1), T * (T - 1)), why: 'Questo sarebbe il calcolo SENZA reimmissione. Qui la pallina viene rimessa: la composizione dell’urna non cambia.' },
      { text: frac(2 * a, T), why: 'Le probabilità di due estrazioni successive si moltiplicano, non si sommano.' },
      { text: frac(a, T), why: 'Questa è la probabilità di una sola estrazione.' },
    ],
    solution: [`Ogni estrazione: P(${cols[0]}) = ${a}/${T}`, `Con reimmissione le estrazioni sono indipendenti: P = ${a}/${T} × ${a}/${T} = ${frac(a * a, T * T)}`],
  });
}

function tabella() {
  const v = [rand(150, 480), rand(150, 480), rand(150, 480), rand(150, 480)];
  const T = v.reduce((s, x) => s + x, 0);
  const ask = pick(['neg', 'pos', 'dis', 'occ']);
  const neg = v[2] + v[3];
  const pos = v[0] + v[1];
  const occ = v[0] + v[2];
  const dis = v[1] + v[3];
  const L = { neg: 'abbia espresso un giudizio negativo', pos: 'abbia espresso un giudizio positivo', occ: 'sia occupata', dis: 'sia disoccupata' };
  const val = { neg, pos, occ, dis };
  const opp = { neg: 'pos', pos: 'neg', occ: 'dis', dis: 'occ' }[ask];
  const sum = { neg: `${v[2]} + ${v[3]}`, pos: `${v[0]} + ${v[1]}`, occ: `${v[0]} + ${v[2]}`, dis: `${v[1]} + ${v[3]}` };
  const cell = { neg: v[2], pos: v[0], occ: v[0], dis: v[1] }[ask];
  return makeQuestion({
    text: `Un sondaggio su ${T} persone ha raccolto i risultati in tabella. Scegliendo a caso una persona intervistata, qual è la probabilità che ${L[ask]}?`,
    visual: { type: 'table', headers: ['', 'Occupate', 'Disoccupate'], rows: [['Giudizio positivo', v[0], v[1]], ['Giudizio negativo', v[2], v[3]]] },
    correct: rawFrac(val[ask], T),
    wrong: [
      { text: rawFrac(val[opp], T), why: `Questi sono i casi dell'evento opposto. I casi favorevoli sono ${sum[ask]} = ${val[ask]}.` },
      { text: rawFrac(cell, T), why: `Hai preso una sola cella della tabella: devi sommare tutta la ${ask === 'neg' || ask === 'pos' ? 'riga' : 'colonna'}: ${sum[ask]} = ${val[ask]}.` },
      { text: rawFrac(val[ask], val[opp]), why: `Al denominatore vanno TUTTI gli intervistati (${T}).` },
      { text: rawFrac(v[3], T), why: `I casi favorevoli sono ${sum[ask]} = ${val[ask]}.` },
    ],
    solution: [`Casi possibili: tutti gli intervistati = ${T}`, `Casi favorevoli: ${sum[ask]} = ${val[ask]}`, `P = ${val[ask]}/${T} ≈ ${perc(val[ask] / T)}`],
  });
}

function tempo() {
  const [start, end] = pick([
    [8, 18],
    [8, 16],
    [9, 17],
    [8, 20],
    [14, 20],
  ]);
  const W = end - start;
  let h;
  do h = rand(1, W - 1);
  while (gcd(h, W) === h && Math.random() < 0.3);
  return makeQuestion({
    text: `Marta segue un corso di ${h} ore, suddivise in vari moduli, nella fascia oraria dalle ${start}:00 alle ${end}:00. Se riceve una telefonata in un momento casuale di quella fascia, qual è la probabilità che NON possa rispondere perché impegnata nel corso?`,
    correct: frac(h, W),
    wrong: [
      { text: frac(W - h, W), why: 'Questa è la probabilità che Marta sia LIBERA, cioè che possa rispondere.' },
      { text: frac(h, 24), why: `La telefonata arriva nella fascia ${start}:00–${end}:00, che dura ${W} ore, non 24.` },
      { text: frac(h, W - h), why: `Si divide per la durata totale della fascia (${W} ore), non per le ore libere.` },
      { text: frac(1, h), why: 'P = ore di corso / ore totali della fascia.' },
    ],
    solution: [`Durata della fascia: ${end} ${MINUS} ${start} = ${W} ore`, `Ore occupate: ${h}`, `P = ${h}/${W} = ${frac(h, W)}`],
  });
}

function cassetti() {
  const c = rand(3, 5);
  const each = rand(2, 4);
  const names = shuffle(COLORS).slice(0, c).map((x) => MASC[x]);
  return makeQuestion({
    text: `In un cassetto ci sono ${c * each} calzini: ${each} per ciascuno dei colori ${names.join(', ')}. Al buio, quanti calzini devi prendere come minimo per essere SICURO di averne due dello stesso colore?`,
    correct: `${c + 1}`,
    wrong: [
      { text: '2', why: 'Con 2 calzini potresti essere sfortunato e prenderne di due colori diversi.' },
      { text: `${c}`, why: `Con ${c} calzini potresti averne uno per ogni colore, tutti diversi.` },
      { text: `${c * each}`, why: 'Non serve prenderli tutti: basta uno in più rispetto al numero di colori.' },
      { text: `${2 * c}`, why: `Ne bastano meno: dopo ${c} calzini tutti diversi, il successivo ripete per forza un colore.` },
    ],
    solution: [`Caso peggiore: i primi ${c} calzini sono tutti di colori diversi`, `Il calzino numero ${c + 1} deve per forza avere un colore già uscito`, `Risposta: ${c + 1}`],
  });
}

export default {
  id: 'probabilita',
  title: 'Probabilità',
  icon: 'P(E)',
  color: '#7c3aed',
  description: 'Dadi, carte, urne, eventi contrari ed estrazioni.',
  levels: [
    { id: 'pro1', title: 'Casi favorevoli', description: 'Dadi, gettoni, urne', pool: [dado, dado, gettoni, urna] },
    { id: 'pro2', title: 'Eventi', description: 'Contrario, unione, carte, due dadi', pool: [contrario, unione, carte, carte, dueDadi] },
    { id: 'pro3', title: 'Stile esame', description: 'Estrazioni, tabelle, tempo', pool: [senzaReimmissione, conReimmissione, tabella, tempo, cassetti] },
  ],
};
