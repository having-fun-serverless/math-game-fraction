import { useState, useRef, useEffect } from 'react';

export default function QuestionCard({ question, phase, onAnswer, onContinue, wasCorrect, lastUserAnswer }) {
  const [input, setInput] = useState('');
  const [choiceSelected, setChoiceSelected] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setInput(''); setChoiceSelected(null);
    if (phase === 'question' && question?.type === 'typed')
      setTimeout(() => inputRef.current?.focus(), 80);
  }, [question, phase]);

  const submit = () => { if (input.trim()) onAnswer(input.trim()); };
  const handleKey = e => { if (e.key === 'Enter') submit(); };
  const handleChoice = c => { setChoiceSelected(c); onAnswer(c); };

  if (!question) return null;

  return (
    <div style={{
      background:'white', borderRadius:16, padding:'18px 20px',
      boxShadow:'0 4px 20px rgba(0,0,0,0.12)', animation:'pop 0.2s ease',
      border:`2.5px solid ${phase==='explain'?(wasCorrect?'#4ade80':'#ff6b6b'):'#e9ecef'}`,
    }}>
      <div style={{ fontSize:17, fontWeight:700, color:'#1a1a2e', marginBottom:14,
        lineHeight:1.5, textAlign:'right' }}>
        {question.text}
      </div>

      {phase === 'question' && (
        question.type === 'typed' ? (
          <div style={{ display:'flex', gap:8, direction:'ltr' }}>
            <input ref={inputRef} type="text" value={input}
              onChange={e=>setInput(e.target.value)} onKeyDown={handleKey}
              placeholder="תשובה..." dir="ltr" inputMode="decimal"
              style={{ flex:1, padding:'10px 14px', fontSize:18, fontWeight:700,
                borderRadius:10, border:'2px solid #dee2e6', outline:'none',
                textAlign:'center', fontFamily:"'Heebo',sans-serif" }} />
            <button onClick={submit} style={{
              background:'linear-gradient(135deg,#2f9e44,#40c057)', color:'white',
              border:'none', borderRadius:10, padding:'10px 20px',
              fontSize:16, fontWeight:800, cursor:'pointer' }}>✓</button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {question.choices.map((c,i) => (
              <button key={i} onClick={() => handleChoice(c)}
                disabled={choiceSelected !== null}
                style={{ padding:'12px 10px', fontSize:16, fontWeight:700, borderRadius:12,
                  cursor:choiceSelected?'default':'pointer',
                  border:`2px solid ${choiceSelected===c?'#74c0fc':'#dee2e6'}`,
                  background:choiceSelected===c?'#e7f5ff':'linear-gradient(135deg,#f8f9fa,#fff)',
                  color:'#333', direction:'ltr', transition:'transform 0.1s' }}
                onMouseEnter={e=>{if(!choiceSelected)e.currentTarget.style.transform='scale(1.04)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)'}}>
                {c}
              </button>
            ))}
          </div>
        )
      )}

      {phase === 'explain' && (
        <>
          <div style={{ background:wasCorrect?'#d3f9d8':'#ffe3e3', borderRadius:10,
            padding:'10px 14px', marginBottom:12, display:'flex', alignItems:'flex-start', gap:10 }}>
            <span style={{ fontSize:20 }}>{wasCorrect?'✅':'❌'}</span>
            <div>
              <div style={{ fontWeight:800, color:wasCorrect?'#2f9e44':'#e03131', fontSize:15 }}>
                {wasCorrect?'נכון מאוד!':'לא נכון'}
              </div>
              {!wasCorrect && (
                <div style={{ fontSize:14, color:'#555', marginTop:2 }}>
                  תשובתך:{' '}
                  <span style={{ direction:'ltr', fontFamily:'monospace', color:'#e03131' }}>
                    {lastUserAnswer}
                  </span>
                  {'  •  '}
                  התשובה הנכונה:{' '}
                  <span style={{ direction:'ltr', fontFamily:'monospace', fontWeight:900, color:'#2f9e44' }}>
                    {question.answer}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div style={{ background:'#f8f9fa', borderRadius:10, padding:'10px 14px',
            marginBottom:14, fontSize:14, color:'#444', lineHeight:1.6 }}>
            <span style={{ fontWeight:700, color:'#1c7ed6' }}>הסבר: </span>
            {question.explanation}
          </div>
          <button onClick={onContinue} style={{
            width:'100%', padding:12, fontSize:16, fontWeight:800, borderRadius:12,
            border:'none', cursor:'pointer',
            background:'linear-gradient(135deg,#1c7ed6,#339af0)', color:'white',
            boxShadow:'0 3px 10px #1c7ed644' }}>
            המשך ←
          </button>
        </>
      )}
    </div>
  );
}
