import Plot from './Plot.jsx';

function DataTable({ headers, rows }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function niceStep(max) {
  const raw = max / 6;
  const pow = 10 ** Math.floor(Math.log10(raw));
  for (const m of [1, 2, 5, 10]) if (raw <= m * pow) return m * pow;
  return 10 * pow;
}

function Bars({ title, labels, values }) {
  const W = 360;
  const H = 240;
  const pad = { l: 36, r: 10, t: 30, b: 34 };
  const step = niceStep(Math.max(...values));
  const top = Math.ceil((Math.max(...values) * 1.1) / step) * step;
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const bw = iw / labels.length;
  const y = (v) => pad.t + ih - (v / top) * ih;
  const ticks = [];
  for (let v = 0; v <= top; v += step) ticks.push(v);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={title}>
      <text x={W / 2} y={16} textAnchor="middle" className="chart-title">
        {title}
      </text>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="grid" />
          <text x={pad.l - 6} y={y(t) + 4} textAnchor="end" className="tick">
            {t}
          </text>
        </g>
      ))}
      {values.map((v, i) => {
        const x = pad.l + i * bw + bw * 0.18;
        const w = bw * 0.64;
        return (
          <g key={i}>
            <rect x={x} y={y(v)} width={w} height={pad.t + ih - y(v)} rx="3" className="bar" />
            <text x={x + w / 2} y={y(v) - 5} textAnchor="middle" className="bar-val">
              {v}
            </text>
            <text x={x + w / 2} y={H - pad.b + 16} textAnchor="middle" className="tick">
              {labels[i].length > 9 ? labels[i].slice(0, 8) + '.' : labels[i]}
            </text>
          </g>
        );
      })}
      <line x1={pad.l} x2={W - pad.r} y1={pad.t + ih} y2={pad.t + ih} className="axis" />
    </svg>
  );
}

function Frame({ L, W: Wd }) {
  // aiuola rettangolare con passaggio pedonale
  const W = 300;
  const H = 210;
  const s = Math.min(200 / L, 130 / Wd);
  const iw = L * s;
  const ih = Wd * s;
  const g = 22;
  const x0 = (W - iw) / 2;
  const y0 = (H - ih) / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart frame" role="img" aria-label="Aiuola con passaggio pedonale">
      <rect x={x0 - g} y={y0 - g} width={iw + 2 * g} height={ih + 2 * g} className="path-area" />
      <rect x={x0} y={y0} width={iw} height={ih} className="garden" />
      <text x={x0 + iw / 2} y={y0 + ih - 8} textAnchor="middle" className="tick">
        {L} m
      </text>
      <text x={x0 + 8} y={y0 + ih / 2} className="tick">
        {Wd} m
      </text>
      <line x1={x0 + iw} x2={x0 + iw + g} y1={y0 + ih / 2} y2={y0 + ih / 2} className="dim" />
      <text x={x0 + iw + g / 2} y={y0 + ih / 2 - 5} textAnchor="middle" className="tick x-label">
        x
      </text>
    </svg>
  );
}

export default function Visual({ visual }) {
  if (!visual) return null;
  return (
    <div className="visual">
      {visual.type === 'table' && <DataTable {...visual} />}
      {visual.type === 'bars' && <Bars {...visual} />}
      {visual.type === 'plot' && <Plot {...visual} />}
      {visual.type === 'frame' && <Frame {...visual} />}
    </div>
  );
}
