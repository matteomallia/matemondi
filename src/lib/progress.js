// Progressi salvati nel browser dello studente (localStorage).
const KEY = 'matemondi-progress-v1';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const p = JSON.parse(raw);
    return p && typeof p === 'object' ? p : {};
  } catch {
    return {};
  }
}

export function saveProgress(p) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage non disponibile: i progressi restano solo in memoria */
  }
}

export function starsFor(score) {
  if (score >= 10) return 3;
  if (score >= 9) return 2;
  if (score >= 7) return 1;
  return 0;
}

export function isTeacherMode() {
  try {
    return new URLSearchParams(window.location.search).has('docente');
  } catch {
    return false;
  }
}
