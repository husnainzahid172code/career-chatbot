const KNOWLEDGE = [
  // ─── Software Engineering ──────────────────────────────────────
  {
    id: "sw-engineering",
    field: "Software Engineering",
    keywords: ["software engineer", "developer", "coding", "programming", "full stack", "frontend", "backend", "web dev", "software dev", "engineering", "swe"],
    topics: {
      skills: "Core: JavaScript/TypeScript, Python, Git, SQL, REST APIs, Docker, CI/CD. Frontend: React, Next.js, HTML/CSS, responsive design. Backend: Node.js, Express, databases (PostgreSQL, MongoDB), API design, authentication. Other: system design, testing, agile/scrum, cloud basics (AWS/GCP/Azure), data structures & algorithms.",
      certifications: "AWS Certified Developer, Google Cloud Engineer, Docker Certified, Meta Frontend Developer (Coursera), Microsoft Azure Developer, Professional Scrum Master.",
      learningPath: "1. Learn programming basics (Python/JS) → 2. Data structures & algorithms → 3. Build projects → 4. Learn a framework (React/Next.js) → 5. Database & API fundamentals → 6. Version control (Git) → 7. Deployment & cloud basics → 8. System design → 9. Contribute to open source → 10. Build portfolio.",
      careerProgression: "Junior (0-2 yrs) → Mid-level (2-5 yrs) → Senior (5-8 yrs) → Staff (8-12 yrs) → Principal (12+ yrs). Alternate paths: Engineering Manager, Solutions Architect, Developer Advocate, Technical Product Manager.",
      interviewTopics: "Data structures (arrays, trees, graphs, hash maps), algorithms (sorting, BFS/DFS, dynamic programming), system design (load balancing, caching, database sharding), behavioral (STAR method: Situation, Task, Action, Result), coding challenges on LeetCode/HackerRank.",
      salaryRange: "Entry $70-100k, Mid $100-150k, Senior $150-220k, Staff $220-350k. FAANG adds 30-50% premium.",
    },
  },
  {
    id: "data-science",
    field: "Data Science",
    keywords: ["data science", "data scientist", "machine learning", "ml", "ai", "artificial intelligence", "deep learning", "analytics", "statistics", "data analysis", "data mining"],
    topics: {
      skills: "Python (Pandas, NumPy, Scikit-learn), SQL, statistics & probability, machine learning algorithms, data visualization (Matplotlib, Seaborn, Tableau), deep learning (TensorFlow/PyTorch), feature engineering, model deployment, A/B testing, experimental design.",
      certifications: "AWS Certified Machine Learning, Google Professional Data Engineer, TensorFlow Developer Certificate, IBM Data Science Professional, Microsoft Azure Data Scientist.",
      learningPath: "1. Statistics & linear algebra → 2. Python for data analysis → 3. SQL → 4. Data visualization → 5. ML algorithms (supervised → unsupervised) → 6. Deep learning → 7. Feature engineering & model tuning → 8. Deployment (MLOps) → 9. Portfolio projects with real datasets → 10. Kaggle competitions.",
      careerProgression: "Junior Data Analyst → Data Scientist → Senior Data Scientist → Lead Data Scientist → Head of AI/ML. Alternate: ML Engineer, Data Engineer, Analytics Manager, AI Researcher.",
      interviewTopics: "Probability & statistics, SQL queries, ML algorithm explanations (bias-variance, overfitting), case studies (how to approach a business problem with data), coding (Python), behavioral questions, hypothesis testing, metric design.",
      salaryRange: "Entry $80-110k, Mid $110-160k, Senior $160-250k, Lead $250-380k.",
    },
  },
  {
    id: "product-design",
    field: "Product Design",
    keywords: ["product design", "ui ux", "ux design", "ui design", "user experience", "user interface", "figma", "design thinking", "visual design", "interaction design", "product designer"],
    topics: {
      skills: "Design thinking, user research, wireframing, prototyping (Figma, Sketch), visual design (color theory, typography, layout), interaction design, usability testing, design systems, responsive design, accessibility (WCAG), information architecture.",
      certifications: "Google UX Design Certificate, Interaction Design Foundation courses, Nielsen Norman Group UX Certification, Adobe Certified Professional, Figma Certification.",
      learningPath: "1. Design principles & color theory → 2. User research methods → 3. Wireframing & prototyping tools → 4. Visual design → 5. Interaction design → 6. Usability testing → 7. Design systems → 8. Portfolio building → 9. Case studies → 10. Design thinking certification.",
      careerProgression: "Junior Designer → Product Designer → Senior Designer → Lead Designer → Design Director / Head of Design. Alternate: UX Researcher, DesignOps, Content Designer, Design Manager.",
      interviewTopics: "Portfolio walkthrough (design process, decisions, impact), design challenges (whiteboarding), collaboration with engineers/product, user research methodology, design system thinking, behavioral questions.",
      salaryRange: "Entry $60-85k, Mid $85-130k, Senior $130-180k, Lead $180-250k.",
    },
  },
  {
    id: "devops",
    field: "DevOps / Cloud Engineering",
    keywords: ["devops", "cloud", "aws", "azure", "gcp", "infrastructure", "sre", "site reliability", "kubernetes", "docker", "ci/cd", "terraform", "linux", "platform engineering"],
    topics: {
      skills: "Linux/Unix administration, cloud platforms (AWS/GCP/Azure), containerization (Docker, Kubernetes), CI/CD pipelines (Jenkins, GitHub Actions), infrastructure as code (Terraform, Ansible), monitoring (Prometheus, Grafana), scripting (Bash, Python), networking, security best practices, GitOps.",
      certifications: "AWS Solutions Architect, Google Cloud Engineer, Certified Kubernetes Administrator (CKA), Terraform Associate, Linux Foundation Certified System Administrator, Azure DevOps Engineer.",
      learningPath: "1. Linux fundamentals → 2. Networking basics → 3. Scripting (Bash/Python) → 4. Cloud platform fundamentals → 5. Containerization (Docker) → 6. Orchestration (Kubernetes) → 7. CI/CD → 8. Infrastructure as Code → 9. Monitoring & logging → 10. Security & compliance.",
      careerProgression: "Junior DevOps Engineer → DevOps Engineer → Senior DevOps → Lead DevOps → Platform Architect. Alternate: SRE, Cloud Architect, Security Engineer, DevSecOps Engineer.",
      interviewTopics: "Linux troubleshooting, Kubernetes architecture, CI/CD pipeline design, incident response, scaling strategies, cost optimization, security best practices, system design for reliability.",
      salaryRange: "Entry $75-100k, Mid $100-150k, Senior $150-200k, Lead $200-280k.",
    },
  },
  {
    id: "marketing",
    field: "Digital Marketing",
    keywords: ["marketing", "digital marketing", "seo", "sem", "social media", "content marketing", "growth marketing", "ppc", "analytics", "brand management", "product marketing"],
    topics: {
      skills: "SEO/SEM, Google Analytics, content strategy, social media management, email marketing, PPC advertising, A/B testing, marketing automation (HubSpot, Marketo), data analysis, copywriting, CRM tools, conversion rate optimization.",
      certifications: "Google Digital Marketing & E-commerce, HubSpot Inbound Marketing, Facebook Blueprint, Google Analytics Certification, SEMrush SEO Certification, Hootsuite Social Media Marketing.",
      learningPath: "1. Marketing fundamentals → 2. Content creation & copywriting → 3. SEO basics → 4. Social media marketing → 5. Analytics & data interpretation → 6. Paid advertising (PPC/SEM) → 7. Email marketing → 8. Marketing automation → 9. Growth strategy → 10. Specialize (growth/ brand/ product marketing).",
      careerProgression: "Marketing Coordinator → Marketing Specialist → Marketing Manager → Senior Manager → Director of Marketing → VP of Marketing / CMO. Alternate: Growth Marketer, Brand Manager, Digital Strategist, Content Strategist.",
      interviewTopics: "Campaign strategy & execution, metrics & KPIs (ROI, CAC, LTV), A/B testing methodology, audience targeting, budget management, tools proficiency, case studies of past campaigns.",
      salaryRange: "Entry $45-65k, Mid $65-95k, Senior $95-140k, Director $140-200k+.",
    },
  },
  {
    id: "cybersecurity",
    field: "Cybersecurity",
    keywords: ["cybersecurity", "security", "infosec", "information security", "penetration testing", "ethical hacking", "network security", "security analyst", "soc", "cissp", "security engineer"],
    topics: {
      skills: "Network security, operating system security, cryptography, penetration testing, vulnerability assessment, SIEM tools, incident response, security policies & compliance, risk management, forensics, cloud security.",
      certifications: "CompTIA Security+, CISSP, CEH (Certified Ethical Hacker), OSCP, CISM, AWS Security Specialty, Google Professional Cloud Security Engineer, SANS GIAC.",
      learningPath: "1. Networking & OS fundamentals → 2. Security+ certification → 3. Linux security → 4. Scripting (Python/Bash) → 5. Network security → 6. Ethical hacking / penetration testing → 7. SIEM & SOC tools → 8. Cloud security → 9. Compliance & governance → 10. Specialize (appsec, cloud sec, forensics).",
      careerProgression: "Security Analyst → Security Engineer → Senior Security Engineer → Security Architect → CISO. Alternate: Penetration Tester, SOC Manager, Security Consultant, Compliance Officer.",
      interviewTopics: "Threat modeling, incident response process, security tooling knowledge, risk assessment, compliance frameworks (NIST, ISO 27001), network segmentation, authentication protocols.",
      salaryRange: "Entry $70-95k, Mid $95-140k, Senior $140-200k, Architect $180-280k.",
    },
  },
  {
    id: "product-management",
    field: "Product Management",
    keywords: ["product management", "product manager", "pm", "product owner", "technical product manager", "growth product manager", "product strategy", "roadmap planning"],
    topics: {
      skills: "Product strategy, roadmap planning, user research, A/B testing, data analysis, stakeholder management, agile/lean methodologies, wireframing & prototyping, OKR/KPI tracking, competitive analysis, go-to-market strategy, technical fluency.",
      certifications: "Product School Product Manager Certification, Pragmatic Institute Certification, Scrum Product Owner (CSPO), Google Project Management Certificate, Reforge Product Management.",
      learningPath: "1. Understand business & technology fundamentals → 2. Learn user research methods → 3. Data analysis skills (SQL, Excel) → 4. Agile & Scrum → 5. Product strategy & vision → 6. Roadmap prioritization → 7. A/B testing & experimentation → 8. Stakeholder management → 9. Domain expertise → 10. Leadership & mentoring.",
      careerProgression: "Associate PM → Product Manager → Senior PM → Group PM / Director → VP of Product → CPO. Alternate: Technical PM, Growth PM, Platform PM, Product Operations.",
      interviewTopics: "Product sense (design a product for X), strategy (how to grow Y), execution (metrics, A/B testing, prioritization), leadership & influence, behavioral (STAR), analytical (SQL cases).",
      salaryRange: "Entry $80-110k, Mid $110-160k, Senior $160-220k, Director $220-350k.",
    },
  },
  // ─── General Career Topics ─────────────────────────────────────
  {
    id: "resume-writing",
    field: "Resume Writing",
    keywords: ["resume", "cv", "curriculum vitae", "cover letter", "ats", "applicant tracking", "resume tips", "resume format", "resume builder"],
    topics: {
      skills: "ATS-friendly formatting, action verbs, quantifiable achievements, keyword optimization, one-page standard, professional summary writing, skills section optimization, experience description best practices.",
      certifications: "",
      learningPath: "1. Choose clean ATS-friendly template → 2. Write strong summary → 3. List experience with action verbs + metrics → 4. Optimize skills section for keywords → 5. Education & certifications → 6. Proofread → 7. Save as PDF → 8. Tailor for each application.",
      careerProgression: "",
      interviewTopics: "",
      salaryRange: "",
      tips: "Use action verbs (Led, Built, Optimized, Designed, Implemented). Quantify achievements (Reduced costs by 20%). Keep to 1 page (<10 yrs exp) or 2 pages (10+ yrs). Use reverse chronological order. Include relevant keywords from job description. Save as PDF not Word. Avoid photos, graphics, or tables (confuses ATS)."
    },
  },
  {
    id: "interview-prep",
    field: "Interview Preparation",
    keywords: ["interview", "interview prep", "interview questions", "job interview", "behavioral", "technical interview", "star method", "interview tips"],
    topics: {
      skills: "STAR method (Situation, Task, Action, Result), company research, behavioral question preparation, technical question practice, mock interviews, asking good questions, follow-up etiquette, salary negotiation basics.",
      certifications: "",
      learningPath: "1. Research company & role → 2. Review common questions → 3. Prepare STAR stories → 4. Practice technical skills (if applicable) → 5. Mock interviews → 6. Prepare questions to ask → 7. Plan logistics (attire, arrival time, materials) → 8. Send thank-you follow-up.",
      careerProgression: "",
      interviewTopics: "STAR method: Situation (context), Task (your goal), Action (what you did), Result (outcome). Prepare 5-7 stories covering: leadership, failure, conflict, success, teamwork, innovation, challenges. Technical interviews: practice LeetCode/system design. Always prepare 3-5 questions to ask the interviewer.",
      salaryRange: "",
    },
  },
  {
    id: "internship-general",
    field: "Internship Tips",
    keywords: ["internship", "intern", "summer internship", "co-op", "internship application", "internship tips", "internship advice", "internship preparation"],
    topics: {
      skills: "Application strategy, networking, resume tailoring, interview preparation for internships, making the most of your internship, converting internship to full-time, building professional relationships, seeking mentorship.",
      certifications: "",
      learningPath: "1. Identify target companies & roles → 2. Tailor resume & cover letter → 3. Network on LinkedIn → 4. Apply early (Aug-Oct for summer) → 5. Prepare for interviews → 6. Accept offer → 7. Prepare before starting → 8. Set goals for internship → 9. Build relationships → 10. Seek feedback & convert to full-time.",
      careerProgression: "",
      interviewTopics: "",
      salaryRange: "",
      tips: "Start applying early (3-6 months before). Leverage university career centers. Network with alumni on LinkedIn. Tailor each application. Prepare a portfolio of projects. During internship: ask questions, take notes, volunteer for work, network with teams. At end: ask about full-time conversion, request recommendation letters.",
    },
  },
];

function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
}

function scoreRelevance(query, entry) {
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return 0;
  let score = 0;
  const entryText = `${entry.field} ${entry.keywords.join(" ")} ${Object.values(entry.topics).join(" ")}`.toLowerCase();
  for (const qt of queryTokens) {
    const qtLen = qt.length;
    if (qtLen < 3) continue;
    if (entryText.includes(qt)) {
      score += qtLen > 5 ? 3 : 1;
    }
    for (const kw of entry.keywords) {
      if (kw.includes(qt) || qt.includes(kw)) {
        score += 2;
      }
    }
  }
  const fieldTokens = tokenize(entry.field);
  const matchCount = fieldTokens.filter((t) => queryTokens.includes(t)).length;
  if (matchCount === fieldTokens.length && fieldTokens.length > 0) score += 5;
  return score;
}

export function searchKnowledge(query) {
  const scored = KNOWLEDGE
    .map((entry) => ({ entry, score: scoreRelevance(query, entry) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.entry);
}

export function formatKnowledgeContext(entries, userGoal) {
  if (!entries || !entries.length) return "";
  const title = userGoal ? `Relevant information for: ${userGoal}` : "Career Knowledge Base";
  return entries
    .map(
      (e) =>
        `[${e.field}]\n` +
        Object.entries(e.topics)
          .filter(([k, v]) => v && k !== "salaryRange")
          .map(([k, v]) => `${k.replace(/([A-Z])/g, " $1").trim()}: ${v}`)
          .join("\n")
    )
    .join("\n\n");
}
