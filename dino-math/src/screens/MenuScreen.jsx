import { useState } from 'react';
import { BOOKS } from '../data/curriculum';

export default function MenuScreen({ onStartTopic }) {
  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState(null);

  const back = () => { if (chapter) { setChapter(null); return; } setBook(null); };

  return (
    <div dir="rtl" style={{
      minHeight:'100vh', background:'linear-gradient(160deg,#e8f5e9 0%,#e3f2fd 100%)',
      fontFamily:"'Heebo','Secular One',sans-serif", padding:16,
    }}>
      <div style={{ textAlign:'center', padding:'20px 0 10px' }}>
        <div style={{ fontSize:56, marginBottom:4 }}>🦖</div>
        <h1 style={{ fontSize:30, fontWeight:900, margin:'0 0 4px',
          fontFamily:"'Secular One',sans-serif",
          background:'linear-gradient(135deg,#2f9e44,#1c7ed6)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          דינו מתמטיקה
        </h1>
        <p style={{ fontSize:13, color:'#777', margin:0 }}>פתור תרגילים — עזור לדינו לקפוץ!</p>
      </div>

      {(book||chapter) && (
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
          <button onClick={back} style={{ background:'rgba(0,0,0,0.06)', border:'none',
            borderRadius:8, padding:'6px 14px', cursor:'pointer', fontSize:14, color:'#333' }}>
            ← חזרה
          </button>
          <span style={{ fontSize:12, color:'#999' }}>
            {book?.title}{chapter?` › ${chapter.title}`:''}
          </span>
        </div>
      )}

      {!book && (
        <>
          <p style={{ textAlign:'center', fontSize:15, fontWeight:700, color:'#444', marginBottom:12 }}>בחר ספר:</p>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {BOOKS.map((b,bi) => (
              <button key={b.id} onClick={()=>setBook(b)} style={{
                background:'white', border:`3px solid ${b.color}`, borderRadius:16,
                padding:'20px 24px', cursor:'pointer', textAlign:'right',
                boxShadow:`0 4px 12px ${b.color}33`,
              }}>
                <div style={{ fontSize:17, fontWeight:900, color:b.color, marginBottom:4 }}>{b.title}</div>
                <div style={{ fontSize:12, color:'#999' }}>
                  {b.chapters.length} פרקים · {b.chapters.reduce((s,c)=>s+c.topics.length,0)} נושאים
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {book && !chapter && (
        <>
          <p style={{ textAlign:'center', fontSize:15, fontWeight:700, color:'#444', marginBottom:12 }}>בחר פרק:</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {book.chapters.map(ch => (
              <button key={ch.id} onClick={()=>setChapter(ch)} style={{
                background:'white', border:`2px solid ${book.color}55`, borderRadius:12,
                padding:'14px 18px', cursor:'pointer', textAlign:'right',
                boxShadow:'0 2px 8px rgba(0,0,0,0.07)',
              }}>
                <div style={{ fontSize:14, fontWeight:800, color:'#333' }}>{ch.title}</div>
                <div style={{ fontSize:11, color:'#aaa', marginTop:2 }}>{ch.topics.length} נושאים</div>
              </button>
            ))}
          </div>
        </>
      )}

      {chapter && (
        <>
          <p style={{ textAlign:'center', fontSize:15, fontWeight:700, color:'#444', marginBottom:12 }}>בחר נושא:</p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {chapter.topics.map(t => (
              <button key={t.id} onClick={()=>onStartTopic(t)} style={{
                background:`linear-gradient(90deg,${book.color}11,white)`,
                border:`2px solid ${book.color}44`, borderRadius:12,
                padding:'14px 18px', cursor:'pointer', textAlign:'right',
                display:'flex', alignItems:'center', justifyContent:'space-between',
              }}>
                <span style={{ fontSize:14, fontWeight:700, color:'#333' }}>{t.title}</span>
                <span style={{ fontSize:20 }}>▶</span>
              </button>
            ))}
          </div>
        </>
      )}

      <div style={{ textAlign:'center', marginTop:28, fontSize:11, color:'#ccc' }}>
        🦖 קפוץ! תכופף! פתור!
      </div>
    </div>
  );
}
