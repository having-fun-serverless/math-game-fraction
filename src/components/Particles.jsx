export default function Particles({ type, color }) {
  const count = type === "fanfare" ? 50 : 20;
  const sym = type === "success"
    ? ["✦", "♪", "⭐", "✧", "💫"]
    : type === "fanfare"
      ? ["🌟", "✨", "⭐", "🎵", "🎶", "💛", "🏆", "🌙"]
      : ["💀", "👾", "😈"];
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50, overflow: "hidden" }}>
      {Array.from({ length: count }).map((_, i) => {
        const up = type !== "fail";
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${10 + Math.random() * 80}%`,
            ...(up ? { bottom: "-20px" } : { top: "-20px" }),
            fontSize: `${14 + Math.random() * 18}px`,
            animation: `${up ? "particleUp" : "particleDown"} ${1 + Math.random() * 2}s ease-${up ? "out" : "in"} forwards`,
            animationDelay: `${Math.random() * 0.4}s`,
            filter: type === "success" ? `drop-shadow(0 0 4px ${color})` : undefined,
          }}>
            {sym[i % sym.length]}
          </div>
        );
      })}
    </div>
  );
}
