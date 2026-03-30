import { LEVELS, QPL } from '../data/levels'
import CharacterSVG from '../components/CharacterSVG'
import SpotifyEmbed from '../components/SpotifyEmbed'

export default function LevelCompleteScreen({ char, level, score, currentLevel, danceIdx, onNextLevel, onMenu }) {
  return (
    <div style={{ animation: "slideIn 0.5s ease", textAlign: "center" }}>
      <CharacterSVG char={char} state="dance" danceIdx={danceIdx + 2} size={160} />
      <h2 style={{ fontSize: 26, fontWeight: 900, color: level.color, margin: "8px 0 6px", fontFamily: "'Secular One'" }}>שלב הושלם!</h2>
      <p style={{ color: "#888", margin: "0 0 4px", fontFamily: "'Heebo'" }}>{score} מתוך {QPL} תשובות נכונות</p>
      <p style={{ color: level.color, margin: "0 0 14px", fontSize: 16, fontFamily: "'Heebo'", textShadow: `0 0 10px ${level.color}44` }}>
        🎵 נפתח: "{level.name}" 🎵
      </p>
      <SpotifyEmbed trackId={level.spotifyId} />
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
        {currentLevel + 1 < LEVELS.length && (
          <button onClick={onNextLevel} style={{ background: `linear-gradient(135deg,${LEVELS[currentLevel + 1]?.color || "#fff"},${LEVELS[currentLevel + 1]?.color || "#fff"}bb)`, border: "none", borderRadius: 14, padding: "14px 32px", color: "#000", fontWeight: 900, fontSize: 15, cursor: "pointer", fontFamily: "'Secular One'", boxShadow: `0 0 20px ${LEVELS[currentLevel + 1]?.color || "#fff"}44` }}>
            שלב הבא →
          </button>
        )}
        <button onClick={onMenu} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px 32px", color: "#aaa", cursor: "pointer", fontSize: 15, fontFamily: "'Heebo'" }}>
          תפריט
        </button>
      </div>
    </div>
  );
}
