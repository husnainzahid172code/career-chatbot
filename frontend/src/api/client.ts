import axios, { AxiosResponse } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const USERS_KEY = "careerpilot.users";
const REPORTS_KEY = "careerpilot.reports";
const ROADMAPS_KEY = "careerpilot.roadmaps";
const AI_CHATS_KEY = "careerpilot.aiChats";
const FAVORITES_KEY = "careerpilot.favorites";

// ─── Generic localStorage helpers ────────────────────────────────

function getStore<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}
function setStore(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

let idCounter = Date.now();
function nextId() { return (++idCounter).toString(36); }

// ─── Mock response builder ──────────────────────────────────────

function mockResponse<T>(data: T, status = 200) {
  return Promise.resolve({ data, status, statusText: "OK", headers: {}, config: {} as any, __isMock: true } as any);
}
function mockError(status: number, message: string): Promise<never> {
  const err = new Error(message);
  (err as any).response = { status, data: { message } };
  return Promise.reject(err);
}

// ─── Mock JWT helpers ───────────────────────────────────────────

const ACCESS_TTL = 15 * 60 * 1000;
const REFRESH_TTL = 30 * 24 * 60 * 60 * 1000;

function signMock(payload: Record<string, unknown>, ttl: number): string {
  const hdr = btoa(JSON.stringify({ alg: "mock", typ: "JWT" }));
  const body = btoa(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + ttl }));
  return `${hdr}.${body}.${btoa("mock-signature")}`;
}
function decodeMock(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch { return null; }
}

async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(password));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── Auth helpers ────────────────────────────────────────────────

type StoredUser = { id: string; name: string; email: string; password: string; role: "user" | "admin"; refreshTokenVersion: number };
function getUsers() { return getStore<StoredUser[]>(USERS_KEY, []); }
function saveUsers(u: StoredUser[]) { setStore(USERS_KEY, u); }
function signAccessToken(u: StoredUser) { return signMock({ sub: u.id, email: u.email, name: u.name, role: u.role }, ACCESS_TTL); }
function signRefreshToken(u: StoredUser) { return signMock({ sub: u.id, v: u.refreshTokenVersion }, REFRESH_TTL); }
function getUserFromToken(headers: Record<string, any>): StoredUser | null {
  const auth = headers?.Authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  const p = decodeMock(token);
  if (!p?.sub) return null;
  return getUsers().find((u) => u.id === p.sub) || null;
}

// ─── Mock auth handler ──────────────────────────────────────────

async function handleMockAuth(config: any): Promise<AxiosResponse> {
  const url = config.url as string;
  const method = (config.method || "get").toLowerCase();
  const body = config.data ? (typeof config.data === "string" ? JSON.parse(config.data) : config.data) : {};

  // GET /auth/me
  if (method === "get" && url === "/auth/me") {
    const user = getUserFromToken(config.headers);
    if (!user) return mockError(401, "Unauthorized");
    return mockResponse({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  }

  // POST /auth/signup
  if (method === "post" && url === "/auth/signup") {
    const { name, email, password } = body;
    if (!name || !email || !password) return mockError(400, "Name, email, and password required");
    const users = getUsers();
    if (users.find((u) => u.email === email.toLowerCase())) return mockError(409, "Email already registered");
    const pwHash = await hashPassword(password);
    const newUser: StoredUser = { id: nextId(), name, email: email.toLowerCase(), password: pwHash, role: "user", refreshTokenVersion: 0 };
    users.push(newUser);
    saveUsers(users);
    return mockResponse({ accessToken: signAccessToken(newUser), refreshToken: signRefreshToken(newUser), user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } });
  }

  // POST /auth/login
  if (method === "post" && url === "/auth/login") {
    const { email, password } = body;
    if (!email || !password) return mockError(400, "Email and password required");
    const user = getUsers().find((u) => u.email === email.toLowerCase());
    if (!user) return mockError(401, "Invalid credentials");
    if (user.password !== await hashPassword(password)) return mockError(401, "Invalid credentials");
    return mockResponse({ accessToken: signAccessToken(user), refreshToken: signRefreshToken(user), user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  }

  // POST /auth/refresh
  if (method === "post" && url === "/auth/refresh") {
    const { refreshToken } = body;
    if (!refreshToken) return mockError(400, "Missing refresh token");
    const p = decodeMock(refreshToken);
    if (!p) return mockError(401, "Invalid refresh token");
    const user = getUsers().find((u) => u.id === p.sub);
    if (!user || user.refreshTokenVersion !== p.v) return mockError(401, "Invalid refresh token");
    return mockResponse({ accessToken: signAccessToken(user), refreshToken: signRefreshToken(user), user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  }

  // POST /auth/logout
  if (method === "post" && url === "/auth/logout") {
    const user = getUserFromToken(config.headers);
    if (user) { const users = getUsers(); const idx = users.findIndex((u) => u.id === user.id); if (idx !== -1) { users[idx].refreshTokenVersion++; saveUsers(users); } }
    return mockResponse({ message: "Logged out" });
  }

  // POST /auth/forgot-password
  if (method === "post" && url === "/auth/forgot-password") {
    return mockResponse({ message: "If this email exists, a reset link has been sent." });
  }

  return mockError(404, "Not found");
}

// ─── Mock data handler for all other endpoints ──────────────────

async function handleMockData(config: any): Promise<AxiosResponse> {
  const url = config.url as string;
  const method = (config.method || "get").toLowerCase();
  const body = config.data ? (typeof config.data === "string" ? JSON.parse(config.data) : config.data) : {};

  // ── Admin Analytics ──
  if (method === "get" && url === "/admin/analytics") {
    const chats = getStore<any[]>(AI_CHATS_KEY, []);
    const reports = getStore<any[]>(REPORTS_KEY, []);
    const roadmaps = getStore<any[]>(ROADMAPS_KEY, []);
    const favorites = getStore<any[]>(FAVORITES_KEY, []);
    return mockResponse({
      cards: { users: getUsers().length, chats: chats.length, messages: chats.reduce((s, c) => s + (c.messageCount || 0), 0), reports: reports.length, roadmaps: roadmaps.length }
    });
  }

  // ── AI Chats ──
  if (url === "/ai/chats") {
    if (method === "get") {
      const all = getStore<any[]>(AI_CHATS_KEY, []).map((c) => ({ _id: c.id, title: c.title, createdAt: c.createdAt }));
      return mockResponse({ items: all });
    }
    if (method === "post") {
      const chats = getStore<any[]>(AI_CHATS_KEY, []);
      const newChat = { id: nextId(), title: body.title || "New Chat", createdAt: Date.now(), messageCount: 0 };
      chats.push(newChat);
      setStore(AI_CHATS_KEY, chats);
      return mockResponse({ chat: { _id: newChat.id, title: newChat.title } });
    }
  }

  // /ai/chats/:id/messages
  const chatMsgMatch = url.match(/^\/ai\/chats\/([^/]+)\/messages$/);
  if (chatMsgMatch) {
    const chatId = chatMsgMatch[1];
    if (method === "get") {
      const all = getStore<any[]>(`careerpilot.aiMessages_${chatId}`, []);
      return mockResponse({ messages: all });
    }
  }

  // DELETE /ai/messages/:id
  const msgDelMatch = url.match(/^\/ai\/messages\/([^/]+)$/);
  if (msgDelMatch && method === "delete") {
    const msgId = msgDelMatch[1];
    return mockResponse({ message: "Deleted" });
  }

  // ── Upload / Resume ──
  if (url === "/upload/reports") {
    if (method === "get") {
      const all = getStore<any[]>(REPORTS_KEY, []);
      const limit = parseInt(String(config.params?.limit || all.length), 10);
      return mockResponse({ items: all.slice(0, limit) });
    }
  }

  const reportMatch = url.match(/^\/upload\/reports\/([^/]+)\/download$/);
  if (reportMatch && method === "get") {
    return mockResponse({ message: "Download not available in offline mode. File data stored locally." });
  }

  if (method === "post" && url === "/upload/resume") {
    const storedUser = getUserFromToken(config.headers);
    const fileName = body?.file?.name || `resume_${Date.now()}.pdf`;
    const analysis = {
      _id: nextId(),
      userId: storedUser?.id,
      atsScore: Math.floor(Math.random() * 30) + 65,
      fileName,
      uploadedAt: new Date().toISOString(),
      summary: "Resume analysis completed. Your resume has good structure but could benefit from more quantifiable achievements.",
      strengths: ["Clear work history", "Relevant education", "Good keyword density for target roles"],
      improvements: ["Add more quantifiable metrics", "Include a professional summary", "Tailor skills section to job description"],
      keywordMatch: Math.floor(Math.random() * 40) + 50,
      formatScore: Math.floor(Math.random() * 20) + 75,
    };
    const reports = getStore<any[]>(REPORTS_KEY, []);
    reports.unshift(analysis);
    setStore(REPORTS_KEY, reports);
    return mockResponse(analysis);
  }

  // ── AI Chat (proxy endpoint) ──
  if (method === "post" && url === "/ai/chat") {
    const { prompt = "" } = body;
    const responses = [
      `Great question about "${prompt.substring(0, 60)}". Here's my advice:\n\n1. **Research the field** — Stay updated with the latest trends and technologies.\n2. **Build relevant skills** — Focus on both technical and soft skills.\n3. **Network actively** — Connect with professionals on LinkedIn and attend industry events.\n4. **Gain practical experience** — Work on projects, internships, or open-source contributions.\n5. **Prepare your applications** — Tailor your resume and cover letter for each opportunity.\n\nWould you like me to elaborate on any of these points?`,
      `Here's what I recommend for "${prompt.substring(0, 60)}":\n\n### Key Steps\n- Start by identifying your strengths and areas for improvement\n- Set clear, achievable short-term and long-term goals\n- Create a structured learning plan with milestones\n- Seek mentorship from experienced professionals\n- Practice regularly and track your progress\n\n### Resources\n- Online courses (Coursera, Udemy, edX)\n- Industry blogs and publications\n- Professional communities and forums\n- Career counseling services\n\nLet me know if you need more specific guidance!`,
      `That's an excellent topic. Here's a structured approach:\n\n## Overview\nUnderstanding "${prompt.substring(0, 60)}" is crucial for career growth.\n\n## Action Plan\n1. **Week 1-2:** Research and gather resources\n2. **Week 3-4:** Start hands-on practice\n3. **Week 5-6:** Build a portfolio project\n4. **Week 7-8:** Apply and iterate\n\n## Pro Tips\n- Consistency matters more than intensity\n- Don't be afraid to make mistakes — they're learning opportunities\n- Find a study group or accountability partner\n- Celebrate small wins along the way\n\nWhat aspect would you like to explore further?`
    ];
    const idx = prompt.length % responses.length;
    return mockResponse({ text: responses[idx], chatId: nextId(), messageId: nextId() });
  }

  // ── Roadmaps ──
  if (url === "/ai/roadmaps") {
    if (method === "get") {
      const all = getStore<any[]>(ROADMAPS_KEY, []);
      return mockResponse({ items: all });
    }
  }

  if (method === "post" && url === "/ai/career-roadmap") {
    const { field = "your field", skillLevel = "Beginner", desiredRole = "your target role" } = body;
    const roadmap = generateRoadmap(field, skillLevel, desiredRole);
    const entry = { _id: nextId(), field, skillLevel, desiredRole, content: roadmap, createdAt: new Date().toISOString() };
    const roadmaps = getStore<any[]>(ROADMAPS_KEY, []);
    roadmaps.unshift(entry);
    setStore(ROADMAPS_KEY, roadmaps);
    return mockResponse({ roadmap });
  }

  // ── Internship Assistant ──
  if (method === "post" && url === "/ai/internship-assistant") {
    const { goal = "" } = body;
    return mockResponse({ response: generateInternshipResponse(goal) });
  }

  // ── Favorites ──
  if (url.startsWith("/favorites")) {
    if (method === "get") {
      const all = getStore<any[]>(FAVORITES_KEY, []);
      const limit = parseInt(String(config.params?.limit || all.length), 10);
      return mockResponse({ total: all.length, items: all.slice(0, limit) });
    }
  }

  // ── Job Matcher ──
  if (method === "get" && url === "/matcher/jobs") {
    return mockResponse({ jobs: getSampleJobs() });
  }

  if (method === "post" && url === "/matcher/match") {
    const { resumeText = "" } = body;
    const { resumeSkills, results } = runJobMatch(resumeText);
    return mockResponse({ resumeSkills, matches: results });
  }

  if (method === "post" && url === "/matcher/extract-skills") {
    const { text = "" } = body;
    const skills = extractSkillsFromText(text);
    return mockResponse({ skills });
  }

  // ── Generic catch for any REST-like pattern (count endpoints) ──
  // Handle /ai/chats?limit=1 style requests for overview counts
  if (method === "get") {
    if (url === "/ai/chats" || url.startsWith("/ai/chats?")) {
      const all = getStore<any[]>(AI_CHATS_KEY, []);
      return mockResponse({ total: all.length, items: all });
    }
    if (url === "/ai/roadmaps" || url.startsWith("/ai/roadmaps?")) {
      const all = getStore<any[]>(ROADMAPS_KEY, []);
      return mockResponse({ total: all.length, items: all });
    }
    if (url === "/upload/reports" || url.startsWith("/upload/reports?")) {
      const all = getStore<any[]>(REPORTS_KEY, []);
      return mockResponse({ total: all.length, items: all });
    }
  }

  return mockError(404, `Endpoint not found: ${method.toUpperCase()} ${url}`);
}

// ─── Template generators ────────────────────────────────────────

function generateRoadmap(field: string, skillLevel: string, desiredRole: string): string {
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const idx = levels.indexOf(skillLevel) >= 0 ? levels.indexOf(skillLevel) : 1;
  const phases = [
    `📘 Phase 1: Foundations (${idx <= 0 ? "Now - 3 months" : "Review & Strengthen"})`,
    `  ▸ Master core concepts in ${field}`,
    `  ▸ Complete introductory courses/certifications`,
    `  ▸ Build your first portfolio project`,
    `  ▸ Join relevant communities and forums`,
    ``,
    `📗 Phase 2: Skill Development (${idx <= 1 ? "3-8 months" : "1-3 months"})`,
    `  ▸ Deep-dive into advanced ${field} topics`,
    `  ▸ Contribute to open-source projects`,
    `  ▸ Build 2-3 substantial portfolio projects`,
    `  ▸ Network with professionals in ${desiredRole} roles`,
    ``,
    `📕 Phase 3: Career Preparation (${idx <= 1 ? "8-12 months" : "3-6 months"})`,
    `  ▸ Tailor resume for ${desiredRole} positions`,
    `  ▸ Practice technical and behavioral interviews`,
    `  ▸ Apply for internships and entry-level positions`,
    `  ▸ Prepare for ${desiredRole}-specific certifications`,
    ``,
    `🎯 Target Role: ${desiredRole}`,
    `📊 Current Level: ${skillLevel}`,
    `💡 Suggested Learning Path:`,
    `  • Online courses (Coursera, Udemy, edX)`,
    `  • Practice platforms (LeetCode, HackerRank)`,
    `  • Portfolio projects with real-world impact`,
    `  • Mentorship and networking`,
  ].join("\n");
  return phases;
}

function generateInternshipResponse(goal: string): string {
  const sections = [
    `📋 INTERNSHIP PREPARATION PLAN`,
    ``,
    `🎯 Based on your goal: "${goal.substring(0, 80)}${goal.length > 80 ? "..." : ""}"`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `📄 COVER LETTER TEMPLATE`,
    ``,
    `Dear Hiring Manager,`,
    ``,
    `I am writing to express my enthusiastic interest in the internship position at your organization. As a student deeply passionate about this field, I have been following your company's innovative work with great admiration.`,
    ``,
    `Through my academic projects and self-directed learning, I have developed strong skills that align perfectly with this role. I am eager to bring my dedication, fresh perspective, and willingness to learn to your team.`,
    ``,
    `Thank you for considering my application. I look forward to the opportunity to contribute to your organization's success.`,
    ``,
    `Best regards`,
    `[Your Name]`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `❓ COMMON INTERVIEW QUESTIONS`,
    ``,
    `1. "Tell me about yourself"`,
    `   → Structure: Present → Past → Future. Start with your current situation, highlight relevant past experiences, and connect to why you're interested in this role.`,
    ``,
    `2. "Why do you want this internship?"`,
    `   → Research the company beforehand. Mention specific projects, values, or technologies they use that excite you.`,
    ``,
    `3. "Describe a challenge you overcame"`,
    `   → Use the STAR method: Situation, Task, Action, Result. Be specific about your contribution.`,
    ``,
    `4. "Where do you see yourself in 5 years?"`,
    `   → Show ambition but connect it to the skills you'll gain from this internship.`,
    ``,
    `5. "Do you have any questions for us?"`,
    `   → Always say yes. Ask about team culture, mentorship, technologies used, or recent projects.`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `📧 HR EMAIL TEMPLATE (Follow-up)`,
    ``,
    `Subject: Follow-up on Internship Application`,
    ``,
    `Dear [Hiring Manager Name],`,
    ``,
    `I hope this message finds you well. I recently applied for the internship position and wanted to express my continued interest in the role. I am very enthusiastic about the opportunity to contribute to your team.`,
    ``,
    `Please let me know if there are any additional materials I can provide to support my application.`,
    ``,
    `Thank you for your time and consideration.`,
    ``,
    `Best regards,`,
    `[Your Name]`,
    `[Your Contact Information]`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `💡 MOCK INTERVIEW PROMPTS (Practice with a friend)`,
    ``,
    `1. Technical Screen: "Walk me through a recent project you worked on. What technologies did you use and what challenges did you face?"`,
    ``,
    `2. Behavioral: "Tell me about a time you worked in a team to achieve a difficult goal."`,
    ``,
    `3. Problem-Solving: "How would you approach learning a new technology or tool for a project?"`,
    ``,
    `4. Company Fit: "What do you know about our company and why do you want to work here specifically?"`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `✅ ACTION ITEMS`,
    `  ☐ Research target companies (5-10)`,
    `  ☐ Tailor resume for each application`,
    `  ☐ Prepare 2-3 portfolio projects`,
    `  ☐ Practice interviews with a friend`,
    `  ☐ Set up LinkedIn profile`,
    `  ☐ Apply to at least 3 internships per week`,
  ].join("\n");
  return sections;
}

// ─── Job Matcher helpers ────────────────────────────────────────

const SKILL_DB = [
  "javascript", "typescript", "python", "java", "c++", "c#", "ruby", "go", "rust", "swift",
  "react", "angular", "vue", "node.js", "express", "django", "flask", "spring", "laravel",
  "sql", "mongodb", "postgresql", "mysql", "redis", "elasticsearch",
  "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ci/cd", "jenkins",
  "machine learning", "deep learning", "nlp", "computer vision", "tensorflow", "pytorch",
  "data analysis", "data visualization", "pandas", "numpy", "scikit-learn", "tableau", "power bi",
  "git", "linux", "rest api", "graphql", "microservices", "agile", "scrum",
  "html", "css", "sass", "tailwind", "bootstrap", "webpack", "vite",
  "jest", "mocha", "cypress", "selenium", "junit", "pytest",
  "figma", "adobe xd", "photoshop", "illustrator",
  "project management", "product management", "leadership", "communication", "teamwork"
];

const SAMPLE_JOBS = [
  { title: "Frontend Developer", company: "TechCorp", description: "Build and maintain modern web applications using React, TypeScript, and Tailwind CSS.", requiredSkills: ["react", "typescript", "html", "css", "javascript", "git", "rest api"] },
  { title: "Backend Engineer", company: "DataFlow Inc", description: "Design and implement scalable REST APIs and microservices with Node.js, Express, PostgreSQL.", requiredSkills: ["node.js", "express", "sql", "postgresql", "docker", "rest api", "git"] },
  { title: "Full Stack Developer", company: "StartupLab", description: "End-to-end SaaS development. React frontend, Node.js backend, MongoDB, AWS.", requiredSkills: ["react", "node.js", "mongodb", "aws", "javascript", "git", "rest api"] },
  { title: "Data Scientist", company: "InsightAI", description: "Apply ML to business problems. Build predictive models, analyze datasets, deploy pipelines.", requiredSkills: ["python", "machine learning", "data analysis", "pandas", "numpy", "scikit-learn", "sql"] },
  { title: "ML Engineer", company: "NeuralTech", description: "Design and deploy production ML systems. Deep learning, NLP, model optimization, MLOps.", requiredSkills: ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "docker", "kubernetes"] },
  { title: "DevOps Engineer", company: "CloudScale", description: "Manage cloud infra, CI/CD pipelines, container orchestration, automated deployment.", requiredSkills: ["aws", "docker", "kubernetes", "jenkins", "linux", "terraform", "ci/cd"] },
  { title: "Data Analyst", company: "MarketPulse", description: "Analyze business data for insights. Create dashboards, reports, visualizations.", requiredSkills: ["sql", "python", "data analysis", "data visualization", "tableau", "excel", "pandas"] },
  { title: "Product Manager", company: "InnovateCo", description: "Define product vision, roadmap, strategy. Work with engineering, design, marketing.", requiredSkills: ["project management", "product management", "leadership", "communication", "agile", "scrum"] },
  { title: "UI/UX Designer", company: "DesignStudio", description: "Create intuitive interfaces and experiences. Wireframing, prototyping, user research.", requiredSkills: ["figma", "adobe xd", "photoshop", "illustrator", "html", "css"] },
  { title: "Mobile Developer", company: "AppWorks", description: "Cross-platform mobile apps with React Native. Backend API integration, app store deployment.", requiredSkills: ["react", "javascript", "typescript", "rest api", "git", "css", "html"] },
];

function getSampleJobs() { return SAMPLE_JOBS.map((j, i) => ({ ...j, id: i })); }

function extractSkillsFromText(text: string): string[] {
  const norm = text.toLowerCase().replace(/[^a-z0-9\s+#.]/g, " ").replace(/\s+/g, " ").trim();
  const found = SKILL_DB.filter((skill) => {
    const pattern = skill.replace(/[.+]/g, "\\$&");
    return new RegExp(`\\b${pattern}\\b`, "i").test(norm);
  });
  return [...new Set(found)];
}

function runJobMatch(resumeText: string) {
  const resumeSkills = extractSkillsFromText(resumeText);
  const results = SAMPLE_JOBS.map((job, index) => {
    const matched = job.requiredSkills.filter((s) => resumeSkills.some((rs) => rs.toLowerCase() === s.toLowerCase()));
    const missing = job.requiredSkills.filter((s) => !resumeSkills.some((rs) => rs.toLowerCase() === s.toLowerCase()));
    const score = job.requiredSkills.length > 0 ? Math.round((matched.length / job.requiredSkills.length) * 100) : 0;
    return { jobIndex: index, job, score, matchedSkills: matched, missingSkills: missing };
  });
  results.sort((a, b) => b.score - a.score);
  return { resumeSkills, results };
}

// ─── Axios instance ─────────────────────────────────────────────

export const api = axios.create({ baseURL: BASE_URL });

let refreshing: Promise<string | null> | null = null;

function getAccessToken() { return localStorage.getItem("careerpilot.accessToken"); }

api.interceptors.request.use(async (config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Mock adapter — intercepts ALL routes and handles locally
api.interceptors.request.use(async (config) => {
  if (config.url?.startsWith("/auth/")) {
    const response = await handleMockAuth(config);
    throw response;
  }
  // For all other routes, try the mock handler first
  const response = await handleMockData(config);
  throw response;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error?.__isMock) return error;
    const original = error.config;
    if (!original) return Promise.reject(error);
    const status = error?.response?.status;
    if (status !== 401 || original?._retry) return Promise.reject(error);
    original._retry = true;
    if (!refreshing) {
      refreshing = (async () => {
        const rt = localStorage.getItem("careerpilot.refreshToken");
        if (!rt) return null;
        try {
          const { data } = await api.post("/auth/refresh", { refreshToken: rt });
          localStorage.setItem("careerpilot.accessToken", data.accessToken);
          localStorage.setItem("careerpilot.refreshToken", data.refreshToken);
          localStorage.setItem("careerpilot.user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("careerpilot:auth"));
          return data.accessToken;
        } catch {
          localStorage.removeItem("careerpilot.accessToken");
          localStorage.removeItem("careerpilot.refreshToken");
          localStorage.removeItem("careerpilot.user");
          window.dispatchEvent(new Event("careerpilot:auth"));
          return null;
        } finally { refreshing = null; }
      })();
    }
    const newToken = await refreshing;
    if (newToken) { original.headers.Authorization = `Bearer ${newToken}`; return api(original); }
    return Promise.reject(error);
  }
);
