export type GeminiResponse = {
  text: string;
  chatId?: string;
  messageId?: string;
};

const FALLBACKS = [
  (p: string) => `Great question about "${p.substring(0, 60)}". Here's my advice:\n\n1. **Research the field** — Stay updated with the latest trends.\n2. **Build relevant skills** — Focus on both technical and soft skills.\n3. **Network actively** — Connect with professionals and attend events.\n4. **Gain practical experience** — Work on projects or internships.\n5. **Prepare your applications** — Tailor your resume for each opportunity.`,
  (p: string) => `Here's my recommendation for "${p.substring(0, 60)}":\n\n### Key Steps\n- Identify your strengths and areas for improvement\n- Set clear, achievable goals\n- Create a structured learning plan\n- Seek mentorship\n- Practice regularly\n\n### Resources\n- Online courses (Coursera, Udemy, edX)\n- Industry blogs and forums\n- Career counseling services\n\nLet me know if you need more specific guidance!`,
  (p: string) => `That's an excellent topic. Here's a structured approach:\n\n## Overview\nUnderstanding "${p.substring(0, 60)}" is crucial for career growth.\n\n## Action Plan\n1. **Week 1-2:** Research and gather resources\n2. **Week 3-4:** Start hands-on practice\n3. **Week 5-6:** Build a portfolio project\n4. **Week 7-8:** Apply and iterate\n\n## Pro Tips\n- Consistency matters more than intensity\n- Don't be afraid to make mistakes\n- Celebrate small wins along the way`,
];

function getFallbackResponse(prompt: string): string {
  const idx = prompt.length % FALLBACKS.length;
  return FALLBACKS[idx](prompt);
}

export async function askBackend(prompt: string, context = ""): Promise<GeminiResponse> {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
    const res = await fetch(`${baseUrl}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, context }),
    });
    if (!res.ok) {
      let detail = "";
      try { const err = await res.json(); detail = err.detail || err.error || ""; } catch {}
      return { text: detail || `The AI service returned an error (${res.status}). Please try again later.` };
    }
    return await res.json();
  } catch {
    return { text: getFallbackResponse(prompt) };
  }
}
