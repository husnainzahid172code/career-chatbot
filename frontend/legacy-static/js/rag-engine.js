// RAG (Retrieval-Augmented Generation) Engine

class RAGEngine {
  constructor() {
    this.faqData = [];
    this.initialized = false;
  }

  /**
   * Initialize RAG engine with FAQ data
   */
  async init() {
    try {
      const response = await fetch('../data/faq.json');
      this.faqData = await response.json();
      this.initialized = true;
      console.log(`RAG Engine initialized with ${this.faqData.length} FAQ entries`);
    } catch (error) {
      console.error('Error loading FAQ data:', error);
      this.faqData = this.getDefaultFAQ();
      this.initialized = true;
    }
  }

  /**
   * Search FAQ by keywords
   */
  searchFAQ(query) {
    if (!query || query.trim().length < 2) return [];
    
    const queryWords = query.toLowerCase().split(/\s+/);
    const results = [];

    for (const faq of this.faqData) {
      const keywords = (faq.keywords || []).map(k => k.toLowerCase());
      const question = faq.question.toLowerCase();
      const answer = faq.answer.toLowerCase();
      
      let matchScore = 0;
      
      // Check keyword matches
      for (const word of queryWords) {
        if (keywords.some(k => k.includes(word))) matchScore += 3;
        if (question.includes(word)) matchScore += 2;
        if (answer.includes(word)) matchScore += 1;
      }
      
      if (matchScore > 0) {
        results.push({
          ...faq,
          matchScore
        });
      }
    }

    // Sort by match score
    return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  }

  /**
   * Get context from FAQ results
   */
  getContext(query) {
    const results = this.searchFAQ(query);
    
    if (results.length === 0) {
      return '';
    }

    let context = 'Based on knowledge base:';
    results.forEach((faq, index) => {
      context += `\n${index + 1}. Q: ${faq.question}\n   A: ${faq.answer}`;
    });
    
    return context;
  }

  /**
   * Build enhanced prompt with context
   */
  buildEnhancedPrompt(userQuery, context) {
    const systemPrompt = `You are a professional AI Career Assistant helping students and fresh graduates with internships, career growth, and skill development. 
Provide practical, actionable advice based on current industry standards.
Be encouraging, specific, and provide concrete examples when possible.
Format your response with clear sections and bullet points when appropriate.`;

    if (context) {
      return `${systemPrompt}\n\nREFERENCE INFORMATION:\n${context}\n\nUSER QUESTION: ${userQuery}`;
    }
    
    return `${systemPrompt}\n\nUSER QUESTION: ${userQuery}`;
  }

  /**
   * Default FAQ data
   */
  getDefaultFAQ() {
    return [
      {
        id: 1,
        keywords: ['cv', 'resume', 'format', 'structure', 'write'],
        question: 'How should I format my CV/Resume?',
        answer: 'Use a clean, professional format with clear sections: Contact Info, Professional Summary, Experience, Education, and Skills. Keep it to 1-2 pages, use consistent formatting, bullet points for achievements, and quantify your accomplishments.'
      },
      {
        id: 2,
        keywords: ['internship', 'apply', 'application', 'apply for internship'],
        question: 'How do I start looking for internships?',
        answer: 'Start by checking popular platforms like LinkedIn, Indeed, Internshala, and company career pages. Tailor your resume for each position, write a compelling cover letter, and apply 3-6 months in advance. Network with professionals in your field.'
      },
      {
        id: 3,
        keywords: ['interview', 'prepare', 'technical', 'behavioral'],
        question: 'How should I prepare for an interview?',
        answer: 'Research the company thoroughly, practice common questions using the STAR method, prepare examples of your achievements, and practice with a friend. Get a good night\'s rest, arrive early, maintain good eye contact, and ask thoughtful questions.'
      },
      {
        id: 4,
        keywords: ['linkedin', 'profile', 'optimize', 'update'],
        question: 'How can I optimize my LinkedIn profile?',
        answer: 'Use a professional headshot, write a compelling headline, create a detailed summary highlighting your skills and goals, add relevant experience and education, endorse your skills, and regularly share or comment on industry content.'
      },
      {
        id: 5,
        keywords: ['skills', 'develop', 'learn', 'improve'],
        question: 'What technical skills are most in-demand?',
        answer: 'In 2026, top skills include Python, JavaScript, Cloud Computing (AWS/Azure), Data Analysis, AI/ML, DevOps, React/Vue, and SQL. Also develop soft skills like communication, problem-solving, leadership, and teamwork.'
      },
      {
        id: 6,
        keywords: ['cover letter', 'write', 'application'],
        question: 'How do I write an effective cover letter?',
        answer: 'Personalize each letter to the company and role, highlight why you\'re interested in the position, showcase relevant achievements and skills, keep it concise (3-4 paragraphs), proofread carefully, and use a professional tone.'
      },
      {
        id: 7,
        keywords: ['career', 'path', 'roadmap', 'direction', 'planning'],
        question: 'How do I plan my career path?',
        answer: 'Define your short-term (1-2 years) and long-term (5-10 years) goals, identify required skills and experience, create an action plan with milestones, seek mentorship, network actively, and review your progress regularly.'
      },
      {
        id: 8,
        keywords: ['salary', 'negotiate', 'compensation', 'offer'],
        question: 'How do I negotiate a job offer?',
        answer: 'Research industry salary standards using sites like Glassdoor and Payscale, practice your pitch, be confident but flexible, ask for time to consider the offer, negotiate salary, benefits, and work arrangements, and get everything in writing.'
      },
      {
        id: 9,
        keywords: ['soft skills', 'communication', 'teamwork', 'leadership'],
        question: 'What soft skills should I develop?',
        answer: 'Key soft skills include: Communication, Critical Thinking, Problem-solving, Teamwork, Leadership, Time Management, Adaptability, and Emotional Intelligence. Practice these daily through projects, presentations, and team collaboration.'
      },
      {
        id: 10,
        keywords: ['freshman', 'beginner', 'first year', 'new', 'start'],
        question: 'As a freshman, how should I prepare for internships?',
        answer: 'Build a strong foundation in core subjects, develop basic programming skills if pursuing tech, contribute to open-source projects, join student organizations, attend tech meetups, and start building your LinkedIn profile early.'
      }
    ];
  }
}

// Initialize RAG Engine
const ragEngine = new RAGEngine();
