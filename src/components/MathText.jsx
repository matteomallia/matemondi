// Rende testo con frazioni scritte come {{numeratore|denominatore}}
export default function MathText({ text, className }) {
  const parts = String(text).split(/(\{\{[^}|]+\|[^}]+\}\})/g);
  return (
    <span className={className}>
      {parts.map((p, i) => {
        const m = p.match(/^\{\{([^}|]+)\|([^}]+)\}\}$/);
        if (m) {
          return (
            <span className="frac" key={i} aria-label={`${m[1]} fratto ${m[2]}`}>
              <span className="num">{m[1]}</span>
              <span className="den">{m[2]}</span>
            </span>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </span>
  );
}
