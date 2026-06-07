# CareerPilot AI

CareerPilot AI is a full-stack AI career assistant SaaS for students, fresh graduates, and job seekers. Features AI-powered chat, resume analysis, career roadmap generation, job matching, and an internship assistant — all in a clean, modern UI.

## Tech Stack

| Layer     | Technology                           |
| --------- | ------------------------------------ |
| Frontend  | React 18 + Vite + TypeScript + Tailwind |
| Backend   | Node.js + Express                    |
| AI        | Google Gemini API / OpenRouter        |
| Auth      | JWT (access + refresh tokens)        |
| Database  | MongoDB (via Mongoose)               |
| Deploy    | Vercel (frontend + serverless API)   |

## Features

- **Dashboard** — Overview with stat cards, active career path tracker, recommended opportunities
- **AI Chat** — Streaming chat powered by Gemini AI for career questions
- **Resume Analyzer** — Upload PDF/DOCX/TXT, get ATS score, keyword match, and improvement suggestions
- **Career Roadmap** — Generate personalized learning roadmaps by field and target role
- **Job Matcher** — Paste resume text, get ranked job matches with skill gap analysis
- **Internship Assistant** — Generate cover letters, interview questions, follow-up emails
- **Admin Panel** — Platform analytics (users, chats, reports, roadmaps)
- **Authentication** — Signup, login, forgot-password flow
- **Dark Mode** — Toggleable light/dark theme, persists to localStorage

## Color Palette

| Mode  | Background | Surface | Accent                 |
| ----- | ---------- | ------- | ---------------------- |
| Light | Cool grey `#F0F2F5` | White cards | Indigo / Emerald / Amber / Rose |
| Dark  | Navy `#0B1120` | Blue-grey `#131C2E` | Indigo / Emerald / Amber / Rose |

## Live Demo

Deployed on Vercel: [career-chatbot-main.vercel.app](https://career-chatbot-main.vercel.app)

## Run Locally

### Prerequisites
- Node.js >= 18
- MongoDB (optional — in-memory fallback for development)

### Setup

```bash
# 1. Clone and install
git clone https://github.com/husnainzahid172code/career-chatbot.git
cd career-chatbot
npm install
npm --prefix frontend install

# 2. Configure environment
cp .env.example .env
# Edit .env with your keys:
#   GEMINI_API_KEY    — Google Gemini API key
#   JWT_SECRET        — Random string for auth tokens
#   JWT_REFRESH_SECRET — Different random string
#   MONGODB_URI       — MongoDB connection string

# 3. Start both servers
npm run dev:server   # Backend on :3000
npm run dev:client   # Frontend on :5173
```

## Environment Variables

| Variable              | Required | Description                            |
| --------------------- | -------- | -------------------------------------- |
| `GEMINI_API_KEY`      | Yes      | Google Gemini API key                  |
| `JWT_SECRET`          | Yes      | Access token signing secret            |
| `JWT_REFRESH_SECRET`  | Yes      | Refresh token signing secret           |
| `MONGODB_URI`         | No       | MongoDB connection (in-memory fallback) |
| `PORT`                | No       | Backend port (default 3000)            |

## API Endpoints

| Method | Endpoint                          | Description               |
| ------ | --------------------------------- | ------------------------- |
| POST   | `/api/auth/signup`                | Create account            |
| POST   | `/api/auth/login`                 | Sign in                   |
| POST   | `/api/auth/forgot-password`       | Reset password            |
| POST   | `/api/ai/chat`                    | AI chat (streaming)       |
| POST   | `/api/ai/career-roadmap`          | Generate career roadmap   |
| POST   | `/api/ai/internship-assistant`    | Internship content        |
| POST   | `/api/upload/resume`              | Analyze resume            |
| GET    | `/api/admin/analytics`            | Platform stats (admin)    |
| POST   | `/api/matcher/match`              | Job-resume matching       |

## Project Structure

```
career-chatbot/
├── api/                    # Vercel serverless functions
│   ├── ai/                 # AI endpoints (chat, roadmap, internship)
│   └── lib/                # Shared AI utilities
├── backend/                # Express server
│   ├── config/             # DB config
│   ├── middleware/         # Auth, rate limiting, error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Route handlers
│   ├── services/           # Gemini service
│   └── utils/              # JWT tokens
├── frontend/               # React + Vite SPA
│   └── src/
│       ├── api/            # Axios client
│       ├── components/     # UI components & layout
│       ├── context/        # Auth & Theme providers
│       ├── gemini/         # Stream integration
│       ├── pages/          # All route pages
│       └── styles.css      # CSS variables & theme system
└── vercel.json             # Vercel deployment config
```

## Security

- All API keys are read from environment variables **only**
- `.env`, `.env.local`, `.env.production` excluded via `.gitignore`
- JWT secrets throw at startup if unconfigured (no hardcoded fallbacks)
- Rate limiting applied to auth and AI endpoints
- CORS restricted in production
