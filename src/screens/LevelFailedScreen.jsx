import { QPL, PASS } from '../data/levels'
import CharacterSVG from '../components/CharacterSVG'

export default function LevelFailedScreen({ char, level, score, onRetry, onMenu }) {
  return (
    <div style={{ animation: "slideIn 0.5s ease", textAlign: "center" }}>
      <CharacterSVG char={char} state="sad" size={150} />
      <h2 style={{ fontSize: 24, fontWeight: 900, color: "#ff6b6b", margin: "8px 0 8px", fontFamily: "'Secular One'" }}>השדים עדיין חזקים!</h2>
      <p style={{ color: "#888", margin: "0 0 6px", fontFamily: "'Heebo'" }}>{score} מתוך {QPL} — צריך לפחות {PASS}</p>
      <p style={{ color: "#666", margin: "0 0 24px", fontSize: 14, fontFamily: "'Heebo'" }}>HUNTR/X אף פעם לא מוותרות! 💪</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={onRetry} style={{ background: `linear-gradient(135deg,${level.color},${level.color}bb)`, border: "none", borderRadius: 14, padding: "14px 32px", color: "#000", fontWeight: 900, fontSize: 15, cursor: "pointer", fontFamily: "'Secular One'" }}>
          נסו שוב!
        </button>
        <button onClick={onMenu} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px 32px", color: "#aaa", cursor: "pointer", fontSize: 15, fontFamily: "'Heebo'" }}>
          תפריט
        </button>
      </div>
    </div>
  );
}
