import { obstacleById } from '../data/obstacles';

export default function Obstacle({ id, width, height }) {
  const obs = obstacleById(id);
  const w = width  ?? obs.width;
  const h = height ?? obs.height;
  const c = obs.color;

  const shapes = {
    cactus_small: <>
      <rect x={11} y={10} width={8} height={40} rx={3} fill={c} />
      <rect x={2}  y={20} width={9} height={7} rx={3} fill={c} />
      <rect x={11} y={18} width={6} height={4} rx={2} fill={c} />
      <rect x={19} y={16} width={9} height={7} rx={3} fill={c} />
      <rect x={15} y={14} width={5} height={4} rx={2} fill={c} />
    </>,
    cactus_tall: <>
      <rect x={13} y={2} width={8} height={74} rx={3} fill={c} />
      <rect x={2}  y={18} width={11} height={7} rx={3} fill={c} />
      <rect x={13} y={16} width={7} height={4} rx={2} fill={c} />
      <rect x={24} y={12} width={10} height={7} rx={3} fill={c} />
      <rect x={20} y={10} width={7} height={4} rx={2} fill={c} />
    </>,
    tumbleweed: <>
      <circle cx={23} cy={23} r={21} fill="none" stroke={c} strokeWidth={4} />
      <line x1={2} y1={23} x2={44} y2={23} stroke={c} strokeWidth={2.5} />
      <line x1={23} y1={2} x2={23} y2={44} stroke={c} strokeWidth={2.5} />
      <line x1={8} y1={8} x2={38} y2={38} stroke={c} strokeWidth={2} />
      <line x1={38} y1={8} x2={8} y2={38} stroke={c} strokeWidth={2} />
      <circle cx={23} cy={23} r={5} fill={c} />
    </>,
    pizza_slice_pile: <>
      <polygon points="27,4 52,40 2,40" fill={c} stroke="#e67700" strokeWidth={2} />
      <polygon points="27,12 47,40 7,40" fill="#ffd43b" />
      <circle cx={22} cy={28} r={3} fill="#e03131" />
      <circle cx={32} cy={24} r={3} fill="#e03131" />
      <circle cx={28} cy={34} r={2.5} fill="#e03131" />
    </>,
    balloon_string: <>
      <ellipse cx={20} cy={20} rx={16} ry={18} fill={c} />
      <ellipse cx={14} cy={14} rx={5} ry={7} fill="#ff8787" opacity={0.5} />
      <path d="M20 38 Q 18 48 20 60" fill="none" stroke="#888" strokeWidth={2} />
      <path d="M16 4 Q20 1 24 4" fill="none" stroke="#e03131" strokeWidth={2} />
    </>,
    crate_low: <>
      <rect x={2} y={4} width={40} height={30} rx={2} fill={c} stroke="#6f4e1a" strokeWidth={2} />
      <line x1={22} y1={4} x2={22} y2={34} stroke="#6f4e1a" strokeWidth={2} />
      <line x1={2} y1={19} x2={42} y2={19} stroke="#6f4e1a" strokeWidth={2} />
      <line x1={2} y1={4} x2={22} y2={19} stroke="#6f4e1a" strokeWidth={1.5} opacity={0.5} />
      <line x1={42} y1={4} x2={22} y2={19} stroke="#6f4e1a" strokeWidth={1.5} opacity={0.5} />
    </>,
    crate_tall: <>
      <rect x={5} y={2} width={38} height={42} rx={2} fill={c} stroke="#6f4e1a" strokeWidth={2} />
      <line x1={24} y1={2} x2={24} y2={44} stroke="#6f4e1a" strokeWidth={2} />
      <line x1={5} y1={23} x2={43} y2={23} stroke="#6f4e1a" strokeWidth={2} />
      <rect x={18} y={0} width={12} height={6} rx={2} fill="#6f4e1a" />
    </>,
    snake: <>
      <path d="M4 12 Q16 0 28 12 Q40 24 52 12 Q58 6 60 10" fill="none" stroke={c} strokeWidth={10} strokeLinecap="round" />
      <path d="M4 12 Q16 0 28 12 Q40 24 52 12 Q58 6 60 10" fill="none" stroke="#86efac" strokeWidth={4} strokeLinecap="round" opacity={0.5} />
      <ellipse cx={5} cy={12} rx={7} ry={5} fill="#16a34a" />
      <circle cx={3} cy={10} r={1.5} fill="#fff" />
    </>,
    beehive: <>
      <ellipse cx={24} cy={26} rx={20} ry={20} fill={c} />
      <ellipse cx={24} cy={22} rx={16} ry={16} fill="#ffd43b" />
      <ellipse cx={24} cy={18} rx={12} ry={10} fill="#fab005" />
      <line x1={4} y1={26} x2={44} y2={26} stroke="#e67700" strokeWidth={1.5} opacity={0.6} />
      <line x1={8} y1={18} x2={40} y2={18} stroke="#e67700" strokeWidth={1.5} opacity={0.6} />
      <ellipse cx={24} cy={40} rx={10} ry={5} fill="#e67700" />
    </>,
    log_rolling: <>
      <ellipse cx={29} cy={14} rx={26} ry={12} fill={c} />
      <ellipse cx={29} cy={14} rx={20} ry={8} fill="#8c5a27" />
      <line x1={3} y1={14} x2={55} y2={14} stroke="#5a3a10" strokeWidth={2} opacity={0.5} />
      <line x1={3} y1={10} x2={55} y2={10} stroke="#5a3a10" strokeWidth={1.5} opacity={0.3} />
    </>,
    barrel: <>
      <ellipse cx={21} cy={10} rx={18} ry={8} fill={c} />
      <rect x={3} y={10} width={36} height={30} fill={c} />
      <ellipse cx={21} cy={40} rx={18} ry={8} fill={c} />
      <rect x={3} y={16} width={36} height={3} fill="#fab005" />
      <rect x={3} y={31} width={36} height={3} fill="#fab005" />
    </>,
    fence_low: <>
      <rect x={2}  y={12} width={7} height={24} rx={2} fill={c} />
      <rect x={22} y={12} width={7} height={24} rx={2} fill={c} />
      <rect x={42} y={12} width={7} height={24} rx={2} fill={c} />
      <rect x={2}  y={14} width={47} height={5} rx={2} fill={c} />
      <rect x={2}  y={24} width={47} height={5} rx={2} fill={c} />
      <polygon points="5,12 8.5,7 12,12"  fill={c} />
      <polygon points="25,12 28.5,7 32,12" fill={c} />
      <polygon points="45,12 48.5,7 52,12" fill={c} />
    </>,
    swinging_rope: <>
      <path d="M9 2 Q14 30 9 58" fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" />
      <ellipse cx={9} cy={2} rx={4} ry={3} fill="#8c6d31" />
      <circle cx={9} cy={58} r={4} fill="#8c6d31" />
    </>,
    bird_low: <>
      <ellipse cx={23} cy={15} rx={12} ry={8} fill={c} />
      <path d="M2 15 Q13 6 23 15"  fill="none" stroke={c} strokeWidth={4} strokeLinecap="round" />
      <path d="M23 15 Q33 6 46 15" fill="none" stroke={c} strokeWidth={4} strokeLinecap="round" />
      <circle cx={32} cy={12} r={2.5} fill="#333" />
      <path d="M36 13 L42 11 L38 15 Z" fill="#f59f00" />
    </>,
    gopher_hole: <>
      <ellipse cx={29} cy={8} rx={26} ry={8} fill="#212529" />
      <ellipse cx={29} cy={8} rx={22} ry={5} fill="#1a1e21" />
      <circle cx={22} cy={5} r={2} fill="#ffd43b" opacity={0.8} />
      <circle cx={36} cy={5} r={2} fill="#ffd43b" opacity={0.8} />
    </>,
    spike_strip: <>
      <rect x={0} y={12} width={60} height={8} rx={2} fill={c} />
      {[3,11,19,27,35,43,51].map(x=>(
        <polygon key={x} points={`${x},12 ${x+4},12 ${x+2},2`} fill="#adb5bd" />
      ))}
    </>,
    lightning_bolt: <>
      <polygon points="18,2 6,32 16,32 10,62 28,26 18,26 30,2" fill={c} stroke="#e67700" strokeWidth={1.5} />
    </>,
    hot_air_balloon_low: <>
      <ellipse cx={22} cy={22} rx={20} ry={24} fill={c} />
      <path d="M2 22 Q22 -2 42 22" fill="#e64980" />
      <line x1={14} y1={44} x2={10} y2={54} stroke="#888" strokeWidth={2} />
      <line x1={30} y1={44} x2={34} y2={54} stroke="#888" strokeWidth={2} />
      <rect x={8} y={52} width={28} height={8} rx={3} fill="#8c5a1a" />
    </>,
    rubber_duck_army: <>
      {[0,18,36].map(ox=>(
        <g key={ox} transform={`translate(${ox},0)`}>
          <ellipse cx={12} cy={22} rx={10} ry={8} fill={c} />
          <circle cx={12} cy={14} r={7} fill={c} />
          <path d="M17 14 L22 13 L20 16 Z" fill="#f59f00" />
          <circle cx={14} cy={12} r={1.5} fill="#333" />
        </g>
      ))}
    </>,
    wind_gust_dust: <>
      <ellipse cx={32} cy={22} rx={30} ry={20} fill={c} opacity={0.8} />
      <ellipse cx={20} cy={30} rx={18} ry={12} fill="#dee2e6" opacity={0.6} />
      <ellipse cx={44} cy={28} rx={16} ry={10} fill="#adb5bd" opacity={0.5} />
    </>,
    cymbal_crash: <>
      <ellipse cx={16} cy={16} rx={14} ry={5} fill={c} />
      <ellipse cx={36} cy={20} rx={14} ry={5} fill={c} />
      <circle cx={16} cy={16} r={4} fill="#e67700" />
      <circle cx={36} cy={20} r={4} fill="#e67700" />
      {[0,1,2,3].map(i=>(
        <line key={i} x1={26+Math.cos(i*1.57)*8} y1={18+Math.sin(i*1.57)*6}
          x2={26+Math.cos(i*1.57)*14} y2={18+Math.sin(i*1.57)*10}
          stroke="#ffd43b" strokeWidth={2} opacity={0.7} />
      ))}
    </>,
    piano_falling: <>
      <g transform="rotate(-15,29,26)">
        <rect x={4} y={4} width={50} height={44} rx={4} fill="#212529" />
        <rect x={8} y={8} width={42} height={20} rx={2} fill="#343a40" />
        {[12,19,26,33,40].map(x=>(
          <rect key={x} x={x} y={8} width={5} height={14} rx={1} fill="white" />
        ))}
        {[15,22,36,43].map(x=>(
          <rect key={x} x={x} y={8} width={4} height={10} rx={1} fill="#212529" />
        ))}
      </g>
    </>,
    percent_sign_sign: <>
      <rect x={20} y={30} width={6} height={18} rx={2} fill="#888" />
      <rect x={8} y={40} width={30} height={6} rx={2} fill="#888" />
      <circle cx={23} cy={24} r={18} fill="white" stroke={c} strokeWidth={3} />
      <text x="23" y="31" textAnchor="middle" fontSize="20" fontWeight="bold" fill={c}>%</text>
    </>,
    bar_chart_wall: <>
      {[{x:2,h:52},{x:14,h:38},{x:26,h:48},{x:38,h:28},{x:50,h:44}].map(({x,h})=>(
        <rect key={x} x={x} y={52-h} width={10} height={h} rx={2} fill={c} />
      ))}
      <rect x={0} y={52} width={62} height={3} fill="#495057" />
    </>,
    pie_chart_roller: <>
      <circle cx={24} cy={24} r={22} fill={c} />
      <path d="M24 24 L46 24 A22 22 0 0 0 24 2 Z" fill="#ffa8c5" />
      <path d="M24 24 L24 2 A22 22 0 0 0 2 24 Z" fill="#e64980" />
      <path d="M24 24 L2 24 A22 22 0 0 0 24 46 Z" fill="#fa5252" />
      <circle cx={24} cy={24} r={5} fill="white" />
    </>,
    dice_tower: <>
      {[0,1,2].map(i=>(
        <g key={i}>
          <rect x={8} y={4+i*20} width={24} height={18} rx={3} fill="white" stroke="#dee2e6" strokeWidth={2} />
          {i===0 && <circle cx={20} cy={13} r={2.5} fill="#333" />}
          {i===1 && <><circle cx={14} cy={10} r={2} fill="#333"/><circle cx={26} cy={10} r={2} fill="#333"/>
            <circle cx={14} cy={18} r={2} fill="#333"/><circle cx={26} cy={18} r={2} fill="#333"/></>}
          {i===2 && <><circle cx={13} cy={9} r={2} fill="#333"/><circle cx={20} cy={13} r={2} fill="#333"/>
            <circle cx={27} cy={17} r={2} fill="#333"/></>}
        </g>
      ))}
    </>,
    coin_fountain: <>
      {[8,16,24,32,44].map((x,i)=>(
        <ellipse key={i} cx={x} cy={50-i*8} rx={5} ry={3} fill={c} opacity={0.8-i*0.1} />
      ))}
      <path d="M10 50 Q28 20 46 50" fill="none" stroke={c} strokeWidth={3} opacity={0.5} />
    </>,
    stopwatch: <>
      <circle cx={21} cy={28} r={18} fill="white" stroke={c} strokeWidth={3} />
      <rect x={17} y={10} width={8} height={5} rx={2} fill={c} />
      <circle cx={21} cy={28} r={14} fill="white" stroke="#dee2e6" strokeWidth={1} />
      <line x1={21} y1={28} x2={21} y2={16} stroke="#333" strokeWidth={2} strokeLinecap="round" />
      <line x1={21} y1={28} x2={32} y2={24} stroke={c} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={21} cy={28} r={2.5} fill="#333" />
    </>,
    calculator_tower: <>
      {[0,1,2].map(i=>(
        <g key={i}>
          <rect x={5} y={2+i*20} width={30} height={18} rx={3} fill="#495057" stroke="#343a40" strokeWidth={1.5} />
          <rect x={8} y={4+i*20} width={24} height={6} rx={2} fill="#73c9b0" />
          {[[8,12],[15,12],[22,12],[8,16],[15,16],[22,16]].map(([bx,by])=>(
            <rect key={`${bx}-${by}`} x={bx} y={by+i*20} width={4} height={3} rx={1} fill="#868e96" />
          ))}
        </g>
      ))}
    </>,
    ruler_beam: <>
      <rect x={0} y={3} width={70} height={13} rx={3} fill={c} />
      <rect x={0} y={3} width={70} height={4} rx={2} fill="#ffd43b" opacity={0.4} />
      {[5,12,19,26,33,40,47,54,61].map(x=>(
        <line key={x} x1={x} y1={3} x2={x} y2={16} stroke="#333" strokeWidth={1.5} opacity={0.6} />
      ))}
    </>,
    flask_spill: <>
      <rect x={18} y={2} width={10} height={14} rx={2} fill={c} />
      <path d="M10 16 L18 16 L18 2 L28 2 L28 16 L36 16 L36 42 Q36 46 30 46 L16 46 Q10 46 10 42 Z" fill={c} />
      <ellipse cx={23} cy={43} rx={13} ry={5} fill="#0ca678" opacity={0.5} />
      <path d="M36 30 Q46 34 52 30 Q50 40 42 38 Z" fill="#15aabf" opacity={0.7} />
    </>,
    probability_spinner: <>
      <circle cx={26} cy={26} r={24} fill="white" stroke="#dee2e6" strokeWidth={2} />
      <path d="M26 26 L50 26 A24 24 0 0 0 26 2 Z" fill="#7950f2" />
      <path d="M26 26 L26 2 A24 24 0 0 0 2 26 Z" fill="#f03e3e" />
      <path d="M26 26 L2 26 A24 24 0 0 0 26 50 Z" fill="#2f9e44" />
      <path d="M26 26 L26 50 A24 24 0 0 0 50 26 Z" fill="#f59f00" />
      <circle cx={26} cy={26} r={4} fill="#333" />
      <line x1={26} y1={26} x2={26} y2={6} stroke="#333" strokeWidth={3} strokeLinecap="round" />
      <polygon points="26,4 23,10 29,10" fill="#333" />
    </>,
    graduation_cap: <>
      <polygon points="28,6 56,18 28,30 0,18" fill="#212529" />
      <rect x={6} y={18} width={44} height={20} rx={2} fill="#343a40" />
      <rect x={6} y={18} width={44} height={6} rx={2} fill="#495057" />
      <line x1={28} y1={30} x2={28} y2={42} stroke="#888" strokeWidth={3} />
      <circle cx={28} cy={44} r={4} fill="#ffd43b" />
    </>,
  };

  const shape = shapes[id] || shapes.cactus_small;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}
      style={{ display:'block', overflow:'visible' }}>
      {shape}
    </svg>
  );
}
