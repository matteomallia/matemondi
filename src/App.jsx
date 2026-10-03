import { useState } from 'react';
import { WORLDS, PASS_SCORE, QUESTIONS_PER_LEVEL } from './worlds/index.js';
import { loadProgress, saveProgress, starsFor, isTeacherMode } from './lib/progress.js';
import Quiz from './components/Quiz.jsx';

const teacher = isTeacherMode();

function Stars({ n, size = '' }) {
  return (
    <span className={`stars ${size}`} aria-label={`${n} stelle su 3`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < n ? 'star on' : 'star'}>
          ★
        </span>
      ))}
    </span>
  );
}

function levelUnlocked(world, i, progress) {
  if (teacher || i === 0) return true;
  const prev = progress[world.levels[i - 1].id];
  return !!prev && prev.best >= PASS_SCORE;
}

function worldStars(world, progress) {
  return world.levels.reduce((s, l) => s + (progress[l.id]?.stars || 0), 0);
}

function WorldMap({ progress, onOpen, onReset }) {
  const total = WORLDS.reduce((s, w) => s + worldStars(w, progress), 0);
  const max = WORLDS.length * 9;
  return (
    <div className="page">
      <header className="hero">
        <div>
          <h1>MateMondi</h1>
          <p>Allenati per l'esame di diploma: scegli un mondo, supera i livelli e raccogli le stelle.</p>
        </div>
        <div className="hero-stars">
          <span className="big-star">★</span>
          <span>
            {total}
            <small>/{max}</small>
          </span>
        </div>
      </header>
      {teacher && <div className="teacher-badge">Modalità docente: tutti i livelli sono sbloccati</div>}
      <div className="worlds">
        {WORLDS.map((w, wi) => {
          const st = worldStars(w, progress);
          const done = w.levels.filter((l) => (progress[l.id]?.best || 0) >= PASS_SCORE).length;
          return (
            <button key={w.id} className="world-card" style={{ '--wc': w.color }} onClick={() => onOpen(w.id)}>
              <div className={`world-icon ${w.icon.length > 4 ? 'long' : ''}`}>{w.icon}</div>
              <div className="world-body">
                <div className="world-num">Mondo {wi + 1}</div>
                <h2>{w.title}</h2>
                <p>{w.description}</p>
                <div className="world-foot">
                  <div className="world-bar">
                    <div style={{ width: `${(done / w.levels.length) * 100}%` }} />
                  </div>
                  <span className="world-stars">
                    ★ {st}/9
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <footer className="foot">
        <p>
          Ogni livello ha {QUESTIONS_PER_LEVEL} domande. Con almeno {PASS_SCORE} risposte giuste sblocchi il livello successivo. ★ 7-8 · ★★ 9 · ★★★ 10
        </p>
        <button className="btn-link small" onClick={onReset}>
          Azzera i progressi
        </button>
      </footer>
    </div>
  );
}

function WorldView({ world, progress, onBack, onPlay }) {
  return (
    <div className="page" style={{ '--wc': world.color }}>
      <button className="btn-ghost" onClick={onBack}>
        ← Tutti i mondi
      </button>
      <header className="world-header">
        <div className={`world-icon big ${world.icon.length > 4 ? 'long' : ''}`}>{world.icon}</div>
        <div>
          <h1>{world.title}</h1>
          <p>{world.description}</p>
        </div>
      </header>
      <div className="levels">
        {world.levels.map((l, i) => {
          const unlocked = levelUnlocked(world, i, progress);
          const p = progress[l.id];
          return (
            <div key={l.id} className={`level-card ${unlocked ? '' : 'locked'}`}>
              <div className="level-num">{unlocked ? i + 1 : '🔒'}</div>
              <div className="level-body">
                <h3>
                  Livello {i + 1} · {l.title}
                </h3>
                <p>{l.description}</p>
                {p ? (
                  <div className="level-best">
                    <Stars n={p.stars} /> Miglior risultato: {p.best}/{QUESTIONS_PER_LEVEL}
                  </div>
                ) : (
                  <div className="level-best muted">{unlocked ? 'Non ancora giocato' : `Sblocca con almeno ${PASS_SCORE}/10 nel livello ${i}`}</div>
                )}
              </div>
              <button className="btn-primary" disabled={!unlocked} onClick={() => onPlay(world.id, i)}>
                {p ? 'Rigioca' : 'Gioca'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Results({ world, levelIndex, score, progress, onRetry, onNext, onBack }) {
  const stars = starsFor(score);
  const passed = score >= PASS_SCORE;
  const hasNext = levelIndex < world.levels.length - 1;
  const msg =
    score === 10
      ? 'Perfetto! Livello dominato.'
      : score >= 9
        ? 'Ottimo lavoro, quasi perfetto!'
        : passed
          ? 'Livello superato! Puoi passare al successivo o riprovare per più stelle.'
          : score >= 5
            ? 'Ci sei quasi! Rileggi le spiegazioni e riprova.'
            : 'Non scoraggiarti: rivedi le soluzioni passo passo e riprova.';
  return (
    <div className="page results" style={{ '--wc': world.color }}>
      <div className="card results-card">
        <div className="results-world">
          {world.title} · Livello {levelIndex + 1}
        </div>
        <div className="results-score">
          {score}
          <small>/{QUESTIONS_PER_LEVEL}</small>
        </div>
        <Stars n={stars} size="lg" />
        <p className="results-msg">{msg}</p>
        {passed && hasNext && <p className="unlock">🔓 Livello {levelIndex + 2} sbloccato!</p>}
        <div className="results-actions">
          {passed && hasNext && (
            <button className="btn-primary" onClick={onNext}>
              Livello successivo →
            </button>
          )}
          <button className={passed && hasNext ? 'btn-secondary' : 'btn-primary'} onClick={onRetry}>
            Riprova (domande nuove)
          </button>
          <button className="btn-secondary" onClick={onBack}>
            Torna al mondo
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [view, setView] = useState({ name: 'map' });
  const [attempt, setAttempt] = useState(0);

  const world = WORLDS.find((w) => w.id === view.worldId);

  function play(worldId, levelIndex) {
    setAttempt((a) => a + 1);
    setView({ name: 'quiz', worldId, levelIndex });
    window.scrollTo(0, 0);
  }

  function finish(score) {
    const lvl = world.levels[view.levelIndex];
    const prev = progress[lvl.id];
    const best = Math.max(prev?.best || 0, score);
    const next = { ...progress, [lvl.id]: { best, stars: starsFor(best), attempts: (prev?.attempts || 0) + 1 } };
    setProgress(next);
    saveProgress(next);
    setView({ name: 'results', worldId: view.worldId, levelIndex: view.levelIndex, score });
    window.scrollTo(0, 0);
  }

  function reset() {
    if (window.confirm('Vuoi davvero azzerare tutti i progressi?')) {
      setProgress({});
      saveProgress({});
    }
  }

  if (view.name === 'world' && world) {
    return <WorldView world={world} progress={progress} onBack={() => setView({ name: 'map' })} onPlay={play} />;
  }
  if (view.name === 'quiz' && world) {
    return (
      <Quiz
        key={attempt}
        world={world}
        level={world.levels[view.levelIndex]}
        attempt={attempt}
        onExit={() => setView({ name: 'world', worldId: world.id })}
        onFinish={finish}
      />
    );
  }
  if (view.name === 'results' && world) {
    return (
      <Results
        world={world}
        levelIndex={view.levelIndex}
        score={view.score}
        progress={progress}
        onRetry={() => play(world.id, view.levelIndex)}
        onNext={() => play(world.id, view.levelIndex + 1)}
        onBack={() => setView({ name: 'world', worldId: world.id })}
      />
    );
  }
  return <WorldMap progress={progress} onOpen={(id) => setView({ name: 'world', worldId: id })} onReset={reset} />;
}
