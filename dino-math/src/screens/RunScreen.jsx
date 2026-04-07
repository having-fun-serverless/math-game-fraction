import { useEffect } from 'react';
import Dino from '../components/Dino';
import Obstacle from '../components/Obstacle';
import Ground from '../components/Ground';
import QuestionCard from '../components/QuestionCard';
import ManualBanner from '../components/ManualBanner';
import TopicHud from '../components/TopicHud';
import { obstacleById } from '../data/obstacles';

const SCENE_W = 680;
const SCENE_H = 160;
const DINO_X = 80;
const GROUND_BOTTOM = 30; // height of ground strip

export default function RunScreen({
  topic, phase, obstacleX, dinoState, dinoFlickering, playerName,
  question, wasCorrect, lastUserAnswer,
  questionIdx, total, correctCount,
  manualTimeLeft, manualCountdown, manualObstacles,
  onAnswer, onContinue, onManualEnd,
  onManualJump, onManualDuck, runFrame,
}) {
  const obs = obstacleById(topic.obstacleId);

  useEffect(() => {
    if (phase !== 'manualPlay') return;
    const handler = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); onManualJump(); }
      if (e.code === 'ArrowDown') { e.preventDefault(); onManualDuck(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, onManualJump, onManualDuck]);

  // Dino vertical position: ground=0, jump=up
  const dinoBottomPx = dinoState === 'jump' ? GROUND_BOTTOM + 110 : GROUND_BOTTOM;

  // Obstacle bottom offset: ducking obstacles float higher
  const obsBottom = obs.dodge === 'duck' ? GROUND_BOTTOM + 42 : GROUND_BOTTOM - 2;

  const running = phase === 'approach' || phase === 'dodge' || phase === 'manualPlay' || phase === 'dancing';

  return (
    <div style={{ width:'100%', maxWidth:SCENE_W, margin:'0 auto',
      fontFamily:"'Heebo','Secular One',sans-serif" }}>

      <TopicHud
        topicTitle={topic.title} questionIdx={questionIdx} total={total}
        correctCount={correctCount} obstacleId={topic.obstacleId}
        manualCountdown={manualCountdown} />

      {/* Game canvas */}
      <div style={{
        position:'relative', width:'100%', maxWidth:SCENE_W, height:SCENE_H,
        background:'linear-gradient(180deg,#dbeafe 0%,#e0f2fe 60%,#f0fdf4 100%)',
        borderRadius:16, overflow:'hidden', boxShadow:'0 4px 16px rgba(0,0,0,0.1)',
        userSelect:'none',
      }}>
        {/* Clouds */}
        <div style={{ position:'absolute', top:12, left:60, width:60, height:18,
          background:'rgba(255,255,255,0.8)', borderRadius:9 }} />
        <div style={{ position:'absolute', top:8, left:100, width:40, height:14,
          background:'rgba(255,255,255,0.7)', borderRadius:7 }} />
        <div style={{ position:'absolute', top:20, right:140, width:70, height:20,
          background:'rgba(255,255,255,0.8)', borderRadius:10 }} />

        <Ground running={running} />

        {/* Dino */}
        <div style={{
          position:'absolute', left:DINO_X,
          bottom: dinoBottomPx,
          transition: dinoState === 'jump'
            ? 'bottom 0.5s cubic-bezier(0.25,0.46,0.45,0.94)'
            : 'bottom 0.2s ease',
        }}>
          <Dino state={dinoState} frame={runFrame} flickering={dinoFlickering} />
        </div>

        {/* Obstacle (hidden during manual play) */}
        {phase !== 'manualPlay' && (
          <div style={{
            position:'absolute',
            left: obstacleX,
            bottom: obsBottom,
          }}>
            <Obstacle id={topic.obstacleId} width={obs.width} height={obs.height} />
          </div>
        )}

        {/* Manual play obstacles */}
        {phase === 'manualPlay' && (manualObstacles || []).map(o => (
          <div key={o.key} style={{
            position:'absolute',
            left: o.x,
            bottom: o.dodge === 'duck' ? GROUND_BOTTOM + 42 : GROUND_BOTTOM - 2,
          }}>
            <Obstacle id={o.id} width={o.width} height={o.height} />
          </div>
        ))}

        {/* Manual play overlay */}
        {phase === 'manualPlay' && (
          <ManualBanner timeLeft={manualTimeLeft} totalTime={20} />
        )}

        {/* Dance celebration overlay */}
        {phase === 'dancing' && (
          <div style={{
            position:'absolute', inset:0,
            background:'rgba(255,255,255,0.75)',
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            gap:6, borderRadius:16,
          }}>
            <div style={{ fontSize:36, animation:'danceBounce 0.7s ease-in-out infinite' }}>
              🎉
            </div>
            <div style={{ fontSize:22, fontWeight:900, color:'#2f9e44',
              textShadow:'0 1px 4px rgba(0,0,0,0.15)' }}>
              {playerName ? `כל הכבוד ${playerName}!` : 'כל הכבוד!'}
            </div>
            <div style={{ fontSize:28, animation:'danceBounce 0.7s ease-in-out infinite 0.2s' }}>
              🦖
            </div>
          </div>
        )}

        {/* Manual touch buttons */}
        {phase === 'manualPlay' && (
          <div style={{ position:'absolute', bottom:4, left:0, right:0,
            display:'flex', justifyContent:'space-between', padding:'0 12px' }}>
            <button
              onTouchStart={e=>{e.preventDefault();onManualDuck();}} onClick={onManualDuck}
              style={{ background:'rgba(0,0,0,0.2)', border:'none', borderRadius:8,
                padding:'6px 18px', color:'white', fontSize:20, cursor:'pointer' }}>↓</button>
            <button
              onTouchStart={e=>{e.preventDefault();onManualJump();}} onClick={onManualJump}
              style={{ background:'rgba(0,0,0,0.2)', border:'none', borderRadius:8,
                padding:'6px 18px', color:'white', fontSize:20, cursor:'pointer' }}>↑</button>
          </div>
        )}
      </div>

      {/* Question / explain card */}
      {(phase === 'question' || phase === 'explain') && question && (
        <div style={{ marginTop:12 }}>
          <QuestionCard
            question={question} phase={phase}
            onAnswer={onAnswer} onContinue={onContinue}
            wasCorrect={wasCorrect} lastUserAnswer={lastUserAnswer} />
        </div>
      )}
    </div>
  );
}
