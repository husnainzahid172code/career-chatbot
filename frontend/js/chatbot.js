// Main Chatbot Logic

class ChatBot {
  constructor() {
    this.messages = [];
    this.chatHistory = [];
    this.currentChatId = null;
    this.init();
  }

  init() {
    // Initialize RAG Engine
    ragEngine.init().then(() => {
      console.log('RAG Engine ready');
    });

    // Load messages
    this.loadMessages();
    this.loadChatHistory();
    this.setupEventListeners();
    this.initTheme();
  }

  setupEventListeners() {
    // Send button
    document.getElementById('sendBtn').addEventListener('click', () => this.handleSendMessage());

    // Input field
    document.getElementById('userInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSendMessage();
      }
    });

    // Voice button
    document.getElementById('voiceBtn').addEventListener('click', () => this.handleVoiceInput());

    // New chat button
    const newChatBtn = document.getElementById('newChatBtn');
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => this.startNewChat());
    }

    // Clear chat button
    const clearChatBtn = document.getElementById('clearChatBtn');
    if (clearChatBtn) {
      clearChatBtn.addEventListener('click', () => this.clearAllChats());
    }

    // Export chat button
    const exportChatBtn = document.getElementById('exportChatBtn');
    if (exportChatBtn) {
      exportChatBtn.addEventListener('click', () => this.exportChat());
    }

    // Quick prompts
    document.querySelectorAll('.quick-prompt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const prompt = e.target.dataset.prompt;
        document.getElementById('userInput').value = prompt;
        this.handleSendMessage();
      });
    });

    // Suggestion chips
    document.querySelectorAll('.suggestion-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const prompt = e.target.dataset.prompt;
        document.getElementById('userInput').value = prompt;
        this.handleSendMessage();
      });
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
      const newTheme = ThemeManager.toggle();
      document.getElementById('themeToggle').textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });

    // Mobile hamburger
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });
    }
  }

  async handleSendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();

    if (!message) {
      showToast('Please enter a message', 'error');
      return;
    }

    if (message.length > 1000) {
      showToast('Message too long (max 1000 characters)', 'error');
      return;
    }

    // Hide welcome screen
    const welcome = document.getElementById('chatWelcome');
    if (welcome) welcome.style.display = 'none';

    // Add user message
    this.addMessage(message, 'user');
    input.value = '';
    input.focus();

    // Show typing indicator
    document.getElementById('typingIndicator').style.display = 'flex';

    try {
      // Get AI response
      const response = await apiHandler.getResponse(message);
      
      // Hide typing indicator
      document.getElementById('typingIndicator').style.display = 'none';
      
      // Add bot message
      this.addMessage(response, 'bot');
      
      // Save to history
      this.saveToHistory();
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('typingIndicator').style.display = 'none';
      
      const errorMessage = error.message || 'Sorry, I encountered an error. Please try again.';
      this.addMessage(errorMessage, 'bot', true);
      
      showToast(errorMessage, 'error');
    }
  }

  handleVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      showToast('Voice input not supported in your browser', 'error');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.start();
    document.getElementById('voiceBtn').textContent = '🎤 Listening...';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      document.getElementById('userInput').value = transcript;
      document.getElementById('voiceBtn').textContent = '🎤';
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      document.getElementById('voiceBtn').textContent = '🎤';
      showToast('Voice input failed', 'error');
    };

    recognition.onend = () => {
      document.getElementById('voiceBtn').textContent = '🎤';
    };
  }

  addMessage(content, role = 'user', isError = false) {
    const message = {
      id: Date.now(),
      content: content,
      role: role,
      timestamp: new Date(),
      isError: isError
    };

    this.messages.push(message);
    this.renderMessage(message);
  }

  renderMessage(message) {
    const container = document.getElementById('messagesContainer');
    const messageEl = document.createElement('div');
    messageEl.className = `message ${message.role}`;
    messageEl.id = `msg-${message.id}`;

    const contentEl = document.createElement('div');
    contentEl.className = 'message-content';
    contentEl.textContent = message.content;

    const timeEl = document.createElement('div');
    timeEl.className = 'message-timestamp';
    timeEl.textContent = formatTime(message.timestamp);

    messageEl.appendChild(contentEl);
    messageEl.appendChild(timeEl);

    // Add copy button for bot messages
    if (message.role === 'bot') {
      const actionsEl = document.createElement('div');
      actionsEl.className = 'message-actions';
      
      const copyBtn = document.createElement('button');
      copyBtn.className = 'message-action-btn';
      copyBtn.textContent = '📋 Copy';
      copyBtn.addEventListener('click', () => copyToClipboard(message.content));
      
      actionsEl.appendChild(copyBtn);
      messageEl.appendChild(actionsEl);
    }

    container.appendChild(messageEl);
    container.scrollTop = container.scrollHeight;
  }

  startNewChat() {
    if (this.messages.length === 0) return;
    
    this.saveToHistory();
    this.messages = [];
    this.currentChatId = null;
    
    // Clear messages
    document.getElementById('messagesContainer').innerHTML = '';
    
    // Show welcome
    document.getElementById('chatWelcome').style.display = 'flex';
    
    showToast('New chat started', 'success');
  }

  saveToHistory() {
    if (this.messages.length === 0) return;

    const chatData = {
      id: this.currentChatId || Date.now(),
      title: this.messages[0]?.content.substring(0, 50) || 'Chat',
      messages: this.messages,
      timestamp: new Date(),
      preview: this.messages[this.messages.length - 1]?.content.substring(0, 30)
    };

    this.chatHistory.push(chatData);
    this.currentChatId = chatData.id;
    this.saveChatHistory();
    this.renderChatHistory();
  }

  clearAllChats() {
    if (confirm('Are you sure you want to clear all chats?')) {
      this.messages = [];
      this.chatHistory = [];
      this.currentChatId = null;
      
      LocalStorage.remove('chatHistory');
      LocalStorage.remove('currentMessages');
      
      document.getElementById('messagesContainer').innerHTML = '';
      document.getElementById('chatHistory').innerHTML = '';
      document.getElementById('chatWelcome').style.display = 'flex';
      
      showToast('All chats cleared', 'success');
    }
  }

  exportChat() {
    if (this.messages.length === 0) {
      showToast('No messages to export', 'error');
      return;
    }

    const exportData = this.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp
    }));

    exportAsJSON(exportData, `careerbot-chat-${Date.now()}.json`);
    showToast('Chat exported successfully', 'success');
  }

  loadMessages() {
    const saved = LocalStorage.get('currentMessages');
    if (saved) {
      this.messages = saved;
      this.messages.forEach(msg => this.renderMessage(msg));
    }
  }

  loadChatHistory() {
    const saved = LocalStorage.get('chatHistory');
    if (saved) {
      this.chatHistory = saved;
      this.renderChatHistory();
    }
  }

  saveChatHistory() {
    LocalStorage.set('chatHistory', this.chatHistory);
    LocalStorage.set('currentMessages', this.messages);
  }

  renderChatHistory() {
    const historyEl = document.getElementById('chatHistory');
    historyEl.innerHTML = '';

    this.chatHistory.slice(-5).reverse().forEach(chat => {
      const item = document.createElement('div');
      item.className = 'chat-history-item';
      item.title = chat.title;
      item.textContent = chat.title;
      item.addEventListener('click', () => this.loadChat(chat.id));
      historyEl.appendChild(item);
    });
  }

  loadChat(chatId) {
    const chat = this.chatHistory.find(c => c.id === chatId);
    if (chat) {
      this.messages = chat.messages;
      this.currentChatId = chatId;
      
      document.getElementById('messagesContainer').innerHTML = '';
      document.getElementById('chatWelcome').style.display = 'none';
      
      this.messages.forEach(msg => this.renderMessage(msg));
    }
  }

  initTheme() {
    ThemeManager.init();
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    document.getElementById('themeToggle').textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// Initialize ChatBot
let chatBot;
document.addEventListener('DOMContentLoaded', () => {
  chatBot = new ChatBot();
});
