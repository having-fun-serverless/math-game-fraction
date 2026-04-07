import { useState, useEffect, useRef, useCallback } from 'react';
import audio from './audio/DinoAudio';
import { allTopics, BOOKS } from './data/curriculum';
import { obstacleById, OBSTACLES } from './data/obstacles';
import MenuScreen from './screens/MenuScreen';
import RunScreen from './screens/RunScreen';
import TopicCompleteScreen from './screens/TopicCompleteScreen';

const QPL = 8;
const MANUAL_EVERY = 5;
const MANUAL_DURATION = 20;
const SCENE_W = 680;
const PAUSE_X = 240;
const OBSTACLE_SPEED = 5;
const TICK_MS = 16;
const DINO_X = 80;
const GROUND_BOTTOM = 30;
const DANCE_SEQ = ['jump','run','duck','run','jump','duck','run','jump','run','duck','run'];

function checkManualCollision(dinoState, obstacles) {
  const dinoW = dinoState === 'duck' ? 80 : 60;
  const dinoH = dinoState === 'duck' ? 40 : 60;
  const dinoBottom = dinoState === 'jump' ? GROUND_BOTTOM + 110 : GROUND_BOTTOM;
  const dinoTop = dinoBottom + dinoH;
  const dinoLeft = DINO_X + 10;
  const dinoRight = DINO_X + dinoW - 10;
  for (const o of obstacles) {
    const obsBottom = o.dodge === 'duck' ? GROUND_BOTTOM + 42 : GROUND_BOTTOM - 2;
    const obsTop = obsBottom + o.height;
    const obsLeft = o.x + 6;
    const obsRight = o.x + o.width - 6;
    if (dinoLeft < obsRight && dinoRight > obsLeft &&
        dinoBottom < obsTop && dinoTop > obsBottom) {
      return true;
    }
  }
  return false;
}

function parseAnswer(s) {
  s = String(s).trim().replace(',', '.');
  const mixed = s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return parseInt(mixed[1]) + parseInt(mixed[2]) / parseInt(mixed[3]);
  const frac = s.match(/^(-?\d+)\/(\d+)$/);
  if (frac) return parseInt(frac[1]) / parseInt(frac[2]);
  return parseFloat(s);
}

function answersMatch(user, correct) {
  const u = parseAnswer(user), c = parseAnswer(correct);
  if (isNaN(u) || isNaN(c)) return String(user).trim() === String(correct).trim();
  return Math.abs(u - c) < 0.011;
}

function nextTopicAfter(id) {
  const all = allTopics();
  const i = all.findIndex(t => t.id === id);
  return i >= 0 && i + 1 < all.length ? all[i + 1] : null;
}

export default function DinoMathGame() {
  const [screen, setScreen] = useState('nameEntry');
  const [playerName, setPlayerName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [topic, setTopic] = useState(null);
  const [phase, setPhase] = useState('approach');
  const [obstacleX, setObstacleX] = useState(SCENE_W + 60);
  const [dinoState, setDinoState] = useState('run');
  const [question, setQuestion] = useState(null);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [lastUserAnswer, setLastUserAnswer] = useState('');
  const [manualCounter, setManualCounter] = useState(0);
  const [manualTimeLeft, setManualTimeLeft] = useState(MANUAL_DURATION);
  const [runFrame, setRunFrame] = useState(0);
  const [muted, setMuted] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [manualObstacles, setManualObstacles] = useState([]);
  const [dinoFlickering, setDinoFlickering] = useState(false);

  const obstacleXRef = useRef(SCENE_W + 60);
  const phaseRef = useRef('approach');
  const topicRef = useRef(null);
  const questionIdxRef = useRef(0);
  const correctCountRef = useRef(0);
  const manualCounterRef = useRef(0);
  const tickRef = useRef(null);
  const frameTickRef = useRef(null);
  const manualTimerRef = useRef(null);
  const dodgeTimerRef = useRef(null);
  const spawnTimerRef = useRef(null);
  const danceTimerRef = useRef(null);
  const danceFrameRef = useRef(null);
  const manualObstaclesRef = useRef([]);
  const manualObstacleKeyRef = useRef(0);
  const lastDodgeTypeRef = useRef(null);
  const dinoStateRef = useRef('run');
  const dinoFlickeringRef = useRef(false);

  const ensureAudio = () => {
    if (!audioStarted) { audio.init(); setAudioStarted(true); }
  };

  const stopTick = useCallback(() => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
  }, []);

  const startTick = useCallback(() => {
    stopTick();
    tickRef.current = setInterval(() => {
      const ph = phaseRef.current;
      if (ph === 'manualPlay') {
        const updated = manualObstaclesRef.current
          .map(o => ({ ...o, x: o.x - OBSTACLE_SPEED }))
          .filter(o => o.x > -120);
        manualObstaclesRef.current = updated;
        setManualObstacles([...updated]);
        if (!dinoFlickeringRef.current && checkManualCollision(dinoStateRef.current, updated)) {
          audio.playHit();
          dinoFlickeringRef.current = true;
          setDinoFlickering(true);
          setTimeout(() => { dinoFlickeringRef.current = false; setDinoFlickering(false); }, 800);
        }
        return;
      }
      if (ph !== 'approach' && ph !== 'dodge') return;
      obstacleXRef.current -= OBSTACLE_SPEED;
      setObstacleX(obstacleXRef.current);
      if (ph === 'approach' && obstacleXRef.current <= PAUSE_X) {
        phaseRef.current = 'question';
        setPhase('question');
        stopTick();
      } else if (ph === 'dodge' && obstacleXRef.current < -120) {
        obstacleXRef.current = SCENE_W + 60;
        setObstacleX(SCENE_W + 60);
        phaseRef.current = 'approach';
        setPhase('approach');
        stopTick();
      }
    }, TICK_MS);
  }, [stopTick]);

  const stopRunFrames = useCallback(() => {
    if (frameTickRef.current) { clearInterval(frameTickRef.current); frameTickRef.current = null; }
  }, []);
  const startRunFrames = useCallback(() => {
    if (frameTickRef.current) return;
    frameTickRef.current = setInterval(() => setRunFrame(f => 1 - f), 160);
  }, []);

  const endManualPlay = useCallback(() => {
    audio.stopChiptune();
    if (manualTimerRef.current) { clearInterval(manualTimerRef.current); manualTimerRef.current = null; }
    if (spawnTimerRef.current) { clearInterval(spawnTimerRef.current); spawnTimerRef.current = null; }
    manualObstaclesRef.current = [];
    setManualObstacles([]);
    obstacleXRef.current = SCENE_W + 60;
    setObstacleX(SCENE_W + 60);
    phaseRef.current = 'approach';
    setPhase('approach');
    dinoStateRef.current = 'run';
    setDinoState('run');
    startTick();
  }, [startTick]);

  const triggerManualPlay = useCallback(() => {
    phaseRef.current = 'manualPlay';
    setPhase('manualPlay');
    dinoStateRef.current = 'run';
    setDinoState('run');
    setManualTimeLeft(MANUAL_DURATION);
    manualObstaclesRef.current = [];
    setManualObstacles([]);
    lastDodgeTypeRef.current = null;
    audio.startChiptune();
    startTick();

    const obstacleIds = Object.keys(OBSTACLES);
    const spawnOne = () => {
      // Alternate dodge type so player uses both jump and duck
      const last = lastDodgeTypeRef.current;
      const candidates = obstacleIds.filter(id => last ? OBSTACLES[id].dodge !== last : true);
      const pool = candidates.length ? candidates : obstacleIds;
      const id = pool[Math.floor(Math.random() * pool.length)];
      const obs = OBSTACLES[id];
      lastDodgeTypeRef.current = obs.dodge;
      const key = manualObstacleKeyRef.current++;
      manualObstaclesRef.current = [
        ...manualObstaclesRef.current,
        { key, id, x: SCENE_W + 60, dodge: obs.dodge, width: obs.width, height: obs.height },
      ];
      setManualObstacles([...manualObstaclesRef.current]);
    };

    spawnOne(); // immediate first obstacle
    spawnTimerRef.current = setInterval(spawnOne, 1800);

    let left = MANUAL_DURATION;
    manualTimerRef.current = setInterval(() => {
      left -= 1;
      setManualTimeLeft(left);
      if (left <= 0) endManualPlay();
    }, 1000);
  }, [endManualPlay, startTick]);

  const startDance = useCallback(() => {
    audio.playTopicComplete();
    stopTick();
    phaseRef.current = 'dancing';
    setPhase('dancing');
    startRunFrames();
    let danceIdx = 0;
    danceFrameRef.current = setInterval(() => {
      const s = DANCE_SEQ[danceIdx % DANCE_SEQ.length];
      dinoStateRef.current = s;
      setDinoState(s);
      danceIdx++;
    }, 350);
    danceTimerRef.current = setTimeout(() => {
      if (danceFrameRef.current) { clearInterval(danceFrameRef.current); danceFrameRef.current = null; }
      stopRunFrames();
      dinoStateRef.current = 'run';
      setDinoState('run');
      setScreen('topicComplete');
    }, 5000);
  }, [stopTick, startRunFrames, stopRunFrames]);

  const advanceToNext = useCallback((nextIdx, newManualCounter, currentTopic) => {
    if (nextIdx >= QPL) {
      startDance();
      return;
    }
    questionIdxRef.current = nextIdx;
    setQuestionIdx(nextIdx);
    setQuestion(currentTopic.generate());

    if (newManualCounter > 0 && newManualCounter % MANUAL_EVERY === 0) {
      triggerManualPlay();
    } else {
      obstacleXRef.current = SCENE_W + 60;
      setObstacleX(SCENE_W + 60);
      phaseRef.current = 'approach';
      setPhase('approach');
      startTick();
    }
  }, [startTick, stopTick, stopRunFrames, triggerManualPlay, startDance]);

  const handleAnswer = useCallback((userAnswer) => {
    if (phaseRef.current !== 'question') return;
    const q = question;
    if (!q) return;
    setLastUserAnswer(userAnswer);
    const correct = answersMatch(userAnswer, q.answer);
    setWasCorrect(correct);

    if (correct) {
      audio.playCorrect();
      const obs = obstacleById(topicRef.current?.obstacleId);
      const action = obs?.dodge || 'jump';
      setDinoState(action);
      if (action === 'jump') audio.playJump(); else audio.playDuck();

      const newCorrect = correctCountRef.current + 1;
      correctCountRef.current = newCorrect;
      setCorrectCount(newCorrect);
      const newMC = manualCounterRef.current + 1;
      manualCounterRef.current = newMC;
      setManualCounter(newMC);
      const nextIdx = questionIdxRef.current + 1;

      // Show answer briefly, then dodge and advance
      phaseRef.current = 'explain';
      setPhase('explain');

      // Resume obstacle movement for dodge
      obstacleXRef.current = PAUSE_X;
      setObstacleX(PAUSE_X);
      phaseRef.current = 'dodge';
      setPhase('explain'); // show correct screen while dodging
      startTick();

      dodgeTimerRef.current = setTimeout(() => {
        setDinoState('run');
        advanceToNext(nextIdx, newMC, topicRef.current);
      }, 1000);

    } else {
      audio.playWrong();
      setDinoState('hit');
      phaseRef.current = 'explain';
      setPhase('explain');
      setTimeout(() => setDinoState('run'), 500);
    }
  }, [question, startTick, advanceToNext]);

  const handleContinue = useCallback(() => {
    if (!topicRef.current) return;
    const newMC = manualCounterRef.current + 1;
    manualCounterRef.current = newMC;
    setManualCounter(newMC);
    advanceToNext(questionIdxRef.current + 1, newMC, topicRef.current);
  }, [advanceToNext]);

  const handleManualJump = useCallback(() => {
    if (phaseRef.current !== 'manualPlay') return;
    dinoStateRef.current = 'jump';
    setDinoState('jump');
    audio.playJump();
    setTimeout(() => { dinoStateRef.current = 'run'; setDinoState('run'); }, 600);
  }, []);

  const handleManualDuck = useCallback(() => {
    if (phaseRef.current !== 'manualPlay') return;
    dinoStateRef.current = 'duck';
    setDinoState('duck');
    audio.playDuck();
    setTimeout(() => { dinoStateRef.current = 'run'; setDinoState('run'); }, 400);
  }, []);

  const startTopic = useCallback((t) => {
    ensureAudio();
    // reset refs
    topicRef.current = t;
    questionIdxRef.current = 0;
    correctCountRef.current = 0;
    manualCounterRef.current = 0;
    obstacleXRef.current = SCENE_W + 60;
    phaseRef.current = 'approach';
    // reset state
    setTopic(t);
    setScreen('running');
    setPhase('approach');
    setQuestionIdx(0);
    setCorrectCount(0);
    setManualCounter(0);
    setDinoState('run');
    setObstacleX(SCENE_W + 60);
    setQuestion(t.generate());
    stopTick();
    stopRunFrames();
    startTick();
    startRunFrames();
  }, [startTick, stopTick, startRunFrames, stopRunFrames]);

  const backToMenu = useCallback(() => {
    stopTick(); stopRunFrames(); audio.stopChiptune();
    if (manualTimerRef.current) { clearInterval(manualTimerRef.current); manualTimerRef.current = null; }
    if (dodgeTimerRef.current) { clearTimeout(dodgeTimerRef.current); dodgeTimerRef.current = null; }
    if (spawnTimerRef.current) { clearInterval(spawnTimerRef.current); spawnTimerRef.current = null; }
    if (danceTimerRef.current) { clearTimeout(danceTimerRef.current); danceTimerRef.current = null; }
    if (danceFrameRef.current) { clearInterval(danceFrameRef.current); danceFrameRef.current = null; }
    manualObstaclesRef.current = [];
    setManualObstacles([]);
    setScreen('menu');
  }, [stopTick, stopRunFrames]);

  // Stop music when entering question phase
  useEffect(() => {
    if (phase === 'question') audio.stopChiptune();
  }, [phase]);

  // Cleanup on unmount
  useEffect(() => () => {
    stopTick(); stopRunFrames(); audio.stopChiptune();
    if (manualTimerRef.current) clearInterval(manualTimerRef.current);
    if (dodgeTimerRef.current) clearTimeout(dodgeTimerRef.current);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (danceTimerRef.current) clearTimeout(danceTimerRef.current);
    if (danceFrameRef.current) clearInterval(danceFrameRef.current);
  }, [stopTick, stopRunFrames]);

  const manualCountdown = MANUAL_EVERY - (manualCounter % MANUAL_EVERY);
  const nextT = topic ? nextTopicAfter(topic.id) : null;

  const confirmName = () => {
    setPlayerName(nameInput.trim());
    setScreen('menu');
  };

  return (
    <div dir="rtl" style={{
      minHeight:'100vh',
      background: screen==='menu' || screen==='nameEntry'
        ? 'linear-gradient(160deg,#e8f5e9 0%,#e3f2fd 100%)'
        : 'linear-gradient(180deg,#dbeafe 0%,#f0fdf4 100%)',
      fontFamily:"'Heebo','Secular One',sans-serif",
    }}>
      {screen === 'nameEntry' && (
        <div style={{
          minHeight:'100vh', display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', padding:24,
        }}>
          <div style={{ fontSize:80, marginBottom:12 }}>🦖</div>
          <h1 style={{ fontSize:30, fontWeight:900, margin:'0 0 8px',
            fontFamily:"'Secular One',sans-serif",
            background:'linear-gradient(135deg,#2f9e44,#1c7ed6)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            דינו מתמטיקה
          </h1>
          <p style={{ fontSize:18, color:'#555', margin:'0 0 20px' }}>מה שמך?</p>
          <input
            type="text" value={nameInput} autoFocus
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') confirmName(); }}
            placeholder="כתוב את שמך..."
            dir="rtl"
            style={{ padding:'12px 20px', fontSize:20, fontWeight:700,
              borderRadius:12, border:'2.5px solid #2f9e44', outline:'none',
              textAlign:'center', marginBottom:16, width:240 }} />
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={confirmName} style={{
              background:'linear-gradient(135deg,#2f9e44,#40c057)', color:'white',
              border:'none', borderRadius:14, padding:'14px 40px',
              fontSize:18, fontWeight:800, cursor:'pointer' }}>
              בוא נשחק! ▶
            </button>
            <button onClick={() => setScreen('menu')} style={{
              background:'white', color:'#888', border:'2px solid #dee2e6',
              borderRadius:14, padding:'14px 20px', fontSize:16, cursor:'pointer' }}>
              דלג
            </button>
          </div>
        </div>
      )}

      {screen === 'menu' && <MenuScreen onStartTopic={startTopic} />}

      {screen === 'running' && topic && (
        <div style={{ padding:'12px 12px 24px', maxWidth:SCENE_W+24, margin:'0 auto' }}>
          <button onClick={()=>{const m=!muted;setMuted(m);audio.setMuted(m);}} style={{
            position:'fixed', top:12, left:12, zIndex:100,
            background:'rgba(255,255,255,0.85)', border:'1px solid #ddd',
            borderRadius:10, padding:'6px 10px', cursor:'pointer', fontSize:18 }}>
            {muted?'🔇':'🔊'}
          </button>
          <button onClick={backToMenu} style={{
            background:'rgba(255,255,255,0.7)', border:'1px solid #ddd', borderRadius:8,
            padding:'4px 12px', cursor:'pointer', fontSize:13, color:'#555', marginBottom:8 }}>
            ← תפריט
          </button>
          <RunScreen
            topic={topic} phase={phase} obstacleX={obstacleX} dinoState={dinoState}
            dinoFlickering={dinoFlickering} playerName={playerName}
            question={question} wasCorrect={wasCorrect} lastUserAnswer={lastUserAnswer}
            questionIdx={questionIdx} total={QPL} correctCount={correctCount}
            manualTimeLeft={manualTimeLeft} manualCountdown={manualCountdown}
            manualObstacles={manualObstacles}
            onAnswer={handleAnswer} onContinue={handleContinue}
            onManualEnd={endManualPlay} onManualJump={handleManualJump}
            onManualDuck={handleManualDuck} runFrame={runFrame} />
        </div>
      )}

      {screen === 'topicComplete' && topic && (
        <TopicCompleteScreen
          topicTitle={topic.title} correctCount={correctCount} total={QPL}
          playerName={playerName}
          hasNextTopic={!!nextT}
          onNextTopic={() => nextT && startTopic(nextT)}
          onMenu={() => setScreen('menu')} />
      )}
    </div>
  );
}
