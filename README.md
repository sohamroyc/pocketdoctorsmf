Pocket Doctor — Simple Guide

What is this?
- A small web app to help you check symptoms, get wellness tips, and manage medications.
- Runs locally with a Node server and simple HTML/CSS/JS pages.

Requirements
- Node.js 18 or newer
- A Google AI Studio API key (for Gemini)

Quick start
1) Install packages
```
npm install
```
2) Set your environment
Create a file named `.env` in the project folder:
```
GEMINI_API_KEY=your_api_key_here
PORT=3000
```
3) Start the server
```
npm start
```
4) Open the app
- Go to `http://localhost:3000/index.html` in your browser.

Main pages
- `index.html` – Landing page with AI chat, features, and links
- `checker.html` – Symptom checker (simple form + AI analysis)
- `wellness.html` – Wellness hub with daily tips and goals
- `medications.html` – Medication manager
- `dashboard.html` – Summary cards (health score, quick actions, emergency)

Light / Dark (Theme)
- Use the “Theme” button in the header to toggle. We save your choice in the browser (localStorage), so it stays the same when you refresh.

How the AI works (short)
- The browser sends requests to our Node server endpoints:
  - `POST /api/chat` for short chat replies
  - `POST /api/analyze-symptoms` for a structured JSON analysis
- The server calls Google’s Gemini APIs with your API key, then returns clean JSON/text back to the page.
- Your API key stays on the server (.env), never in client JS.

Project workflow (how to work on this project)
1) Plan a change
   - Pick the page or feature (e.g., improve `wellness.html`).
   - Search in `assets/css/styles.css` for styles you can reuse.
2) Make the change
   - Edit the HTML (structure and content).
   - Update CSS variables or classes (use theme variables like `--panel`, `--text`).
   - If needed, add small JS in page or in `assets/js/common.js`.
3) Test locally
   - Run `npm start`.
   - Refresh the page in the browser (try both Light and Dark modes).
4) Lint and review
   - Keep code easy to read and consistent.
   - Avoid inline secrets. Use `.env` only.
5) Commit in small steps
   - Clear messages: “Fix light mode on dashboard cards,” “Center wellness grid,” etc.

Server endpoints (summary)
- `POST /api/chat` – Plain-text, short AI reply
- `POST /api/analyze-symptoms` – JSON with analysis, risk, and advice

Tips
- If something looks broken in Light mode, check that colors use the theme CSS variables:
  - Text: `var(--text)` or `var(--muted)`
  - Surfaces: `var(--panel)`, `var(--panel-2)`
  - Borders: `var(--border)`
- The theme toggle stores `theme` in localStorage. Delete that key if the theme gets stuck.

Deploy to Vercel (Free)
1) Push your code to GitHub
2) Go to [vercel.com](https://vercel.com) and import your GitHub repo
3) Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY` = your Google AI Studio API key
4) Deploy! Vercel will auto-detect it's a Node.js app

Your app will be live at `https://your-project.vercel.app`

Security
- Do not expose your API key in any client code. Keep it in `.env`.
- The server proxies requests to Google, so keys stay private.
- Never commit `.env` files to Git.

License
- For learning and personal use. Review dependencies for their own licenses.


