export default function Ground({ running }) {
  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:30 }}>
      <div style={{
        position:'absolute', bottom:6, left:0, right:0, height:12,
        background:'linear-gradient(180deg,#a3e635,#65a30d)',
        borderTop:'2px solid #4d7c0f',
      }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:6, background:'#92400e' }} />
      <div style={{
        position:'absolute', bottom:6, left:0, right:0, height:6,
        backgroundImage:'radial-gradient(circle, #4d7c0f 1px, transparent 1px)',
        backgroundSize:'20px 6px',
        animation: running ? 'scrollGround 0.4s linear infinite' : 'none',
      }} />
    </div>
  );
}
