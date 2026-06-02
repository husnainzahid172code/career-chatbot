export type Role = "user" | "assistant" | "system";

export type Message = {
  id: string;
  role: Exclude<Role, "system">;
  content: string;
  createdAt: number;
};

export type FAQItem = {
  id: number;
  keywords: string[];
  question: string;
  answer: string;
};

export type FAQSchema = FAQItem[];

export type RAGHit = {
  item: FAQItem;
  matchedKeyword: string;
};

