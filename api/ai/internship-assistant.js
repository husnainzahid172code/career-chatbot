import { searchKnowledge, formatKnowledgeContext } from "../lib/knowledge.js";
import { callOpenRouter } from "../lib/openrouter.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { goal } = req.body || {};
  if (!goal || !goal.trim()) {
    return res.status(400).json({ error: "Goal is required" });
  }

  const relevant = searchKnowledge(goal);
  const knowledge = formatKnowledgeContext(relevant, goal);

  try {
    const text = await callOpenRouter([
      {
        role: "system",
        content: `You are an internship preparation expert helping students and graduates land great internships. Use the knowledge base below to provide accurate, specific guidance. Only answer career/study related questions.

${knowledge ? `## Knowledge Base\n${knowledge}\n\n` : ""}Generate a comprehensive response based on the user's request. Include specific, actionable advice. Format with clear sections using markdown.`,
      },
      {
        role: "user",
        content: goal,
      },
    ], { temperature: 0.7, maxTokens: 2048 });

    return res.json({ response: text });
  } catch (err) {
    const status = err.status || 500;
    const message = err.detail ? `OpenRouter API error (${status})` : err.message;
    return res.status(status).json({ error: message, detail: err.detail || "" });
  }
}
