# Career & Internship Chatbot 🎓💼

An AI-powered career guidance chatbot designed for university students and fresh graduates. Built with modern web technologies and featuring Light RAG (Retrieval-Augmented Generation) for intelligent, context-aware responses.

## 🌟 Features

### Core Features
- **Modern Chat Interface**: ChatGPT-style UI with smooth animations and responsive design
- **AI-Powered Responses**: Integration with Google Gemini API for intelligent guidance
- **Light RAG System**: JSON-based FAQ knowledge base with keyword matching for context retrieval
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Voice Support**: Speech-to-text for hands-free input

### Career Guidance Capabilities
- CV/Resume optimization tips
- Internship preparation guidance
- Career roadmap planning
- Skill development recommendations
- Interview preparation strategies
- LinkedIn profile optimization
- Technical and soft skills guidance
- Career path recommendations

### Smart Features
- Suggested prompts and quick questions
- Chat history persistence
- Copy response button
- Enter-to-send functionality
- Clear chat option
- Typing animations
- Auto-scroll for new messages
- Loading spinner feedback

## 📁 Project Structure

```
career-chatbot/
├── frontend/
│   ├── index.html
│   ├── chatbot.html
│   ├── about.html
│   ├── resources.html
│   ├── css/
│   │   ├── styles.css
│   │   ├── chatbot.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── main.js
│   │   ├── chatbot.js
│   │   ├── rag-engine.js
│   │   ├── api-handler.js
│   │   └── utils.js
│   └── data/
│       └── faq.json
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── routes/
│   │   ├── chat.js
│   │   └── rag.js
│   ├── controllers/
│   │   ├── chatController.js
│   │   └── ragController.js
│   ├── services/
│   │   ├── geminiService.js
│   │   └── ragService.js
│   ├── utils/
│   │   ├── errorHandler.js
│   │   └── validators.js
│   └── data/
│       └── faq.json
├── .env.example
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- Modern web browser
- Google Gemini API key (free)

### Setup

1. **Get API Key**: Visit https://aistudio.google.com/app/apikey
2. **Create .env file**: Copy `.env.example` and add your API key
3. **Run Frontend**: `python -m http.server 8000` (or use Live Server)
4. **Access**: http://localhost:8000/frontend/index.html

## 🔧 Configuration

### Environment Variables (.env)
```
VITE_GEMINI_API_KEY=your_key_here
VITE_GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
PORT=3000
NODE_ENV=development
```

## 📚 Key Components

### Frontend
- **index.html**: Landing page with hero section
- **chatbot.html**: Main chat interface
- **about.html**: About page
- **resources.html**: Career resources
- **CSS**: Modern styling with dark/light mode
- **JavaScript**: Chat logic, RAG engine, API integration

### Backend
- **server.js**: Express server
- **Routes**: Chat and RAG endpoints
- **Services**: Gemini API integration
- **Data**: FAQ knowledge base

### RAG System
- Keyword-based context retrieval
- FAQ matching algorithm
- Context injection into prompts
- Fallback mechanisms

## 🎨 Design Features

- Glassmorphism UI with modern aesthetics
- Dark/Light mode toggle
- Responsive mobile design
- Smooth animations
- Career-themed styling
- Professional typography

## 🔐 Security

- API keys in .env only
- Input validation
- Error handling
- CORS configuration
- Rate limiting

## 📖 Learning Topics

- HTML5, CSS3, JavaScript
- AI API integration
- RAG concepts
- Prompt engineering
- Responsive design
- Backend with Express
- Deployment strategies

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
- Connect GitHub repo
- Set environment variables
- Auto-deploy on push

## 📝 FAQ Dataset

30+ entries covering:
- CV/Resume tips
- Internship process
- Career paths
- Interview prep
- LinkedIn optimization
- Soft skills
- Technical roadmaps

## 🐛 Troubleshooting

**API Key Error**: Check `.env` file
**CORS Error**: Use backend server or proxy
**Chat Not Responding**: Check internet and API quota
**FAQ Not Matching**: Add more keywords to FAQ entries

## 📄 License

MIT License - Open source and free to use

## 👨‍💻 Created by

**Husnain Zahid** - @husnainzahid172code

---
**Status**: Production Ready ✅
**Version**: 1.0.0
**Last Updated**: June 2026