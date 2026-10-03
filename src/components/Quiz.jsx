import { useEffect, useMemo, useRef, useState } from 'react';
import MathText from './MathText.jsx';
import Visual from './Visual.jsx';
import { buildLevel } from '../worlds/index.js';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function Quiz({ world, level, attempt, onExit, onFinish }) {
  const questions = useMemo(() => buildLevel(level), [level, attempt]);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [showSol, setShowSol] = useState(false);
  const feedbackRef = useRef(null);
  const q = questions[idx];
  const answered = chosen !== null;
  const isLast = idx === questions.length - 1;

  function choose(i) {
    if (answered) return;
    setChosen(i);
    const ok = q.options[i].correct;
    if (ok) setScore((s) => s + 1);
    setShowSol(!ok);
  }

  function next() {
    if (!answered) return;
    if (isLast) {
      onFinish(score);
      return;
    }
    setIdx((n) => n + 1);
    setChosen(null);
    setShowSol(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    if (answered && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [answered]);

  useEffect(() => {
    const onKey = (e) => {
      const k = e.key.toLowerCase();
      const map = { a: 0, b: 1, c: 2, d: 3, 1: 0, 2: 1, 3: 2, 4: 3 };
      if (!answered && k in map) choose(map[k]);
      else if (answered && (k === 'enter' || k === ' ')) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!q) return null;
  const correctIdx = q.options.findIndex((o) => o.correct);
  const ok = answered && q.options[chosen].correct;

  return (
    <div className="quiz" style={{ '--wc': world.color }}>
      <div className="quiz-top">
        <button className="btn-ghost" onClick={onExit} aria-label="Esci dal livello">
          ✕ Esci
        </button>
        <div className="quiz-progress" aria-label={`Domanda ${idx + 1} di ${questions.length}`}>
          <div className="quiz-progress-bar" style={{ width: `${((idx + (answered ? 1 : 0)) / questions.length) * 100}%` }} />
        </div>
        <div className="quiz-count">
          {idx + 1}/{questions.length}
        </div>
      </div>
      <div className="quiz-meta">
        <span className="chip" style={{ background: world.color }}>
          {world.title}
        </span>
        <span className="chip chip-soft">{level.title}</span>
        <span className="quiz-score">✔ {score}</span>
      </div>

      <div className="card question-card">
        <p className="q-text">
          <MathText text={q.text} />
        </p>
        {q.formula && (
          <div className="formula">
            <MathText text={q.formula} />
          </div>
        )}
        <Visual visual={q.visual} />
      </div>

      <div className="options" role="list">
        {q.options.map((o, i) => {
          let cls = 'option';
          if (answered) {
            if (i === correctIdx) cls += ' correct';
            else if (i === chosen) cls += ' wrong';
            else cls += ' dim';
          }
          return (
            <button key={i} className={cls} onClick={() => choose(i)} disabled={answered} role="listitem">
              <span className="letter">{LETTERS[i]}</span>
              <MathText text={o.text} className="opt-text" />
              {answered && i === correctIdx && <span className="mark">✔</span>}
              {answered && i === chosen && i !== correctIdx && <span className="mark">✗</span>}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`feedback ${ok ? 'ok' : 'ko'}`} ref={feedbackRef}>
          <div className="fb-title">{ok ? '✔ Corretto!' : '✗ Risposta sbagliata'}</div>
          {!ok && (
            <div className="fb-why">
              <strong>Perché la tua risposta è sbagliata:</strong>
              <p>
                <MathText text={q.options[chosen].why} />
              </p>
              <p className="fb-right">
                Risposta corretta: <strong>{LETTERS[correctIdx]}</strong> — <MathText text={q.options[correctIdx].text} />
              </p>
            </div>
          )}
          {showSol ? (
            <div className="solution">
              <strong>Soluzione passo passo</strong>
              <ol>
                {q.solution.map((s, i) => (
                  <li key={i}>
                    <MathText text={s} />
                  </li>
                ))}
              </ol>
              {q.tip && (
                <p className="tip">
                  💡 <MathText text={q.tip} />
                </p>
              )}
            </div>
          ) : (
            <button className="btn-link" onClick={() => setShowSol(true)}>
              Mostra la soluzione passo passo
            </button>
          )}
        </div>
      )}

      <div className="quiz-actions">
        <button className="btn-primary" onClick={next} disabled={!answered}>
          {answered ? (isLast ? 'Vedi il risultato' : 'Prossima domanda →') : 'Scegli una risposta'}
        </button>
      </div>
    </div>
  );
}
