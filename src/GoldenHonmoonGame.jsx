import { useState, useEffect, useCallback, useRef } from "react";
import audio from './audio/GameAudio'
import { CHARACTERS } from './data/characters'
import { LEVELS, QPL, PASS } from './data/levels'
import ConfettiEffect from './components/ConfettiEffect'
import Particles from './components/Particles'
import FloatingDecorations from './components/FloatingDecorations'
import CharSelectScreen from './screens/CharSelectScreen'
import MenuScreen from './screens/MenuScreen'
import PlayingScreen from './screens/PlayingScreen'
import LevelCompleteScreen from './screens/LevelCompleteScreen'
import LevelFailedScreen from './screens/LevelFailedScreen'

export default function GoldenHonmoonGame() {
  const [screen, setScreen] = useState("charSelect");
  const [selectedChar, setSelectedChar] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [currentQ, setCurrentQ] = useState(null);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [particles, setParticles] = useState(null);
  const [charState, setCharState] = useState("idle");
  const [danceIdx, setDanceIdx] = useState(0);
  const inputRef = useRef(null);

  const level = LEVELS[currentLevel];
  const char = selectedChar ? CHARACTERS.find(c => c.id === selectedChar) : null;

  const ensureAudio = () => {
    if (!audioStarted) {
      audio.init();
      audio.startBgMusic();
      setAudioStarted(true);
    }
  };

  const triggerParticles = (type, color) => {
    setParticles({ type, color, key: Date.now() });
    setTimeout(() => setParticles(null), 2500);
  };

  const generateQuestion = useCallback(() => {
    if (LEVELS[currentLevel]) {
      setCurrentQ(LEVELS[currentLevel].generate());
      setInput("");
      setFeedback(null);
      setCharState("idle");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentLevel]);

  useEffect(() => { if (screen === "playing") generateQuestion(); }, [screen, questionIdx, generateQuestion]);
  useEffect(() => { audio.setBgVolume(screen === "levelComplete" ? 0.02 : 0.07); }, [screen]);

  const checkAnswer = () => {
    if (!currentQ || !input.trim()) return;
    const userAns = parseFloat(input.replace(",", "."));
    const correct = Math.abs(userAns - currentQ.a) < 0.001;
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      if (streak >= 2) audio.playStreak(); else audio.playSuccess();
      setFeedback({ correct: true, msg: streak >= 2 ? `🔥 רצף של ${streak + 1}!` : "✓ נכון!" });
      setDanceIdx(d => d + 1);
      setCharState("dance");
      triggerParticles("success", level.color);
    } else {
      setStreak(0);
      setShakeWrong(true);
      audio.playFail();
      setTimeout(() => setShakeWrong(false), 500);
      setFeedback({ correct: false, msg: `✗ התשובה: ${currentQ.a}` });
      setCharState("sad");
      triggerParticles("fail", "#ff4444");
    }
    setTimeout(() => {
      if (questionIdx + 1 >= QPL) {
        const passed = (correct ? score + 1 : score) >= PASS;
        if (passed) {
          setCompletedLevels(c => [...c, currentLevel]);
          setShowConfetti(true);
          audio.playFanfare();
          triggerParticles("fanfare", "#FFD700");
          setCharState("dance");
          setTimeout(() => setShowConfetti(false), 4000);
        } else {
          audio.playLevelFail();
          setCharState("sad");
        }
        setScreen(passed ? "levelComplete" : "levelFailed");
      } else {
        setQuestionIdx(q => q + 1);
      }
    }, 1400);
  };

  const startLevel = (idx) => {
    ensureAudio();
    setCurrentLevel(idx);
    setQuestionIdx(0);
    setScore(0);
    setStreak(0);
    setCharState("idle");
    setScreen("playing");
  };

  const handleKey = (e) => { if (e.key === "Enter") checkAnswer(); };

  return (
    <div dir="rtl" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "linear-gradient(160deg,#06061a 0%,#12122e 30%,#1e1245 60%,#2a1050 100%)", color: "#e0e0e0", fontFamily: "'Secular One','Heebo',sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `radial-gradient(circle at 20% 50%,#c084fc 1px,transparent 1px),radial-gradient(circle at 80% 20%,#FFD700 1px,transparent 1px),radial-gradient(circle at 60% 80%,#FF69B4 1px,transparent 1px)`, backgroundSize: "60px 60px,80px 80px,70px 70px", animation: "bgPulse 4s ease infinite" }} />
      {showConfetti && <ConfettiEffect />}
      {particles && <Particles key={particles.key} type={particles.type} color={particles.color} />}
      <FloatingDecorations />

      <div style={{ maxWidth: 460, margin: "0 auto", padding: "16px", position: "relative", zIndex: 1 }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", padding: "10px 0 14px", position: "relative" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#555", marginBottom: 4, fontFamily: "'Heebo'" }}>HUNTR/X MATH QUEST</div>
          <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0, background: "linear-gradient(135deg,#FFD700 0%,#FF69B4 40%,#00BFFF 70%,#c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Secular One'", animation: "titleGlow 3s ease infinite" }}>Golden Honmoon</h1>
          <div style={{ fontSize: 10, color: "#444", marginTop: 2, fontFamily: "'Heebo'" }}>골든 혼문 • מגן ההונמון המוזהב</div>
          {screen !== "charSelect" && (
            <button onClick={() => { ensureAudio(); const n = !muted; setMuted(n); audio.setMuted(n); }} style={{ position: "absolute", left: 0, top: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "8px 12px", cursor: "pointer", fontSize: 18, color: muted ? "#444" : "#FFD700", transition: "all 0.2s" }}>
              {muted ? "🔇" : "🔊"}
            </button>
          )}
          {audioStarted && !muted && (
            <div style={{ position: "absolute", right: 0, top: 14, display: "flex", gap: 2, alignItems: "flex-end", height: 20 }}>
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} style={{ width: 3, borderRadius: 2, background: "linear-gradient(to top,#FF69B4,#FFD700)", animation: "beatPulse 0.4s ease infinite", animationDelay: `${i * 0.1}s`, height: [10, 16, 8, 14, 12][i], opacity: 0.6 }} />
              ))}
            </div>
          )}
        </div>

        {screen === "charSelect" && (
          <CharSelectScreen
            onSelect={id => { setSelectedChar(id); setScreen("menu"); }}
            onInitAudio={ensureAudio}
          />
        )}
        {screen === "menu" && char && (
          <MenuScreen
            char={char}
            completedLevels={completedLevels}
            onStartLevel={startLevel}
            onChangeChar={() => { setScreen("charSelect"); setSelectedChar(null); }}
          />
        )}
        {screen === "playing" && currentQ && char && (
          <PlayingScreen
            char={char}
            level={level}
            currentQ={currentQ}
            questionIdx={questionIdx}
            score={score}
            streak={streak}
            feedback={feedback}
            shakeWrong={shakeWrong}
            charState={charState}
            danceIdx={danceIdx}
            input={input}
            onInput={setInput}
            onSubmit={checkAnswer}
            onKeyDown={handleKey}
            onBack={() => setScreen("menu")}
            inputRef={inputRef}
          />
        )}
        {screen === "levelComplete" && char && (
          <LevelCompleteScreen
            char={char}
            level={level}
            score={score}
            currentLevel={currentLevel}
            danceIdx={danceIdx}
            onNextLevel={() => startLevel(currentLevel + 1)}
            onMenu={() => setScreen("menu")}
          />
        )}
        {screen === "levelFailed" && char && (
          <LevelFailedScreen
            char={char}
            level={level}
            score={score}
            onRetry={() => startLevel(currentLevel)}
            onMenu={() => setScreen("menu")}
          />
        )}

        <div style={{ textAlign: "center", marginTop: 28, padding: "8px 0", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <span style={{ fontSize: 10, color: "#2a2a3a", fontFamily: "'Heebo'" }}>🐯 Derpy approves this math quest</span>
        </div>
      </div>
    </div>
  );
}
