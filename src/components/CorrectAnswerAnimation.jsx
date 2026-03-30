import { useState, useEffect } from 'react';

function AnimWrapper({ children }) {
  return (
    <div style={{
      marginTop: 12,
      padding: '16px 12px',
      background: 'rgba(255,100,50,0.06)',
      border: '1px solid rgba(255,107,107,0.2)',
      borderRadius: 16,
      animation: 'scaleIn 0.3s ease',
    }}>
      {children}
    </div>
  );
}

function FallbackAnswer({ a }) {
  return (
    <AnimWrapper>
      <div style={{ textAlign: 'center', fontSize: 26, fontWeight: 900, color: '#FFD700', direction: 'ltr', fontFamily: "'Secular One'" }}>
        = {a}
      </div>
    </AnimWrapper>
  );
}

// Level 1: × ÷ by 10/100/1000 — decimal dot physically slides
function Level1Animation({ q, a }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const match = q.match(/^([\d.]+)\s*([×÷])\s*(\d+)\s*=\s*\?$/);
  if (!match) return <FallbackAnswer a={a} />;

  const numStr = match[1];
  const op = match[2];
  const mult = parseInt(match[3]);
  const places = Math.round(Math.log10(mult));

  const origDotIdx = numStr.indexOf('.');
  const digits = numStr.replace('.', '').split('');
  const startDotPos = origDotIdx === -1 ? digits.length : origDotIdx;

  let displayDigits;
  let startPos;
  let endPos;

  if (op === '×') {
    const digitsAfterDot = digits.length - startDotPos;
    const zerosToAdd = Math.max(0, places - digitsAfterDot);
    displayDigits = [...digits, ...Array(zerosToAdd).fill('0')];
    startPos = startDotPos;
    endPos = startDotPos + places;
  } else {
    const rawEndPos = startDotPos - places;
    if (rawEndPos >= 1) {
      displayDigits = [...digits];
      startPos = startDotPos;
      endPos = rawEndPos;
    } else {
      const zerosNeeded = 1 - rawEndPos;
      displayDigits = [...Array(zerosNeeded).fill('0'), ...digits];
      startPos = startDotPos + zerosNeeded;
      endPos = 1;
    }
  }

  const BOX_W = 32;
  const GAP = 3;
  const STEP = BOX_W + GAP;

  // Dot centered in the gap between boxes: left edge at dotPos*STEP - GAP/2 - 4 (half of 8px dot)
  const startLeft = startPos * STEP - GAP / 2 - 4;
  const endLeft = endPos * STEP - GAP / 2 - 4;

  const addedCount = displayDigits.length - digits.length;

  return (
    <AnimWrapper>
      <div style={{ fontSize: 12, color: '#aaa', marginBottom: 10, textAlign: 'center', fontFamily: "'Heebo'" }}>
        {op === '×'
          ? `כפל ב-${mult}: הנקודה זזה ${places} מקומות ימינה ←`
          : `חילוק ב-${mult}: הנקודה זזה ${places} מקומות שמאלה →`}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <div style={{ position: 'relative', display: 'inline-flex', direction: 'ltr', gap: GAP, paddingBottom: 14, paddingRight: 16 }}>
          {displayDigits.map((d, i) => {
            const isAdded = op === '×'
              ? i >= digits.length
              : i < addedCount;
            return (
              <div key={i} style={{
                width: BOX_W, height: BOX_W,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${isAdded ? 'rgba(255,255,255,0.08)' : 'rgba(255,215,0,0.3)'}`,
                borderRadius: 6,
                fontSize: 18,
                fontWeight: 700,
                color: isAdded ? '#555' : '#e0e0e0',
                fontFamily: "'Secular One'",
                background: isAdded ? 'rgba(255,255,255,0.02)' : 'rgba(255,215,0,0.06)',
              }}>{d}</div>
            );
          })}
          {/* Animated decimal dot */}
          <div style={{
            position: 'absolute',
            bottom: 3,
            left: phase >= 1 ? endLeft : startLeft,
            width: 8, height: 8,
            borderRadius: '50%',
            background: '#FFD700',
            boxShadow: '0 0 8px #FFD700, 0 0 16px #FFD70066',
            transition: phase >= 1 ? 'left 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
            zIndex: 2,
          }} />
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        fontSize: 26, fontWeight: 900,
        color: '#FFD700',
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        fontFamily: "'Secular One'",
        direction: 'ltr',
      }}>= {a}</div>
    </AnimWrapper>
  );
}

// Levels 2 & 3: decimal × decimal — count decimal places then reveal
function Level23Animation({ q, a }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const match = q.match(/^([\d.]+)\s*×\s*([\d.]+)/);
  if (!match) return <FallbackAnswer a={a} />;

  const numA = match[1];
  const numB = match[2];
  const decA = numA.includes('.') ? numA.split('.')[1].length : 0;
  const decB = numB.includes('.') ? numB.split('.')[1].length : 0;
  const totalDec = decA + decB;
  const intA = parseInt(numA.replace('.', ''));
  const intB = parseInt(numB.replace('.', ''));
  const intResult = intA * intB;

  const badgeStyle = {
    display: 'inline-block',
    background: 'rgba(255,105,180,0.2)',
    border: '1px solid rgba(255,105,180,0.5)',
    borderRadius: 8,
    padding: '2px 8px',
    color: '#FF69B4',
    fontSize: 11,
    fontFamily: "'Heebo'",
    marginTop: 4,
    opacity: phase >= 1 ? 1 : 0,
    transition: 'opacity 0.4s ease',
  };

  return (
    <AnimWrapper>
      {/* Step 1: operands with decimal-place badges */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 16, direction: 'ltr', marginBottom: 10 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', fontFamily: "'Secular One'" }}>{numA}</div>
          <div style={badgeStyle}>{decA} מקום</div>
        </div>
        <div style={{ fontSize: 22, color: '#888', paddingTop: 2 }}>×</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', fontFamily: "'Secular One'" }}>{numB}</div>
          <div style={badgeStyle}>{decB} מקום</div>
        </div>
      </div>

      {/* Step 2: sum of decimal places */}
      <div style={{
        textAlign: 'center',
        fontSize: 13,
        color: '#FF69B4',
        fontFamily: "'Heebo'",
        marginBottom: 10,
        opacity: phase >= 2 ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}>
        {decA} + {decB} = <strong>{totalDec}</strong> מקומות עשרוניים בתוצאה
      </div>

      {/* Step 3: integer × and answer */}
      <div style={{ opacity: phase >= 3 ? 1 : 0, transition: 'opacity 0.4s ease', textAlign: 'center' }}>
        <div style={{ color: '#888', fontSize: 14, direction: 'ltr', marginBottom: 4 }}>
          {intA} × {intB} = {intResult}
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#FF69B4', direction: 'ltr', fontFamily: "'Secular One'" }}>
          = {a}
        </div>
      </div>
    </AnimWrapper>
  );
}

// Level 4: decimal ÷ decimal — multiply both to clear decimals
function Level4Animation({ q, a }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1000);
    const t3 = setTimeout(() => setPhase(3), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const match = q.match(/^([\d.]+)\s*÷\s*([\d.]+)/);
  if (!match) return <FallbackAnswer a={a} />;

  const strA = match[1];
  const strB = match[2];
  const decA = strA.includes('.') ? strA.split('.')[1].length : 0;
  const decB = strB.includes('.') ? strB.split('.')[1].length : 0;
  const mult = Math.pow(10, Math.max(decA, decB));
  const intA = Math.round(parseFloat(strA) * mult);
  const intB = Math.round(parseFloat(strB) * mult);

  return (
    <AnimWrapper>
      <div style={{ textAlign: 'center', direction: 'ltr' }}>
        <div style={{ fontSize: 20, color: '#ccc', fontFamily: "'Secular One'", marginBottom: 8 }}>
          {strA} ÷ {strB}
        </div>

        <div style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          marginBottom: 6,
        }}>
          <div style={{ fontSize: 12, color: '#aaa', fontFamily: "'Heebo'", marginBottom: 4, direction: 'rtl' }}>
            {`מכפילים שניהם ב-${mult}`}
          </div>
          <div style={{ fontSize: 20, color: '#9B59B6', fontFamily: "'Secular One'" }}>
            {intA} ÷ {intB}
          </div>
        </div>

        <div style={{ opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.4s ease', color: '#666', fontSize: 18, marginBottom: 4 }}>
          ↓
        </div>

        <div style={{
          fontSize: 26, fontWeight: 900,
          color: '#9B59B6',
          fontFamily: "'Secular One'",
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}>
          = {a}
        </div>
      </div>
    </AnimWrapper>
  );
}

// Level 5: fraction → decimal — SVG ring fill
function Level5Animation({ q, a }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const match = q.match(/(\d+)\/(\d+)/);
  if (!match) return <FallbackAnswer a={a} />;

  const n = parseInt(match[1]);
  const d = parseInt(match[2]);
  const fraction = n / d;

  const r = 42;
  const cx = 55;
  const cy = 55;
  const circumference = 2 * Math.PI * r;
  const dashOffset = phase >= 1 ? circumference * (1 - fraction) : circumference;

  return (
    <AnimWrapper>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 22, color: '#fff', fontFamily: "'Secular One'", direction: 'ltr', marginBottom: 6 }}>
          {n}/{d}
        </div>

        <svg width={110} height={110} style={{ display: 'block', margin: '0 auto' }}>
          {/* Background ring */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={10} />
          {/* Animated fill arc */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#FFD700"
            strokeWidth={10}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: phase >= 1 ? 'stroke-dashoffset 1s ease' : 'none' }}
          />
          {/* Fraction label in center */}
          <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={14} fontWeight="bold">{n}</text>
          <line x1={cx - 14} y1={cy} x2={cx + 14} y2={cy} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
          <text x={cx} y={cy + 16} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={12}>{d}</text>
        </svg>

        <div style={{
          fontSize: 26, fontWeight: 900,
          color: '#FFD700',
          fontFamily: "'Secular One'",
          direction: 'ltr',
          marginTop: 6,
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}>
          = {a}
        </div>
      </div>
    </AnimWrapper>
  );
}

export default function CorrectAnswerAnimation({ currentQ, levelId }) {
  if (levelId === 1) return <Level1Animation q={currentQ.q} a={currentQ.a} />;
  if (levelId === 2 || levelId === 3) return <Level23Animation q={currentQ.q} a={currentQ.a} />;
  if (levelId === 4) return <Level4Animation q={currentQ.q} a={currentQ.a} />;
  if (levelId === 5) return <Level5Animation q={currentQ.q} a={currentQ.a} />;
  return <FallbackAnswer a={currentQ.a} />;
}
