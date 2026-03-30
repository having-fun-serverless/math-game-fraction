import { LEVELS } from '../data/levels'
import CharacterSVG from '../components/CharacterSVG'

export default function MenuScreen({ char, completedLevels, onStartLevel, onChangeChar }) {
  return (
    <div style={{ animation: "slideIn 0.5s ease" }}>
      <div style={{ background: `linear-gradient(135deg,${char.color}10,${char.accent}08)`, borderRadius: 20, padding: "16px", marginBottom: 18, border: `1px solid ${char.color}22`, textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <button onClick={onChangeChar} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "4px 10px", cursor: "pointer", fontSize: 11, color: "#888", fontFamily: "'Heebo'" }}>החלפת דמות</button>
        </div>
        <CharacterSVG char={char} state="idle" size={100} />
        <div style={{ fontSize: 16, fontWeight: 900, color: char.color, fontFamily: "'Secular One'", marginTop: 4 }}>{char.name} {char.weapon} מוכנה לקרב!</div>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: "#999", fontFamily: "'Heebo'", margin: "8px 0 0" }}>
          הביסו את השדים של גוי-מא 👹 ופתחו שירים! 🎵
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {LEVELS.map((lv, i) => {
          const completed = completedLevels.includes(i);
          const locked = i > 0 && !completedLevels.includes(i - 1);
          return (
            <button key={lv.id} onClick={() => !locked && onStartLevel(i)} disabled={locked} style={{
              background: completed ? `linear-gradient(135deg,${lv.color}15,${lv.color}08)` : locked ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${completed ? lv.color + "55" : locked ? "#222" : lv.color + "22"}`,
              borderRadius: 16, padding: "14px 16px", color: locked ? "#444" : "#e0e0e0",
              cursor: locked ? "not-allowed" : "pointer", textAlign: "right", transition: "all 0.3s", fontFamily: "'Heebo'", opacity: locked ? 0.4 : 1,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 28 }}>{locked ? "🔒" : completed ? "🏆" : lv.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: completed ? lv.color : "#e0e0e0" }}>{lv.name}</span>
                    {completed && <span style={{ fontSize: 10, background: lv.color + "22", color: lv.color, padding: "2px 8px", borderRadius: 20 }}>✓</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 3 }}>{lv.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {completedLevels.length === LEVELS.length && (
        <div style={{ marginTop: 24, padding: 24, borderRadius: 20, textAlign: "center", background: "linear-gradient(135deg,#FFD70012,#FF69B412,#c084fc12)", border: "1px solid #FFD70033", animation: "glowPulse 2s ease infinite" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🌙✨🏆✨🌙</div>
          <CharacterSVG char={char} state="dance" danceIdx={3} size={120} />
          <div style={{ fontSize: 22, fontWeight: 900, color: "#FFD700", fontFamily: "'Secular One'", marginTop: 8 }}>ההונמון המוזהב הושלם!</div>
          <div style={{ fontSize: 13, color: "#aaa", marginTop: 6, fontFamily: "'Heebo'" }}>ניצחת את גוי-מא! 🐯</div>
        </div>
      )}
    </div>
  );
}
