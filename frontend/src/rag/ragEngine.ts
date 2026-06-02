import type { FAQSchema, RAGHit } from "../types";

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[\u2019']/g, "'")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string) {
  const n = normalize(text);
  return new Set(n.split(" ").filter(Boolean));
}

export async function loadFAQ(): Promise<FAQSchema> {
  const res = await fetch("/data/faq.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load faq.json (${res.status})`);
  return (await res.json()) as FAQSchema;
}

export function findBestRAGHit(faq: FAQSchema, userQuery: string): RAGHit | null {
  const qNorm = normalize(userQuery);
  const qTokens = tokenize(userQuery);

  let best: { hit: RAGHit; score: number } | null = null;

  for (const item of faq) {
    for (const kwRaw of item.keywords ?? []) {
      const kw = normalize(kwRaw);
      if (!kw) continue;

      // Deterministic match rules:
      // - keyword token match (exact token)
      // - or keyword phrase substring match
      const kwTokens = kw.split(" ").filter(Boolean);
      const tokenMatch =
        kwTokens.length === 1 ? qTokens.has(kwTokens[0]) : kwTokens.every((t) => qTokens.has(t));
      const phraseMatch = qNorm.includes(kw);

      if (!tokenMatch && !phraseMatch) continue;

      const score = (phraseMatch ? 2 : 0) + kwTokens.length;
      const hit: RAGHit = { item, matchedKeyword: kwRaw };
      if (!best || score > best.score) best = { hit, score };
    }
  }

  return best?.hit ?? null;
}

export function buildGroundingBlock(hit: RAGHit) {
  return [
    "GROUNDING (local FAQ knowledge base):",
    `Matched keyword: ${hit.matchedKeyword}`,
    `FAQ question: ${hit.item.question}`,
    `FAQ answer: ${hit.item.answer}`
  ].join("\n");
}

