import { createGeminiClient } from "../gemini/geminiClient";

export async function generateChatTitle(firstUserMessage: string): Promise<string> {
  const client = createGeminiClient();
  const model = client.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "You generate short chat titles. Return ONLY a 3-5 word title, no quotes, no punctuation at the end."
  });

  const res = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: `Create a title for this request:\n\n${firstUserMessage}` }]
      }
    ]
  });

  const text = res.response.text().trim();
  return text.split("\n")[0].replace(/^["']|["']$/g, "").trim().slice(0, 64) || "New chat";
}

