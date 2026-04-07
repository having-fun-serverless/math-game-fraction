export default function ManualBanner({ timeLeft, totalTime = 20 }) {
  const pct = (timeLeft / totalTime) * 100;
  const urgent = timeLeft <= 5;
  return (
    <div style={{
      position:'absolute', top:0, left:0, right:0,
      background:'rgba(22,163,74,0.93)', padding:'6px 12px 5px',
      display:'flex', flexDirection:'column', gap:3,
      animation:'bannerPulse 1.5s ease infinite',
      borderBottom:'2px solid #15803d',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:15, fontWeight:900, color:'white', fontFamily:"'Secular One',sans-serif" }}>
          🦖 עכשיו אתה שולט בדינו!
        </span>
        <span style={{ fontSize:16, fontWeight:900, color:urgent?'#ffd43b':'white' }}>{timeLeft}ש'</span>
      </div>
      <div style={{ fontSize:11, color:'#bbf7d0', textAlign:'center' }}>
        קפוץ: רווח / ↑ &nbsp;|&nbsp; התכופף: ↓
      </div>
      <div style={{ height:4, background:'rgba(255,255,255,0.3)', borderRadius:2, overflow:'hidden' }}>
        <div style={{ height:'100%', borderRadius:2, width:`${pct}%`,
          background:urgent?'#ffd43b':'white', transition:'width 1s linear, background 0.3s' }} />
      </div>
    </div>
  );
}
