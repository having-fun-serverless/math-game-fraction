export default function Dino({ state = 'run', frame = 0, flickering = false }) {
  const isDuck = state === 'duck';
  const isHit  = state === 'hit';
  const W = isDuck ? 80 : 60;
  const H = isDuck ? 40 : 60;
  const green = '#4ade80', dark = '#16a34a', hitFilter = 'sepia(1) saturate(4) hue-rotate(-30deg) brightness(1.2)';
  const flickerStyle = flickering ? { animation: 'flicker 0.12s step-start infinite' } : {};

  const Eye = () => (
    <g>
      <ellipse cx={isDuck?68:45} cy={14} rx={5} ry={5} fill="white" />
      <circle cx={isDuck?69:46} cy={14} r={2.5} fill="#052e16" />
      <circle cx={isDuck?70:47} cy={13} r={1} fill="white" />
    </g>
  );

  if (isDuck) return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      style={{ display:'block', filter: isHit?hitFilter:'none', ...flickerStyle }} aria-label="דינוזאור מתכופף">
      <ellipse cx={38} cy={26} rx={34} ry={16} fill={green} />
      <ellipse cx={38} cy={28} rx={22} ry={9} fill="#86efac" opacity={0.5} />
      <ellipse cx={65} cy={16} rx={16} ry={12} fill={green} />
      <rect x={10} y={10} width={50} height={5} rx={2} fill={dark} />
      <rect x={8}  y={34} width={12} height={5} rx={2} fill={dark} />
      <rect x={24} y={34} width={12} height={5} rx={2} fill={dark} />
      <rect x={40} y={32} width={10} height={5} rx={2} fill={dark} />
      <ellipse cx={5} cy={24} rx={7} ry={5} fill={dark} />
      <polygon points="8,39 12,39 10,43"  fill="#bbf7d0" />
      <polygon points="24,39 28,39 26,43" fill="#bbf7d0" />
      <Eye />
      <circle cx={76} cy={19} r={1.5} fill={dark} />
    </svg>
  );

  let legA, legB;
  if (state === 'jump') {
    legA = { x1:24, y1:42, x2:20, y2:50, fx:16, fy:50 };
    legB = { x1:32, y1:42, x2:36, y2:50, fx:40, fy:50 };
  } else if (frame === 0) {
    legA = { x1:22, y1:44, x2:16, y2:58, fx:12, fy:58 };
    legB = { x1:30, y1:44, x2:38, y2:54, fx:42, fy:54 };
  } else {
    legA = { x1:22, y1:44, x2:28, y2:58, fx:32, fy:58 };
    legB = { x1:30, y1:44, x2:20, y2:54, fx:16, fy:54 };
  }
  const Leg = ({l}) => (
    <g>
      <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={dark} strokeWidth={6} strokeLinecap="round" />
      <polygon points={`${l.fx-4},${l.fy} ${l.fx+6},${l.fy} ${l.fx+2},${l.fy+4}`} fill="#bbf7d0" />
    </g>
  );

  return (
    <svg width={W} height={H} viewBox="0 0 60 60"
      style={{ display:'block', filter: isHit?hitFilter:'none', ...flickerStyle }} aria-label="דינוזאור">
      <Leg l={legA} /><Leg l={legB} />
      <path d="M 18 40 Q 4 44 2 52 Q 6 48 16 46 Z" fill={dark} />
      <ellipse cx={28} cy={38} rx={16} ry={14} fill={green} />
      <ellipse cx={29} cy={40} rx={10} ry={8} fill="#86efac" opacity={0.5} />
      <path d="M 20 24 L 22 18 L 26 22 L 28 15 L 32 20 L 34 16 L 36 22 L 38 25"
        fill="none" stroke={dark} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
      <rect x={32} y={22} width={12} height={18} rx={5} fill={green} />
      <rect x={34} y={8} width={20} height={18} rx={6} fill={green} />
      <rect x={36} y={20} width={16} height={8} rx={4} fill={dark} />
      <line x1={38} y1={34} x2={44} y2={42} stroke={dark} strokeWidth={5} strokeLinecap="round" />
      <polygon points="40,42 46,42 43,46" fill="#bbf7d0" />
      <Eye />
      <circle cx={52} cy={20} r={1.5} fill={dark} />
    </svg>
  );
}
