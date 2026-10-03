import { rand, pick, num, euro, makeQuestion, MINUS, shuffle } from '../lib/utils.js';

// Contesti per i problemi con costo fisso + costo variabile
const CONTEXTS = [
  { what: 'palestra', quanti: 'quanti', unit: 'ingressi', unit1: 'ingresso', A: 'Palestra FitUp', B: 'Palestra Energy', fixedLabel: 'iscrizione', fixed: [[20, 40], [60, 100]], var: [[6, 9], [2, 4]] },
  { what: 'noleggio bici', quanti: 'quante', unit: 'ore', unit1: 'ora', A: 'Noleggio Rapido', B: 'Bike Center', fixedLabel: 'quota fissa', fixed: [[2, 5], [10, 16]], var: [[4, 6], [2, 3]] },
  { what: 'tariffa telefonica', quanti: 'quanti', unit: 'GB extra', unit1: 'GB', A: 'Offerta Base', B: 'Offerta Plus', fixedLabel: 'canone', fixed: [[5, 8], [12, 18]], var: [[3, 5], [1, 2]] },
  { what: 'corso di guida', quanti: 'quante', unit: 'lezioni', unit1: 'lezione', A: 'Autoscuola Centro', B: 'Autoscuola Sicura', fixedLabel: 'iscrizione', fixed: [[100, 150], [250, 350]], var: [[35, 45], [20, 28]] },
];

function offers() {
  const ctx = pick(CONTEXTS);
  const fA = rand(...ctx.fixed[0]);
  const fB = rand(...ctx.fixed[1]);
  const pA = rand(...ctx.var[0]);
  const pB = rand(...ctx.var[1]);
  return { ctx, fA, fB, pA, pB, cA: (n) => fA + pA * n, cB: (n) => fB + pB * n };
}

const offerText = (o) =>
  `Per un servizio di ${o.ctx.what} ci sono due offerte. ${o.ctx.A}: ${euro(o.fA)} di ${o.ctx.fixedLabel} + ${euro(o.pA)} per ogni ${o.ctx.unit1}. ${o.ctx.B}: ${euro(o.fB)} di ${o.ctx.fixedLabel} + ${euro(o.pB)} per ogni ${o.ctx.unit1}.`;

// ---------- LIVELLO 1 ----------

function confronto() {
  const o = offers();
  const n = rand(2, 20);
  const a = o.cA(n);
  const b = o.cB(n);
  if (a === b) throw new Error('retry');
  const best = a < b ? 'A' : 'B';
  const nameA = o.ctx.A;
  const nameB = o.ctx.B;
  const calc = `${nameA}: ${euro(o.fA)} + ${n}·${euro(o.pA)} = ${euro(a)}; ${nameB}: ${euro(o.fB)} + ${n}·${euro(o.pB)} = ${euro(b)}.`;
  return makeQuestion({
    text: `${offerText(o)} Con ${n} ${o.ctx.unit}, quale offerta conviene?`,
    visual: { type: 'table', headers: ['Offerta', o.ctx.fixedLabel, `costo per ${o.ctx.unit1}`], rows: [[nameA, euro(o.fA), euro(o.pA)], [nameB, euro(o.fB), euro(o.pB)]] },
    correct: best === 'A' ? `${nameA} (spesa ${euro(a)})` : `${nameB} (spesa ${euro(b)})`,
    wrong: [
      { text: best === 'A' ? `${nameB} (spesa ${euro(b)})` : `${nameA} (spesa ${euro(a)})`, why: `Confronta le due spese: ${calc}` },
      { text: 'È indifferente', why: `Le due spese sono diverse: ${calc}` },
      { text: 'Non si può stabilire', why: `I dati bastano: calcola la spesa totale di ciascuna offerta. ${calc}` },
    ],
    solution: ['Spesa totale = quota fissa + costo unitario × quantità', calc, `Conviene ${best === 'A' ? nameA : nameB}.`],
  });
}

function abbonamento() {
  const t = pick([1.5, 2, 2.5, 3, 3.5, 4]);
  const d = rand(2, 5);
  const P = Math.round(t * 4 * rand(2, 5) + pick([-2, 2, -1, 1, 3, -3]));
  const tot = 4 * d * t;
  if (Math.abs(tot - P) < 0.01) throw new Error('retry');
  const correct = tot > P ? "Conviene l'abbonamento mensile" : 'Conviene acquistare i biglietti giornalieri';
  const calc = `Biglietti: 4 settimane × ${d} giorni × ${euro(t)} = ${euro(tot)}; abbonamento: ${euro(P)}.`;
  return makeQuestion({
    text: `Per andare al lavoro Luca prende il treno. Un abbonamento mensile (considera un mese di 4 settimane) costa ${euro(P)}, mentre il biglietto giornaliero costa ${euro(t)}. Luca va in sede ${d} giorni a settimana. Cosa gli conviene?`,
    correct,
    wrong: [
      { text: tot > P ? 'Conviene acquistare i biglietti giornalieri' : "Conviene l'abbonamento mensile", why: calc },
      { text: 'È indifferente', why: `Le due spese non sono uguali. ${calc}` },
      { text: 'I dati non sono sufficienti', why: `I dati bastano. ${calc}` },
    ],
    solution: [`Giorni di viaggio al mese: 4 × ${d} = ${4 * d}`, `Spesa con biglietti: ${4 * d} × ${euro(t)} = ${euro(tot)}`, `Abbonamento: ${euro(P)}`, correct],
    tip: 'Ricorda di confrontare sempre lo stesso periodo di tempo (qui: un mese).',
  });
}

function costoSingolo() {
  const o = offers();
  const n = rand(3, 15);
  const useA = Math.random() < 0.5;
  const f = useA ? o.fA : o.fB;
  const p = useA ? o.pA : o.pB;
  const name = useA ? o.ctx.A : o.ctx.B;
  return makeQuestion({
    text: `${offerText(o)} Quanto si spende in totale con ${name} per ${n} ${o.ctx.unit}?`,
    correct: euro(f + p * n),
    wrong: [
      { text: euro(p * n), why: `Hai dimenticato di aggiungere la parte fissa: ${euro(f)} di ${o.ctx.fixedLabel}.` },
      { text: euro((f + p) * n), why: `La quota fissa si paga una volta sola, non per ogni ${o.ctx.unit1}.` },
      { text: euro(f + p), why: `Il costo di ${euro(p)} va moltiplicato per il numero di ${o.ctx.unit} (${n}).` },
      { text: euro((useA ? o.fB : o.fA) + (useA ? o.pB : o.pA) * n), why: 'Hai usato i prezzi dell’altra offerta.' },
    ],
    solution: [`Spesa = ${o.ctx.fixedLabel} + costo × quantità`, `${euro(f)} + ${n} × ${euro(p)} = ${euro(f)} + ${euro(p * n)} = ${euro(f + p * n)}`],
  });
}

// ---------- LIVELLO 2 ----------

function funzioneCosto() {
  if (Math.random() < 0.5) {
    const o = offers();
    const useA = Math.random() < 0.5;
    const f = useA ? o.fA : o.fB;
    const p = useA ? o.pA : o.pB;
    return makeQuestion({
      text: `${useA ? o.ctx.A : o.ctx.B} chiede ${euro(f)} di ${o.ctx.fixedLabel} più ${euro(p)} per ogni ${o.ctx.unit1}. Quale funzione esprime il costo C in base al numero x di ${o.ctx.unit}?`,
      correct: `C(x) = ${num(p)}x + ${num(f)}`,
      wrong: [
        { text: `C(x) = ${num(f)}x + ${num(p)}`, why: `È il costo per ${o.ctx.unit1} (${euro(p)}) a moltiplicare x; la quota fissa si somma una volta sola.` },
        { text: `C(x) = ${num(p + f)}x`, why: `Così pagheresti la quota fissa per ogni ${o.ctx.unit1}: va sommata una volta sola.` },
        { text: `C(x) = ${num(p)}x`, why: `Manca la quota fissa di ${euro(f)}.` },
      ],
      solution: ['Costo = parte fissa + parte variabile', `Parte variabile: ${num(p)}·x;  parte fissa: ${num(f)}`, `C(x) = ${num(p)}x + ${num(f)}`],
    });
  }
  const c1 = rand(7, 12);
  const c2 = rand(13, 20);
  const k = pick([49, 79, 99, 129]);
  return makeQuestion({
    text: `Sara acquista due smartphone a rate. Per il primo paga un canone mensile di ${c1} €, per il secondo ${c2} €. Per ciascuno dei due telefoni è richiesto un anticipo di ${k} €. Il primo è rateizzato in x mesi, il secondo in y mesi. Quale funzione esprime il costo totale C?`,
    correct: `C = ${c1}x + ${c2}y + ${2 * k}`,
    wrong: [
      { text: `C = ${c1}x + ${c2}y + ${k}`, why: `L'anticipo di ${k} € va pagato per CIASCUNO dei due telefoni: 2 × ${k} = ${2 * k}.` },
      { text: `C = ${c1}xy + ${2 * k}`, why: 'I mesi dei due telefoni non si moltiplicano tra loro: ogni canone va moltiplicato per i suoi mesi.' },
      { text: `C = ${c1}(x ${MINUS} y) + ${2 * k}`, why: 'Non c’è nessuna differenza tra i mesi: i due costi si SOMMANO.' },
      { text: `C = ${c1 + c2}(x + y) + ${2 * k}`, why: 'Ogni canone va moltiplicato solo per i mesi del proprio telefono.' },
    ],
    solution: [`Primo telefono: ${k} + ${c1}x`, `Secondo telefono: ${k} + ${c2}y`, `Totale: C = ${c1}x + ${c2}y + ${2 * k}`],
  });
}

function pareggio() {
  const ctx = pick(CONTEXTS);
  const pA = rand(...ctx.var[0]);
  const pB = rand(...ctx.var[1]);
  const diff = pA - pB;
  if (diff <= 0) throw new Error('retry');
  const n = rand(3, 15);
  const fA = rand(...ctx.fixed[0]);
  const fB = fA + diff * n;
  const o = { ctx, fA, fB, pA, pB };
  const check = (m) => `Con ${m} ${ctx.unit}: ${ctx.A} costa ${euro(fA + pA * m)}, ${ctx.B} costa ${euro(fB + pB * m)}. Non sono uguali.`;
  const cands = [fB - fA, n + 1, n - 1, Math.round((fB + fA) / diff), n + 2];
  return makeQuestion({
    text: `${offerText(o)} Per ${ctx.quanti} ${ctx.unit} le due offerte costano esattamente uguale?`,
    correct: `${n}`,
    wrong: cands.filter((m) => m > 0 && m !== n).map((m) => ({ text: `${m}`, why: m === fB - fA ? `${m} € è la differenza tra le quote fisse: va divisa per la differenza dei costi unitari (${euro(diff)}). ${check(m)}` : check(m) })),
    solution: [`Pongo uguali i costi: ${num(fA)} + ${num(pA)}x = ${num(fB)} + ${num(pB)}x`, `${num(pA)}x ${MINUS} ${num(pB)}x = ${num(fB)} ${MINUS} ${num(fA)} ⇒ ${num(diff)}x = ${num(fB - fA)}`, `x = ${num(fB - fA)} / ${num(diff)} = ${n}`],
  });
}

function daQuando() {
  const t = pick([2, 2.5, 3, 3.5, 4]);
  // abbonamento P tra 4·t·(d*-1) e 4·t·d*
  const dStar = rand(2, 5);
  const low = 4 * t * (dStar - 1);
  const high = 4 * t * dStar;
  const P = Math.round(low + (high - low) * pick([0.3, 0.5, 0.7]));
  if (P <= low || P >= high) throw new Error('retry');
  const rows = [1, 2, 3, 4, 5].map((d) => `${d} gg: ${euro(4 * d * t)}`).join(' · ');
  return makeQuestion({
    text: `Un abbonamento mensile del bus costa ${euro(P)}; il biglietto giornaliero (andata e ritorno) costa ${euro(t)}. Considera un mese di 4 settimane. Da quanti giorni a settimana in su conviene l'abbonamento?`,
    correct: `Da ${dStar} giorni a settimana`,
    wrong: [
      { text: `Da ${dStar - 1} giorni a settimana`, why: `Con ${dStar - 1} giorni i biglietti costano ${euro(low)}, meno dell'abbonamento (${euro(P)}).` },
      { text: dStar + 1 <= 5 ? `Da ${dStar + 1} giorni a settimana` : 'Non conviene mai', why: `Già con ${dStar} giorni i biglietti costano ${euro(high)}, più dell'abbonamento (${euro(P)}).` },
      { text: "Conviene sempre l'abbonamento", why: `Con 1 giorno a settimana i biglietti costano solo ${euro(4 * t)}, meno di ${euro(P)}.` },
    ],
    solution: ['Costo mensile dei biglietti = 4 × giorni × prezzo', rows, `L'abbonamento (${euro(P)}) conviene quando i biglietti costerebbero di più: da ${dStar} giorni in su.`],
  });
}

// ---------- LIVELLO 3 ----------

function retribuzioneData() {
  const baseA = pick([400, 500, 600]);
  const pA = pick([20, 25]);
  const baseB = baseA + pick([200, 300, 400]);
  const pB = pA - pick([5, 10]);
  const months = ['Gennaio', 'Febbraio', 'Marzo'];
  const inc = months.map(() => rand(24, 46) * 500);
  return { baseA, pA, baseB, pB, months, inc };
}

const retribText = (d) => `Un negozio propone a un commesso due forme di retribuzione. Forma A: ${euro(d.baseA)}/mese + ${d.pA}% sugli incassi del mese. Forma B: ${euro(d.baseB)}/mese + ${d.pB}% sugli incassi del mese.`;
const retribVisual = (d) => ({ type: 'table', headers: ['Mese', 'Incassi'], rows: d.months.map((m, i) => [m, euro(d.inc[i])]) });

function retribuzioneMese() {
  const d = retribuzioneData();
  const i = rand(0, 2);
  const I = d.inc[i];
  const g = d.baseB + (I * d.pB) / 100;
  return makeQuestion({
    text: `${retribText(d)} Gli incassi del primo trimestre sono in tabella. Se avesse scelto la forma B, quanto avrebbe guadagnato a ${d.months[i].toLowerCase()}?`,
    visual: retribVisual(d),
    correct: euro(g),
    wrong: [
      { text: euro((I * d.pB) / 100), why: `Hai calcolato solo la percentuale: va aggiunto lo stipendio fisso di ${euro(d.baseB)}.` },
      { text: euro(d.baseA + (I * d.pA) / 100), why: 'Questo è il guadagno con la forma A.' },
      { text: euro(d.baseB + d.pB * 100), why: `Il ${d.pB}% si calcola sugli incassi: ${I} × ${d.pB}/100 = ${num((I * d.pB) / 100)}.` },
      { text: euro(d.baseB + (I * d.pA) / 100), why: `Nella forma B la percentuale è ${d.pB}%, non ${d.pA}%.` },
    ],
    solution: [`${d.pB}% di ${euro(I)} = ${I} × ${d.pB} / 100 = ${euro((I * d.pB) / 100)}`, `Totale: ${euro(d.baseB)} + ${euro((I * d.pB) / 100)} = ${euro(g)}`],
  });
}

function retribuzioneTrimestre() {
  const d = retribuzioneData();
  const totA = d.inc.reduce((s, I) => s + d.baseA + (I * d.pA) / 100, 0);
  const totB = d.inc.reduce((s, I) => s + d.baseB + (I * d.pB) / 100, 0);
  if (Math.abs(totA - totB) < 1) throw new Error('retry');
  const best = totA > totB ? 'A' : 'B';
  const calc = `Totale trimestre: forma A = ${euro(totA)}, forma B = ${euro(totB)}.`;
  return makeQuestion({
    text: `${retribText(d)} Gli incassi del primo trimestre sono in tabella. Quale forma di retribuzione sarebbe stata più remunerativa nel trimestre?`,
    visual: retribVisual(d),
    correct: `Forma ${best} (totale ${euro(best === 'A' ? totA : totB)})`,
    wrong: [
      { text: `Forma ${best === 'A' ? 'B' : 'A'} (totale ${euro(best === 'A' ? totB : totA)})`, why: calc },
      { text: `Forma ${best === 'A' ? 'B' : 'A'}, perché ha lo stipendio fisso più alto`, why: `Lo stipendio fisso non basta: conta anche la percentuale sugli incassi. ${calc}` },
      { text: 'È indifferente', why: calc },
    ],
    solution: [
      ...d.months.map((m, i) => `${m}: A = ${euro(d.baseA + (d.inc[i] * d.pA) / 100)}, B = ${euro(d.baseB + (d.inc[i] * d.pB) / 100)}`),
      calc,
      `Conviene la forma ${best}.`,
    ],
  });
}

function palestraErrata() {
  const s = pick([15, 18, 20, 22]);
  const N = pick([12, 15, 20]);
  const sub = s * rand(Math.ceil(N * 0.55), N - 2) - pick([3, 5, 7]); // abbonamento
  const be = sub / s; // pareggio (non intero)
  if (Number.isInteger(be)) throw new Error('retry');
  const n1 = Math.floor(be) - rand(0, 2); // conviene singole
  const n2 = Math.ceil(be) + rand(0, 1); // conviene abbonamento
  if (n1 < 1 || n2 > N) throw new Error('retry');
  const st = [
    { t: `Se va a ${n1} lezioni, le conviene pagare le lezioni singole`, ok: true, why: `Vero: ${n1} × ${euro(s)} = ${euro(n1 * s)} < ${euro(sub)}.` },
    { t: `Se va a ${n2} lezioni, le conviene l'abbonamento`, ok: true, why: `Vero: ${n2} × ${euro(s)} = ${euro(n2 * s)} > ${euro(sub)}.` },
    { t: `Pagando tutte le ${N} lezioni singolarmente spenderebbe ${euro(N * s)}`, ok: true, why: `Vero: ${N} × ${euro(s)} = ${euro(N * s)}.` },
    { t: `Con tutte le ${N} lezioni, l'abbonamento le fa risparmiare ${euro(N * s - sub)}`, ok: true, why: `Vero: ${euro(N * s)} ${MINUS} ${euro(sub)} = ${euro(N * s - sub)}.` },
  ];
  const falseIdx = rand(0, 3);
  const falses = [
    { t: `Se va a ${n2} lezioni, le conviene pagare le lezioni singole`, why: `${n2} × ${euro(s)} = ${euro(n2 * s)}, che è più dell'abbonamento (${euro(sub)}).` },
    { t: `Se va a ${n1} lezioni, le conviene l'abbonamento`, why: `${n1} × ${euro(s)} = ${euro(n1 * s)}, che è meno dell'abbonamento (${euro(sub)}).` },
    { t: `Pagando tutte le ${N} lezioni singolarmente spenderebbe ${euro(N * s - s)}`, why: `${N} × ${euro(s)} = ${euro(N * s)}, non ${euro(N * s - s)}.` },
    { t: `Con tutte le ${N} lezioni, l'abbonamento le fa risparmiare ${euro(N * s - sub + 10)}`, why: `Il risparmio è ${euro(N * s)} ${MINUS} ${euro(sub)} = ${euro(N * s - sub)}.` },
  ];
  const wrongStatements = st.filter((_, i) => i !== falseIdx).map((x) => ({ text: x.t, why: `Questa affermazione è VERA, ma la domanda chiede quella ERRATA. ${x.why}` }));
  return makeQuestion({
    text: `Giulia vuole frequentare un corso in palestra di ${N} lezioni. L'abbonamento per tutto il corso costa ${euro(sub)}, mentre una lezione singola costa ${euro(s)}. Quale affermazione è ERRATA?`,
    correct: falses[falseIdx].t,
    wrong: shuffle(wrongStatements),
    solution: [`Punto di pareggio: ${euro(sub)} / ${euro(s)} ≈ ${num(be, 1)} lezioni`, `Sotto le ${num(be, 1)} lezioni convengono le singole, sopra conviene l'abbonamento`, `L'affermazione errata è: “${falses[falseIdx].t}”. ${falses[falseIdx].why}`],
  });
}

function graficoOfferte() {
  const pA = rand(4, 7);
  const pB = rand(1, 3);
  const n = rand(3, 7);
  const fA = rand(0, 6);
  const fB = fA + (pA - pB) * n;
  const ymax = Math.ceil((fA + pA * 10) / 10) * 10 + 10;
  return makeQuestion({
    text: `Il grafico mostra il costo totale (in €) di due offerte in funzione del numero x di utilizzi. Offerta A: C = ${pA}x${fA ? ' + ' + fA : ''}. Offerta B: C = ${pB}x + ${fB}. Quando conviene l'offerta B?`,
    visual: {
      type: 'plot',
      xmin: 0,
      xmax: 10,
      ymin: 0,
      ymax,
      curves: [
        { kind: 'line', m: pA, q: fA, label: 'A', color: '#4f46e5' },
        { kind: 'line', m: pB, q: fB, label: 'B', color: '#ea580c' },
      ],
      points: [{ x: n, y: fA + pA * n, label: '' }],
    },
    correct: `Per più di ${n} utilizzi`,
    wrong: [
      { text: `Per meno di ${n} utilizzi`, why: `Prima di x = ${n} la retta B sta SOPRA la retta A: B costa di più.` },
      { text: 'Sempre', why: `Per pochi utilizzi B costa di più (ha la quota fissa più alta: ${fB} €).` },
      { text: 'Mai', why: `Dopo x = ${n} la retta B sta SOTTO la retta A: costa meno.` },
    ],
    solution: [`Le rette si incontrano dove i costi sono uguali: ${pA}x${fA ? ' + ' + fA : ''} = ${pB}x + ${fB} ⇒ x = ${n}`, 'Conviene l’offerta la cui retta sta più in BASSO', `Dopo x = ${n} la retta B è più in basso ⇒ B conviene per più di ${n} utilizzi`],
  });
}

export default {
  id: 'scelta',
  title: 'Problemi di scelta',
  icon: '€',
  color: '#ca8a04',
  description: 'Confrontare offerte, abbonamenti e retribuzioni.',
  levels: [
    { id: 'sce1', title: 'Quale conviene?', description: 'Confronti diretti tra due offerte', pool: [confronto, confronto, abbonamento, costoSingolo] },
    { id: 'sce2', title: 'Funzioni di costo', description: 'Scrivere C(x) e trovare il pareggio', pool: [funzioneCosto, funzioneCosto, pareggio, daQuando] },
    { id: 'sce3', title: 'Stile esame', description: 'Retribuzioni, abbonamenti, grafici', pool: [retribuzioneMese, retribuzioneTrimestre, palestraErrata, graficoOfferte] },
  ],
};
