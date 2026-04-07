// MathText.jsx — renders Hebrew+math strings with:
//   • math segments wrapped in dir="ltr" to fix RTL mirroring
//   • fractions displayed with a real horizontal bar instead of /
//
// No changes needed to question generators — works on raw strings.

// Hebrew Unicode ranges (letters only; punctuation/spaces stay outside)
const HEB_RE = /[\u05D0-\u05EA\u05F0-\u05F4\uFB1D-\uFB4E]/;
// A segment is "math" only if it contains at least one digit or math operator
const HAS_MATH = /[\d/?=×÷+\-%]/;

// A fraction numerator/denominator can be digits or ? (unknown placeholder)
const FRAC_PART = '[-\\d?]+';
// Matches: optional_whole   num/den   OR just   num/den
const FRAC_RE = new RegExp(
  `(\\d+)\\s+(${FRAC_PART})\\/(${FRAC_PART})|(${FRAC_PART})\\/(${FRAC_PART})`,
  'g',
);

function FracBar({ n, d, size = '0.82em' }) {
  return (
    <span style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
      verticalAlign: 'middle', lineHeight: 1.15, margin: '0 1px', fontSize: size,
    }}>
      <span style={{ lineHeight: 1, paddingBottom: 1 }}>{n}</span>
      <span style={{
        lineHeight: 1, borderTop: '1.5px solid currentColor',
        paddingTop: 2, minWidth: '1ch', textAlign: 'center',
      }}>{d}</span>
    </span>
  );
}

/** Parse a math string into React nodes, replacing fraction patterns with FracBar */
function parseMath(str, baseKey) {
  const nodes = [];
  let last = 0;
  let i = 0;
  FRAC_RE.lastIndex = 0;
  let m;
  while ((m = FRAC_RE.exec(str)) !== null) {
    if (m.index > last) nodes.push(<span key={`t${baseKey}_${i++}`}>{str.slice(last, m.index)}</span>);
    if (m[1] !== undefined) {
      // mixed number: whole  num/den
      nodes.push(
        <span key={`f${baseKey}_${i++}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          <span>{m[1]}</span>
          <FracBar n={m[2]} d={m[3]} />
        </span>
      );
    } else {
      // simple fraction
      nodes.push(<FracBar key={`f${baseKey}_${i++}`} n={m[4]} d={m[5]} />);
    }
    last = m.index + m[0].length;
  }
  if (last < str.length) nodes.push(<span key={`t${baseKey}_${i++}`}>{str.slice(last)}</span>);
  return nodes;
}

/**
 * MathText — renders a string that mixes Hebrew text and math expressions.
 *
 * Usage: <MathText text={question.text} />
 */
export default function MathText({ text, style }) {
  if (!text) return null;

  // split() with a capture group gives: [nonHeb, heb, nonHeb, heb, ...]
  const segments = String(text).split(/([\u05D0-\u05EA\u05F0-\u05F4\uFB1D-\uFB4E]+)/);

  return (
    <span style={style}>
      {segments.map((seg, idx) => {
        if (!seg) return null;
        if (HEB_RE.test(seg)) {
          // Hebrew segment — stays RTL
          return <span key={idx} dir="rtl">{seg}</span>;
        }
        if (!HAS_MATH.test(seg)) {
          // Pure whitespace / punctuation between Hebrew words — render as-is (no dir wrapping)
          return <span key={idx}>{seg}</span>;
        }
        // Math segment — force LTR and render fractions with a proper bar
        return (
          <span key={idx} dir="ltr">
            {parseMath(seg, idx)}
          </span>
        );
      })}
    </span>
  );
}
