import { obstacleById } from '../data/obstacles';

export default function TopicHud({ topicTitle, questionIdx, total, correctCount, obstacleId, manualCountdown }) {
  const obs = obstacleById(obstacleId);
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'6px 10px', marginBottom:6,
      background:'rgba(255,255,255,0.85)', borderRadius:12,
      boxShadow:'0 1px 6px rgba(0,0,0,0.07)', fontSize:13,
    }}>
      <span style={{ fontWeight:700, color:'#333', maxWidth:180, overflow:'hidden',
        whiteSpace:'nowrap', textOverflow:'ellipsis' }}>{topicTitle}</span>
      <div style={{ display:'flex', gap:4, alignItems:'center' }}>
        {Array.from({length:total}).map((_,i) => (
          <div key={i} style={{
            width:8, height:8, borderRadius:'50%',
            background: i<correctCount?'#4ade80':i===questionIdx?'#ffd43b':'#dee2e6',
            border:`1.5px solid ${i<correctCount?'#2f9e44':i===questionIdx?'#f59f00':'#ced4da'}`,
          }} />
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:1 }}>
        <span style={{ fontSize:11, color:'#888' }}>{obs.name}</span>
        {manualCountdown <= 2 && (
          <span style={{ fontSize:10, color:'#f59f00', fontWeight:700 }}>🎮 ידני בעוד {manualCountdown}</span>
        )}
      </div>
    </div>
  );
}
