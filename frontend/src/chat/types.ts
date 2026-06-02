import type { Message } from "../types";

export type ChatSession = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
};

export type SessionGroup = {
  label: "Today" | "Yesterday" | "Older Sessions";
  sessions: ChatSession[];
};

