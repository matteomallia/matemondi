# MateMondi

Web app (React + Vite) per allenarsi all'esame di diploma di matematica (IV anno IeFP).
Gli esercizi sono divisi in **8 mondi**, ognuno con **3 livelli** da 10 domande a scelta multipla (4 opzioni, una sola corretta).

| Mondo | Livelli |
|---|---|
| Equazioni di 2° grado | incomplete · formula risolutiva · stile esame |
| Disequazioni di 2° grado | primi passi · interni o esterni · casi speciali |
| La retta | leggere l'equazione · costruire rette · piano cartesiano |
| La circonferenza | centro e raggio · forma normale · grafici e posizioni |
| La parabola | prime osservazioni · vertice e asse · grafici e problemi |
| Problemi di scelta | quale conviene · funzioni di costo · stile esame |
| Probabilità | casi favorevoli · eventi · stile esame |
| Statistica | indici di posizione · frequenze e grafici · stile esame |

## Come funziona

- Le domande sono **generate con numeri casuali**: ogni tentativo propone esercizi nuovi, quindi non si possono imparare le risposte a memoria.
- Ogni risposta sbagliata mostra **perché quella scelta è errata** (l'errore tipico che porta a quel risultato), la risposta corretta e la **soluzione passo passo**.
- Con almeno **7/10** si sblocca il livello successivo. Stelle: ★ 7-8 · ★★ 9 · ★★★ 10.
- I progressi sono salvati nel browser dello studente (nessun login, nessun server).
- **Modalità docente**: aggiungi `?docente` in fondo all'indirizzo (es. `https://utente.github.io/matemondi/?docente`) per sbloccare tutti i livelli.
- Da computer si può rispondere anche con la tastiera: tasti `A`-`D` (o `1`-`4`) e `Invio` per andare avanti.

## Pubblicare su GitHub Pages

> **Pagina bianca?** Succede se GitHub pubblica la cartella principale del repository: lì c'è il codice sorgente non compilato, che il browser non sa eseguire. Usa uno dei due metodi qui sotto.

### Metodo A — il più semplice (cartella `docs`, già compilata)

1. Carica tutti i file nel repository (anche la cartella `docs`).
2. **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** e cartella **/docs** → **Save**
3. Dopo 1-2 minuti il sito è su `https://TUO-UTENTE.github.io/NOME-REPO/`.

Nota: la cartella `docs` è una versione già pronta. Se modifichi gli esercizi in `src/`, usa il metodo B (oppure rigenera `docs` con `npm run build:docs`).

### Metodo B — compilazione automatica (GitHub Actions)

1. **Settings → Pages → Source: GitHub Actions**.
2. Vai su **Actions**: il workflow *Deploy su GitHub Pages* compila e pubblica l'app (se era già partito prima, rilancialo con *Re-run all jobs*). Deve comparire la spunta verde.
3. Ogni push su `main` aggiorna automaticamente il sito.

Se carichi i file trascinandoli nella pagina del repository, controlla che ci sia anche la cartella nascosta `.github/workflows`.

## Sviluppo in locale

```bash
npm install
npm run dev      # server di sviluppo
npm run check    # verifica automatica di tutti i generatori di domande
npm run build    # build di produzione nella cartella dist
```

## Aggiungere o modificare esercizi

Ogni mondo è un file in `src/worlds/`. Una domanda è una funzione che restituisce `makeQuestion({...})`:

```js
function mioEsercizio() {
  const k = rand(2, 9);
  return makeQuestion({
    text: 'Testo della domanda',
    formula: `x² − ${k * k} = 0`,          // facoltativa, mostrata in evidenza
    correct: `x = −${k} ; x = ${k}`,
    wrong: [                                  // almeno 3 risposte sbagliate
      { text: `x = ${k}`, why: 'Spiegazione dell’errore…' },
      // ...
    ],
    solution: ['Passo 1', 'Passo 2'],         // soluzione passo passo
  });
}
```

Poi aggiungi la funzione al `pool` del livello. Le frazioni si scrivono `{{3|4}}`.
Dopo ogni modifica lancia `npm run check`: genera migliaia di domande e segnala opzioni duplicate, valori mancanti o spiegazioni assenti.
