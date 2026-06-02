# Career & Internship Chatbot - Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Get API Key
Visit https://aistudio.google.com/app/apikey and create a free API key

### Step 2: Create .env File
```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_API_PROVIDER=gemini
```

### Step 3: Run Frontend
```bash
cd frontend
python -m http.server 8000
```

### Step 4: Open Browser
Go to `http://localhost:8000/index.html` and start chatting!

---

## 📁 File Structure

```
career-chatbot/
├── frontend/           # Web interface
│   ├── index.html      # Home page
│   ├── chatbot.html    # Chat interface
│   ├── css/            # Styling
│   ├── js/             # Chatbot logic
│   └── data/faq.json   # 30 FAQ entries
├── backend/            # Express server
│   └── server.js       # API endpoints
├── .env.example        # Config template
└── README.md           # Full documentation
```

---

## ⚙️ Configuration

### Google Gemini (Default)
```env
VITE_GEMINI_API_KEY=your_key
VITE_API_PROVIDER=gemini
```

### OpenAI (Alternative)
```env
VITE_OPENAI_API_KEY=your_key
VITE_API_PROVIDER=openai
```

---

## 🧪 Testing

Try these questions:
- "How should I prepare for an internship?"
- "What skills do I need for software engineering?"
- "How can I improve my CV?"
- "What's a good career roadmap?"
- "How do I prepare for interviews?"

---

## 🐛 Troubleshooting

**API Key Error:** Make sure `.env` file exists with correct key  
**Chat Not Working:** Check internet, verify API key has quota  
**Voice Not Working:** Use Chrome/Firefox, check microphone permissions  
**Module Error:** Use `python3 -m http.server 8000` or `npx http-server`

---

## 📚 Features

✅ 30+ Career FAQ entries  
✅ AI-powered responses (Gemini/OpenAI)  
✅ Light RAG system for better answers  
✅ Voice input support  
✅ Dark/Light mode  
✅ Chat history  
✅ Mobile responsive  
✅ Export conversations  

---

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
Connect GitHub repo and set environment variables

---

## 📞 Support

Check README.md for complete documentation and detailed troubleshooting.

**Enjoy! 🎉**