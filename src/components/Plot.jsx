// Piano cartesiano in SVG: rette, parabole, circonferenze, poligoni e punti.
const COLORS = ['#4f46e5', '#ea580c', '#16a34a', '#db2777'];

function step(range) {
  const raw = range / 10;
  if (raw <= 1) return 1;
  const pow = 10 ** Math.floor(Math.log10(raw));
  for (const m of [1, 2, 5, 10]) if (raw <= m * pow) return m * pow;
  return 10 * pow;
}

const fmt = (v) => String(v).replace('-', '−');

export default function Plot({ xmin = -6, xmax = 6, ymin = -6, ymax = 6, curves = [], points = [], polygon }) {
  const W = 340;
  const xr = xmax - xmin;
  const yr = ymax - ymin;
  const H = Math.round(Math.min(380, Math.max(220, (W * yr) / xr)));
  const pad = 18;
  const sx = (x) => pad + ((x - xmin) / xr) * (W - 2 * pad);
  const sy = (y) => H - pad - ((y - ymin) / yr) * (H - 2 * pad);
  const kx = step(xr);
  const ky = step(yr);
  const xt = [];
  for (let x = Math.ceil(xmin / kx) * kx; x <= xmax; x += kx) xt.push(x);
  const yt = [];
  for (let y = Math.ceil(ymin / ky) * ky; y <= ymax; y += ky) yt.push(y);
  const ax = Math.min(Math.max(0, ymin), ymax); // asse x a y = 0 (o al bordo)
  const ay = Math.min(Math.max(0, xmin), xmax);
  const clipId = 'clip' + Math.random().toString(36).slice(2, 8);

  const curveEls = curves.map((c, i) => {
    const color = c.color || COLORS[i % COLORS.length];
    if (c.kind === 'line') {
      return <line key={i} x1={sx(xmin)} y1={sy(c.m * xmin + c.q)} x2={sx(xmax)} y2={sy(c.m * xmax + c.q)} stroke={color} className="curve" />;
    }
    if (c.kind === 'vline') {
      return <line key={i} x1={sx(c.x)} y1={sy(ymin)} x2={sx(c.x)} y2={sy(ymax)} stroke={color} className="curve" />;
    }
    if (c.kind === 'parabola') {
      const pts = [];
      for (let k = 0; k <= 240; k++) {
        const x = xmin + (xr * k) / 240;
        const y = c.a * x * x + c.b * x + c.c;
        pts.push(`${sx(x).toFixed(1)},${sy(Math.max(Math.min(y, ymax + yr), ymin - yr)).toFixed(1)}`);
      }
      return <polyline key={i} points={pts.join(' ')} stroke={color} className="curve" fill="none" />;
    }
    if (c.kind === 'circle') {
      return <ellipse key={i} cx={sx(c.cx)} cy={sy(c.cy)} rx={Math.abs(sx(c.r) - sx(0))} ry={Math.abs(sy(c.r) - sy(0))} stroke={color} className="curve" fill="none" />;
    }
    return null;
  });

  const labels = curves
    .map((c, i) => ({ c, i }))
    .filter(({ c }) => c.label && c.kind === 'line')
    .map(({ c, i }) => {
      const xl = xmax - xr * 0.06;
      const yl = c.m * xl + c.q;
      const yy = Math.min(Math.max(yl, ymin + yr * 0.05), ymax - yr * 0.05);
      return (
        <text key={'l' + i} x={sx(xl)} y={sy(yy) - 8} className="curve-label" fill={c.color || COLORS[i % COLORS.length]} textAnchor="middle">
          {c.label}
        </text>
      );
    });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart plot" role="img" aria-label="Grafico sul piano cartesiano">
      <defs>
        <clipPath id={clipId}>
          <rect x={pad} y={pad} width={W - 2 * pad} height={H - 2 * pad} />
        </clipPath>
      </defs>
      {xt.map((x) => (
        <line key={'gx' + x} x1={sx(x)} x2={sx(x)} y1={sy(ymin)} y2={sy(ymax)} className="grid" />
      ))}
      {yt.map((y) => (
        <line key={'gy' + y} x1={sx(xmin)} x2={sx(xmax)} y1={sy(y)} y2={sy(y)} className="grid" />
      ))}
      <line x1={sx(xmin)} x2={sx(xmax)} y1={sy(ax)} y2={sy(ax)} className="axis" />
      <line x1={sx(ay)} x2={sx(ay)} y1={sy(ymin)} y2={sy(ymax)} className="axis" />
      <text x={sx(xmax) - 2} y={sy(ax) - 6} textAnchor="end" className="axis-name">
        x
      </text>
      <text x={sx(ay) + 6} y={sy(ymax) + 12} className="axis-name">
        y
      </text>
      {xt
        .filter((x) => x !== ay)
        .map((x) => (
          <text key={'tx' + x} x={sx(x)} y={sy(ax) + 13} textAnchor="middle" className="tick">
            {fmt(x)}
          </text>
        ))}
      {yt
        .filter((y) => y !== ax)
        .map((y) => (
          <text key={'ty' + y} x={sx(ay) - 4} y={sy(y) + 4} textAnchor="end" className="tick">
            {fmt(y)}
          </text>
        ))}
      <g clipPath={`url(#${clipId})`}>
        {polygon && <polygon points={polygon.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')} className="poly" />}
        {curveEls}
      </g>
      {labels}
      {points.map((p, i) => (
        <g key={'p' + i}>
          <circle cx={sx(p.x)} cy={sy(p.y)} r="4" className="pt" />
          {p.label && (
            <text x={sx(p.x) + 7} y={sy(p.y) - 7} className="pt-label">
              {p.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
