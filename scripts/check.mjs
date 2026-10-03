// Verifica automatica di tutti i generatori di domande.
// Uso: npm run check
import { WORLDS, buildLevel } from '../src/worlds/index.js';
import { safeGenerate, numericValue } from '../src/lib/utils.js';

const RUNS = Number(process.argv[2] || 400);
let errors = 0;
let total = 0;
const bad = /NaN|undefined|Infinity|\bnull\b|\[object/;

function checkQ(q, where) {
  total++;
  const problems = [];
  if (!q.options || q.options.length !== 4) problems.push('opzioni != 4');
  const correct = q.options.filter((o) => o.correct);
  if (correct.length !== 1) problems.push('corrette != 1');
  const texts = q.options.map((o) => o.text.replace(/\s+/g, ' ').trim().toLowerCase());
  if (new Set(texts).size !== 4) problems.push('opzioni duplicate');
  for (const o of q.options) {
    if (bad.test(o.text)) problems.push('testo opzione: ' + o.text);
    if (!o.correct && (!o.why || bad.test(o.why))) problems.push('why mancante/errato: ' + o.text + ' -> ' + o.why);
  }
  // controllo semantico: opzioni puramente numeriche non devono avere lo stesso valore
  const val = numericValue;
  const vals = q.options.map((o) => val(o.text));
  if (vals.every((v) => v != null)) {
    const rounded = vals.map((v) => Math.round(v * 1e6));
    if (new Set(rounded).size !== 4) problems.push('valori numerici equivalenti: ' + q.options.map((o) => o.text).join(' | '));
  }
  const all = [q.text, q.formula || '', ...(q.solution || []), q.tip || ''].join(' ');
  if (bad.test(all)) problems.push('testo/soluzione: ' + all.slice(0, 200));
  const every = all + ' ' + q.options.map((o) => o.text + ' ' + (o.why || '')).join(' ');
  const asc = every.match(/(^|[\s(=;|:/])-\d[^ ]*/);
  if (asc) problems.push('meno ASCII: ' + every.slice(Math.max(0, asc.index - 60), asc.index + 30));
  if (!q.solution || q.solution.length === 0) problems.push('soluzione mancante');
  if (problems.length) {
    errors++;
    if (errors < 25) console.log('✗', where, problems, '\n   ', q.text);
  }
}

for (const w of WORLDS) {
  for (const lvl of w.levels) {
    const gens = [...new Set(lvl.pool)];
    for (const g of gens) {
      let fails = 0;
      for (let i = 0; i < RUNS; i++) {
        try {
          checkQ(safeGenerate(g), `${w.id}/${lvl.id}/${g.name}`);
        } catch (e) {
          fails++;
        }
      }
      if (fails) {
        errors++;
        console.log(`✗ ${w.id}/${lvl.id}/${g.name}: ${fails} generazioni fallite`);
      }
    }
    for (let i = 0; i < 30; i++) {
      const qs = buildLevel(lvl);
      if (qs.length !== 10) {
        errors++;
        console.log(`✗ ${lvl.id}: livello con ${qs.length} domande`);
        break;
      }
    }
  }
}
console.log(`\n${total} domande controllate, ${errors} problemi.`);
process.exit(errors ? 1 : 0);
