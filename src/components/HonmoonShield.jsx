export default function HonmoonShield({ power, maxPower, color }) {
  const pct = Math.min(power / maxPower, 1), glow = pct * 40;
  return (
    <div style={{ textAlign: "center", margin: "6px 0" }}>
      <div style={{ width: 100, height: 100, borderRadius: "50%", margin: "0 auto", position: "relative", animation: pct >= 1 ? "shieldComplete 1s ease infinite" : undefined }}>
        <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, animation: "spinSlow 20s linear infinite" }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map(d => (
            <line key={d} x1="50" y1="3" x2="50" y2="10" stroke={color} strokeWidth="2"
              opacity={pct > d / 360 ? 0.8 : 0.15} transform={`rotate(${d} 50 50)`} strokeLinecap="round" />
          ))}
        </svg>
        <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: `3px solid ${color}`, background: `conic-gradient(${color}cc ${pct * 360}deg, #1a1a2e ${pct * 360}deg)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${glow}px ${color}, inset 0 0 ${glow / 2}px ${color}55`, transition: "all 0.6s ease" }}>
          <div style={{ width: 62, height: 62, borderRadius: "50%", background: "#12122a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <span style={{ fontSize: 10, color: "#888", fontFamily: "'Secular One'" }}>הונמון</span>
            <span style={{ fontSize: 18, fontWeight: 800, color, fontFamily: "'Secular One'" }}>{power}/{maxPower}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
