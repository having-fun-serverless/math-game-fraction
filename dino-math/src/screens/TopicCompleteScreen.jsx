export default function TopicCompleteScreen({ topicTitle, correctCount, total, onMenu, onNextTopic, hasNextTopic }) {
  const passed = correctCount >= Math.ceil(total * 0.7);
  const stars = correctCount >= total ? 3 : correctCount >= Math.ceil(total * 0.85) ? 2 : passed ? 1 : 0;

  return (
    <div dir="rtl" style={{
      minHeight:'100vh', fontFamily:"'Heebo','Secular One',sans-serif",
      background:passed?'linear-gradient(160deg,#e8f5e9,#f0fdf4)':'linear-gradient(160deg,#fff3e0,#fef9c3)',
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', padding:24, textAlign:'center',
    }}>
      <div style={{ fontSize:80, marginBottom:12 }}>{passed?'🏆':'💪'}</div>
      <h2 style={{ fontSize:28, fontWeight:900, margin:'0 0 6px',
        fontFamily:"'Secular One',sans-serif", color:passed?'#2f9e44':'#e67700' }}>
        {passed?'כל הכבוד!':'כמעט!'}
      </h2>
      <p style={{ fontSize:15, color:'#666', margin:'0 0 16px' }}>{topicTitle}</p>
      <div style={{ fontSize:40, marginBottom:16, letterSpacing:4 }}>
        {[0,1,2].map(i=><span key={i} style={{ opacity:i<stars?1:0.2 }}>⭐</span>)}
      </div>
      <div style={{ background:'white', borderRadius:16, padding:'16px 32px',
        boxShadow:'0 4px 16px rgba(0,0,0,0.1)', marginBottom:24,
        fontSize:22, fontWeight:900, color:'#333' }}>
        <span style={{ color:passed?'#2f9e44':'#e67700' }}>{correctCount}</span>
        <span style={{ color:'#aaa', fontSize:18 }}> / {total}</span>
        <div style={{ fontSize:12, fontWeight:400, color:'#888', marginTop:4 }}>תשובות נכונות</div>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:28 }}>
        {Array.from({length:total}).map((_,i)=>(
          <div key={i} style={{ width:12, height:12, borderRadius:'50%',
            background:i<correctCount?'#4ade80':'#e9ecef',
            border:`2px solid ${i<correctCount?'#2f9e44':'#dee2e6'}` }} />
        ))}
      </div>
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
        {hasNextTopic && passed && (
          <button onClick={onNextTopic} style={{
            background:'linear-gradient(135deg,#2f9e44,#20c952)', color:'white',
            border:'none', borderRadius:14, padding:'14px 28px',
            fontSize:16, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 12px #2f9e4466' }}>
            נושא הבא ←
          </button>
        )}
        <button onClick={onMenu} style={{
          background:'white', color:'#333', border:'2px solid #dee2e6',
          borderRadius:14, padding:'14px 28px', fontSize:16, fontWeight:700, cursor:'pointer' }}>
          חזרה לתפריט
        </button>
      </div>
    </div>
  );
}
