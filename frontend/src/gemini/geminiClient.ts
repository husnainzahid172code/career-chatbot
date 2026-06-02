import { api } from "../api/client";

export type GeminiResponse = {
  text: string;
  chatId?: string;
  messageId?: string;
};

export async function askBackend(prompt: string, context = ""): Promise<GeminiResponse> {
  const { data } = await api.post("/ai/chat", { prompt, context });
  return data;
}
