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
  const foods = ['פיצות','עוגות','חפיסות שוקולד','לחמניות','עוגיות'];
  const people = ['ילדים','חברים','תלמידים','אחים','שכנים'];
  // masculine plural parts only, to keep gender agreement clean
  const parts = ['פרקים','קטעים','דפים','חלקים'];
  const scenarios = [
    () => { const n = r(1,11), d = r(n+1,13); const f = pick(foods), p = pick(people); return maybeChoice(
      `חילקו ${n} ${f} בחלוקה שווה בין ${d} ${p}. כמה יקבל כל אחד?`,
      frac(n,d), [frac(d,n), frac(n+1,d), frac(n,d+1)],
      `מחלקים ${n} ב-${d}: כל אחד מקבל ${n}/${d}. המונה הוא מה שמחלקים, המכנה הוא מספר החלקים.`
    )},
    () => { const n = r(2,9), d = r(n+1,12); return typed(
      `כתוב את השבר המתאים: ${n} ${pick(foods)} חולקו בחלקים שווים בין ${d} ${pick(people)}.`,
      frac(n,d),
      `${n} ÷ ${d} = ${n}/${d}. חלוקה שווה של ${n} שלמים ל-${d} חלקים.`
    )},
    () => { const n = r(1,6), d = r(n+1,10); const p = pick(parts); return choice(
      `ספר שלם מחולק ל-${d} ${p} שווים. קראת ${n} ${p}. איזה חלק מהספר קראת?`,
      frac(n,d), [frac(n+1,d), frac(n,d+1), frac(Math.max(d-n,1),d)],
      `${n} מתוך ${d} הם השבר ${n}/${d}.`
    )},
    () => { const d = r(3,12), n = r(1,d-1); return maybeChoice(
      `איזה שבר מייצג את ${n} חלקים מתוך ${d} חלקים שווים?`,
      frac(n,d), [frac(d,n), frac(n,d+1), frac(n+1,d+1)],
      `${n} חלקים מתוך ${d} = ${n}/${d}.`
    )},
    () => { const hours = r(1,23); return typed(
      `יממה מחולקת ל-24 שעות. איזה חלק מהיממה הוא ${hours} שעות?`,
      frac(hours,24),
      `${hours} מתוך 24 = ${frac(hours,24)}.`
    )},
  ];
  return pick(scenarios)();
}

function genT2() {
  // עוד על השבר כמנת חילוק — improper fractions ↔ mixed numbers
  const scenarios = [
    () => { const d = pick([2,3,4,5,6,7,8]); const w = r(1,6); const n = r(1,d-1);
      const tot = w*d+n;
      return maybeChoice(
        `כתוב את המספר המעורב: ${tot}/${d} = ?`,
        mixed(w,n,d), [mixed(w+1,n,d), mixed(w,n+1>d-1?1:n+1,d), `${tot}/${d+1}`],
        `${tot} ÷ ${d} = ${w} ומשאר ${n}. לכן ${tot}/${d} = ${mixed(w,n,d)}.`
      )},
    () => { const d = pick([2,3,4,5,6,7]); const w = r(1,5); const n = r(1,d-1);
      const tot = w*d+n;
      return typed(
        `כתוב כשבר מדומה: ${mixed(w,n,d)} = ?/${d}`,
        tot,
        `${w} × ${d} + ${n} = ${tot}. לכן ${mixed(w,n,d)} = ${tot}/${d}.`
      )},
    () => { const d = pick([3,4,5,6,7,8]); const w = r(1,5); const n = r(1,d-1);
      const tot = w*d+n;
      return choice(
        `${tot} ÷ ${d} = ?`,
        mixed(w,n,d), [String(w), `${tot}/${d+1}`, w>1?mixed(w-1,n,d):mixed(w+1,n,d)].filter(x=>x!==mixed(w,n,d)),
        `${tot} ÷ ${d}: שלמים = ${w}, משאר = ${n}. התוצאה: ${mixed(w,n,d)}.`
      )},
    () => { const d = pick([2,3,4,5,6]); const w = r(2,7); const n = r(1,d-1);
      const tot = w*d+n;
      const contexts = [`חולקו ${tot} עוגיות ל-${d} שקיות שוות. כמה עוגיות בכל שקית?`,
                        `יש ${tot} סוכריות לחלוקה ל-${d} ילדים שווה בשווה. כמה לכל ילד?`,
                        `${tot} ס"מ של חוט חולקו ל-${d} חלקים שווים. כמה ס"מ בכל חלק?`];
      return maybeChoice(pick(contexts), mixed(w,n,d), [String(w), `${tot}/${d}`, mixed(w+1,n,d)],
        `${tot} ÷ ${d} = ${w} שלמים ועוד ${n}/${d} = ${mixed(w,n,d)}.`);
    },
  ];
  return pick(scenarios)();
}

function genT3() {
  // שברים ומספרים עשרוניים — conversion between fractions and decimals
  const pairs = [
    ['1/2','0.5'], ['1/4','0.25'], ['3/4','0.75'], ['1/5','0.2'], ['2/5','0.4'],
    ['3/5','0.6'], ['4/5','0.8'], ['1/10','0.1'], ['3/10','0.3'], ['7/10','0.7'],
    ['9/10','0.9'], ['1/8','0.125'], ['3/8','0.375'], ['5/8','0.625'], ['7/8','0.875'],
    ['1/20','0.05'], ['3/20','0.15'], ['7/20','0.35'], ['9/20','0.45'],
    ['11/20','0.55'], ['1/25','0.04'], ['3/25','0.12'], ['2/25','0.08'],
    ['1/50','0.02'], ['3/50','0.06'], ['1/40','0.025'], ['1/200','0.005'],
    ['2/10','0.2'], ['4/10','0.4'], ['6/10','0.6'], ['8/10','0.8'],
  ];
  const wrongDecs = ['0.3','0.6','0.4','0.15','0.2','0.35','0.45','0.55','0.7','0.8','0.125','0.5'];
  const wrongFracs = ['1/3','2/3','3/8','1/6','2/7','3/7','4/9','5/11'];
  const [fr, dec] = pick(pairs);
  const mode = Math.random();
  if (mode < 0.33) {
    return maybeChoice(`המר למספר עשרוני: ${fr} = ?`, dec,
      wrongDecs.filter(x=>x!==dec).slice(0,4),
      `${fr}: מחלקים מונה במכנה. ${fr.split('/')[0]} ÷ ${fr.split('/')[1]} = ${dec}.`);
  } else if (mode < 0.66) {
    return maybeChoice(`המר לשבר פשוט: ${dec} = ?`, fr,
      wrongFracs.filter(x=>x!==fr).slice(0,4),
      `${dec} = ${fr}.`);
  } else {
    // comparison question
    const [fr2, dec2] = pick(pairs.filter(p => p[0] !== fr));
    const v1 = parseFloat(dec), v2 = parseFloat(dec2);
    const larger = v1 > v2 ? fr : fr2;
    return choice(
      `איזה שבר גדול יותר: ${fr} או ${fr2}?`,
      larger, [v1===v2?fr:v1<v2?fr:fr2],
      `${fr} = ${dec}, ${fr2} = ${dec2}. ${v1>v2?fr:fr2} גדול יותר.`);
  }
}

function genT4() {
  // כפל שלם בשבר — whole × fraction
  const contexts = [
    (w2,n,d,ans,ansStr) => maybeChoice(`${w2} × ${n}/${d} = ?`, ansStr,
      [String(w2*n), frac(n,d*w2), String(ans+1), String(parseFloat(ansStr)+1)].filter(x=>x!==ansStr),
      `כופלים את השלם במונה ומחלקים במכנה: ${w2} × ${n} ÷ ${d} = ${ansStr}.`),
    (w2,n,d,ans,ansStr) => maybeChoice(`יש ${w2} ק"ג של אורז. השתמשנו ב-${n}/${d} מהכמות. כמה ק"ג השתמשנו?`, ansStr,
      [String(w2*n), frac(n+1,d), String(ans+1)].filter(x=>x!==ansStr),
      `${n}/${d} × ${w2} = ${w2*n}/${d} = ${ansStr} ק"ג.`),
    (w2,n,d,ans,ansStr) => maybeChoice(`אורך המסלול ${w2} ק"מ. רצנו ${n}/${d} ממנו. כמה ק"מ רצנו?`, ansStr,
      [String(w2-ans), frac(n,d+1), String(ans+1)].filter(x=>x!==ansStr),
      `${n}/${d} × ${w2} = ${ansStr} ק"מ.`),
    (w2,n,d,ans,ansStr) => typed(`חשב: ${w2} × ${n}/${d}`, ansStr,
      `${w2} × ${n}/${d} = ${w2*n}/${d} = ${ansStr}.`),
  ];
  const d = pick([2,3,4,5,6,7,8]);
  const w2 = d * r(1,6);
  const n = r(1, d-1);
  const ans = w2 * n / d;
  const ansStr = Number.isInteger(ans) ? String(ans) : frac(w2*n, d);
  return pick(contexts)(w2,n,d,ans,ansStr);
}

function genT5() {
  // כפל שלם במספר מעורב
  const whole = r(2,9);
  const md = pick([2,3,4,5,6]);
  const mw = r(1,5), mn = r(1,md-1);
  // whole × (mw + mn/md)
  const totalNum = whole * mw * md + whole * mn;
  const ansW = Math.floor(totalNum / md);
  const ansN = totalNum % md;
  const ansStr = mixed(ansW, ansN, md);
  const ctxs = [
    `${whole} × ${mixed(mw,mn,md)} = ?`,
    `כל מגרש שטחו ${mixed(mw,mn,md)} דונם. מה שטח ${whole} מגרשים?`,
    `בכל קופסה יש ${mixed(mw,mn,md)} ק"ג. כמה ק"ג ב-${whole} קופסות?`,
    `חשב: ${whole} × ${mixed(mw,mn,md)}`,
  ];
  return maybeChoice(
    pick(ctxs),
    ansStr,
    [String(ansW), mixed(ansW+1, ansN, md), ansN>0 ? mixed(ansW, ansN-1, md) : String(ansW+1)],
    `${whole} × ${mixed(mw,mn,md)} = ${whole} × (${mw} + ${mn}/${md}) = ${whole*mw} + ${frac(whole*mn,md)} = ${ansStr}.`
  );
}

function genT6() {
  // מציאת חלק של מספר שלם — (n/d) × whole
  const d = pick([2,3,4,5,6,8,10]);
  const whole = d * r(2,10);
  const n = r(1, d-1);
  const ans = whole * n / d;
  const ctxs = [
    `${n}/${d} מתוך ${whole} = ?`,
    `בכיתה יש ${whole} תלמידים. ${n}/${d} מהם בנות. כמה בנות?`,
    `מגרש שטחו ${whole} מ"ר. ${n}/${d} ממנו מכוסה דשא. כמה מ"ר דשא?`,
    `בחנות יש ${whole} פריטים. ${n}/${d} מהם במבצע. כמה פריטים במבצע?`,
    `${n}/${d} × ${whole} = ?`,
  ];
  return maybeChoice(
    pick(ctxs),
    ans,
    [whole*n, ans+d, Math.max(1,ans-d), ans+whole/d].filter(x=>x!==ans),
    `${n}/${d} × ${whole} = (${whole} ÷ ${d}) × ${n} = ${whole/d} × ${n} = ${ans}.`
  );
}

function genT7() {
  // מציאת חלק של שבר — fraction × fraction
  const d1 = pick([2,3,4,5,6,7,8]), d2 = pick([2,3,4,5,6,7,8]);
  const n1 = r(1,d1-1 || 1), n2 = r(1,d2-1 || 1);
  const rn = n1*n2, rd = d1*d2;
  const g = gcd(rn,rd);
  const ansStr = rd/g===1 ? String(rn/g) : `${rn/g}/${rd/g}`;
  const ctxs = [
    `${n1}/${d1} × ${n2}/${d2} = ?`,
    `${n1}/${d1} מתוך ${n2}/${d2} = ?`,
    `בכוס יש ${n2}/${d2} מים, ושפכנו ${n1}/${d1} מהם. איזה חלק מהכוס שפכנו?`,
    `${n2}/${d2} מהחלקה זרוע בחיטה. ${n1}/${d1} מהחיטה נקטף. איזה חלק מהחלקה נקטף?`,
  ];
  return maybeChoice(
    pick(ctxs),
    ansStr,
    [frac(n1+n2,d1+d2), frac(n1*n2+1,d1*d2), frac(n1,d2), frac(n2,d1)].filter(x=>x!==ansStr),
    `כופלים מונה במונה ומכנה במכנה: ${n1}×${n2} / ${d1}×${d2} = ${rn}/${rd} = ${ansStr}.`
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
    `ממירים לשבר מדומה: ${fn}/${fd} × ${totalMixed}/${md} = ${resNum}/${resDen} = ${ansStr}.`
  );
}

function genT9() {
  // מציאת הכמות על-פי חלק ממנה — N known part → find whole
  const d = pick([2,3,4,5,6,8,10]);
  const n = r(1, d-1);
  const ans = d * r(2,12);
  const part = ans * n / d;
  const ctxs = [
    `${n}/${d} מכמות מסוימת שווים ל-${part}. מהי הכמות?`,
    `קראתי ${n}/${d} מהספר, שהם ${part} עמודים. כמה עמודים יש בספר?`,
    `${part} תלמידים נעדרו, והם ${n}/${d} מהכיתה. כמה תלמידים בכיתה?`,
    `הגיעו ${part} אורחים, שהם ${n}/${d} מהמוזמנים. כמה אורחים הוזמנו?`,
    `${part} הם ${n}/${d} מכמות מסוימת. מה הכמות השלמה?`,
  ];
  return maybeChoice(
    pick(ctxs),
    ans,
    [ans+d, Math.max(1,ans-d), part*d, ans*2].filter(x=>x!==ans&&x>0),
    `${part} הם ${n}/${d} מהכמות. 1/${d} = ${part} ÷ ${n} = ${part/n}. הכמות = ${part/n} × ${d} = ${ans}.`
  );
}

function genT10() {
  // חילוק שלם בשבר (א) — whole ÷ unit fraction
  const d = pick([2,3,4,5,6,7,8,9,10]);
  const whole = r(2,12);
  const ans = whole * d;
  const ctxs = [
    `${whole} ÷ 1/${d} = ?`,
    `חילקנו ${whole} מטרים של בד לחתיכות באורך 1/${d} מטר. כמה חתיכות התקבלו?`,
    `כמה פעמים נכנס 1/${d} בתוך ${whole}?`,
    `${whole} כוסות מים חולקו למנות של 1/${d} כוס. כמה מנות התקבלו?`,
  ];
  return maybeChoice(
    pick(ctxs),
    ans,
    [whole, ans-d, ans+d, Math.max(1,whole-1)].filter(x=>x!==ans&&x>0),
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
  const k = r(2,8);
  const a = r(1,7), b = r(1,7);
  const g = gcd(a,b);
  const ra = a/g, rb = b/g;
  const ctxs = [
    `בכיתה יש ${a*k} בנים ו-${b*k} בנות. מה היחס בין מספר הבנים למספר הבנות (בצורה מצומצמת)?`,
    `במשפחה יש ${a*k} כלבים ו-${b*k} חתולים. מה היחס בין הכלבים לחתולים?`,
    `בסל יש ${a*k} תפוחים ו-${b*k} תפוזים. מה היחס המצומצם בין התפוחים לתפוזים?`,
    `בגינה יש ${a*k} עצי תפוח ו-${b*k} עצי זית. מה היחס המצומצם בין עצי התפוח לעצי הזית?`,
    `צמצם את היחס: ${a*k}:${b*k}`,
  ];
  return maybeChoice(
    pick(ctxs),
    `${ra}:${rb}`,
    [`${a*k}:${b*k}`, `${rb}:${ra}`, `${ra+1}:${rb}`, `${ra}:${rb+1}`].filter(x=>`${ra}:${rb}`!==x),
    `מצמצמים: ${a*k}:${b*k} = ${ra}:${rb} (מחלקים ב-${g*k}).`
  );
}

function genT14() {
  // יחס בין כמויות (ב) — ratio in simplest form / find part of total
  const a = r(1,6), b = r(1,6), total = (a+b)*r(2,8);
  const partA = total * a / (a+b);
  const partB = total * b / (a+b);
  const nameA = pick(['דן','עמית','רון','שני','אמיר']);
  const nameB = pick(['לירון','נועה','גיל','מיכל','יובל']);
  const ctxs = [
    `היחס בין הכסף של ${nameA} לכסף של ${nameB} הוא ${a}:${b}. יחד יש להם ${total} ₪. כמה ₪ יש ל${nameA}?`,
    `חילקו ${total} סוכריות ביחס ${a}:${b}. כמה סוכריות יש בחלק הראשון?`,
    `בתערובת יחס המרכיבים הוא ${a}:${b}. סה"כ ${total} גרם. כמה גרם מהמרכיב הראשון?`,
    `צבע מעורב ביחס ${a}:${b}. יש בסה"כ ${total} מ"ל. כמה מ"ל מהצבע הראשון?`,
  ];
  return maybeChoice(
    pick(ctxs),
    partA,
    [partB, partA+a, total-partA-1, total].filter(x=>x!==partA&&x>0),
    `החלק הראשון: ${a}/(${a}+${b}) × ${total} = ${partA}.`
  );
}

function genT15() {
  // מציאת כמות חסרה על-פי יחס — proportion
  const a = r(1,7), b = r(1,7)*r(1,3);
  const mult = r(2,8);
  const x = a * mult;
  const ans = b * mult; // a:b = x:ans
  const ctxs = [
    `אם ${a}:${b} = ${x}:?, מהו הערך החסר?`,
    `מתכון דורש ${a} כפות סוכר ל-${b} כוסות קמח. כמה כוסות קמח צריך ל-${x} כפות סוכר?`,
    `על כל ${a} ק"מ נסיעה צורכת המכונית ${b} ליטר דלק. כמה ליטר היא תצרוך ב-${x} ק"מ?`,
    `ב-${a} ימים נארזו ${b} חבילות. בקצב הזה, כמה חבילות יארזו ב-${x} ימים?`,
  ];
  return maybeChoice(
    pick(ctxs),
    ans,
    [ans+b, Math.max(1,ans-a), x+b, Math.round(a*b/x)].filter(x2=>x2!==ans&&x2>0),
    `יחס: ${a}:${b} = ${x}:?. הערך החסר = ${x} × ${b} ÷ ${a} = ${ans}.`
  );
}

function genT16() {
  // חלוקה על-פי יחס — divide total in given ratio
  const a = r(1,6), b = r(1,6), total = (a+b)*r(2,8);
  const partA = total*a/(a+b), partB = total*b/(a+b);
  const bigPart = Math.max(partA,partB), smallPart = Math.min(partA,partB);
  const things = pick(['שקלים','ק"ג','מטרים','ק"מ','גרם','נקודות']);
  const ctxs = [
    `חלקנו ${total} ${things} ביחס ${a}:${b}. מהו החלק הגדול?`,
    `${total} ${things} חולקו ביחס ${a}:${b}. מהו החלק הקטן?`,
    `ירושה של ${total} ₪ חולקה ביחס ${a}:${b}. כמה ₪ קיבל האח שמקבל את החלק הגדול?`,
    `חולקו ${total} נקודות ביחס ${a}:${b}. כמה נקודות קיבל הראשון?`,
  ];
  const askBig = Math.random() < 0.6;
  const ans = askBig ? bigPart : smallPart;
  const q = ctxs[askBig ? r(0,2) : 1];
  return maybeChoice(
    q, ans,
    [total, askBig?smallPart:bigPart, ans+a+b, Math.max(1,ans-a)].filter(x=>x!==ans&&x>0),
    `החלק = ${askBig?Math.max(a,b):Math.min(a,b)}/(${a}+${b}) × ${total} = ${ans}.`
  );
}

// ─── Book 2: מספרים עשרוניים, אחוזים ונתונים ─────────────────────────────

function genT17() {
  // כפל עשרוניים ב-10, 100, 1000
  const m = pick([10,100,1000]);
  const places = m===10 ? pick([1,2]) : m===100 ? pick([2,3]) : pick([3,4]);
  const ints = r(1,49);
  const decs = Array.from({length:places}, ()=>r(0,9));
  // ensure last decimal is non-zero so it's not trivially integer
  decs[decs.length-1] = r(1,9);
  const baseStr = ints + '.' + decs.join('');
  const ans = parseFloat(baseStr) * m;
  const ansStr = Number.isInteger(ans) ? String(ans) : String(parseFloat(ans.toFixed(Math.max(0,places-Math.log10(m)))));
  const ctxs = [
    `${baseStr} × ${m} = ?`,
    `מחיר של גרם תבלין הוא ${baseStr} ₪. כמה עולים ${m} גרם?`,
    `כדור אחד שוקל ${baseStr} ק"ג. כמה שוקלים ${m} כדורים?`,
    `הכפל: ${baseStr} × ${m}`,
  ];
  return maybeChoice(
    pick(ctxs),
    ansStr,
    [String(parseFloat(baseStr)+m), String(parseFloat(baseStr)*m/10), String(parseFloat(ansStr)+1)].filter(x=>x!==ansStr),
    `כפל ב-${m} מזיז את הנקודה ${Math.log10(m)} מקומות ימינה: ${baseStr} → ${ansStr}.`
  );
}

function genT18() {
  // חילוק עשרוניים ב-10, 100, 1000
  const m = pick([10,100,1000]);
  const digits = Math.log10(m);
  // build a decimal that divides cleanly
  const mantissa = r(1, 9999);
  const whole = mantissa; // we'll divide this
  const ans = whole / m;
  const ansStr = String(parseFloat(ans.toFixed(digits + 2)));
  // Build context-appropriate questions per divisor
  const unitCtx = m === 10
    ? `${whole} מ"מ = כמה ס"מ? (1 ס"מ = 10 מ"מ)`
    : m === 100
    ? `${whole} אגורות = כמה שקלים? (1 ש"ח = 100 אגורות)`
    : `${whole} גרם = כמה ק"ג? (1 ק"ג = 1000 גרם)`;
  const ctxs = [
    `${whole} ÷ ${m} = ?`,
    unitCtx,
    `חלק את ${whole} ב-${m}.`,
  ];
  return maybeChoice(
    pick(ctxs),
    ansStr,
    [String(whole*m), String(parseFloat(ansStr)+0.1), String(parseFloat(ansStr)*10)].filter(x=>x!==ansStr),
    `חלוקה ב-${m} מזיזה את הנקודה ${digits} מקומות שמאלה: ${whole} → ${ansStr}.`
  );
}

function genT19() {
  // כפל עשרוניים (א) — decimal × whole
  const places = pick([1,2]);
  const factor = Math.pow(10, places);
  const aInt = r(11, 99);
  const a = (aInt / factor).toFixed(places);
  const b = r(2,15);
  const ans = parseFloat(a) * b;
  const ansStr = String(parseFloat(ans.toFixed(places+1)));
  const ctxs = [
    `${a} × ${b} = ?`,
    `כל כרטיס עולה ${a} ₪. כמה עולים ${b} כרטיסים?`,
    `יש ${b} קופסות, וכל אחת שוקלת ${a} ק"ג. מה המשקל הכולל?`,
    `רץ רץ ${a} ק"מ ביום. כמה ק"מ הוא רץ ב-${b} ימים?`,
  ];
  return maybeChoice(
    pick(ctxs),
    ansStr,
    [String(parseFloat(a)+b), String(parseFloat(ansStr)+b*0.1), String(parseFloat(ansStr)+1)].filter(x=>x!==ansStr),
    `${a} × ${b}: מכפילים ${aInt} × ${b} = ${aInt*b}, ואז מחלקים ב-${factor} = ${ansStr}.`
  );
}

function genT20() {
  // כפל עשרוניים (ב) — decimal × decimal
  const pa = pick([1,2]), pb = pick([1,2]);
  const fa = Math.pow(10,pa), fb = Math.pow(10,pb);
  const ai = r(11, pa===1?99:999), bi = r(11, pb===1?99:999);
  const a = (ai/fa).toFixed(pa), b = (bi/fb).toFixed(pb);
  const ans = parseFloat(a)*parseFloat(b);
  const ansStr = String(parseFloat(ans.toFixed(pa+pb)));
  const totalPlaces = pa+pb;
  const ctxs = [
    `${a} × ${b} = ?`,
    `שטיח באורך ${a} מ' וברוחב ${b} מ'. מה השטח שלו?`,
    `הליכה במהירות ${a} מ' בשנייה במשך ${b} שניות — כמה מטרים עברנו?`,
    `חשב: ${a} × ${b}`,
  ];
  return maybeChoice(
    pick(ctxs),
    ansStr,
    [String(parseFloat(a)+parseFloat(b)), String(parseFloat(ansStr)+0.1*Math.pow(10,-(pa+pb-1))), String(ans*10).slice(0,8)].filter(x=>x!==ansStr),
    `${a} × ${b}: מכפילים ${ai} × ${bi} = ${ai*bi}, מחלקים ב-${fa*fb}. ${totalPlaces} ספרות אחרי נקודה. תוצאה: ${ansStr}.`
  );
}

function genT21() {
  // חילוק עשרוניים
  const divisors = [0.2,0.4,0.5,0.25,0.8,0.1,0.05,0.125,1.5,2.5];
  const b = pick(divisors);
  const ans = r(2,20);
  const a = parseFloat((ans*b).toFixed(4));
  const aStr = String(a);
  const inv = parseFloat((1/b).toFixed(5));
  const ctxs = [
    `${aStr} ÷ ${b} = ?`,
    `${aStr} מטרים של בד חולקו לחתיכות באורך ${b} מטר. כמה חתיכות התקבלו?`,
    `כמה פעמים נכנס ${b} בתוך ${aStr}?`,
    `חלק את ${aStr} ב-${b}.`,
  ];
  return maybeChoice(
    pick(ctxs),
    ans,
    [ans+1, Math.max(1,ans-1), Math.round(a*10), ans*2].filter(x=>x!==ans&&x>0),
    `${aStr} ÷ ${b} = ${aStr} × ${inv} = ${ans}.`
  );
}

function genT22() {
  // שבר פשוט → עשרוני בעזרת חילוק
  const fracs = [['1/4','0.25'],['3/8','0.375'],['5/8','0.625'],['7/8','0.875'],
                  ['1/5','0.2'],['2/5','0.4'],['3/5','0.6'],['4/5','0.8'],
                  ['1/16','0.0625'],['3/4','0.75']];
  const [fr, dec] = pick(fracs);
  return maybeChoice(
    `המר למספר עשרוני (בעזרת חילוק): ${fr} = ?`,
    dec,
    ['0.5','0.3','0.6','0.125','0.4'].filter(x=>x!==dec),
    `${fr}: מחלקים מונה במכנה. ${fr.split('/')[0]} ÷ ${fr.split('/')[1]} = ${dec}.`
  );
}

function genT23() {
  // האחוז: מאית של כמות
  const whole = r(1,50)*100;
  const pct = pick([1,2,3,4,5,6,7,8,9,10,50]);
  const ans = whole*pct/100;
  const ctxs = [
    `${pct}% מ-${whole} = ?`,
    `כמה הם ${pct}% ממחיר של ${whole} ₪?`,
    `בבחינה שמורכבת מ-${whole} נקודות קיבלת ${pct}%. כמה נקודות קיבלת?`,
    `${pct}% מ-${whole} גרם שוקולד = ? גרם`,
  ];
  return maybeChoice(
    pick(ctxs),
    ans,
    [ans*2, ans+pct, Math.max(0,whole-ans), ans+10].filter(x=>x!==ans&&x>=0),
    `${pct}% = ${pct}/100. ${pct}/100 × ${whole} = ${ans}.`
  );
}

function genT24() {
  // האחוז: חלק של כמות (א) — easy percentages
  const whole = pick([20,40,50,60,80,100,120,150,200,240,300,400,500]);
  const pct = pick([10,20,25,50,75]);
  const ans = whole*pct/100;
  const ctxs = [
    `${pct}% מ-${whole} = ?`,
    `חנות נותנת הנחה של ${pct}% על מוצר שעולה ${whole} ₪. בכמה ₪ ההנחה?`,
    `בבית הספר ${whole} תלמידים, ו-${pct}% מהם הולכים ברגל. כמה תלמידים הולכים ברגל?`,
    `${pct}% מ-${whole} ק"ג = ? ק"ג`,
    `חשב: ${pct}% מ-${whole}`,
  ];
  return maybeChoice(
    pick(ctxs),
    ans,
    [Math.max(0,whole-ans), ans+pct, ans*2, ans+whole*0.1].filter(x=>x!==ans&&x>=0),
    `${pct}% = ${pct}/100. ${whole} × ${pct} ÷ 100 = ${ans}.`
  );
}

function genT25() {
  // האחוז: חלק של כמות (ב) — varied percentages
  const whole = pick([60,80,120,150,180,200,250,300,350,400,450,500]);
  const pct = pick([15,30,35,40,45,55,60,65,70,80,85,90]);
  const ans = whole*pct/100;
  const ctxs = [
    `${pct}% מ-${whole} = ?`,
    `מתוך ${whole} גרם גלידה אכלנו ${pct}%. כמה גרם אכלנו?`,
    `בבקבוק ${whole} מ"ל מיץ ושתינו ${pct}% ממנו. כמה מ"ל שתינו?`,
    `בחנות יש ${whole} חולצות, ${pct}% מהן כחולות. כמה חולצות כחולות?`,
  ];
  return maybeChoice(
    pick(ctxs),
    ans,
    [whole*pct/10, ans+10, Math.max(0,ans-10), ans+pct].filter(x=>x!==ans&&x>0),
    `${pct}% מ-${whole}: ${whole} × ${pct} ÷ 100 = ${ans}.`
  );
}

function genT26() {
  // מציאת חלק באחוזים — what % is part of whole?
  // Generate dynamically: pick pct from a wide set, pick whole that divides cleanly
  const pcts = [5,10,15,20,25,30,40,50,60,75,80];
  const ans = pick(pcts);
  const whole = pick([20,25,40,50,60,80,100,120,150,200,250,400,500]);
  const part = whole * ans / 100;
  if (!Number.isInteger(part)) return genT26(); // retry if not integer
  const ctxs = [
    `${part} מתוך ${whole} הם כמה אחוזים?`,
    `קיבלת ${part} נקודות מתוך ${whole}. מה הציון באחוזים?`,
    `מ-${whole} תלמידים, ${part} הגיעו. כמה אחוזים הגיעו?`,
    `${part} מ-${whole} = ?%`,
  ];
  return maybeChoice(
    pick(ctxs),
    ans,
    [100-ans, ans+5, ans+10, ans===50?25:50].filter(x=>x!==ans&&x>0&&x<=100),
    `${part} ÷ ${whole} × 100 = ${ans}%.`
  );
}

function genT27() {
  // עוד על האחוז כחלק — find original given part & percentage
  const pct = pick([10,20,25,40,50,75,80]);
  // pick a "nice" whole that gives integer part
  const whole = r(1,15) * Math.round(100/pct) * pick([1,2,5]);
  const part = whole*pct/100;
  if (!Number.isInteger(part)||!Number.isInteger(whole)||whole<10) return genT27();
  const ctxs = [
    `${part} הם ${pct}% מאיזו כמות?`,
    `הנחה של ${pct}% הסתכמה ב-${part} ₪. מה המחיר המקורי?`,
    `${part} תלמידים הם ${pct}% מהכיתה. כמה תלמידים יש בכיתה?`,
    `${part} גרם הם ${pct}% מהאריזה. מה משקל האריזה?`,
  ];
  return maybeChoice(
    pick(ctxs),
    whole,
    [whole+pct, Math.max(1,whole-pct), part, whole*2].filter(x=>x!==whole&&x>0),
    `אם ${part} הם ${pct}%, אז 1% = ${part/pct}. 100% = ${part/pct} × 100 = ${whole}.`
  );
}

function genT28() {
  // מציאת כמות אחרי שינוי באחוזים
  const orig = pick([40,50,60,75,80,100,120,150,160,200,250,300]);
  const pct = pick([5,10,15,20,25,30,40,50]);
  const increase = Math.random()<0.5;
  const ans = increase ? orig*(1+pct/100) : orig*(1-pct/100);
  if (!Number.isInteger(ans)) return genT28();
  const direction = increase ? `עלה ב-${pct}%` : `ירד ב-${pct}%`;
  const opposite = increase ? orig*(1-pct/100) : orig*(1+pct/100);
  const ctxs = [
    `מחיר המוצר היה ${orig} ₪ ו${direction}. מה המחיר החדש?`,
    `משקל האריזה היה ${orig} גרם ו${direction}. מה המשקל החדש?`,
    `מספר העובדים בחברה היה ${orig} ו${direction}. כמה עובדים יש כעת?`,
    `המרחק היה ${orig} ק"מ ו${direction}. מה המרחק החדש?`,
  ];
  return maybeChoice(
    pick(ctxs),
    ans,
    [Number.isInteger(opposite)?opposite:ans+pct, ans+pct, Math.max(1,ans-pct), orig].filter(x=>x!==ans&&x>0),
    `${orig} × ${increase?(1+pct/100):(1-pct/100)} = ${ans}.`
  );
}

function genT29() {
  // מציאת אחוז אחרי שינוי בכמות
  const orig = pick([40,50,60,75,80,100,120,150,160,200,250,300]);
  const pct = pick([5,10,15,20,25,30,40,50]);
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
  // הצגה וניתוח נתונים — mean / range / sum from a list
  const n = pick([4,5,6,7]);
  const maxVal = pick([20,30,50,100]);
  // generate nums that give a clean mean
  const mean = r(5, maxVal-5);
  const deviations = Array.from({length:n-1}, ()=>r(-mean+1,maxVal-mean-1));
  const lastDev = -deviations.reduce((a,b)=>a+b,0);
  if (mean + lastDev < 1 || mean + lastDev > maxVal*1.5) return genT30();
  const nums = [...deviations.map(d=>mean+d), mean+lastDev].sort((a,b)=>a-b);
  const sum = nums.reduce((a,b)=>a+b,0);
  const range = Math.max(...nums) - Math.min(...nums);
  const contexts = ['הציונים','מדידות הגובה (ס"מ)','מספרי הדגים שנתפסו','הזמנים (דקות)','הנקודות'];
  const ctx = pick(contexts);
  const q = Math.random();
  if (q < 0.4) {
    return maybeChoice(
      `${ctx}: ${nums.join(', ')}. מה הממוצע?`,
      mean, [mean+1, mean-1, Math.round(mean+0.5), sum],
      `סכום = ${sum}. ממוצע = ${sum} ÷ ${n} = ${mean}.`
    );
  } else if (q < 0.7) {
    return maybeChoice(
      `${ctx}: ${nums.join(', ')}. מה הטווח?`,
      range, [range+1, Math.max(1,range-1), Math.max(...nums), Math.min(...nums)],
      `טווח = ${Math.max(...nums)} − ${Math.min(...nums)} = ${range}.`
    );
  } else {
    return typed(
      `${ctx}: ${nums.join(', ')}. מה הסכום?`,
      sum, `מחברים את כל הנתונים: ${nums.join(' + ')} = ${sum}.`
    );
  }
}

function genT31() {
  // איסוף וניתוח — median / mode
  const n = pick([5,7,9]); // always odd for clear median
  const maxV = pick([15,20,30,50,100]);
  const useMode = Math.random()<0.5;
  if (useMode) {
    const dup = r(1, maxV-1);
    const times = pick([2,3]);
    const others = Array.from({length:n-times}, ()=>{ let v; do{ v=r(1,maxV); }while(v===dup); return v; });
    const arr = [...Array(times).fill(dup), ...others].sort((a,b)=>a-b);
    return maybeChoice(
      `נתונים: ${arr.join(', ')}. מה השכיח?`,
      dup, arr.filter(x=>x!==dup).slice(0,3),
      `השכיח הוא הערך שחוזר הכי הרבה פעמים. ${dup} מופיע ${times} פעמים.`
    );
  }
  const nums = Array.from({length:n}, ()=>r(1,maxV)).sort((a,b)=>a-b);
  const medIdx = Math.floor(n/2);
  const med = nums[medIdx];
  return maybeChoice(
    `נתונים (ממוינים): ${nums.join(', ')}. מה החציון?`,
    med,
    [nums[medIdx-1], nums[medIdx+1], nums[0], nums[n-1]].filter(x=>x!==med&&x!==undefined),
    `החציון הוא הערך האמצעי. ב-${n} ערכים זהו הערך מס' ${medIdx+1}: ${med}.`
  );
}

function genT32() {
  // ניתוח סיכויים (א) — basic probability
  const total = pick([4,5,6,8,10,12,15,20]);
  const fav = r(1, total-1);
  const ansStr = frac(fav,total);
  const colors = ['אדומים','כחולים','ירוקים','צהובים','שחורים'];
  const color = pick(colors);
  const containers = ['קופסה','שקית','כד','ארגז'];
  const items = ['כדורים','גולות','קלפים','אסימונים','כרטיסים'];
  const container = pick(containers), item = pick(items);
  const ctxs = [
    `ב${container} יש ${total} ${item}, מתוכם ${fav} ${color}. מה ההסתברות לשלוף ${item} ${color}?`,
    `מגרילים אחד מתוך ${total} ${item}. ${fav} מתוכם זוכים. מה ההסתברות לזכות?`,
    `בוחרים קלף באקראי מ-${total} קלפים. ${fav} מהם מסומנים. מה ההסתברות לבחור קלף מסומן?`,
  ];
  return maybeChoice(
    pick(ctxs),
    ansStr,
    [frac(total-fav,total), frac(fav,total-1), frac(fav+1,total), frac(fav,total+1)].filter(x=>x!==ansStr),
    `הסתברות = ${fav}/${total} = ${ansStr}.`
  );
}

function genT33() {
  // ניתוח סיכויים (ב) — complementary probability
  const total = pick([4,5,6,8,10,12,15,20]);
  const fav = r(1,total-1);
  const comp = total - fav;
  const pStr = frac(fav,total);
  const compStr = frac(comp,total);
  const ctxs = [
    `ההסתברות לאירוע מסוים היא ${pStr}. מה ההסתברות שהאירוע לא יתרחש?`,
    `ההסתברות שירד גשם מחר היא ${pStr}. מה ההסתברות שלא ירד גשם?`,
    `הסיכוי לזכות במשחק הוא ${pStr}. מה הסיכוי להפסיד?`,
    `מתוך ${total} ניסיונות, ${fav} צפויים להצליח. מה ההסתברות לכישלון בניסיון בודד?`,
  ];
  return maybeChoice(
    pick(ctxs),
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
