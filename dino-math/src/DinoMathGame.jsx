import { useState, useEffect, useRef, useCallback } from 'react';
import audio from './audio/DinoAudio';
import { allTopics, BOOKS } from './data/curriculum';
import { obstacleById } from './data/obstacles';
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
  const [screen, setScreen] = useState('menu');
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
    obstacleXRef.current = SCENE_W + 60;
    setObstacleX(SCENE_W + 60);
    phaseRef.current = 'approach';
    setPhase('approach');
    setDinoState('run');
    startTick();
  }, [startTick]);

  const triggerManualPlay = useCallback(() => {
    phaseRef.current = 'manualPlay';
    setPhase('manualPlay');
    setDinoState('run');
    setManualTimeLeft(MANUAL_DURATION);
    audio.startChiptune();
    let left = MANUAL_DURATION;
    manualTimerRef.current = setInterval(() => {
      left -= 1;
      setManualTimeLeft(left);
      if (left <= 0) endManualPlay();
    }, 1000);
  }, [endManualPlay]);

  const advanceToNext = useCallback((nextIdx, newManualCounter, currentTopic) => {
    if (nextIdx >= QPL) {
      audio.playTopicComplete();
      stopTick(); stopRunFrames();
      setScreen('topicComplete');
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
  }, [startTick, stopTick, stopRunFrames, triggerManualPlay]);

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
    setDinoState('jump');
    audio.playJump();
    setTimeout(() => setDinoState('run'), 600);
  }, []);

  const handleManualDuck = useCallback(() => {
    if (phaseRef.current !== 'manualPlay') return;
    setDinoState('duck');
    audio.playDuck();
    setTimeout(() => setDinoState('run'), 400);
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
  }, [stopTick, stopRunFrames]);

  const manualCountdown = MANUAL_EVERY - (manualCounter % MANUAL_EVERY);
  const nextT = topic ? nextTopicAfter(topic.id) : null;

  return (
    <div dir="rtl" style={{
      minHeight:'100vh',
      background: screen==='menu'
        ? 'linear-gradient(160deg,#e8f5e9 0%,#e3f2fd 100%)'
        : 'linear-gradient(180deg,#dbeafe 0%,#f0fdf4 100%)',
      fontFamily:"'Heebo','Secular One',sans-serif",
    }}>
      {screen === 'running' && (
        <button onClick={()=>{const m=!muted;setMuted(m);audio.setMuted(m);}} style={{
          position:'fixed', top:12, left:12, zIndex:100,
          background:'rgba(255,255,255,0.85)', border:'1px solid #ddd',
          borderRadius:10, padding:'6px 10px', cursor:'pointer', fontSize:18 }}>
          {muted?'🔇':'🔊'}
        </button>
      )}

      {screen === 'menu' && <MenuScreen onStartTopic={startTopic} />}

      {screen === 'running' && topic && (
        <div style={{ padding:'12px 12px 24px', maxWidth:SCENE_W+24, margin:'0 auto' }}>
          <button onClick={backToMenu} style={{
            background:'rgba(255,255,255,0.7)', border:'1px solid #ddd', borderRadius:8,
            padding:'4px 12px', cursor:'pointer', fontSize:13, color:'#555', marginBottom:8 }}>
            ← תפריט
          </button>
          <RunScreen
            topic={topic} phase={phase} obstacleX={obstacleX} dinoState={dinoState}
            question={question} wasCorrect={wasCorrect} lastUserAnswer={lastUserAnswer}
            questionIdx={questionIdx} total={QPL} correctCount={correctCount}
            manualTimeLeft={manualTimeLeft} manualCountdown={manualCountdown}
            onAnswer={handleAnswer} onContinue={handleContinue}
            onManualEnd={endManualPlay} onManualJump={handleManualJump}
            onManualDuck={handleManualDuck} runFrame={runFrame} />
        </div>
      )}

      {screen === 'topicComplete' && topic && (
        <TopicCompleteScreen
          topicTitle={topic.title} correctCount={correctCount} total={QPL}
          hasNextTopic={!!nextT}
          onNextTopic={() => nextT && startTopic(nextT)}
          onMenu={() => setScreen('menu')} />
      )}
    </div>
  );
}
