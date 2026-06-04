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

const JOB_DB = [
  {
    title: "Frontend Developer",
    company: "TechCorp",
    description: "Build and maintain modern web applications using React, TypeScript, and Tailwind CSS. Collaborate with UX designers and backend engineers.",
    requiredSkills: ["react", "typescript", "html", "css", "javascript", "git", "rest api"]
  },
  {
    title: "Backend Engineer",
    company: "DataFlow Inc",
    description: "Design and implement scalable REST APIs and microservices. Work with Node.js, Express, PostgreSQL, and Docker.",
    requiredSkills: ["node.js", "express", "sql", "postgresql", "docker", "rest api", "git"]
  },
  {
    title: "Full Stack Developer",
    company: "StartupLab",
    description: "End-to-end development of SaaS platform. React frontend, Node.js backend, MongoDB, and AWS deployment.",
    requiredSkills: ["react", "node.js", "mongodb", "aws", "javascript", "git", "rest api"]
  },
  {
    title: "Data Scientist",
    company: "InsightAI",
    description: "Apply machine learning to solve business problems. Build predictive models, analyze datasets, and deploy ML pipelines.",
    requiredSkills: ["python", "machine learning", "data analysis", "pandas", "numpy", "scikit-learn", "sql"]
  },
  {
    title: "ML Engineer",
    company: "NeuralTech",
    description: "Design and deploy production ML systems. Deep learning, NLP, model optimization, and MLOps.",
    requiredSkills: ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "docker", "kubernetes"]
  },
  {
    title: "DevOps Engineer",
    company: "CloudScale",
    description: "Manage cloud infrastructure, CI/CD pipelines, and container orchestration. Automate deployment and monitoring.",
    requiredSkills: ["aws", "docker", "kubernetes", "jenkins", "linux", "terraform", "ci/cd"]
  },
  {
    title: "Data Analyst",
    company: "MarketPulse",
    description: "Analyze business data to generate insights. Create dashboards, reports, and data visualizations for stakeholders.",
    requiredSkills: ["sql", "python", "data analysis", "data visualization", "tableau", "excel", "pandas"]
  },
  {
    title: "Product Manager",
    company: "InnovateCo",
    description: "Define product vision, roadmap, and strategy. Work with engineering, design, and marketing teams to deliver value.",
    requiredSkills: ["project management", "product management", "leadership", "communication", "agile", "scrum"]
  },
  {
    title: "UI/UX Designer",
    company: "DesignStudio",
    description: "Create intuitive user interfaces and experiences. Wireframing, prototyping, user research, and visual design.",
    requiredSkills: ["figma", "adobe xd", "photoshop", "illustrator", "html", "css"]
  },
  {
    title: "Mobile Developer",
    company: "AppWorks",
    description: "Develop cross-platform mobile applications using React Native. Integrate with backend APIs and app stores.",
    requiredSkills: ["react", "javascript", "typescript", "rest api", "git", "css", "html"]
  }
];

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s+#.]/g, " ").replace(/\s+/g, " ").trim();
}

export function extractSkills(text) {
  const normalized = normalize(text);
  const found = [];
  for (const skill of SKILL_DB) {
    const pattern = skill.replace(/[.+]/g, "\\$&");
    const regex = new RegExp(`\\b${pattern}\\b`, "i");
    if (regex.test(normalized)) found.push(skill);
  }
  return [...new Set(found)];
}

export function scoreMatch(resumeSkills, jobRequiredSkills) {
  const resumeSet = new Set(resumeSkills.map((s) => s.toLowerCase()));
  const matched = jobRequiredSkills.filter((s) => resumeSet.has(s.toLowerCase()));
  const missing = jobRequiredSkills.filter((s) => !resumeSet.has(s.toLowerCase()));
  const score = jobRequiredSkills.length > 0 ? Math.round((matched.length / jobRequiredSkills.length) * 100) : 0;
  return { score, matched, missing };
}

export function rankJobs(resumeText) {
  const resumeSkills = extractSkills(resumeText);
  const results = JOB_DB.map((job, index) => {
    const { score, matched, missing } = scoreMatch(resumeSkills, job.requiredSkills);
    return { jobIndex: index, job, score, matchedSkills: matched, missingSkills: missing };
  });
  results.sort((a, b) => b.score - a.score);
  return { resumeSkills, results };
}

export function getSampleJobs() {
  return JOB_DB.map((j, i) => ({ ...j, id: i }));
}
