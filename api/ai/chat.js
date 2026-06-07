import { searchKnowledge, formatKnowledgeContext } from "../lib/knowledge.js";
import { callOpenRouter } from "../lib/openrouter.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, context } = req.body || {};
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const relevant = searchKnowledge(prompt);
  const knowledge = formatKnowledgeContext(relevant, "career guidance");

  try {
    const text = await callOpenRouter([
      {
        role: "system",
        content: `You are a career advisor and study counselor AI assistant. Only answer questions related to careers, jobs, education, study skills, professional development, resume writing, interview preparation, skill-building, internships, and academic guidance. If a user asks about anything outside these topics, politely explain that you can only assist with career and study-related questions and decline to answer.

${knowledge ? `## Knowledge Base\nUse this information to provide accurate, specific guidance:\n${knowledge}\n` : ""}`,
      },
      {
        role: "user",
        content: `${context ? `${context}\n\n` : ""}${prompt}`,
      },
    ]);

    return res.json({ text });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({
      error: err.detail ? `API error (${status})` : err.message,
      detail: err.detail || "",
    });
  }
}
