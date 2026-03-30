# Golden Honmoon Math Game

Hebrew RTL decimal-arithmetic browser game for HUNTR/X fans.

## Stack

- React 18 + Vite 5 (plain JavaScript, no TypeScript, no test framework)
- Web Audio API for procedural music and sound effects
- Inline CSS (`style={{}}` props) + global keyframes in `src/index.css`

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # output to dist/
npm run preview  # serve the built output locally
```

## Project Layout

```
src/
  audio/          - GameAudio singleton (Web Audio API synthesiser)
  data/           - characters.js, levels.js  (pure data, no React)
  components/     - reusable UI pieces (CharacterSVG, HonmoonShield, etc.)
  screens/        - one file per game screen; each receives all data via props
  GoldenHonmoonGame.jsx  - state machine; owns all useState/useEffect/callbacks
  App.jsx         - thin wrapper that renders GoldenHonmoonGame
  index.css       - @keyframes, Google Fonts @import, body reset, input rules
index.html        - entry HTML; Google Fonts <link> in <head>
infra/
  s3-website.yaml - CloudFormation template for S3 static hosting
scripts/
  deploy.sh       - build + CloudFormation deploy + S3 sync
```

## Key Constants (`src/data/levels.js`)

| Constant | Value | Meaning |
|----------|-------|---------|
| `QPL`    | 5     | Questions per level |
| `PASS`   | 4     | Correct answers needed to pass |

## CSS Convention

- **Do not** convert inline `style={{}}` props to CSS modules — the codebase uses inline styles throughout
- **Global concerns only** go in `src/index.css`: `@keyframes`, font import, `body` reset, `input` utility rules
- `dir="rtl"` is set on the root `<div>` in `GoldenHonmoonGame.jsx`
- Math question text uses `direction:"ltr"` inline so numbers render correctly

## Audio Singleton (`src/audio/GameAudio.js`)

- Exports a single `audio` instance — import only in `GoldenHonmoonGame.jsx`
- `audio.init()` **must** be called inside a user-gesture handler (Web Audio API requirement)
- The existing `ensureAudio()` guard in `GoldenHonmoonGame.jsx` handles this correctly — do not move it

## Deployment to S3

### 1. Create infrastructure

```bash
aws cloudformation deploy \
  --stack-name golden-honmoon-math-site \
  --template-file infra/s3-website.yaml \
  --parameter-overrides BucketName=<your-unique-bucket-name> \
  --region us-east-1
```

### 2. Build and deploy

```bash
./scripts/deploy.sh --bucket <your-unique-bucket-name> --region us-east-1
```

The script builds the app, syncs `dist/` to S3, and prints the public website URL.

## Game Flow

```
Character select → Level menu → 5 questions
  ↓ ≥4 correct          ↓ <4 correct
Level complete        Level failed
(Spotify embed)       (retry option)
```

## Hebrew / RTL Notes

- All UI text is in Hebrew; do not change it
- The game targets Israeli school children learning decimal fractions
- Korean text (character names) is decorative flavour text
