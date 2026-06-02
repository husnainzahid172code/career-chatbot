const BASE_URL =
  process.env.GEMINI_API_URL ||
  process.env.VITE_GEMINI_API_URL ||
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function askGemini(prompt, context = "") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY — set it in .env or server environment");

  const body = {
    contents: [
      {
        parts: [
          {
            text: `${context ? `${context}\n\n` : ""}${prompt}`
          }
        ]
      }
    ]
  };

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": apiKey
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p) => p?.text).join("") ||
    "I could not generate a response right now.";
  return text;
}

export async function* askGeminiChunked(prompt, context = "") {
  const text = await askGemini(prompt, context);
  const parts = text.split(/(\s+)/).filter(Boolean);
  for (const p of parts) {
    yield p;
  }
}
