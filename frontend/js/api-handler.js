// API Handler for Gemini and OpenAI

class APIHandler {
  constructor() {
    this.apiProvider = 'gemini'; // 'gemini' or 'openai'
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.rateLimit = 0;
    this.rateLimitMax = 10;
  }

  /**
   * Send message to Gemini API
   */
  async sendToGemini(prompt) {
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to .env file');
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.geminiApiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      }
      
      throw new Error('Invalid response format from Gemini API');
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  /**
   * Send message to OpenAI API
   */
  async sendToOpenAI(prompt) {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to .env file');
    }

    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      }
      
      throw new Error('Invalid response format from OpenAI API');
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  /**
   * Main method to get AI response
   */
  async getResponse(userMessage) {
    // Check rate limiting
    if (this.rateLimit >= this.rateLimitMax) {
      throw new Error('Rate limit exceeded. Please wait before sending another message.');
    }

    // Get context from RAG
    const ragContext = ragEngine.getContext(userMessage);
    const enhancedPrompt = ragEngine.buildEnhancedPrompt(userMessage, ragContext);

    this.rateLimit++;

    try {
      if (this.apiProvider === 'openai') {
        return await this.sendToOpenAI(enhancedPrompt);
      } else {
        return await this.sendToGemini(enhancedPrompt);
      }
    } catch (error) {
      this.rateLimit--; // Decrement on error
      throw error;
    }
  }

  /**
   * Reset rate limit (could be called on timer)
   */
  resetRateLimit() {
    this.rateLimit = 0;
  }
}

// Initialize API Handler
const apiHandler = new APIHandler();
