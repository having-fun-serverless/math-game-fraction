import { QPL, PASS } from '../data/levels'
import CharacterSVG from '../components/CharacterSVG'
import HonmoonShield from '../components/HonmoonShield'

export default function PlayingScreen({
  char, level, currentQ, questionIdx, score, streak,
  feedback, shakeWrong, charState, danceIdx,
  input, onInput, onSubmit, onKeyDown, onBack, inputRef,
}) {
  return (
    <div style={{ animation: "slideIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "7px 16px", color: "#888", cursor: "pointer", fontSize: 13, fontFamily: "'Heebo'" }}>← תפריט</button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14, color: level.color, fontFamily: "'Secular One'" }}>{level.emoji} {level.name}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: "4px 0" }}>
        <div style={{ flex: "0 0 auto" }}>
          <CharacterSVG char={char} state={charState} danceIdx={danceIdx} size={120} />
        </div>
        <div style={{ flex: "0 0 auto" }}>
          <HonmoonShield power={score} maxPower={QPL} color={level.color} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, margin: "6px 0" }}>
        {Array.from({ length: QPL }).map((_, i) => (
          <div key={i} style={{
            width: 12, height: 12, borderRadius: "50%", transition: "all 0.4s",
            background: i < questionIdx ? level.color : i === questionIdx ? "#fff" : "rgba(255,255,255,0.1)",
            boxShadow: i === questionIdx ? `0 0 12px ${level.color}` : i < questionIdx ? `0 0 6px ${level.color}66` : "none",
            transform: i === questionIdx ? "scale(1.3)" : "scale(1)",
          }} />
        ))}
      </div>
      <div style={{ fontSize: 11, textAlign: "center", color: "#555", margin: "2px 0 14px", fontFamily: "'Heebo'" }}>
        שאלה {questionIdx + 1} מתוך {QPL} • צריך {PASS} נכונות
      </div>

      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 22, padding: "26px 22px", border: `1px solid ${level.color}22`, textAlign: "center", animation: shakeWrong ? "shakeX 0.4s ease" : "scaleIn 0.3s ease", position: "relative" }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 24, fontFamily: "'Secular One'", direction: "ltr", letterSpacing: "1px", textShadow: `0 0 20px ${level.color}44` }}>
          {currentQ.q}
        </div>
        <div style={{ display: "flex", gap: 10, maxWidth: 300, margin: "0 auto" }}>
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={input}
            onChange={e => onInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={!!feedback}
            placeholder="תשובה..."
            style={{ flex: 1, background: "rgba(0,0,0,0.35)", border: `2px solid ${level.color}33`, borderRadius: 14, padding: "14px 18px", color: "#fff", fontSize: 22, textAlign: "center", fontFamily: "'Secular One'", direction: "ltr", transition: "all 0.3s" }}
          />
          <button
            onClick={onSubmit}
            disabled={!!feedback || !input.trim()}
            style={{ background: `linear-gradient(135deg,${level.color},${level.color}bb)`, border: "none", borderRadius: 14, padding: "14px 22px", color: "#000", fontWeight: 900, fontSize: 18, fontFamily: "'Secular One'", cursor: feedback || !input.trim() ? "not-allowed" : "pointer", opacity: feedback || !input.trim() ? 0.4 : 1, transition: "all 0.2s", boxShadow: `0 0 15px ${level.color}44` }}
          >✓</button>
        </div>
        {feedback && (
          <div style={{ marginTop: 16, padding: "12px 18px", borderRadius: 14, background: feedback.correct ? "rgba(0,220,100,0.1)" : "rgba(255,50,50,0.1)", border: `1px solid ${feedback.correct ? "#4ade8044" : "#ff6b6b44"}`, color: feedback.correct ? "#4ade80" : "#ff6b6b", fontSize: 17, fontWeight: 700, fontFamily: "'Heebo'", animation: "scaleIn 0.2s ease", direction: "ltr" }}>
            {feedback.msg}
          </div>
        )}
      </div>
      {streak >= 3 && (
        <div style={{ textAlign: "center", marginTop: 10, fontSize: 14, color: level.color, animation: "charDanceBounce 0.5s ease infinite", fontFamily: "'Secular One'" }}>
          🔥 רצף חם! {streak} ברצף! 🔥
        </div>
      )}
    </div>
  );
}
