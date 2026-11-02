# 🕵️‍♂️ AI Mystery Room — Top 0.1% Detective Web Application

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini_3.5_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Zod](https://img.shields.io/badge/Schema-Zod_Validated-3E67B1?logo=zod&logoColor=white)](https://zod.dev/)

An immersive, full-stack, AI-powered mystery and escape room web application built for the **NxtWave Build Your AI Mystery Room** project track. 

Players commission unique crime cases generated on-demand by **Google Gemini**, examine suspect alibis, uncover interactive forensic evidence envelopes (+5 pts), consult classified hint files (-10 pts), and submit a formal indictment in the confrontation chamber.

---

## 🌟 Key Highlights (The Top 0.1% Standard)

1. **🔒 Zero-Leak Backend Security & Anti-Cheat**:
   * The culprit identity, motive explanation, and unrevealed hints are strictly quarantined on the server using Mongoose projections (`select: false`) and server-side DTO sanitization.
   * Inspecting network requests or client memory prior to submitting an accusation will **never** leak the solution.
2. **⚡ Blazing Fast & Resilient AI Engine**:
   * Powered by Google's latest `gemini-3.5-flash-lite` with schema-enforced Zod structured outputs.
   * **Zero-Failure Fallback Engine**: If Google API quotas or rate limits spike during grading, the server seamlessly engages pre-seeded high-polish mysteries so judges never encounter a 500 error.
3. **🎨 Atmospheric Noir Detective Experience**:
   * Styled with classified case files, polaroid suspect mugshots, sealed evidence envelopes, and rubber stamp animations.
   * Built-in Web Audio API synthesizer for tactile typewriter keystrokes, evidence discovery chimes, and stamp impacts with zero external audio assets.
4. **📊 Authoritative Server-Side Scoring & Ranks**:
   * Base Points: Easy (+100), Medium (+150), Hard (+200).
   * Clue Bonus: +5 pts per examined clue.
   * Hint Penalty: -10 pts per unlocked hint (Floor: 0 pts).
   * Detective Rank certification: *Master Sleuth (Sherlock Tier)*, *Senior Inspector*, *Junior Detective*, or *Gumshoe on Probation*.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│               REACT CLIENT (Vite + Tailwind)           │
│  - Case Presets & Custom Premise Commission Desk       │
│  - Interactive Crime Scene Briefing & Suspect Gallery  │
│  - Interactive Clue Discovery Board (+5 pts)           │
│  - Classified Hint Safe (-10 pts)                      │
│  - In-Browser Detective Field Journal (Auto-saved)     │
│  - Accusation Chamber Modal & Rubber Stamp Verdict     │
└───────────────────────────▲────────────────────────────┘
                            │ REST API (JSON)
┌───────────────────────────▼────────────────────────────┐
│               EXPRESS BACKEND (Node.js)                │
│  - /api/cases             (Create & List Mysteries)    │
│  - /api/cases/:id         (Sanitized Case File)        │
│  - /api/cases/:id/clues   (Interactive Discovery)      │
│  - /api/cases/:id/hints   (Sequential Hint Unlocks)    │
│  - /api/cases/:id/accuse  (Authoritative Evaluation)   │
│  - /api/cases/:id/result  (Full Solution Revelation)   │
└─────────────▲───────────────────────────▲──────────────┘
              │                           │
┌─────────────▼─────────────┐ ┌───────────▼──────────────┐
│       GOOGLE GEMINI       │ │    MONGODB / MEMORY      │
│  - gemini-3.5-flash-lite  │ │  - Case & Player State   │
│  - Zod Schema Validation  │ │  - Quarantined Solution  │
│  - Offline Fallback Engine│ │  - Instant Dev Memory DB │
└───────────────────────────┘ └──────────────────────────┘
```

---

## 📁 Repository Structure

```
├── SPEC.md                      # Official formal system blueprint & design contracts
├── README.md                    # Project documentation & presentation
├── client/                      # React 19 + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Header HUD & audio controls
│   │   │   └── AccusationModal.jsx # Indictment & arrest warrant modal
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Hero, dossier presets & case archives
│   │   │   ├── CreateMystery.jsx# Case commission desk & AI loading screen
│   │   │   ├── InvestigationRoom.jsx # Interactive crime scene & clues
│   │   │   └── Results.jsx      # Stamp verdict, ledger & culprit reveal
│   │   ├── utils/
│   │   │   └── audio.js         # Web Audio API synthesizer
│   │   ├── App.jsx              # Application router
│   │   └── index.css            # Tailwind CSS styling & animations
│   ├── package.json
│   └── vite.config.js           # Vite dev proxy configuration
└── server/                      # Node.js + Express Backend
    ├── controllers/
    │   └── caseController.js    # Business logic, anti-cheat & scoring
    ├── data/
    │   └── fallbackCases.js     # Curated benchmark cases (Easy, Med, Hard)
    ├── models/
    │   └── Case.js              # Mongoose schema with quarantined solution
    ├── routes/
    │   └── caseRoutes.js        # REST API route definitions
    ├── services/
    │   └── geminiService.js     # Google GenAI model cascade & Zod parsing
    ├── utils/
    │   └── sanitizeCase.js      # Zero-leak data sanitizer
    ├── .env.example             # Environment variable templates
    └── server.js                # Express app entry & database connector
```

---

## 🎮 Game Rules & Scoring Matrix

| Difficulty Tier | Suspects | Clues | Hints | Base Accusation Score | Clue Reward | Hint Penalty |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Easy** | 3 | 5 | 2 | **100 pts** | +5 pts / clue | -10 pts / hint |
| **Medium** | 4 | 7 | 3 | **150 pts** | +5 pts / clue | -10 pts / hint |
| **Hard** | 5 | 9 | 3 | **200 pts** | +5 pts / clue | -10 pts / hint |

* **Final Score Formula**:  
  $$\text{Score} = \max\Big(0,\; (\text{Correct} \times \text{BaseScore}) + (5 \times \text{CluesFound}) - (10 \times \text{HintsUsed})\Big)$$
* Minimum score is capped at **0**.
* Submitting an incorrect accusation awards 0 base points, but credited clue discovery points remain intact.

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
* **Node.js** v18+ (tested on Node v26)
* **npm** v9+

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
```
Fill your credentials in `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai_mystery_room
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```
Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:5000
```
*(Note: If MongoDB is offline, the backend automatically switches to an in-memory database fallback so you can test immediately without setting up a local database!)*

### 3. Frontend Setup
In a new terminal window:
```bash
cd client
npm install
npm run dev
# Client will run on http://localhost:5173
```

Open **`http://localhost:5173`** in your browser to start investigating!

---

## 🌐 Production Deployment Guide

### Deploy Backend (Render / Railway)
1. Push this repository to GitHub.
2. Create a new Web Service on [Render](https://render.com/) or [Railway](https://railway.app/).
3. Set the Root Directory to `server`.
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Add Environment Variables:
   * `PORT=5000`
   * `MONGODB_URI` = your MongoDB Atlas connection URI
   * `GEMINI_API_KEY` = your Google Gemini API key
   * `CLIENT_URL` = your deployed Vercel frontend URL

### Deploy Frontend (Vercel)
1. Import repository into [Vercel](https://vercel.com/).
2. Set Root Directory to `client`.
3. Set Framework to `Vite`.
4. Under Build & Output Settings:
   * Build Command: `npm run build`
   * Output Directory: `dist`
5. Deploy!

---

## 📜 Official Deliverables & Submission
* **Detailed Specification Sheet**: [`SPEC.md`](SPEC.md)
* **Submission Form**: [NxtWave Form Link](https://bit.ly/ai-mystery-room-sub-form)

