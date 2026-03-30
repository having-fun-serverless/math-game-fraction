export default function CharacterSVG({ char, state, danceIdx = 0, size = 160 }) {
  const c = char;
  const dance = state === "dance" ? c.dances[danceIdx % c.dances.length] : null;
  const anim = state === "idle" ? "charIdle" : state === "sad" ? "charSad" : dance || "charIdle";

  const poses = {
    charIdle:      { lArm: -15,  rArm: 15,   lLeg: -5,  rLeg: 5,   bodyY: 0,   headTilt: 0,   bodyRotate: 0  },
    danceSpinKick: { lArm: -80,  rArm: 120,  lLeg: -10, rLeg: 60,  bodyY: -8,  headTilt: -10, bodyRotate: 5  },
    danceWave:     { lArm: -160, rArm: 160,  lLeg: -5,  rLeg: 5,   bodyY: -5,  headTilt: 5,   bodyRotate: 0  },
    danceJump:     { lArm: -140, rArm: -140, lLeg: 30,  rLeg: -30, bodyY: -20, headTilt: 0,   bodyRotate: 0  },
    dancePop:      { lArm: -90,  rArm: 90,   lLeg: -15, rLeg: 15,  bodyY: -6,  headTilt: 10,  bodyRotate: -5 },
    danceSlide:    { lArm: -30,  rArm: -120, lLeg: -20, rLeg: 30,  bodyY: -4,  headTilt: -8,  bodyRotate: 8  },
    danceTwirl:    { lArm: -120, rArm: -60,  lLeg: 10,  rLeg: -10, bodyY: -12, headTilt: 15,  bodyRotate: -10 },
    danceMartial:  { lArm: -170, rArm: 0,    lLeg: 60,  rLeg: 5,   bodyY: -6,  headTilt: -5,  bodyRotate: 10 },
    danceFlip:     { lArm: -90,  rArm: -90,  lLeg: 40,  rLeg: -40, bodyY: -25, headTilt: 0,   bodyRotate: 0  },
    danceGroove:   { lArm: -45,  rArm: 45,   lLeg: -20, rLeg: 20,  bodyY: -3,  headTilt: 8,   bodyRotate: -3 },
    danceKick:     { lArm: -60,  rArm: 140,  lLeg: -5,  rLeg: 80,  bodyY: -5,  headTilt: -5,  bodyRotate: 5  },
    danceSpin360:  { lArm: -150, rArm: 150,  lLeg: 0,   rLeg: 0,   bodyY: -10, headTilt: 0,   bodyRotate: 15 },
    danceStrut:    { lArm: -30,  rArm: 60,   lLeg: -25, rLeg: 25,  bodyY: -2,  headTilt: 12,  bodyRotate: -8 },
    danceBreak:    { lArm: -170, rArm: 30,   lLeg: 50,  rLeg: -20, bodyY: -8,  headTilt: -12, bodyRotate: 12 },
    danceRobot:    { lArm: -90,  rArm: 90,   lLeg: 0,   rLeg: 0,   bodyY: 0,   headTilt: 0,   bodyRotate: 0  },
    danceBounce:   { lArm: -50,  rArm: -50,  lLeg: -15, rLeg: 15,  bodyY: -15, headTilt: 5,   bodyRotate: 0  },
    danceSlither:  { lArm: -30,  rArm: 120,  lLeg: -10, rLeg: 10,  bodyY: -4,  headTilt: -15, bodyRotate: 10 },
    danceNinja:    { lArm: -170, rArm: -10,  lLeg: 70,  rLeg: -5,  bodyY: -10, headTilt: 0,   bodyRotate: 15 },
    danceHipHop:   { lArm: -110, rArm: 40,   lLeg: -20, rLeg: 30,  bodyY: -6,  headTilt: 10,  bodyRotate: -5 },
    charSad:       { lArm: 20,   rArm: -20,  lLeg: -2,  rLeg: 2,   bodyY: 6,   headTilt: -20, bodyRotate: 0  },
  };

  const p = poses[anim] || poses.charIdle;
  const isSad = state === "sad";
  const isDance = state === "dance";

  return (
    <div style={{
      width: size, height: size * 1.4, position: "relative", margin: "0 auto",
      animation: isDance ? "charDanceBounce 0.4s ease infinite" : isSad ? "charSadSway 1.5s ease infinite" : "charBreathing 3s ease infinite",
      filter: isSad ? "saturate(0.4) brightness(0.8)" : isDance ? `drop-shadow(0 0 15px ${c.color}88)` : undefined,
      transition: "filter 0.5s ease",
    }}>
      <svg viewBox="0 0 120 170" style={{ width: "100%", height: "100%" }}>
        {isDance && (
          <g style={{ animation: "sparkleRotate 1s linear infinite" }}>
            {[[-8, 20], [128, 30], [10, 140], [110, 150], [60, -5]].map(([x, y], i) => (
              <text key={i} x={x} y={y} fontSize="10" style={{
                animation: `sparkleFlash 0.5s ease infinite ${i * 0.15}s`,
                opacity: 0,
              }}>✦</text>
            ))}
          </g>
        )}
        {isSad && (
          <g>
            {[[30, 10], [50, 5], [70, 15], [90, 8]].map(([x, y], i) => (
              <line key={i} x1={x} y1={y} x2={x} y2={y + 8} stroke="#6688cc" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"
                style={{ animation: `rainDrop 0.8s ease infinite ${i * 0.2}s` }} />
            ))}
          </g>
        )}

        <g transform={`translate(60, ${85 + p.bodyY}) rotate(${p.bodyRotate})`}>
          <line x1="-8" y1="30" x2={-8 + p.lLeg * 0.3} y2="65" stroke={c.outfit2} strokeWidth="8" strokeLinecap="round"
            style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} />
          <circle cx={-8 + p.lLeg * 0.3} cy="67" r="5" fill={c.outfit2}
            style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} />
          <line x1="8" y1="30" x2={8 + p.rLeg * 0.3} y2="65" stroke={c.outfit2} strokeWidth="8" strokeLinecap="round"
            style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} />
          <circle cx={8 + p.rLeg * 0.3} cy="67" r="5" fill={c.outfit2}
            style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} />

          <rect x="-16" y="-20" width="32" height="50" rx="12" fill={c.outfit1}
            style={{ transition: "all 0.35s ease" }} />
          <rect x="-12" y="5" width="24" height="3" rx="1.5" fill={c.accent} opacity="0.5" />
          <rect x="-10" y="12" width="20" height="2" rx="1" fill={c.accent} opacity="0.3" />

          <line x1="-16" y1="-10" x2={-16 + Math.sin(p.lArm * Math.PI / 180) * 28} y2={-10 - Math.cos(p.lArm * Math.PI / 180) * 28}
            stroke={c.skinTone} strokeWidth="7" strokeLinecap="round"
            style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} />
          <line x1="16" y1="-10" x2={16 + Math.sin(-p.rArm * Math.PI / 180) * 28} y2={-10 - Math.cos(-p.rArm * Math.PI / 180) * 28}
            stroke={c.skinTone} strokeWidth="7" strokeLinecap="round"
            style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} />
          {isDance && (
            <text x={16 + Math.sin(-p.rArm * Math.PI / 180) * 32} y={-10 - Math.cos(-p.rArm * Math.PI / 180) * 32 + 4}
              fontSize="12" textAnchor="middle"
              style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>{c.weapon}</text>
          )}

          <g transform={`translate(0, -30) rotate(${p.headTilt})`}
            style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <ellipse cx="0" cy="-2" rx="20" ry="18" fill={c.hair} />
            <ellipse cx="0" cy="2" rx="16" ry="16" fill={c.skinTone} />
            <path d={`M-16,-8 Q-10,-18 0,-16 Q10,-18 16,-8 Q10,-14 0,-12 Q-10,-14 -16,-8`} fill={c.hair} />
            <path d={`M-16,0 Q-22,10 -18,22`} stroke={c.hair} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d={`M16,0 Q22,10 18,22`} stroke={c.hair} strokeWidth="4" fill="none" strokeLinecap="round" />
            {isSad ? (
              <>
                <path d="M-7,2 Q-5,6 -3,2" stroke="#333" strokeWidth="1.5" fill="none" />
                <path d="M3,2 Q5,6 7,2" stroke="#333" strokeWidth="1.5" fill="none" />
                <circle cx="-7" cy="7" r="1.5" fill="#88bbee" style={{ animation: "tearDrop 1s ease infinite" }} />
                <circle cx="7" cy="8" r="1.5" fill="#88bbee" style={{ animation: "tearDrop 1s ease infinite 0.3s" }} />
              </>
            ) : isDance ? (
              <>
                <ellipse cx="-6" cy="1" rx="3.5" ry="4" fill="#333" />
                <ellipse cx="6" cy="1" rx="3.5" ry="4" fill="#333" />
                <circle cx="-5" cy="0" r="1.2" fill="#fff" />
                <circle cx="7" cy="0" r="1.2" fill="#fff" />
                <text x="-6" y="4" fontSize="4" textAnchor="middle" style={{ animation: "sparkleFlash 0.4s ease infinite" }}>✦</text>
                <text x="6" y="4" fontSize="4" textAnchor="middle" style={{ animation: "sparkleFlash 0.4s ease infinite 0.2s" }}>✦</text>
              </>
            ) : (
              <>
                <ellipse cx="-6" cy="1" rx="3" ry="3.5" fill="#333" />
                <ellipse cx="6" cy="1" rx="3" ry="3.5" fill="#333" />
                <circle cx="-5" cy="0" r="1" fill="#fff" />
                <circle cx="7" cy="0" r="1" fill="#fff" />
              </>
            )}
            {isSad ? (
              <path d="M-5,10 Q0,7 5,10" stroke="#cc6666" strokeWidth="1.5" fill="none" />
            ) : isDance ? (
              <path d="M-6,8 Q0,15 6,8" stroke="#e06080" strokeWidth="1.5" fill="#e0608033" />
            ) : (
              <path d="M-4,9 Q0,12 4,9" stroke="#cc8888" strokeWidth="1.2" fill="none" />
            )}
            {isDance && <>
              <circle cx="-11" cy="6" r="3" fill="#ff88aa" opacity="0.3" />
              <circle cx="11" cy="6" r="3" fill="#ff88aa" opacity="0.3" />
            </>}
          </g>
        </g>
      </svg>
    </div>
  );
}
