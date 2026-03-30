export default function ConfettiEffect() {
  const clr = ["#FFD700", "#FF69B4", "#00BFFF", "#9B59B6", "#FF4500", "#34d399"];
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999 }}>
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${Math.random() * 100}%`,
          top: "-10px",
          width: `${Math.random() * 10 + 4}px`,
          height: `${Math.random() * 10 + 4}px`,
          background: clr[i % clr.length],
          borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          animation: `confettiFall ${2 + Math.random() * 3}s ease-in forwards`,
          animationDelay: `${Math.random() * 0.8}s`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }} />
      ))}
    </div>
  );
}
