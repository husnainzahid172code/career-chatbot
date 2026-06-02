# CareerPilot AI

CareerPilot AI is a modern SaaS-style Career & Internship Assistant for students, fresh graduates, and job seekers.

## Stack
- Frontend: React + Vite + Tailwind
- Backend: Node.js + Express
- AI: Google Gemini API
- Auth: JWT (extensible to Firebase/Auth providers)
- Database: MongoDB-ready connection layer

## Implemented Platform Modules
- Landing page and SaaS dashboard shell with sidebar navigation
- Authentication flow: signup, login, forgot-password endpoint, protected routes
- AI chat API integration through backend proxy
- Resume/document upload (PDF/DOCX/TXT validation) and analysis endpoint
- Career roadmap generation endpoint
- Internship assistant endpoint
- Rate limiting middleware and API error handling
- Local RAG-ready frontend resources preserved from previous implementation

## Run Locally
1. Install dependencies:
   - `npm install`
   - `npm --prefix frontend install`
2. Configure env:
   - Copy `.env.example` to `.env`
   - Add `GEMINI_API_KEY`, `JWT_SECRET`, and optional `MONGODB_URI`
3. Start services:
   - Backend: `npm run dev:server`
   - Frontend: `npm run dev:client`

## Env Variables
Use `.env` (never commit real keys):

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
PORT=3000
JWT_SECRET=replace_with_a_secure_secret
MONGODB_URI=mongodb://127.0.0.1:27017/careerpilot_ai
GEMINI_API_KEY=replace_with_your_real_key
```

## API Endpoints
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/ai/chat`
- `POST /api/ai/career-roadmap`
- `POST /api/ai/internship-assistant`
- `POST /api/upload/resume`

## Notes
- The previous static website is preserved in `frontend/legacy-static/`.
- Current auth storage is in-memory for development bootstrap; replace with persistent DB models in production.