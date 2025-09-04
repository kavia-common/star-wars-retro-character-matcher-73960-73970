# SWCG Frontend (React SPA)

A retro 80s Star Wars–themed character glam generator. Users take a 5-question quiz, see their character match with a witty write-up, upload a selfie, generate a glam mashup, and share via social or SMS.

## Tech
- React 18, React Router v6
- Vanilla CSS with neon/space theme
- Integrates with FastAPI backend via REST

## Run
- Copy .env.example to .env and set values:
  - REACT_APP_API_BASE_URL (e.g., http://localhost:3001)
  - REACT_APP_SITE_URL (e.g., http://localhost:3000)
- Install: npm install
- Dev: npm start (http://localhost:3000)
- Build: npm run build

## Pages
- / (Quiz): Animated 5-question neon quiz
- /reveal (MatchReveal): Character match card with witty write-up
- /selfie (SelfieUpload): Camera/file input, preview, upload
- /mashup (MashupViewer): Displays generated image in glam frame
- /share (Share): Buttons for Facebook, Twitter, and SMS (via backend)

## API Endpoints Used
- GET /characters/traits (optional catalog)
- POST /quiz/submit -> MatchResult
- POST /selfie/upload -> { temp_id, url }
- POST /image/mashup -> { mashup_url, public_id }
- POST /share -> { status, link?, sid? }

## Notes
- State is persisted in localStorage to allow navigation between steps.
- Styling uses palette: primary #FF77FF, secondary #0077FF, accent #FFFF00.
- Responsive for mobile and desktop.
