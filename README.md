# Pocket Doctor 🩺

A small web app to help you **check symptoms, get wellness tips, and manage medications** — built by **Team Axiom**.

---

## 🚀 What is this?
- A lightweight health assistant web app.
- Runs locally with a Node.js server and simple HTML/CSS/JS frontend.
- AI-powered (Google Gemini) for symptom analysis and quick chat.

---

## 📦 Requirements
- **Node.js 18+**
- **Google AI Studio API Key** (for Gemini)

---

## ⚡ Quick start

1. **Install packages**
```bash
npm install
```

2. **Set environment**
Create a file named `.env` in the project folder:
```
GEMINI_API_KEY=your_api_key_here
PORT=3000
```

3. **Start the server**
```bash
npm start
```

4. **Open the app**
Visit: `http://localhost:3000/index.html`

---

## 📄 Main pages
- `index.html` – Landing page with AI chat, features, and links
- `checker.html` – Symptom checker (form + AI analysis)
- `wellness.html` – Wellness hub with daily tips and goals
- `medications.html` – Medication manager
- `dashboard.html` – Summary cards (health score, quick actions, emergency)

---

## 🎨 Light / Dark Mode
- Toggle theme with the **“Theme”** button in the header.
- Preference is stored in **localStorage**.
- Colors are applied using **CSS variables** (`--panel`, `--text`, etc.).

---

## 🧠 How the AI works
- The browser sends requests to the Node server:
  - `POST /api/chat` → short AI replies
  - `POST /api/analyze-symptoms` → JSON with analysis, risk, advice
- The server calls **Google Gemini APIs** using your API key.
- Your key stays **safe on the server (.env)** and is never exposed to client code.

---

## 🔄 Project Workflow (Team Process)

1. **Plan a change**
   - Choose a page or feature (e.g., improve `wellness.html`).
   - Check existing styles in `assets/css/styles.css`.

2. **Implement**
   - Update HTML for structure/content.
   - Reuse or extend CSS variables and classes (`--panel`, `--text`).
   - Add JS logic in `assets/js/common.js` if needed.

3. **Test locally**
   - Run `npm start`.
   - Refresh in browser (test both Light and Dark modes).

4. **Review & lint**
   - Ensure clean, consistent, and readable code.
   - No inline secrets — use `.env`.

5. **Commit & push**
   - Use small, clear commits:
     - Example: `fix: light mode colors on dashboard cards`
     - Example: `feat: center grid in wellness page`

6. **Deploy (Vercel)**
   - Push code to GitHub.
   - Import repo on [vercel.com](https://vercel.com).
   - Add environment variables (`GEMINI_API_KEY`).
   - Deploy → app will be live at `https://your-project.vercel.app`.

---

## 🛠️ Server Endpoints
- `POST /api/chat` → Plain-text AI reply
- `POST /api/analyze-symptoms` → JSON (symptom analysis, risk, advice)

---

## 🔐 Security
- **Do not expose** API keys in client code.
- Keep `.env` private — never commit it.
- Server acts as a **secure proxy** for Gemini requests.

---

## 📜 License
- For learning and personal use.
- Dependencies have their own licenses.

---

## 👥 Team – **Axiom**
*Innovating Health with AI*

Built with 💡 and 💻 by:
- **Soham Roy Chowdhury**
- **Arnab Dan**
- **Parambrata Chakraborty**
- **Saumyadip Saha**

---


