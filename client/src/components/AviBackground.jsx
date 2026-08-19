/** Realistic flight-diagram watermarks — fixed behind all pages */

const DIAGRAMS = [
  { top: '1%', left: '0%', width: 360, rotate: -4, kind: 'route' },
  { top: '6%', right: '0%', width: 320, rotate: 3, kind: 'radar' },
  { top: '38%', left: '-2%', width: 300, rotate: 6, kind: 'approach' },
  { top: '50%', right: '0%', width: 340, rotate: -4, kind: 'enroute' },
  { top: '74%', left: '3%', width: 280, rotate: -2, kind: 'plan' },
  { top: '62%', right: '4%', width: 260, rotate: 5, kind: 'radar' },
];

const PLANES = [
  { top: '22%', left: '18%', size: 120, rotate: -12 },
  { top: '48%', right: '15%', size: 100, rotate: 18 },
  { top: '85%', left: '42%', size: 90, rotate: -8 },
];

const STROKE = '#003B51';
const ACCENT = '#C5A572';
const CYAN = '#50B9A1';

/** Large side-view aircraft silhouette */
function PlaneSilhouette({ size }) {
  return (
    <svg width={size} height={size * 0.35} viewBox="0 0 200 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 35 L55 32 L62 22 L68 32 L95 34 L130 30 L145 18 L152 30 L178 34 L185 35 L178 36 L152 40 L145 52 L138 40 L95 36 L68 38 L62 48 L55 38 L20 35 Z"
        fill={STROKE}
        fillOpacity="0.14"
      />
      <path
        d="M95 34 L130 30 M68 32 L95 34"
        stroke={ACCENT}
        strokeOpacity="0.2"
        strokeWidth="1.2"
      />
      <ellipse cx="115" cy="33" rx="8" ry="3" fill={CYAN} fillOpacity="0.15" />
    </svg>
  );
}

function RouteChart({ width }) {
  const h = width * 0.55;
  return (
    <svg width={width} height={h} viewBox="0 0 320 176" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="176" fill="#003B51" fillOpacity="0.04" rx="4" />
      {[40, 80, 120, 160, 200, 240, 280].map((x) => (
        <line key={`v${x}`} x1={x} y1="20" x2={x} y2="156" stroke={STROKE} strokeOpacity="0.1" strokeWidth="0.6" />
      ))}
      {[40, 80, 120].map((y) => (
        <line key={`h${y}`} x1="24" y1={y} x2="296" y2={y} stroke={STROKE} strokeOpacity="0.1" strokeWidth="0.6" />
      ))}
      <path
        d="M48 128 C 90 40, 180 48, 272 88"
        stroke={CYAN}
        strokeOpacity="0.28"
        strokeWidth="2"
        strokeDasharray="8 5"
        fill="none"
      />
      {[
        [48, 128, 'DUB'],
        [118, 72, 'LAM'],
        [198, 58, 'KONAN'],
        [272, 88, 'DXB'],
      ].map(([x, y, label]) => (
        <g key={label}>
          <polygon
            points={`${x},${y - 5} ${x + 4},${y + 3} ${x - 4},${y + 3}`}
            fill={ACCENT}
            fillOpacity="0.25"
            stroke={STROKE}
            strokeOpacity="0.2"
            strokeWidth="0.8"
          />
          <text x={x} y={y + 16} textAnchor="middle" fill={STROKE} fillOpacity="0.22" fontSize="9" fontFamily="monospace">
            {label}
          </text>
        </g>
      ))}
      <circle cx="48" cy="128" r="5" stroke={STROKE} strokeOpacity="0.22" strokeWidth="1.2" fill="none" />
      <circle cx="272" cy="88" r="5" stroke={STROKE} strokeOpacity="0.22" strokeWidth="1.2" fill="none" />
      <g transform="translate(165, 52) rotate(-25) scale(1.4)">
        <path d="M0-8 L2 4 L10 6 L2 8 L0 14 L-2 8 L-10 6 L-2 4 Z" fill={STROKE} fillOpacity="0.2" />
      </g>
    </svg>
  );
}

function RadarScope({ width }) {
  const h = width;
  return (
    <svg width={width} height={h} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="92" stroke={STROKE} strokeOpacity="0.14" strokeWidth="1" />
      {[30, 55, 80].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} stroke={STROKE} strokeOpacity="0.1" strokeWidth="0.7" />
      ))}
      {[0, 45, 90, 135].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1="100"
            y1="100"
            x2={100 + 92 * Math.cos(rad)}
            y2={100 + 92 * Math.sin(rad)}
            stroke={STROKE}
            strokeOpacity="0.08"
            strokeWidth="0.6"
          />
        );
      })}
      <path d="M100 100 L100 12 A88 88 0 0 1 168 52 Z" fill={CYAN} fillOpacity="0.1" />
      {[
        [72, 68, 'EI-AVL'],
        [128, 82, '9H-ALI'],
        [88, 118, 'A6-AVC'],
      ].map(([x, y, t]) => (
        <g key={t}>
          <rect x={x - 3} y={y - 3} width="6" height="6" fill={ACCENT} fillOpacity="0.3" />
          <text x={x + 8} y={y + 3} fill={STROKE} fillOpacity="0.2" fontSize="7" fontFamily="monospace">
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ApproachPlate({ width }) {
  const h = width * 0.7;
  return (
    <svg width={width} height={h} viewBox="0 0 280 196" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="16" width="240" height="164" stroke={STROKE} strokeOpacity="0.14" strokeWidth="1" fill="none" />
      <rect x="118" y="140" width="44" height="8" fill={STROKE} fillOpacity="0.12" rx="1" />
      <text x="140" y="158" textAnchor="middle" fill={STROKE} fillOpacity="0.2" fontSize="8" fontFamily="monospace">
        RWY 28
      </text>
      <line x1="60" y1="40" x2="140" y2="144" stroke={CYAN} strokeOpacity="0.22" strokeWidth="1.2" strokeDasharray="4 3" />
      <line x1="220" y1="40" x2="140" y2="144" stroke={CYAN} strokeOpacity="0.22" strokeWidth="1.2" strokeDasharray="4 3" />
      <path
        d="M200 48 L240 48 Q260 48 260 68 Q260 88 240 88 L200 88 Q180 88 180 68 Q180 48 200 48"
        stroke={ACCENT}
        strokeOpacity="0.22"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M140 144 m-70 0 a70 70 0 0 1 140 0"
        stroke={STROKE}
        strokeOpacity="0.15"
        strokeWidth="1"
        fill="none"
        strokeDasharray="4 3"
      />
    </svg>
  );
}

function EnrouteChart({ width }) {
  const h = width * 0.65;
  return (
    <svg width={width} height={h} viewBox="0 0 300 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 150 L120 90 L200 110 L260 50" stroke={CYAN} strokeOpacity="0.22" strokeWidth="2" fill="none" />
      <text x="155" y="98" fill={STROKE} fillOpacity="0.2" fontSize="8" fontFamily="monospace">
        UL607
      </text>
      {[
        [120, 90, 'LAM'],
        [200, 110, 'BPK'],
      ].map(([x, y, id]) => (
        <g key={id}>
          <circle cx={x} cy={y} r="14" stroke={STROKE} strokeOpacity="0.16" strokeWidth="1" fill="none" />
          <circle cx={x} cy={y} r="2.5" fill={ACCENT} fillOpacity="0.28" />
          <text x={x} y={y + 24} textAnchor="middle" fill={STROKE} fillOpacity="0.2" fontSize="8" fontFamily="monospace">
            {id}
          </text>
        </g>
      ))}
    </svg>
  );
}

function FlightPlanStrip({ width }) {
  const h = width * 0.35;
  return (
    <svg width={width} height={h} viewBox="0 0 260 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="20" width="244" height="52" stroke={STROKE} strokeOpacity="0.14" strokeWidth="1" rx="2" fill={STROKE} fillOpacity="0.04" />
      <line x1="24" y1="46" x2="236" y2="46" stroke={STROKE} strokeOpacity="0.16" strokeWidth="1" />
      {[
        [32, 'DEP', 'DUB'],
        [88, 'WPT', 'LAM'],
        [144, 'WPT', 'KONAN'],
        [200, 'ARR', 'DXB'],
      ].map(([x, type, code]) => (
        <g key={code}>
          <circle cx={x} cy="46" r="4" fill={type === 'DEP' || type === 'ARR' ? ACCENT : CYAN} fillOpacity="0.25" />
          <text x={x} y="62" textAnchor="middle" fill={STROKE} fillOpacity="0.22" fontSize="8" fontFamily="monospace" fontWeight="600">
            {code}
          </text>
        </g>
      ))}
      <text x="130" y="14" textAnchor="middle" fill={STROKE} fillOpacity="0.18" fontSize="8" fontFamily="monospace">
        FPL · EI-AVL · A320 · IFR
      </text>
    </svg>
  );
}

function Diagram({ kind, width }) {
  switch (kind) {
    case 'radar':
      return <RadarScope width={width} />;
    case 'approach':
      return <ApproachPlate width={width} />;
    case 'enroute':
      return <EnrouteChart width={width} />;
    case 'plan':
      return <FlightPlanStrip width={width} />;
    default:
      return <RouteChart width={width} />;
  }
}

export default function AviBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 10%, rgba(197,165,114,0.1) 0%, transparent 42%), radial-gradient(circle at 85% 85%, rgba(80,185,161,0.08) 0%, transparent 40%)',
        }}
      />
      {DIAGRAMS.map((d, i) => (
        <div
          key={`d-${i}`}
          className="absolute"
          style={{
            top: d.top,
            left: d.left,
            right: d.right,
            width: d.width,
            transform: `rotate(${d.rotate}deg)`,
          }}
        >
          <Diagram kind={d.kind} width={d.width} />
        </div>
      ))}
      {PLANES.map((p, i) => (
        <div
          key={`p-${i}`}
          className="absolute"
          style={{
            top: p.top,
            left: p.left,
            right: p.right,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          <PlaneSilhouette size={p.size} />
        </div>
      ))}
    </div>
  );
}
