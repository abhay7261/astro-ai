# 🕉️ AstroAI — Modern Vedic Astrology & AI Consultation Platform

> **A Full-Stack Production Vedic Astrology Mobile Web App built with Next.js 16, Node.js Express MVC, and MongoDB Atlas Cloud.**

---

## 🌟 Key Features

### 1. 🧙‍♂️ 24/7 Personal AI Vedic Astrologer (`/ai-chat`)
- Instant Vedic astrological consultations for **Shaadi (Marriage)**, **Career/Job**, **Dhan Labh (Wealth)**, and **Graha Dosh**.
- Tailored Vedic remedies (*Pandit Ji ke Achook Upay*) and authentic Sanskrit mantras (*Devguru Brihaspati, Surya, Shani Dev*).

### 2. 🌌 Royal Vedic Astrolabe & Cosmic Planetary Orbits
- Continuous 360° counter-rotating 12-Zodiac chakra wheel and sacred lotus petals.
- 3 concentric planetary orbits (Moon 🌙, Mercury 💫, Sun ☀️, Venus ✨, Jupiter 🪐, Mars 🔴) in live running animation.

### 3. 👨‍🏫 Verified Human Astrologer Directory (`/chat`)
- Directory of verified senior Acharyas with ratings, experience, languages, and specialties.
- Interactive consultation chat modal.

### 4. 💳 ₹4 VIP Pass Trial + 3-Day Free + ₹299/mo UPI Auto-Debit (`/vip-pass`)
- Pocket FM / Kuku FM subscription model: ₹4 upfront bank setup verification.
- 3-day full VIP access with live countdown timer.
- 1-click UPI Auto-Pay mandate authorization & cancellation.

### 5. 🎬 Astro Reels Feed (`/reels`)
- 100dvh vertical short video feed with double-tap like, comments drawer, and share toast.

### 6. 🔐 Master Admin Control Center (`/admin`)
- Protected by 4-digit Master Security Passcode (`7788`).
- **Astrologer Management**: Add, Delete, and Online/Offline toggle with live backend sync.
- **AI Bot Personas**: Manage, customize tone, or delete AI personas.
- **Subscription Rule Configurator**: Configure trial fees, trial days, and recurring amounts.
- **Push Broadcast Notifications**: Live broadcast sender to active users.

---

## 🏗️ Architecture & Tech Stack

```text
astro-ai/
├── astro-ai-frontend/       # Next.js 16 (App Router, Tailwind CSS, Lucide Icons)
└── astro-ai-backend/        # Node.js + Express (Clean MVC Architecture)
    ├── config/              # MongoDB Atlas, Mongoose, Payment config
    ├── controllers/         # AI, Astrologer, Subscription, Reel, User controllers
    ├── models/              # Data schemas & persistent storage
    ├── routes/              # Express REST API routes (/api/v1/*)
    └── server.js            # Master server with live request logger
```

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, Mongoose, CORS, Dotenv, Nodemon
- **Database**: MongoDB Atlas (Cloud AWS Mumbai) + Local Disk Fallback

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/astro-ai.git
cd astro-ai
```

### 2. Backend Setup
```bash
cd astro-ai-backend
npm install
npm run dev
```
*Backend runs on: `http://localhost:5000`*

### 3. Frontend Setup
```bash
cd ../astro-ai-frontend
npm install
npm run dev
```
*Frontend runs on: `http://localhost:3000`*

---

## 🔐 Credentials & Defaults

- **Master Admin Passcode**: `7788` (at `/admin`)
- **Default Database**: MongoDB Atlas Cloud (`astroai` DB)
- **API Status**: `http://localhost:5000/api/v1/database/status`

---

## 📄 License
ISC License © 2026 AstroAI Team.
