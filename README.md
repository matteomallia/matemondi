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

1. Crea un nuovo repository su GitHub (es. `matemondi`).
2. Carica il contenuto di questa cartella (da terminale):
   ```bash
   git init
   git add .
   git commit -m "MateMondi"
   git branch -M main
   git remote add origin https://github.com/TUO-UTENTE/matemondi.git
   git push -u origin main
   ```
   In alternativa puoi trascinare i file nella pagina del repository con **Add file → Upload files** (attenzione a includere anche la cartella nascosta `.github`).
3. Nel repository vai su **Settings → Pages** e in **Build and deployment → Source** scegli **GitHub Actions**.
4. Vai su **Actions**: il workflow *Deploy su GitHub Pages* compila e pubblica l'app (se era già partito prima del punto 3, rilancialo con *Re-run*).
5. Il link da condividere sarà `https://TUO-UTENTE.github.io/matemondi/`.

Ogni nuovo push su `main` aggiorna automaticamente il sito.

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
