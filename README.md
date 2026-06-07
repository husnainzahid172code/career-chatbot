# CareerPilot AI

Full-stack AI career assistant SaaS. React + TypeScript frontend (Vite, Tailwind CSS, dark/light theme), Node.js/Express backend with JWT auth, MongoDB, and Google Gemini API integration. Features AI chat streaming, resume ATS analysis, career roadmap generation, job-skill matcher, and internship assistant. Deployed on Vercel with serverless API functions and SPA rewrites. Clean light/dark UI with CSS custom property theming and a dark blue + grey color palette.

## Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Frontend  | React 18 + Vite + TypeScript + Tailwind |
| Backend   | Node.js + Express                   |
| AI        | Google Gemini API / OpenRouter      |
| Auth      | JWT (access + refresh tokens)       |
| Database  | MongoDB (Mongoose)                  |
| Deploy    | Vercel (frontend + serverless API)  |

## Features

- AI chat streaming for career guidance
- Resume ATS analysis with keyword matching
- Personalized career roadmap generation
- Job-resume matcher with skill gap analysis
- Internship assistant (cover letters, interview prep)
- Admin analytics dashboard
- Toggleable dark/light theme (persisted)
- JWT auth with signup/login/forgot-password flow

## Live Demo

[career-chatbot-main.vercel.app](https://career-chatbot-main.vercel.app)

## Quick Start

```bash
git clone https://github.com/husnainzahid172code/career-chatbot.git
cd career-chatbot
npm install && npm --prefix frontend install
cp .env.example .env   # add GEMINI_API_KEY, JWT_SECRET, JWT_REFRESH_SECRET
npm run dev:server     # backend on :3000
npm run dev:client     # frontend on :5173
```

## Env Variables

| Variable             | Required | Description                     |
| -------------------- | -------- | ------------------------------- |
| `GEMINI_API_KEY`     | Yes      | Google Gemini API key           |
| `JWT_SECRET`         | Yes      | Access token signing secret     |
| `JWT_REFRESH_SECRET` | Yes      | Refresh token signing secret    |
| `MONGODB_URI`        | No       | MongoDB connection (memory fallback) |

## API Endpoints

| Method | Endpoint                       | Description            |
| ------ | ------------------------------ | ---------------------- |
| POST   | `/api/auth/signup`             | Create account         |
| POST   | `/api/auth/login`              | Sign in                |
| POST   | `/api/auth/forgot-password`    | Reset password         |
| POST   | `/api/ai/chat`                 | AI chat (streaming)    |
| POST   | `/api/ai/career-roadmap`       | Generate roadmap       |
| POST   | `/api/ai/internship-assistant` | Internship content     |
| POST   | `/api/upload/resume`           | Analyze resume         |
| GET    | `/api/admin/analytics`         | Platform stats         |
| POST   | `/api/matcher/match`           | Job-resume matching    |

## Security

- All API keys read from environment variables (never hardcoded)
- `.env`, `.env.*`, `.vercel/` excluded via `.gitignore`
- JWT secrets throw at startup if unconfigured
- Rate limiting on auth and AI endpoints
