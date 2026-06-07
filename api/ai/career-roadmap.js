import { searchKnowledge, formatKnowledgeContext } from "../lib/knowledge.js";
import { callOpenRouter } from "../lib/openrouter.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { field, skillLevel, desiredRole } = req.body || {};
  if (!field || !field.trim()) {
    return res.status(400).json({ error: "Field is required" });
  }

  const query = `${field} ${skillLevel || ""} ${desiredRole || ""}`;
  const relevant = searchKnowledge(query);
  const knowledge = formatKnowledgeContext(relevant, field);

  try {
    const text = await callOpenRouter([
      {
        role: "system",
        content: `You are a senior career advisor creating personalized career roadmaps. Use the knowledge base below to provide accurate, specific guidance. Only answer career/study related questions.

${knowledge ? `## Knowledge Base\n${knowledge}\n\n` : ""}Generate a detailed career roadmap in this format:

## Career Roadmap: ${desiredRole || field}

### Overview
Brief description of the role and what it entails.

### Required Skills
Technical and soft skills needed, organized by priority.

### Recommended Certifications
Relevant certifications with brief descriptions.

### 6-Month Learning Plan
Month 1-2: Foundations
Month 3-4: Intermediate skills
Month 5-6: Advanced topics & projects

### Portfolio Projects
2-3 project ideas with descriptions.

### Career Progression Path
Entry → Mid → Senior → Lead levels with timelines.

### Interview Preparation Tips
Key topics to study and practice.`,
      },
      {
        role: "user",
        content: `Create a career roadmap for someone interested in "${field}" with current skill level "${skillLevel || "Beginner"}" aiming for "${desiredRole || field}". Be specific and actionable.`,
      },
    ], { temperature: 0.7, maxTokens: 2048 });

    return res.json({ roadmap: text });
  } catch (err) {
    const status = err.status || 500;
    const message = err.detail ? `OpenRouter API error (${status})` : err.message;
    return res.status(status).json({ error: message, detail: err.detail || "" });
  }
}
