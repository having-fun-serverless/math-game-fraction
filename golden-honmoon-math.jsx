import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════ AUDIO ENGINE ═══════════════ */
class GameAudio {
  constructor(){this.ctx=null;this.bgGain=null;this.bgPlaying=false;this.bgTimeout=null;}
  init(){if(this.ctx)return;this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.masterGain=this.ctx.createGain();this.masterGain.gain.value=1;this.masterGain.connect(this.ctx.destination);this.bgGain=this.ctx.createGain();this.bgGain.gain.value=0.07;this.bgGain.connect(this.masterGain);}
  setMuted(m){if(this.masterGain)this.masterGain.gain.value=m?0:1;}
  _t(f,s,d,ty="sine",v=.15,dest=null){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(v,s+.03);g.gain.exponentialRampToValueAtTime(.001,s+d);o.connect(g).connect(dest||this.masterGain);o.start(s);o.stop(s+d+.01);}
  playSuccess(){if(!this.ctx)return;const t=this.ctx.currentTime;[523.25,659.25,783.99,1046.5].forEach((f,i)=>this._t(f,t+i*.08,.35,"sine",.18));this._t(2093,t+.25,.45,"triangle",.08);}
  playStreak(){if(!this.ctx)return;const t=this.ctx.currentTime;[523.25,659.25,783.99,1046.5,1318.51,1567.98].forEach((f,i)=>this._t(f,t+i*.06,.4,i<4?"sine":"triangle",.15));}
  playFail(){if(!this.ctx)return;const t=this.ctx.currentTime;[392,349.23,311.13].forEach((f,i)=>this._t(f,t+i*.12,.3,"sawtooth",.09));}
  playFanfare(){if(!this.ctx)return;const t=this.ctx.currentTime;[[523.25,659.25,783.99],[587.33,739.99,880],[659.25,830.61,987.77],[783.99,987.77,1174.66],[1046.5,1318.51,1567.98]].forEach((ch,ci)=>ch.forEach(f=>this._t(f,t+ci*.18,ci===4?.9:.4,ci<4?"sine":"triangle",ci===4?.14:.1)));}
  playLevelFail(){if(!this.ctx)return;const t=this.ctx.currentTime;[392,349.23,311.13,261.63].forEach((f,i)=>this._t(f,t+i*.2,.5,"triangle",.12));}
  startBgMusic(){if(!this.ctx||this.bgPlaying)return;this.bgPlaying=true;this._loop();}
  _loop(){
    if(!this.bgPlaying||!this.ctx)return;const t=this.ctx.currentTime,bt=.5,bar=2;
    const ch=[{r:220,n:[220,261.63,329.63]},{r:174.61,n:[174.61,220,261.63]},{r:261.63,n:[261.63,329.63,392]},{r:196,n:[196,246.94,293.66]}];
    ch.forEach((c,ci)=>{c.n.forEach(f=>{const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type="sine";o.frequency.value=f;const s=t+ci*bar;g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(.06,s+.1);g.gain.setValueAtTime(.06,s+bar-.15);g.gain.linearRampToValueAtTime(0,s+bar);o.connect(g).connect(this.bgGain);o.start(s);o.stop(s+bar+.01);});[0,1,2,3].forEach(bi=>this._t(c.r/2,t+ci*bar+bi*bt,bt*.8,"triangle",bi===0?.12:.06,this.bgGain));});
    [{f:523.25,s:0,d:.5},{f:587.33,s:.5,d:.25},{f:523.25,s:1,d:.5},{f:440,s:1.75,d:.25},{f:523.25,s:2,d:.75},{f:440,s:2.75,d:.25},{f:392,s:3,d:.5},{f:349.23,s:3.5,d:.5},{f:523.25,s:4,d:.5},{f:659.25,s:4.5,d:.5},{f:783.99,s:5,d:.5},{f:659.25,s:5.5,d:.5},{f:587.33,s:6,d:1},{f:523.25,s:7,d:.75}].forEach(({f,s,d})=>{const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type="sine";o.frequency.value=f;const st=t+s*bt;g.gain.setValueAtTime(0,st);g.gain.linearRampToValueAtTime(.04,st+.03);g.gain.setValueAtTime(.04,st+d*bt-.05);g.gain.linearRampToValueAtTime(0,st+d*bt);o.connect(g).connect(this.bgGain);o.start(st);o.stop(st+d*bt+.01);});
    for(let i=0;i<32;i++){const s=t+i*(bt/2),bs=this.ctx.sampleRate*.03,buf=this.ctx.createBuffer(1,bs,this.ctx.sampleRate),d=buf.getChannelData(0);for(let j=0;j<bs;j++)d[j]=(Math.random()*2-1)*.3;const src=this.ctx.createBufferSource();src.buffer=buf;const g=this.ctx.createGain(),hp=this.ctx.createBiquadFilter();hp.type="highpass";hp.frequency.value=8000;g.gain.setValueAtTime(i%2===0?.08:.03,s);g.gain.exponentialRampToValueAtTime(.001,s+.05);src.connect(hp).connect(g).connect(this.bgGain);src.start(s);}
    for(let ci=0;ci<4;ci++){[0,2].forEach(bi=>{const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type="sine";const s=t+ci*bar+bi*bt;o.frequency.setValueAtTime(150,s);o.frequency.exponentialRampToValueAtTime(40,s+.08);g.gain.setValueAtTime(.15,s);g.gain.exponentialRampToValueAtTime(.001,s+.15);o.connect(g).connect(this.bgGain);o.start(s);o.stop(s+.2);});[1,3].forEach(bi=>{const s=t+ci*bar+bi*bt,bs=this.ctx.sampleRate*.08,buf=this.ctx.createBuffer(1,bs,this.ctx.sampleRate),d=buf.getChannelData(0);for(let j=0;j<bs;j++)d[j]=Math.random()*2-1;const src=this.ctx.createBufferSource();src.buffer=buf;const g=this.ctx.createGain(),bp=this.ctx.createBiquadFilter();bp.type="bandpass";bp.frequency.value=3000;bp.Q.value=1;g.gain.setValueAtTime(.08,s);g.gain.exponentialRampToValueAtTime(.001,s+.1);src.connect(bp).connect(g).connect(this.bgGain);src.start(s);});}
    this.bgTimeout=setTimeout(()=>this._loop(),4*bar*1000-50);
  }
  stopBgMusic(){this.bgPlaying=false;if(this.bgTimeout)clearTimeout(this.bgTimeout);}
  setBgVolume(v){if(this.bgGain)this.bgGain.gain.value=v;}
}
const audio=new GameAudio();

/* ═══════════════ CHARACTERS ═══════════════ */
const CHARACTERS = [
  {
    id:"rumi", name:"Rumi", korName:"루미", color:"#c084fc", accent:"#7c3aed",
    description:"מנהיגת HUNTR/X • זמרת ראשית",
    hair:"#7c3aed", skinTone:"#fde2c8", outfit1:"#c084fc", outfit2:"#7c3aed",
    weapon:"🎤", trait:"שירה",
    dances:["danceSpinKick","danceWave","danceJump","dancePop","danceSlide","danceTwirl"],
  },
  {
    id:"mira", name:"Mira", korName:"미라", color:"#f472b6", accent:"#be185d",
    description:"לוחמת HUNTR/X • רקדנית ראשית",
    hair:"#1a1a2e", skinTone:"#d4a574", outfit1:"#f472b6", outfit2:"#be185d",
    weapon:"⚔️", trait:"ריקוד",
    dances:["danceMartial","danceFlip","danceGroove","danceKick","danceSpin360","danceStrut"],
  },
  {
    id:"zoey", name:"Zoey", korName:"조이", color:"#34d399", accent:"#059669",
    description:"ראפרית HUNTR/X • שוליית שין-קאל",
    hair:"#1a1a2e", skinTone:"#fde2c8", outfit1:"#34d399", outfit2:"#059669",
    weapon:"🗡️", trait:"ראפ",
    dances:["danceBreak","danceRobot","danceBounce","danceSlither","danceNinja","danceHipHop"],
  },
];

/* ═══════════════ SVG CHARACTER COMPONENT ═══════════════ */
function CharacterSVG({ char, state, danceIdx = 0, size = 160 }) {
  const c = char;
  const dance = state === "dance" ? c.dances[danceIdx % c.dances.length] : null;
  const anim = state === "idle" ? "charIdle" : state === "sad" ? "charSad" : dance || "charIdle";

  // body part positions vary by dance
  const poses = {
    charIdle: { lArm: -15, rArm: 15, lLeg: -5, rLeg: 5, bodyY: 0, headTilt: 0, bodyRotate: 0 },
    danceSpinKick: { lArm: -80, rArm: 120, lLeg: -10, rLeg: 60, bodyY: -8, headTilt: -10, bodyRotate: 5 },
    danceWave: { lArm: -160, rArm: 160, lLeg: -5, rLeg: 5, bodyY: -5, headTilt: 5, bodyRotate: 0 },
    danceJump: { lArm: -140, rArm: -140, lLeg: 30, rLeg: -30, bodyY: -20, headTilt: 0, bodyRotate: 0 },
    dancePop: { lArm: -90, rArm: 90, lLeg: -15, rLeg: 15, bodyY: -6, headTilt: 10, bodyRotate: -5 },
    danceSlide: { lArm: -30, rArm: -120, lLeg: -20, rLeg: 30, bodyY: -4, headTilt: -8, bodyRotate: 8 },
    danceTwirl: { lArm: -120, rArm: -60, lLeg: 10, rLeg: -10, bodyY: -12, headTilt: 15, bodyRotate: -10 },
    danceMartial: { lArm: -170, rArm: 0, lLeg: 60, rLeg: 5, bodyY: -6, headTilt: -5, bodyRotate: 10 },
    danceFlip: { lArm: -90, rArm: -90, lLeg: 40, rLeg: -40, bodyY: -25, headTilt: 0, bodyRotate: 0 },
    danceGroove: { lArm: -45, rArm: 45, lLeg: -20, rLeg: 20, bodyY: -3, headTilt: 8, bodyRotate: -3 },
    danceKick: { lArm: -60, rArm: 140, lLeg: -5, rLeg: 80, bodyY: -5, headTilt: -5, bodyRotate: 5 },
    danceSpin360: { lArm: -150, rArm: 150, lLeg: 0, rLeg: 0, bodyY: -10, headTilt: 0, bodyRotate: 15 },
    danceStrut: { lArm: -30, rArm: 60, lLeg: -25, rLeg: 25, bodyY: -2, headTilt: 12, bodyRotate: -8 },
    danceBreak: { lArm: -170, rArm: 30, lLeg: 50, rLeg: -20, bodyY: -8, headTilt: -12, bodyRotate: 12 },
    danceRobot: { lArm: -90, rArm: 90, lLeg: 0, rLeg: 0, bodyY: 0, headTilt: 0, bodyRotate: 0 },
    danceBounce: { lArm: -50, rArm: -50, lLeg: -15, rLeg: 15, bodyY: -15, headTilt: 5, bodyRotate: 0 },
    danceSlither: { lArm: -30, rArm: 120, lLeg: -10, rLeg: 10, bodyY: -4, headTilt: -15, bodyRotate: 10 },
    danceNinja: { lArm: -170, rArm: -10, lLeg: 70, rLeg: -5, bodyY: -10, headTilt: 0, bodyRotate: 15 },
    danceHipHop: { lArm: -110, rArm: 40, lLeg: -20, rLeg: 30, bodyY: -6, headTilt: 10, bodyRotate: -5 },
    charSad: { lArm: 20, rArm: -20, lLeg: -2, rLeg: 2, bodyY: 6, headTilt: -20, bodyRotate: 0 },
  };

  const p = poses[anim] || poses.charIdle;
  const isSad = state === "sad";
  const isDance = state === "dance";

  return (
    <div style={{
      width: size, height: size * 1.4, position: "relative", margin: "0 auto",
      animation: isDance ? "charDanceBounce 0.4s ease infinite" : isSad ? "charSadSway 1.5s ease infinite" : "charBreathing 3s ease infinite",
      filter: isSad ? "saturate(0.4) brightness(0.8)" : isDance ? `drop-shadow(0 0 15px ${c.color}88)` : undefined,
      transition: "filter 0.5s ease",
    }}>
      <svg viewBox="0 0 120 170" style={{ width: "100%", height: "100%" }}>
        {/* Dance sparkles */}
        {isDance && (
          <g style={{ animation: "sparkleRotate 1s linear infinite" }}>
            {[[-8,20],[128,30],[10,140],[110,150],[60,-5]].map(([x,y],i)=>(
              <text key={i} x={x} y={y} fontSize="10" style={{
                animation:`sparkleFlash 0.5s ease infinite ${i*0.15}s`,
                opacity:0,
              }}>✦</text>
            ))}
          </g>
        )}
        {/* Sad rain drops */}
        {isSad && (
          <g>
            {[[30,10],[50,5],[70,15],[90,8]].map(([x,y],i)=>(
              <line key={i} x1={x} y1={y} x2={x} y2={y+8} stroke="#6688cc" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"
                style={{ animation:`rainDrop 0.8s ease infinite ${i*0.2}s` }} />
            ))}
          </g>
        )}

        <g transform={`translate(60, ${85+p.bodyY}) rotate(${p.bodyRotate})`}>
          {/* Left leg */}
          <line x1="-8" y1="30" x2={-8+p.lLeg*0.3} y2="65" stroke={c.outfit2} strokeWidth="8" strokeLinecap="round"
            style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} />
          <circle cx={-8+p.lLeg*0.3} cy="67" r="5" fill={c.outfit2}
            style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} />
          {/* Right leg */}
          <line x1="8" y1="30" x2={8+p.rLeg*0.3} y2="65" stroke={c.outfit2} strokeWidth="8" strokeLinecap="round"
            style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} />
          <circle cx={8+p.rLeg*0.3} cy="67" r="5" fill={c.outfit2}
            style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} />

          {/* Body/torso */}
          <rect x="-16" y="-20" width="32" height="50" rx="12" fill={c.outfit1}
            style={{ transition: "all 0.35s ease" }} />
          {/* Outfit detail stripe */}
          <rect x="-12" y="5" width="24" height="3" rx="1.5" fill={c.accent} opacity="0.5" />
          <rect x="-10" y="12" width="20" height="2" rx="1" fill={c.accent} opacity="0.3" />

          {/* Left arm */}
          <line x1="-16" y1="-10" x2={-16+Math.sin(p.lArm*Math.PI/180)*28} y2={-10-Math.cos(p.lArm*Math.PI/180)*28}
            stroke={c.skinTone} strokeWidth="7" strokeLinecap="round"
            style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} />
          {/* Right arm */}
          <line x1="16" y1="-10" x2={16+Math.sin(-p.rArm*Math.PI/180)*28} y2={-10-Math.cos(-p.rArm*Math.PI/180)*28}
            stroke={c.skinTone} strokeWidth="7" strokeLinecap="round"
            style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }} />
          {/* Weapon in right hand when dancing */}
          {isDance && (
            <text x={16+Math.sin(-p.rArm*Math.PI/180)*32} y={-10-Math.cos(-p.rArm*Math.PI/180)*32+4}
              fontSize="12" textAnchor="middle"
              style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>{c.weapon}</text>
          )}

          {/* Head */}
          <g transform={`translate(0, -30) rotate(${p.headTilt})`}
            style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
            {/* Hair back */}
            <ellipse cx="0" cy="-2" rx="20" ry="18" fill={c.hair} />
            {/* Face */}
            <ellipse cx="0" cy="2" rx="16" ry="16" fill={c.skinTone} />
            {/* Hair bangs */}
            <path d={`M-16,-8 Q-10,-18 0,-16 Q10,-18 16,-8 Q10,-14 0,-12 Q-10,-14 -16,-8`} fill={c.hair} />
            {/* Hair side strands */}
            <path d={`M-16,0 Q-22,10 -18,22`} stroke={c.hair} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d={`M16,0 Q22,10 18,22`} stroke={c.hair} strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Eyes */}
            {isSad ? (
              <>
                <path d="M-7,2 Q-5,6 -3,2" stroke="#333" strokeWidth="1.5" fill="none" />
                <path d="M3,2 Q5,6 7,2" stroke="#333" strokeWidth="1.5" fill="none" />
                {/* Tears */}
                <circle cx="-7" cy="7" r="1.5" fill="#88bbee" style={{ animation: "tearDrop 1s ease infinite" }} />
                <circle cx="7" cy="8" r="1.5" fill="#88bbee" style={{ animation: "tearDrop 1s ease infinite 0.3s" }} />
              </>
            ) : isDance ? (
              <>
                <ellipse cx="-6" cy="1" rx="3.5" ry="4" fill="#333" />
                <ellipse cx="6" cy="1" rx="3.5" ry="4" fill="#333" />
                <circle cx="-5" cy="0" r="1.2" fill="#fff" />
                <circle cx="7" cy="0" r="1.2" fill="#fff" />
                {/* Star eyes sparkle */}
                <text x="-6" y="4" fontSize="4" textAnchor="middle" style={{animation:"sparkleFlash 0.4s ease infinite"}}>✦</text>
                <text x="6" y="4" fontSize="4" textAnchor="middle" style={{animation:"sparkleFlash 0.4s ease infinite 0.2s"}}>✦</text>
              </>
            ) : (
              <>
                <ellipse cx="-6" cy="1" rx="3" ry="3.5" fill="#333" />
                <ellipse cx="6" cy="1" rx="3" ry="3.5" fill="#333" />
                <circle cx="-5" cy="0" r="1" fill="#fff" />
                <circle cx="7" cy="0" r="1" fill="#fff" />
              </>
            )}
            {/* Mouth */}
            {isSad ? (
              <path d="M-5,10 Q0,7 5,10" stroke="#cc6666" strokeWidth="1.5" fill="none" />
            ) : isDance ? (
              <path d="M-6,8 Q0,15 6,8" stroke="#e06080" strokeWidth="1.5" fill="#e0608033" />
            ) : (
              <path d="M-4,9 Q0,12 4,9" stroke="#cc8888" strokeWidth="1.2" fill="none" />
            )}
            {/* Blush */}
            {isDance && <>
              <circle cx="-11" cy="6" r="3" fill="#ff88aa" opacity="0.3" />
              <circle cx="11" cy="6" r="3" fill="#ff88aa" opacity="0.3" />
            </>}
          </g>
        </g>
      </svg>
    </div>
  );
}

/* ═══════════════ GAME LEVELS ═══════════════ */
const LEVELS = [
  { id:1,name:"Golden",emoji:"✨",description:"כפל וחילוק ב-10, 100, 1000",spotifyId:"1CPZ5BxNNd0n0nF4Orb9JS",color:"#FFD700",
    generate:()=>{const ops=[()=>{const a=+(Math.random()*90+1).toFixed(Math.floor(Math.random()*3)+1),m=[10,100,1000][Math.floor(Math.random()*3)];return{q:`${a} × ${m} = ?`,a:+(a*m).toFixed(4)}},()=>{const m=[10,100,1000][Math.floor(Math.random()*3)],a=+(Math.random()*900+10).toFixed(Math.floor(Math.random()*3)+1);return{q:`${a} ÷ ${m} = ?`,a:+(a/m).toFixed(6)}}];return ops[Math.floor(Math.random()*ops.length)]();}},
  { id:2,name:"How It's Done",emoji:"⚡",description:"כפל מספרים עשרוניים (א)",spotifyId:"4iSXiBGqVNflQPYnYciMBT",color:"#FF69B4",
    generate:()=>{const a=+(Math.floor(Math.random()*90+10)/10).toFixed(1),b=+(Math.floor(Math.random()*9+1)/10).toFixed(1);return{q:`${a} × ${b} = ?`,a:+(a*b).toFixed(4)}}},
  { id:3,name:"Soda Pop",emoji:"🫧",description:"כפל מספרים עשרוניים (ב)",spotifyId:"02sy7FAs8dkDNYsHp4Ul3f",color:"#00BFFF",
    generate:()=>{const a=+(Math.floor(Math.random()*90+10)/10).toFixed(1),b=+(Math.floor(Math.random()*90+10)/10).toFixed(1);return{q:`${a} × ${b} = ?`,a:+(a*b).toFixed(4)}}},
  { id:4,name:"What It Sounds Like",emoji:"🔥",description:"חילוק מספרים עשרוניים",spotifyId:"3TGxSPlHPbrhGhw0DVdHqN",color:"#9B59B6",
    generate:()=>{const b=+(Math.floor(Math.random()*9+1)/10).toFixed(1),r=+(Math.floor(Math.random()*90+10)/10).toFixed(1),a=+(b*r).toFixed(4);return{q:`${a} ÷ ${b} = ?`,a:r}}},
  { id:5,name:"Golden Honmoon 🌙",emoji:"👹",description:"משבר פשוט למספר עשרוני",spotifyId:"1CPZ5BxNNd0n0nF4Orb9JS",color:"#FFD700",
    generate:()=>{const ds=[2,4,5,8,10,20,25,50],d=ds[Math.floor(Math.random()*ds.length)],n=Math.floor(Math.random()*(d-1))+1;return{q:`הפכו לעשרוני: ${n}/${d} = ?`,a:+(n/d).toFixed(6)}}},
];
const QPL=5, PASS=4;

/* ═══════════════ PARTICLES ═══════════════ */
function Particles({type,color}){
  const count=type==="fanfare"?50:20;
  const sym=type==="success"?["✦","♪","⭐","✧","💫"]:type==="fanfare"?["🌟","✨","⭐","🎵","🎶","💛","🏆","🌙"]:["💀","👾","😈"];
  return <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:50,overflow:"hidden"}}>
    {Array.from({length:count}).map((_,i)=>{const up=type!=="fail";return<div key={i} style={{position:"absolute",left:`${10+Math.random()*80}%`,...(up?{bottom:"-20px"}:{top:"-20px"}),fontSize:`${14+Math.random()*18}px`,animation:`${up?"particleUp":"particleDown"} ${1+Math.random()*2}s ease-${up?"out":"in"} forwards`,animationDelay:`${Math.random()*.4}s`,filter:type==="success"?`drop-shadow(0 0 4px ${color})`:undefined}}>{sym[i%sym.length]}</div>})}
  </div>;
}

function ConfettiEffect(){
  const clr=["#FFD700","#FF69B4","#00BFFF","#9B59B6","#FF4500","#34d399"];
  return<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:999}}>
    {Array.from({length:60}).map((_,i)=><div key={i} style={{position:"absolute",left:`${Math.random()*100}%`,top:"-10px",width:`${Math.random()*10+4}px`,height:`${Math.random()*10+4}px`,background:clr[i%clr.length],borderRadius:Math.random()>.5?"50%":"2px",animation:`confettiFall ${2+Math.random()*3}s ease-in forwards`,animationDelay:`${Math.random()*.8}s`,transform:`rotate(${Math.random()*360}deg)`}}/>)}
  </div>;
}

function FloatingDecorations(){
  const items=["♪","♫","🌙","✦","⭐","🎵","✧","💜"];
  return<>{items.map((item,i)=><div key={i} style={{position:"absolute",fontSize:14+i*2,opacity:.2,left:`${5+i*12}%`,bottom:`${5+Math.random()*40}%`,animation:`floatUp ${5+i*.8}s ease-in-out infinite`,animationDelay:`${i*.6}s`,color:["#FFD700","#FF69B4","#00BFFF","#9B59B6","#c084fc","#34d399","#fbbf24","#f472b6"][i],filter:"drop-shadow(0 0 4px currentColor)"}}>{item}</div>)}</>;
}

/* ═══════════════ SHIELD ═══════════════ */
function HonmoonShield({power,maxPower,color}){
  const pct=Math.min(power/maxPower,1),glow=pct*40;
  return<div style={{textAlign:"center",margin:"6px 0"}}>
    <div style={{width:100,height:100,borderRadius:"50%",margin:"0 auto",position:"relative",animation:pct>=1?"shieldComplete 1s ease infinite":undefined}}>
      <svg viewBox="0 0 100 100" style={{position:"absolute",inset:0,animation:"spinSlow 20s linear infinite"}}>
        {[0,45,90,135,180,225,270,315].map(d=><line key={d} x1="50" y1="3" x2="50" y2="10" stroke={color} strokeWidth="2" opacity={pct>d/360?.8:.15} transform={`rotate(${d} 50 50)`} strokeLinecap="round"/>)}
      </svg>
      <div style={{position:"absolute",inset:8,borderRadius:"50%",border:`3px solid ${color}`,background:`conic-gradient(${color}cc ${pct*360}deg, #1a1a2e ${pct*360}deg)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 ${glow}px ${color}, inset 0 0 ${glow/2}px ${color}55`,transition:"all 0.6s ease"}}>
        <div style={{width:62,height:62,borderRadius:"50%",background:"#12122a",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
          <span style={{fontSize:10,color:"#888",fontFamily:"'Secular One'"}}>הונמון</span>
          <span style={{fontSize:18,fontWeight:800,color,fontFamily:"'Secular One'"}}>{power}/{maxPower}</span>
        </div>
      </div>
    </div>
  </div>;
}

/* ═══════════════ MAIN GAME ═══════════════ */
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
  const char = selectedChar ? CHARACTERS.find(c=>c.id===selectedChar) : null;

  const ensureAudio=()=>{if(!audioStarted){audio.init();audio.startBgMusic();setAudioStarted(true);}};
  const triggerParticles=(type,color)=>{setParticles({type,color,key:Date.now()});setTimeout(()=>setParticles(null),2500);};

  const generateQuestion=useCallback(()=>{
    if(LEVELS[currentLevel]){setCurrentQ(LEVELS[currentLevel].generate());setInput("");setFeedback(null);setCharState("idle");setTimeout(()=>inputRef.current?.focus(),100);}
  },[currentLevel]);

  useEffect(()=>{if(screen==="playing")generateQuestion();},[screen,questionIdx,generateQuestion]);
  useEffect(()=>{audio.setBgVolume(screen==="levelComplete"?.02:.07);},[screen]);

  const checkAnswer=()=>{
    if(!currentQ||!input.trim())return;
    const userAns=parseFloat(input.replace(",","."));
    const correct=Math.abs(userAns-currentQ.a)<0.001;
    if(correct){
      setScore(s=>s+1);setStreak(s=>s+1);
      if(streak>=2)audio.playStreak();else audio.playSuccess();
      setFeedback({correct:true,msg:streak>=2?`🔥 רצף של ${streak+1}!`:"✓ נכון!"});
      setDanceIdx(d=>d+1);setCharState("dance");
      triggerParticles("success",level.color);
    } else {
      setStreak(0);setShakeWrong(true);audio.playFail();
      setTimeout(()=>setShakeWrong(false),500);
      setFeedback({correct:false,msg:`✗ התשובה: ${currentQ.a}`});
      setCharState("sad");
      triggerParticles("fail","#ff4444");
    }
    setTimeout(()=>{
      if(questionIdx+1>=QPL){
        const passed=(correct?score+1:score)>=PASS;
        if(passed){setCompletedLevels(c=>[...c,currentLevel]);setShowConfetti(true);audio.playFanfare();triggerParticles("fanfare","#FFD700");setCharState("dance");setTimeout(()=>setShowConfetti(false),4000);}
        else{audio.playLevelFail();setCharState("sad");}
        setScreen(passed?"levelComplete":"levelFailed");
      }else{setQuestionIdx(q=>q+1);}
    },1400);
  };

  const startLevel=(idx)=>{ensureAudio();setCurrentLevel(idx);setQuestionIdx(0);setScore(0);setStreak(0);setCharState("idle");setScreen("playing");};
  const handleKey=(e)=>{if(e.key==="Enter")checkAnswer();};

  return(
    <div dir="rtl" style={{minHeight:"100vh",position:"relative",overflow:"hidden",background:"linear-gradient(160deg,#06061a 0%,#12122e 30%,#1e1245 60%,#2a1050 100%)",color:"#e0e0e0",fontFamily:"'Secular One','Heebo',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Secular+One&family=Heebo:wght@300;400;700;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes floatUp{0%,100%{transform:translateY(0) rotate(0deg);opacity:.15}50%{transform:translateY(-60px) rotate(15deg);opacity:.35}}
        @keyframes confettiFall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
        @keyframes shakeX{0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 15px #FFD70066}50%{box-shadow:0 0 40px #FFD700cc}}
        @keyframes beatPulse{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.4)}}
        @keyframes spinSlow{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes shieldComplete{0%,100%{transform:scale(1);filter:brightness(1)}50%{transform:scale(1.04);filter:brightness(1.2)}}
        @keyframes particleUp{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(-300px) scale(0) rotate(180deg);opacity:0}}
        @keyframes particleDown{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(200px) scale(0);opacity:0}}
        @keyframes titleGlow{0%,100%{filter:drop-shadow(0 0 8px #FFD70044)}50%{filter:drop-shadow(0 0 20px #FFD700aa)}}
        @keyframes bgPulse{0%,100%{opacity:.03}50%{opacity:.08}}
        @keyframes scaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes charDanceBounce{0%,100%{transform:translateY(0) rotate(-2deg)}25%{transform:translateY(-8px) rotate(2deg)}50%{transform:translateY(0) rotate(-2deg)}75%{transform:translateY(-5px) rotate(1deg)}}
        @keyframes charSadSway{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}
        @keyframes charBreathing{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
        @keyframes sparkleFlash{0%,100%{opacity:0;transform:scale(0.5)}50%{opacity:1;transform:scale(1.2)}}
        @keyframes sparkleRotate{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes tearDrop{0%{opacity:0;transform:translateY(0)}50%{opacity:.8;transform:translateY(4px)}100%{opacity:0;transform:translateY(10px)}}
        @keyframes rainDrop{0%{opacity:0;transform:translateY(-5px)}50%{opacity:.5}100%{opacity:0;transform:translateY(20px)}}
        @keyframes charSelectPop{from{transform:scale(0.6) rotate(-5deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}
        @keyframes charHover{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        input[type=text]{outline:none;caret-color:#FFD700}
        input[type=text]:focus{border-color:#FFD700!important;box-shadow:0 0 20px #FFD70044}
      `}</style>

      <div style={{position:"absolute",inset:0,opacity:.04,backgroundImage:`radial-gradient(circle at 20% 50%,#c084fc 1px,transparent 1px),radial-gradient(circle at 80% 20%,#FFD700 1px,transparent 1px),radial-gradient(circle at 60% 80%,#FF69B4 1px,transparent 1px)`,backgroundSize:"60px 60px,80px 80px,70px 70px",animation:"bgPulse 4s ease infinite"}}/>
      {showConfetti&&<ConfettiEffect/>}
      {particles&&<Particles key={particles.key} type={particles.type} color={particles.color}/>}
      <FloatingDecorations/>

      <div style={{maxWidth:460,margin:"0 auto",padding:"16px",position:"relative",zIndex:1}}>

        {/* HEADER */}
        <div style={{textAlign:"center",padding:"10px 0 14px",position:"relative"}}>
          <div style={{fontSize:11,letterSpacing:4,color:"#555",marginBottom:4,fontFamily:"'Heebo'"}}>HUNTR/X MATH QUEST</div>
          <h1 style={{fontSize:30,fontWeight:900,margin:0,background:"linear-gradient(135deg,#FFD700 0%,#FF69B4 40%,#00BFFF 70%,#c084fc 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"'Secular One'",animation:"titleGlow 3s ease infinite"}}>Golden Honmoon</h1>
          <div style={{fontSize:10,color:"#444",marginTop:2,fontFamily:"'Heebo'"}}>골든 혼문 • מגן ההונמון המוזהב</div>
          {screen!=="charSelect"&&<button onClick={()=>{ensureAudio();const n=!muted;setMuted(n);audio.setMuted(n);}} style={{position:"absolute",left:0,top:10,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"8px 12px",cursor:"pointer",fontSize:18,color:muted?"#444":"#FFD700",transition:"all 0.2s"}}>{muted?"🔇":"🔊"}</button>}
          {audioStarted&&!muted&&<div style={{position:"absolute",right:0,top:14,display:"flex",gap:2,alignItems:"flex-end",height:20}}>{[0,1,2,3,4].map(i=><div key={i} style={{width:3,borderRadius:2,background:"linear-gradient(to top,#FF69B4,#FFD700)",animation:"beatPulse 0.4s ease infinite",animationDelay:`${i*.1}s`,height:[10,16,8,14,12][i],opacity:.6}}/>)}</div>}
        </div>

        {/* ═══ CHARACTER SELECT ═══ */}
        {screen==="charSelect"&&(
          <div style={{animation:"slideIn 0.5s ease",textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:900,color:"#FFD700",margin:"10px 0 6px",fontFamily:"'Secular One'"}}>בחרי את הלוחמת שלך!</div>
            <div style={{fontSize:13,color:"#888",marginBottom:24,fontFamily:"'Heebo'"}}>מי תלחם לצידך נגד גוי-מא?</div>

            <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
              {CHARACTERS.map((c,i) => (
                <button key={c.id} onClick={()=>{ensureAudio();setSelectedChar(c.id);setScreen("menu");}}
                  style={{
                    background:`linear-gradient(160deg, ${c.color}15, ${c.accent}10)`,
                    border:`2px solid ${c.color}44`,borderRadius:22,padding:"18px 14px 14px",
                    cursor:"pointer",width:130,textAlign:"center",transition:"all 0.3s",
                    animation:`charSelectPop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i*0.15}s both`,
                    position:"relative",overflow:"hidden",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 8px 30px ${c.color}33`;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=c.color+"44";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}
                >
                  <div style={{animation:"charHover 2s ease infinite",animationDelay:`${i*0.3}s`}}>
                    <CharacterSVG char={c} state="idle" size={90}/>
                  </div>
                  <div style={{fontSize:18,fontWeight:900,color:c.color,fontFamily:"'Secular One'",marginTop:4}}>{c.name}</div>
                  <div style={{fontSize:11,color:"#aaa",fontFamily:"'Heebo'"}}>{c.korName}</div>
                  <div style={{fontSize:10,color:"#666",marginTop:4,fontFamily:"'Heebo'"}}>{c.description}</div>
                  <div style={{fontSize:18,marginTop:6}}>{c.weapon}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ MENU ═══ */}
        {screen==="menu"&&char&&(
          <div style={{animation:"slideIn 0.5s ease"}}>
            <div style={{background:`linear-gradient(135deg,${char.color}10,${char.accent}08)`,borderRadius:20,padding:"16px",marginBottom:18,border:`1px solid ${char.color}22`,textAlign:"center",position:"relative"}}>
              <div style={{position:"absolute",top:10,left:10}}>
                <button onClick={()=>{setScreen("charSelect");setSelectedChar(null);}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"4px 10px",cursor:"pointer",fontSize:11,color:"#888",fontFamily:"'Heebo'"}}>החלפת דמות</button>
              </div>
              <CharacterSVG char={char} state="idle" size={100}/>
              <div style={{fontSize:16,fontWeight:900,color:char.color,fontFamily:"'Secular One'",marginTop:4}}>{char.name} {char.weapon} מוכנה לקרב!</div>
              <p style={{fontSize:13,lineHeight:1.7,color:"#999",fontFamily:"'Heebo'",margin:"8px 0 0"}}>
                הביסו את השדים של גוי-מא 👹 ופתחו שירים! 🎵
              </p>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {LEVELS.map((lv,i)=>{
                const completed=completedLevels.includes(i);
                const locked=i>0&&!completedLevels.includes(i-1);
                return<button key={lv.id} onClick={()=>!locked&&startLevel(i)} disabled={locked} style={{
                  background:completed?`linear-gradient(135deg,${lv.color}15,${lv.color}08)`:locked?"rgba(255,255,255,0.02)":"rgba(255,255,255,0.04)",
                  border:`1px solid ${completed?lv.color+"55":locked?"#222":lv.color+"22"}`,
                  borderRadius:16,padding:"14px 16px",color:locked?"#444":"#e0e0e0",
                  cursor:locked?"not-allowed":"pointer",textAlign:"right",transition:"all 0.3s",fontFamily:"'Heebo'",opacity:locked?.4:1,
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <span style={{fontSize:28}}>{locked?"🔒":completed?"🏆":lv.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:16,fontWeight:700,color:completed?lv.color:"#e0e0e0"}}>{lv.name}</span>
                        {completed&&<span style={{fontSize:10,background:lv.color+"22",color:lv.color,padding:"2px 8px",borderRadius:20}}>✓</span>}
                      </div>
                      <div style={{fontSize:12,color:"#666",marginTop:3}}>{lv.description}</div>
                    </div>
                  </div>
                </button>;
              })}
            </div>

            {completedLevels.length===LEVELS.length&&(
              <div style={{marginTop:24,padding:24,borderRadius:20,textAlign:"center",background:"linear-gradient(135deg,#FFD70012,#FF69B412,#c084fc12)",border:"1px solid #FFD70033",animation:"glowPulse 2s ease infinite"}}>
                <div style={{fontSize:48,marginBottom:8}}>🌙✨🏆✨🌙</div>
                <CharacterSVG char={char} state="dance" danceIdx={3} size={120}/>
                <div style={{fontSize:22,fontWeight:900,color:"#FFD700",fontFamily:"'Secular One'",marginTop:8}}>ההונמון המוזהב הושלם!</div>
                <div style={{fontSize:13,color:"#aaa",marginTop:6,fontFamily:"'Heebo'"}}>ניצחת את גוי-מא! 🐯</div>
              </div>
            )}
          </div>
        )}

        {/* ═══ PLAYING ═══ */}
        {screen==="playing"&&currentQ&&char&&(
          <div style={{animation:"slideIn 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <button onClick={()=>setScreen("menu")} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"7px 16px",color:"#888",cursor:"pointer",fontSize:13,fontFamily:"'Heebo'"}}>← תפריט</button>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:14,color:level.color,fontFamily:"'Secular One'"}}>{level.emoji} {level.name}</span>
              </div>
            </div>

            {/* Character + Shield side by side */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,margin:"4px 0"}}>
              <div style={{flex:"0 0 auto"}}>
                <CharacterSVG char={char} state={charState} danceIdx={danceIdx} size={120}/>
              </div>
              <div style={{flex:"0 0 auto"}}>
                <HonmoonShield power={score} maxPower={QPL} color={level.color}/>
              </div>
            </div>

            {/* Progress dots */}
            <div style={{display:"flex",justifyContent:"center",gap:10,margin:"6px 0"}}>
              {Array.from({length:QPL}).map((_,i)=><div key={i} style={{width:12,height:12,borderRadius:"50%",transition:"all 0.4s",background:i<questionIdx?level.color:i===questionIdx?"#fff":"rgba(255,255,255,0.1)",boxShadow:i===questionIdx?`0 0 12px ${level.color}`:i<questionIdx?`0 0 6px ${level.color}66`:"none",transform:i===questionIdx?"scale(1.3)":"scale(1)"}}/>)}
            </div>
            <div style={{fontSize:11,textAlign:"center",color:"#555",margin:"2px 0 14px",fontFamily:"'Heebo'"}}>שאלה {questionIdx+1} מתוך {QPL} • צריך {PASS} נכונות</div>

            {/* Question card */}
            <div style={{background:"rgba(255,255,255,0.05)",borderRadius:22,padding:"26px 22px",border:`1px solid ${level.color}22`,textAlign:"center",animation:shakeWrong?"shakeX 0.4s ease":"scaleIn 0.3s ease",position:"relative"}}>
              <div style={{fontSize:28,fontWeight:900,color:"#fff",marginBottom:24,fontFamily:"'Secular One'",direction:"ltr",letterSpacing:"1px",textShadow:`0 0 20px ${level.color}44`}}>{currentQ.q}</div>
              <div style={{display:"flex",gap:10,maxWidth:300,margin:"0 auto"}}>
                <input ref={inputRef} type="text" inputMode="decimal" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} disabled={!!feedback} placeholder="תשובה..."
                  style={{flex:1,background:"rgba(0,0,0,0.35)",border:`2px solid ${level.color}33`,borderRadius:14,padding:"14px 18px",color:"#fff",fontSize:22,textAlign:"center",fontFamily:"'Secular One'",direction:"ltr",transition:"all 0.3s"}}/>
                <button onClick={checkAnswer} disabled={!!feedback||!input.trim()} style={{background:`linear-gradient(135deg,${level.color},${level.color}bb)`,border:"none",borderRadius:14,padding:"14px 22px",color:"#000",fontWeight:900,fontSize:18,fontFamily:"'Secular One'",cursor:feedback||!input.trim()?"not-allowed":"pointer",opacity:feedback||!input.trim()?.4:1,transition:"all 0.2s",boxShadow:`0 0 15px ${level.color}44`}}>✓</button>
              </div>
              {feedback&&<div style={{marginTop:16,padding:"12px 18px",borderRadius:14,background:feedback.correct?"rgba(0,220,100,0.1)":"rgba(255,50,50,0.1)",border:`1px solid ${feedback.correct?"#4ade8044":"#ff6b6b44"}`,color:feedback.correct?"#4ade80":"#ff6b6b",fontSize:17,fontWeight:700,fontFamily:"'Heebo'",animation:"scaleIn 0.2s ease",direction:"ltr"}}>{feedback.msg}</div>}
            </div>
            {streak>=3&&<div style={{textAlign:"center",marginTop:10,fontSize:14,color:level.color,animation:"charDanceBounce 0.5s ease infinite",fontFamily:"'Secular One'"}}>🔥 רצף חם! {streak} ברצף! 🔥</div>}
          </div>
        )}

        {/* ═══ LEVEL COMPLETE ═══ */}
        {screen==="levelComplete"&&char&&(
          <div style={{animation:"slideIn 0.5s ease",textAlign:"center"}}>
            <CharacterSVG char={char} state="dance" danceIdx={danceIdx+2} size={160}/>
            <h2 style={{fontSize:26,fontWeight:900,color:level.color,margin:"8px 0 6px",fontFamily:"'Secular One'"}}>שלב הושלם!</h2>
            <p style={{color:"#888",margin:"0 0 4px",fontFamily:"'Heebo'"}}>{score} מתוך {QPL} תשובות נכונות</p>
            <p style={{color:level.color,margin:"0 0 14px",fontSize:16,fontFamily:"'Heebo'",textShadow:`0 0 10px ${level.color}44`}}>🎵 נפתח: "{level.name}" 🎵</p>
            <div style={{margin:"16px auto",maxWidth:340,borderRadius:16,overflow:"hidden",boxShadow:"0 0 30px rgba(255,215,0,0.3)",animation:"slideIn 0.6s ease"}}>
              <iframe src={`https://open.spotify.com/embed/track/${level.spotifyId}?utm_source=generator&theme=0`} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style={{borderRadius:16}}/>
            </div>
            <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:20}}>
              {currentLevel+1<LEVELS.length&&<button onClick={()=>startLevel(currentLevel+1)} style={{background:`linear-gradient(135deg,${LEVELS[currentLevel+1]?.color||"#fff"},${LEVELS[currentLevel+1]?.color||"#fff"}bb)`,border:"none",borderRadius:14,padding:"14px 32px",color:"#000",fontWeight:900,fontSize:15,cursor:"pointer",fontFamily:"'Secular One'",boxShadow:`0 0 20px ${LEVELS[currentLevel+1]?.color||"#fff"}44`}}>שלב הבא →</button>}
              <button onClick={()=>setScreen("menu")} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:14,padding:"14px 32px",color:"#aaa",cursor:"pointer",fontSize:15,fontFamily:"'Heebo'"}}>תפריט</button>
            </div>
          </div>
        )}

        {/* ═══ LEVEL FAILED ═══ */}
        {screen==="levelFailed"&&char&&(
          <div style={{animation:"slideIn 0.5s ease",textAlign:"center"}}>
            <CharacterSVG char={char} state="sad" size={150}/>
            <h2 style={{fontSize:24,fontWeight:900,color:"#ff6b6b",margin:"8px 0 8px",fontFamily:"'Secular One'"}}>השדים עדיין חזקים!</h2>
            <p style={{color:"#888",margin:"0 0 6px",fontFamily:"'Heebo'"}}>{score} מתוך {QPL} — צריך לפחות {PASS}</p>
            <p style={{color:"#666",margin:"0 0 24px",fontSize:14,fontFamily:"'Heebo'"}}>HUNTR/X אף פעם לא מוותרות! 💪</p>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              <button onClick={()=>startLevel(currentLevel)} style={{background:`linear-gradient(135deg,${level.color},${level.color}bb)`,border:"none",borderRadius:14,padding:"14px 32px",color:"#000",fontWeight:900,fontSize:15,cursor:"pointer",fontFamily:"'Secular One'"}}>נסו שוב!</button>
              <button onClick={()=>setScreen("menu")} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:14,padding:"14px 32px",color:"#aaa",cursor:"pointer",fontSize:15,fontFamily:"'Heebo'"}}>תפריט</button>
            </div>
          </div>
        )}

        <div style={{textAlign:"center",marginTop:28,padding:"8px 0",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
          <span style={{fontSize:10,color:"#2a2a3a",fontFamily:"'Heebo'"}}>🐯 Derpy approves this math quest</span>
        </div>
      </div>
    </div>
  );
}
