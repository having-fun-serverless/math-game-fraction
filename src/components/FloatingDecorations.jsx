export default function FloatingDecorations() {
  const items = ["♪", "♫", "🌙", "✦", "⭐", "🎵", "✧", "💜"];
  const colors = ["#FFD700", "#FF69B4", "#00BFFF", "#9B59B6", "#c084fc", "#34d399", "#fbbf24", "#f472b6"];
  return (
    <>
      {items.map((item, i) => (
        <div key={i} style={{
          position: "absolute",
          fontSize: 14 + i * 2,
          opacity: 0.2,
          left: `${5 + i * 12}%`,
          bottom: `${5 + Math.random() * 40}%`,
          animation: `floatUp ${5 + i * 0.8}s ease-in-out infinite`,
          animationDelay: `${i * 0.6}s`,
          color: colors[i],
          filter: "drop-shadow(0 0 4px currentColor)",
        }}>
          {item}
        </div>
      ))}
    </>
  );
}
