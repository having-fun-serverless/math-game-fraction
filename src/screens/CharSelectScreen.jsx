import { CHARACTERS } from '../data/characters'
import CharacterSVG from '../components/CharacterSVG'

export default function CharSelectScreen({ onSelect, onInitAudio }) {
  return (
    <div style={{ animation: "slideIn 0.5s ease", textAlign: "center" }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: "#FFD700", margin: "10px 0 6px", fontFamily: "'Secular One'" }}>בחרי את הלוחמת שלך!</div>
      <div style={{ fontSize: 13, color: "#888", marginBottom: 24, fontFamily: "'Heebo'" }}>מי תלחם לצידך נגד גוי-מא?</div>

      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        {CHARACTERS.map((c, i) => (
          <button key={c.id} onClick={() => { onInitAudio(); onSelect(c.id); }}
            style={{
              background: `linear-gradient(160deg, ${c.color}15, ${c.accent}10)`,
              border: `2px solid ${c.color}44`, borderRadius: 22, padding: "18px 14px 14px",
              cursor: "pointer", width: 130, textAlign: "center", transition: "all 0.3s",
              animation: `charSelectPop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.15}s both`,
              position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${c.color}33`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = c.color + "44"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ animation: "charHover 2s ease infinite", animationDelay: `${i * 0.3}s` }}>
              <CharacterSVG char={c} state="idle" size={90} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: c.color, fontFamily: "'Secular One'", marginTop: 4 }}>{c.name}</div>
            <div style={{ fontSize: 11, color: "#aaa", fontFamily: "'Heebo'" }}>{c.korName}</div>
            <div style={{ fontSize: 10, color: "#666", marginTop: 4, fontFamily: "'Heebo'" }}>{c.description}</div>
            <div style={{ fontSize: 18, marginTop: 6 }}>{c.weapon}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
