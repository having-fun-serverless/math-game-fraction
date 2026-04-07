// curriculum.js — all 33 topic generators for Dino Math Runner
// Each generate() returns { type, text, answer, choices?, explanation }

const r = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Make 4 shuffled choices ensuring `correct` is included and no duplicates
function choices(correct, wrongs) {
  const pool = [...new Set([correct, ...wrongs])];
  const others = pool.filter(x => x !== correct).slice(0, 3);
  while (others.length < 3) others.push(String(r(1, 20)));
  return shuffle([correct, ...others]);
}

function typed(text, answer, explanation) {
  return { type: 'typed', text, answer: String(answer), explanation };
}

function choice(text, answer, wrongs, explanation) {
  return {
    type: 'choice',
    text,
    answer: String(answer),
    choices: choices(String(answer), wrongs.map(String)),
    explanation,
  };
}

function maybeChoice(text, answer, wrongs, explanation) {
  return Math.random() < 0.35
    ? choice(text, answer, wrongs, explanation)
    : typed(text, answer, explanation);
}

// Simplify fraction, return "n/d" string
function frac(n, d) {
  if (d === 0) return '0';
  const g = gcd(Math.abs(n), Math.abs(d));
  const sn = n / g, sd = d / g;
  if (sd === 1) return String(sn);
  return `${sn}/${sd}`;
}

// Format mixed number as "w n/d"
function mixed(w, n, d) {
  if (n === 0) return String(w);
  const g = gcd(Math.abs(n), Math.abs(d));
  return `${w} ${n/g}/${d/g}`;
}

// Convert mixed/fraction string to decimal for display in wrong answers
function fracVal(n, d) { return n / d; }

// ─── Book 1: שברים פשוטים ויחס ────────────────────────────────────────────

function genT1() {
  // השבר כמנת חילוק — sharing word problems → simple fraction
  const scenarios = [
    () => { const n = r(1,7), d = r(n+1,9); return maybeChoice(
      `חלקו ${n} פיצות שוות בין ${d} ילדים. כמה פיצה יקבל כל ילד?`,
      frac(n,d), [frac(d,n), frac(n+1,d), frac(n,d+1)],
      `מחלקים ${n} ב-${d}: כל ילד מקבל ${n}/${d} פיצה. המונה הוא מה שמחלקים, המכנה הוא מספר החלקים.`
    )},
    () => { const n = r(2,6), d = r(n+1,8); return typed(
      `כתוב את השבר המתאים: ${n} חתיכות שוקולד מחולקות בין ${d} ילדים. כמה כל ילד מקבל?`,
      frac(n,d),
      `${n} ÷ ${d} = ${n}/${d}. כל חלוקה שווה של שלם ל-${d} חלקים שווה שבר עם מכנה ${d}.`
    )},
    () => { const n = r(1,4), d = r(2,5); return choice(
      `ספר שלם מחולק ל-${d} פרקים שווים. קראת ${n} פרקים. איזה חלק מהספר קראת?`,
      frac(n,d), [frac(n+1,d), frac(n,d+1), frac(d-n,d)],
      `${n} פרקים מתוך ${d} הם השבר ${n}/${d} מהספר.`
    )},
  ];
  return pick(scenarios)();
}

function genT2() {
  // עוד על השבר כמנת חילוק — improper fractions ↔ mixed numbers
  const scenarios = [
    () => { const d = pick([2,3,4,5]); const w = r(1,4); const n = r(1,d-1);
      const tot = w*d+n;
      return maybeChoice(
        `כתוב את המספר המעורב: ${tot}/${d} = ?`,
        mixed(w,n,d), [mixed(w+1,n,d), mixed(w,n+1,d), mixed(w-1,n,d)],
        `${tot} ÷ ${d} = ${w} ומשאר ${n}. לכן ${tot}/${d} = ${mixed(w,n,d)}.`
      )},
    () => { const d = pick([2,3,4,5]); const w = r(1,4); const n = r(1,d-1);
      const tot = w*d+n;
      return typed(
        `כתוב כשבר בלתי מעורך: ${mixed(w,n,d)} = ?/${d}`,
        tot,
        `${w} × ${d} + ${n} = ${tot}. לכן ${mixed(w,n,d)} = ${tot}/${d}.`
      )},
    () => { const d = pick([3,4,5,6]); const w = r(1,3); const n = r(1,d-1);
      const tot = w*d+n;
      return choice(
        `${tot} ÷ ${d} = ?`,
        mixed(w,n,d), [String(w), mixed(w,n,d+1), mixed(w+1,n-1,d)].filter(x=>x!==mixed(w,n,d)),
        `חלק: ${tot} ÷ ${d} = ${w} שלמים ועוד ${n}/${d}. התוצאה: ${mixed(w,n,d)}.`
      )},
  ];
  return pick(scenarios)();
}

function genT3() {
  // שברים ומספרים עשרוניים — conversion between fractions and decimals
  const pairs = [
    ['1/2','0.5'], ['1/4','0.25'], ['3/4','0.75'], ['1/5','0.2'], ['2/5','0.4'],
    ['3/5','0.6'], ['4/5','0.8'], ['1/10','0.1'], ['3/10','0.3'], ['7/10','0.7'],
    ['1/8','0.125'], ['3/8','0.375'], ['5/8','0.625'], ['1/20','0.05'],
  ];
  const [fr, dec] = pick(pairs);
  return Math.random() < 0.5
    ? maybeChoice(`המר לשבר עשרוני: ${fr} = ?`, dec,
        ['0.3','0.6','0.4','0.15','0.2','0.35'].filter(x=>x!==dec),
        `${fr}: מחלקים מונה במכנה. התוצאה: ${dec}.`)
    : maybeChoice(`המר לשבר פשוט: ${dec} = ?`, fr,
        ['1/3','2/3','3/8','1/6','2/7'].filter(x=>x!==fr),
        `${dec} = ${fr}. כפול את שני האגפים במכנה כדי לקבל שבר שלם.`);
}

function genT4() {
  // כפל שלם בשבר — whole × fraction
  const n = r(1,5), d = pick([2,3,4,5,6]);
  const whole = pick([2,3,4,5,6,8,9,10,12,15].filter(w => w%d===0 || r(0,1)));
  // ensure clean answer: pick whole divisible by d
  const w2 = d * r(1,4);
  const ans = w2 * n / d;
  const ansStr = Number.isInteger(ans) ? String(ans) : frac(w2*n, d);
  return maybeChoice(
    `${w2} × ${n}/${d} = ?`,
    ansStr,
    [String(w2*n), frac(n,d*w2), String(ans+1), String(ans-1)].filter(x=>x!==ansStr),
    `כופלים את השלם במונה ומחלקים במכנה: ${w2} × ${n} ÷ ${d} = ${ans}.`
  );
}

function genT5() {
  // כפל שלם במספר מעורב
  const whole = r(2,6);
  const mw = r(1,4), mn = r(1,4), md = pick([2,3,4,5]);
  // whole × (mw + mn/md)
  const intPart = whole * mw;
  const fracNum = whole * mn;
  const totalNum = intPart * md + fracNum;
  const ansW = Math.floor(totalNum / md);
  const ansN = totalNum % md;
  const ansStr = mixed(ansW, ansN, md);
  return maybeChoice(
    `${whole} × ${mixed(mw,mn,md)} = ?`,
    ansStr,
    [String(ansW), mixed(ansW+1,ansN,md), mixed(ansW,ansN>0?ansN-1:1,md)],
    `${whole} × ${mixed(mw,mn,md)} = ${whole} × (${mw} + ${mn}/${md}) = ${whole*mw} + ${frac(whole*mn,md)} = ${ansStr}.`
  );
}

function genT6() {
  // מציאת חלק של מספר שלם — (n/d) × whole
  const d = pick([2,3,4,5,6]);
  const whole = d * r(2,6);
  const n = r(1, d-1);
  const ans = whole * n / d;
  return maybeChoice(
    `${n}/${d} מתוך ${whole} = ?`,
    ans,
    [whole*n, ans+d, Math.max(1,ans-d), ans*2].filter(x=>x!==ans),
    `${n}/${d} × ${whole} = (${whole} ÷ ${d}) × ${n} = ${whole/d} × ${n} = ${ans}.`
  );
}

function genT7() {
  // מציאת חלק של שבר — fraction × fraction
  const n1 = r(1,4), d1 = pick([2,3,4,5,6]);
  const n2 = r(1,4), d2 = pick([2,3,4,5,6]);
  const rn = n1*n2, rd = d1*d2;
  const g = gcd(rn,rd);
  const ansStr = rd/g===1 ? String(rn/g) : `${rn/g}/${rd/g}`;
  return maybeChoice(
    `${n1}/${d1} × ${n2}/${d2} = ?`,
    ansStr,
    [frac(n1+n2,d1+d2), frac(n1*n2+1,d1*d2), frac(n1,d2), frac(n2,d1)],
    `כופלים מונה במונה ומכנה במכנה: (${n1}×${n2})/(${d1}×${d2}) = ${rn}/${rd} = ${ansStr}.`
  );
}

function genT8() {
  // מציאת חלק של מספר מעורב וכפל מספרים מעורבים
  const fn = r(1,3), fd = pick([2,3,4]);
  const mw = r(1,3), mn = r(1,fd-1 || 1), md = fd;
  // (fn/fd) × (mw + mn/md)
  const totalMixed = mw * md + mn;
  const resNum = fn * totalMixed;
  const resDen = fd * md;
  const g = gcd(resNum, resDen);
  const rn = resNum/g, rd = resDen/g;
  const rw = Math.floor(rn/rd), rrn = rn%rd;
  const ansStr = rrn===0 ? String(rw) : mixed(rw, rrn, rd);
  return maybeChoice(
    `${fn}/${fd} × ${mixed(mw,mn,md)} = ?`,
    ansStr,
    [String(rw+1), mixed(rw,rrn>0?rrn-1:1,rd), frac(fn,fd)],
    `ממירים לשבר בלתי מעורך: ${fn}/${fd} × ${totalMixed}/${md} = ${resNum}/${resDen} = ${ansStr}.`
  );
}

function genT9() {
  // מציאת הכמות על-פי חלק ממנה — N known part → find whole
  const d = pick([2,3,4,5]);
  const n = r(1, d-1);
  const ans = d * r(2,8);
  const part = ans * n / d;
  return maybeChoice(
    `${n}/${d} מכמות מסוימת שווים ל-${part}. מהי הכמות?`,
    ans,
    [ans+d, ans-d, part*d, ans*2].filter(x=>x!==ans&&x>0),
    `${part} הם ${n}/${d} מהכמות. אחד חלק = ${part} ÷ ${n} = ${part/n}. הכמות = ${part/n} × ${d} = ${ans}.`
  );
}

function genT10() {
  // חילוק שלם בשבר (א) — whole ÷ unit fraction
  const d = pick([2,3,4,5,6]);
  const whole = r(2,8);
  const ans = whole * d;
  return maybeChoice(
    `${whole} ÷ 1/${d} = ?`,
    ans,
    [whole, ans-d, ans+d, whole/d>0?Math.round(whole/d):1].filter(x=>x!==ans&&x>0),
    `חלוקה בשבר = כפל בהפכי: ${whole} × ${d} = ${ans}.`
  );
}

function genT11() {
  // חילוק שלם בשבר (ב) — whole ÷ non-unit fraction
  const n = r(2,4), d = pick([3,4,5,6]);
  const whole = r(2,6);
  const resNum = whole * d, resDen = n;
  const g = gcd(resNum,resDen);
  const rw = Math.floor(resNum/resDen/g*g), rn2 = resNum%(resDen);
  const ansStr = rn2===0 ? String(whole*d/n) : mixed(Math.floor(whole*d/n), (whole*d)%n, n);
  return maybeChoice(
    `${whole} ÷ ${n}/${d} = ?`,
    ansStr,
    [String(whole*n/d), String(whole*d), String(whole+n)].filter(x=>x!==ansStr),
    `${whole} ÷ ${n}/${d} = ${whole} × ${d}/${n} = ${whole*d}/${n} = ${ansStr}.`
  );
}

function genT12() {
  // חילוק שבר בשבר
  const n1 = r(1,5), d1 = pick([2,3,4,6]);
  const n2 = r(1,5), d2 = pick([2,3,4,6]);
  const rn = n1*d2, rd = d1*n2;
  const g = gcd(rn,rd);
  const ansStr = rd/g===1 ? String(rn/g) : (rn/g > rd/g ? mixed(Math.floor(rn/g/rd*g*rd/g),rn/g%(rd/g),rd/g) : `${rn/g}/${rd/g}`);
  return maybeChoice(
    `${n1}/${d1} ÷ ${n2}/${d2} = ?`,
    frac(rn,rd),
    [frac(n1*n2,d1*d2), frac(n1,d2), frac(n2,d1)],
    `חלוקה בשבר = כפל בהפכי: ${n1}/${d1} × ${d2}/${n2} = ${rn}/${rd} = ${frac(rn,rd)}.`
  );
}

function genT13() {
  // יחס בין כמויות (א) — express ratio
  const a = r(1,6), b = r(1,6);
  const g = gcd(a,b);
  const ra = a/g, rb = b/g;
  return maybeChoice(
    `בכיתה יש ${a*3} בנים ו-${b*3} בנות. מה היחס בין מספר הבנים למספר הבנות?`,
    `${ra}:${rb}`,
    [`${a*3}:${b*3}`, `${rb}:${ra}`, `${ra+1}:${rb}`, `${ra}:${rb+1}`].filter(x=>`${ra}:${rb}`!==x),
    `מצמצמים: ${a*3}:${b*3} = ${ra}:${rb} (מחלקים שניהם ב-${g*3}).`
  );
}

function genT14() {
  // יחס בין כמויות (ב) — ratio in simplest form / find part of total
  const a = r(2,5), b = r(2,5), total = (a+b)*r(2,4);
  const partA = total * a / (a+b);
  return maybeChoice(
    `יחס כסף בין דן לרון הוא ${a}:${b}. יחד יש להם ${total} שקלים. כמה שקלים יש לדן?`,
    partA,
    [total*b/(a+b), partA+a, total-partA-1].filter(x=>x!==partA&&x>0),
    `חלק דן: ${a}/(${a}+${b}) × ${total} = ${a}/${a+b} × ${total} = ${partA} שקלים.`
  );
}

function genT15() {
  // מציאת כמות חסרה על-פי יחס — proportion
  const a = r(2,6), b = r(2,6)*a;
  const x = r(2,6)*a;
  const ans = x*b/a; // x:ans = a:b
  return maybeChoice(
    `אם ${a}:${b} = ${x}:?, מהו הערך החסר?`,
    ans,
    [ans+b, ans-a, x+b, a*b/x].filter(x2=>x2!==ans&&x2>0),
    `יחס: ${a}:${b} = ${x}:?. הערך החסר = ${x} × ${b} ÷ ${a} = ${ans}.`
  );
}

function genT16() {
  // חלוקה על-פי יחס — divide total in given ratio
  const a = r(1,4), b = r(1,4), total = (a+b)*r(2,5);
  const partA = total*a/(a+b), partB = total*b/(a+b);
  return maybeChoice(
    `חלק ${total} שקלים ביחס ${a}:${b}. מה החלק הגדול יותר?`,
    Math.max(partA,partB),
    [Math.min(partA,partB), total, Math.max(partA,partB)+a].filter(x=>x!==Math.max(partA,partB)),
    `החלק הגדול = ${Math.max(a,b)}/(${a}+${b}) × ${total} = ${Math.max(partA,partB)}.`
  );
}

// ─── Book 2: מספרים עשרוניים, אחוזים ונתונים ─────────────────────────────

function genT17() {
  // כפל עשרוניים ב-10, 100, 1000
  const m = pick([10,100,1000]);
  const decimals = m===10  ? [1,2] : m===100 ? [1,2,3] : [1,2,3,4];
  const places = pick(decimals);
  const base = r(1,9) + r(0,9)/10 + (places>=2?r(0,9)/100:0) + (places>=3?r(0,9)/1000:0);
  const baseStr = base.toFixed(places);
  const ans = parseFloat(baseStr) * m;
  const ansStr = Number.isInteger(ans) ? String(ans) : ans.toFixed(Math.max(0,places-Math.log10(m)));
  return maybeChoice(
    `${baseStr} × ${m} = ?`,
    ansStr,
    [String(parseFloat(baseStr)+m), String(parseFloat(baseStr)*m/10), String(parseFloat(ansStr)+1)].filter(x=>x!==ansStr),
    `כפל ב-${m} מזיז את הנקודה הדצימלית ${Math.log10(m)} מקומות ימינה: ${baseStr} → ${ansStr}.`
  );
}

function genT18() {
  // חילוק עשרוניים ב-10, 100, 1000
  const m = pick([10,100,1000]);
  const whole = r(1,999);
  const ans = whole / m;
  const ansStr = ans.toFixed(Math.log10(m) + (whole%m!==0?1:0));
  return maybeChoice(
    `${whole} ÷ ${m} = ?`,
    String(parseFloat(ansStr)),
    [String(whole*m), String(ans+0.1), String(ans*10)].filter(x=>x!==String(parseFloat(ansStr))),
    `חלוקה ב-${m} מזיזה את הנקודה ${Math.log10(m)} מקומות שמאלה: ${whole} → ${parseFloat(ansStr)}.`
  );
}

function genT19() {
  // כפל עשרוניים (א) — decimal × whole
  const a = (r(1,9)+r(1,9)/10).toFixed(1);
  const b = r(2,9);
  const ans = (parseFloat(a)*b).toFixed(2);
  const ansStr = String(parseFloat(ans));
  return maybeChoice(
    `${a} × ${b} = ?`,
    ansStr,
    [String(parseFloat(a)+b), String(parseFloat(ansStr)+b), String((parseFloat(a)+0.1)*b).slice(0,5)].filter(x=>x!==ansStr),
    `${a} × ${b}: כופלים בלי נקודה (${Math.round(parseFloat(a)*10)} × ${b} = ${Math.round(parseFloat(a)*10)*b}), ואז מחלקים ב-10. תוצאה: ${ansStr}.`
  );
}

function genT20() {
  // כפל עשרוניים (ב) — decimal × decimal
  const a = (r(1,5)+r(1,9)/10).toFixed(1);
  const b = (r(1,5)+r(1,9)/10).toFixed(1);
  const ans = (parseFloat(a)*parseFloat(b));
  const ansStr = String(parseFloat(ans.toFixed(4)));
  return maybeChoice(
    `${a} × ${b} = ?`,
    ansStr,
    [String(parseFloat(a)+parseFloat(b)), String(parseFloat(ansStr)+0.1), String(ans*10).slice(0,5)].filter(x=>x!==ansStr),
    `${a} × ${b}: שתי ספרות אחרי נקודה → התוצאה: ${ansStr}. (ספרות אחרי נקודה: 1+1=2)`
  );
}

function genT21() {
  // חילוק עשרוניים
  const b = pick([0.2,0.4,0.5,0.25,0.8]);
  const ans = r(2,12);
  const a = parseFloat((ans*b).toFixed(3));
  const aStr = String(a);
  return maybeChoice(
    `${aStr} ÷ ${b} = ?`,
    ans,
    [ans+1, ans-1, Math.round(a/b*10), ans*2].filter(x=>x!==ans&&x>0),
    `חלוקה ב-${b} = כפל בהפכי: ${aStr} × ${1/b} = ${ans}. אפשר גם: להכפיל שניהם ב-${1/b<10?10:100} ואז לחלק.`
  );
}

function genT22() {
  // שבר פשוט → עשרוני בעזרת חילוק
  const fracs = [['1/4','0.25'],['3/8','0.375'],['5/8','0.625'],['7/8','0.875'],
                  ['1/5','0.2'],['2/5','0.4'],['3/5','0.6'],['4/5','0.8'],
                  ['1/16','0.0625'],['3/4','0.75']];
  const [fr, dec] = pick(fracs);
  return maybeChoice(
    `המר לעשרוני (בעזרת חילוק): ${fr} = ?`,
    dec,
    ['0.5','0.3','0.6','0.125','0.4'].filter(x=>x!==dec),
    `${fr}: מחלקים מונה במכנה. ${fr.split('/')[0]} ÷ ${fr.split('/')[1]} = ${dec}.`
  );
}

function genT23() {
  // האחוז: מאית של כמות
  const whole = r(1,20)*100;
  const pct = pick([1,2,5,10,50]);
  const ans = whole*pct/100;
  return maybeChoice(
    `${pct}% מ-${whole} = ?`,
    ans,
    [ans*2, ans+pct, whole-ans].filter(x=>x!==ans&&x>=0),
    `${pct}% = ${pct}/100. ${pct}/100 × ${whole} = ${ans}.`
  );
}

function genT24() {
  // האחוז: חלק של כמות (א) — easy percentages
  const wholes = [20,40,50,80,100,120,200];
  const whole = pick(wholes);
  const pct = pick([10,20,25,50,75]);
  const ans = whole*pct/100;
  return maybeChoice(
    `${pct}% מ-${whole} = ?`,
    ans,
    [whole-ans, ans+pct, ans*2].filter(x=>x!==ans&&x>=0),
    `${pct}% = ${pct}/100. ${whole} × ${pct} ÷ 100 = ${ans}.`
  );
}

function genT25() {
  // האחוז: חלק של כמות (ב) — varied percentages
  const whole = pick([60,80,120,150,200,250,300]);
  const pct = pick([15,30,35,40,45,60,70,80]);
  const ans = whole*pct/100;
  return maybeChoice(
    `${pct}% מ-${whole} = ?`,
    ans,
    [whole*pct/10, ans+10, ans-10].filter(x=>x!==ans&&x>0),
    `${pct}% מ-${whole}: ${whole} × ${pct} ÷ 100 = ${ans}.`
  );
}

function genT26() {
  // מציאת חלק באחוזים — what % is part of whole?
  const pairs = [[15,60,25],[12,48,25],[18,90,20],[30,120,25],[40,160,25],
                  [25,100,25],[8,40,20],[24,80,30],[35,140,25],[16,64,25]];
  const [part, whole, ans] = pick(pairs);
  return maybeChoice(
    `${part} מתוך ${whole} הם כמה אחוזים?`,
    ans,
    [100-ans, ans+5, ans*2].filter(x=>x!==ans&&x>0&&x<=100),
    `${part} ÷ ${whole} = ${part/whole}. כופלים ב-100: ${part/whole} × 100 = ${ans}%.`
  );
}

function genT27() {
  // עוד על האחוז כחלק — find original given part & percentage
  const pct = pick([20,25,40,50,75]);
  const whole = r(2,8)*100/pct*pick([1,2,4]);
  const part = whole*pct/100;
  if (!Number.isInteger(part)||!Number.isInteger(whole)) return genT27();
  return maybeChoice(
    `${part} הם ${pct}% מאיזו כמות?`,
    whole,
    [whole+pct, whole-pct, part, whole*2].filter(x=>x!==whole&&x>0),
    `אם ${part} הם ${pct}%, אז 1% = ${part}/${pct} = ${part/pct}. 100% = ${part/pct} × 100 = ${whole}.`
  );
}

function genT28() {
  // מציאת כמות אחרי שינוי באחוזים
  const orig = pick([40,50,60,80,100,120,200]);
  const pct = pick([10,20,25,50]);
  const increase = Math.random()<0.5;
  const ans = increase ? orig*(1+pct/100) : orig*(1-pct/100);
  const direction = increase ? `עלה ב-${pct}%` : `ירד ב-${pct}%`;
  return maybeChoice(
    `מחיר מוצר היה ${orig} ש"ח ו${direction}. מה המחיר החדש?`,
    ans,
    [increase?orig-orig*pct/100:orig+orig*pct/100, ans+pct, ans-pct].filter(x=>x!==ans&&x>0),
    `${direction}: ${orig} × ${increase?`(1 + ${pct}/100)`:`(1 - ${pct}/100)`} = ${orig} × ${increase?(1+pct/100):(1-pct/100)} = ${ans}.`
  );
}

function genT29() {
  // מציאת אחוז אחרי שינוי בכמות
  const orig = pick([50,60,80,100,120,150,200]);
  const pct = pick([10,20,25,50]);
  const increase = Math.random()<0.5;
  const newVal = increase ? orig*(1+pct/100) : orig*(1-pct/100);
  const direction = increase ? 'עלה' : 'ירד';
  return maybeChoice(
    `כמות השתנתה מ-${orig} ל-${newVal}. בכמה אחוזים ${direction}?`,
    pct,
    [pct*2, pct/2, pct+10, pct-5].filter(x=>x!==pct&&x>0),
    `שינוי = ${Math.abs(newVal-orig)}. אחוז = ${Math.abs(newVal-orig)}/${orig} × 100 = ${pct}%.`
  );
}

function genT30() {
  // הצגה וניתוח נתונים — mean / range from a list
  const n = 5;
  const nums = Array.from({length:n}, ()=>r(2,20));
  const sum = nums.reduce((a,b)=>a+b,0);
  const mean = sum/n;
  const range = Math.max(...nums) - Math.min(...nums);
  return Math.random()<0.5
    ? maybeChoice(
        `נתוני הציונים: ${nums.join(', ')}. מה הממוצע?`,
        mean, [mean+1, mean-1, Math.round(mean)+0.5, sum],
        `סכום כל הנתונים = ${sum}. ממוצע = ${sum} ÷ ${n} = ${mean}.`
      )
    : maybeChoice(
        `נתוני הציונים: ${nums.join(', ')}. מה הטווח?`,
        range, [range+1, range-1, Math.max(...nums), Math.min(...nums)],
        `טווח = ערך מרבי − ערך מינימלי = ${Math.max(...nums)} − ${Math.min(...nums)} = ${range}.`
      );
}

function genT31() {
  // איסוף וניתוח — median / mode
  const nums = Array.from({length:5}, ()=>r(1,10)).sort((a,b)=>a-b);
  const med = nums[2];
  const useMode = Math.random()<0.5;
  if (useMode) {
    const dup = r(1,9);
    const arr = [dup, dup, r(1,9), r(1,9), r(1,9)].sort((a,b)=>a-b);
    return maybeChoice(
      `נתונים: ${arr.join(', ')}. מה הנפוץ ביותר (שכיח)?`,
      dup, [arr[2],arr[3],arr[4]].filter(x=>x!==dup),
      `השכיח הוא הערך שחוזר הכי הרבה פעמים. ${dup} מופיע פעמיים.`
    );
  }
  return maybeChoice(
    `נתונים (ממוינים): ${nums.join(', ')}. מה החציון?`,
    med, [nums[1],nums[3],nums[0],nums[4]].filter(x=>x!==med),
    `החציון הוא הערך האמצעי לאחר מיון. בסידרה של 5 ערכים, זהו הערך ה-3: ${med}.`
  );
}

function genT32() {
  // ניתוח סיכויים (א) — basic probability
  const total = pick([4,5,6,8,10,12]);
  const fav = r(1, total-1);
  const g = gcd(fav,total);
  const ansStr = frac(fav,total);
  return maybeChoice(
    `בקופסה ${total} כדורים, ${fav} מהם אדומים. מה ההסתברות לשלוף כדור אדום?`,
    ansStr,
    [frac(total-fav,total), frac(fav,total-1), frac(fav+1,total), frac(fav,total+1)].filter(x=>x!==ansStr),
    `הסתברות = מספר המקרים הרצויים / כלל המקרים = ${fav}/${total} = ${ansStr}.`
  );
}

function genT33() {
  // ניתוח סיכויים (ב) — complementary probability
  const total = pick([4,5,6,8,10]);
  const fav = r(1,total-1);
  const comp = total - fav;
  const pStr = frac(fav,total);
  const compStr = frac(comp,total);
  return maybeChoice(
    `הסתברות לאירוע מסוים היא ${pStr}. מה ההסתברות שהאירוע לא יתרחש?`,
    compStr,
    [frac(fav,total+1), frac(comp+1,total), frac(comp,total+1), pStr].filter(x=>x!==compStr),
    `הסתברות המשלים = 1 − ${pStr} = ${frac(total-fav,total)} = ${compStr}.`
  );
}

// ─── BOOKS structure ──────────────────────────────────────────────────────

export const BOOKS = [
  {
    id: 'book1',
    title: 'ספר 1: שברים פשוטים ויחס',
    color: '#2f9e44',
    chapters: [
      {
        id: 'b1c1',
        title: "פרק א': משמעויות וייצוגים של השבר הפשוט",
        topics: [
          { id:'t1',  title:'השבר כמנת חילוק',                                           obstacleId:'cactus_small',    generate: genT1  },
          { id:'t2',  title:'עוד על השבר כמנת חילוק',                                    obstacleId:'cactus_tall',     generate: genT2  },
          { id:'t3',  title:'שברים פשוטים ומספרים עשרוניים על ישר המספרים',             obstacleId:'tumbleweed',      generate: genT3  },
        ],
      },
      {
        id: 'b1c2',
        title: "פרק ב': כפל של שברים ושל מספרים מעורבים",
        topics: [
          { id:'t4',  title:'כפל שלם בשבר',                                              obstacleId:'pizza_slice_pile',generate: genT4  },
          { id:'t5',  title:'כפל שלם במספר מעורב',                                       obstacleId:'balloon_string',  generate: genT5  },
          { id:'t6',  title:'מציאת חלק של מספר שלם',                                    obstacleId:'crate_low',       generate: genT6  },
          { id:'t7',  title:'מציאת חלק של שבר',                                          obstacleId:'crate_tall',      generate: genT7  },
          { id:'t8',  title:'מציאת חלק של מספר מעורב וכפל של מספרים מעורבים',           obstacleId:'snake',           generate: genT8  },
          { id:'t9',  title:'מציאת הכמות על-פי חלק ממנה',                               obstacleId:'beehive',         generate: genT9  },
        ],
      },
      {
        id: 'b1c3',
        title: "פרק ג': חילוק של שברים ושל מספרים מעורבים",
        topics: [
          { id:'t10', title:'חילוק שלם בשבר (א)',                                        obstacleId:'log_rolling',     generate: genT10 },
          { id:'t11', title:'חילוק שלם בשבר (ב)',                                        obstacleId:'barrel',          generate: genT11 },
          { id:'t12', title:'חילוק שבר בשבר',                                            obstacleId:'fence_low',       generate: genT12 },
        ],
      },
      {
        id: 'b1c4',
        title: "פרק ד': יחס",
        topics: [
          { id:'t13', title:'יחס בין כמויות (א)',                                        obstacleId:'swinging_rope',   generate: genT13 },
          { id:'t14', title:'יחס בין כמויות (ב)',                                        obstacleId:'bird_low',        generate: genT14 },
          { id:'t15', title:'מציאת כמות חסרה על-פי יחס נתון',                           obstacleId:'gopher_hole',     generate: genT15 },
          { id:'t16', title:'חלוקה של כמות על-פי יחס נתון',                             obstacleId:'spike_strip',     generate: genT16 },
        ],
      },
    ],
  },
  {
    id: 'book2',
    title: 'ספר 2: מספרים עשרוניים, אחוזים ונתונים',
    color: '#1c7ed6',
    chapters: [
      {
        id: 'b2c1',
        title: "פרק א': מספרים עשרוניים: כפל וחילוק",
        topics: [
          { id:'t17', title:'כפל מספרים עשרוניים ב-10, ב-100 וב-1,000',                obstacleId:'lightning_bolt',      generate: genT17 },
          { id:'t18', title:'חילוק מספרים עשרוניים ב-10, ב-100 וב-1,000',               obstacleId:'hot_air_balloon_low', generate: genT18 },
          { id:'t19', title:'כפל מספרים עשרוניים (א)',                                  obstacleId:'rubber_duck_army',    generate: genT19 },
          { id:'t20', title:'כפל מספרים עשרוניים (ב)',                                  obstacleId:'wind_gust_dust',      generate: genT20 },
          { id:'t21', title:'חילוק מספרים עשרוניים',                                    obstacleId:'cymbal_crash',        generate: genT21 },
          { id:'t22', title:'משבר פשוט למספר עשרוני בעזרת חילוק',                      obstacleId:'piano_falling',       generate: genT22 },
        ],
      },
      {
        id: 'b2c2',
        title: "פרק ב': אחוזים",
        topics: [
          { id:'t23', title:'האחוז: מאית של כמות',                                      obstacleId:'percent_sign_sign',  generate: genT23 },
          { id:'t24', title:'האחוז: חלק של כמות (א)',                                   obstacleId:'bar_chart_wall',     generate: genT24 },
          { id:'t25', title:'האחוז: חלק של כמות (ב)',                                   obstacleId:'pie_chart_roller',   generate: genT25 },
          { id:'t26', title:'מציאת חלק של כמות, הנתון באחוזים',                        obstacleId:'dice_tower',         generate: genT26 },
          { id:'t27', title:'עוד על האחוז כחלק של כמות',                               obstacleId:'coin_fountain',      generate: genT27 },
          { id:'t28', title:'מציאת כמות אחרי שינוי באחוזים',                            obstacleId:'stopwatch',          generate: genT28 },
          { id:'t29', title:'מציאת אחוז אחרי שינוי בכמות',                             obstacleId:'calculator_tower',   generate: genT29 },
        ],
      },
      {
        id: 'b2c3',
        title: "פרק ג': חקר נתונים וניתוח סיכויים",
        topics: [
          { id:'t30', title:'הצגה וניתוח של נתונים',                                    obstacleId:'ruler_beam',         generate: genT30 },
          { id:'t31', title:'איסוף, ארגון וניתוח של נתונים',                            obstacleId:'flask_spill',        generate: genT31 },
          { id:'t32', title:'ניתוח סיכויים (א)',                                        obstacleId:'probability_spinner',generate: genT32 },
          { id:'t33', title:'ניתוח סיכויים (ב)',                                        obstacleId:'graduation_cap',     generate: genT33 },
        ],
      },
    ],
  },
];

export function allTopics() {
  return BOOKS.flatMap(b => b.chapters.flatMap(c => c.topics));
}

export function topicById(id) {
  for (const book of BOOKS)
    for (const ch of book.chapters)
      for (const t of ch.topics)
        if (t.id === id) return t;
  return null;
}
