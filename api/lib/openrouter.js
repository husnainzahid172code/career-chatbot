export async function callOpenRouter(messages, options = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("API key not configured");

  const model = options.model || "openai/gpt-4o-mini";
  const timeoutMs = options.timeout || 15000;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      signal: controller.signal,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://career-chatbot-main.vercel.app",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens || 2048,
      }),
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const error = await response.text();
      const err = new Error(`API error (${response.status})`);
      err.status = response.status;
      err.detail = error;
      throw err;
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || "";
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}
