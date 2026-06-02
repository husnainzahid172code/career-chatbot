import type { ChatSession, SessionGroup } from "./types";

function startOfDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function groupSessions(sessions: ChatSession[]): SessionGroup[] {
  const now = Date.now();
  const today = startOfDay(now);
  const yesterday = today - 24 * 60 * 60 * 1000;

  const byUpdated = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  const groups: SessionGroup[] = [
    { label: "Today", sessions: [] },
    { label: "Yesterday", sessions: [] },
    { label: "Older Sessions", sessions: [] }
  ];

  for (const s of byUpdated) {
    const day = startOfDay(s.updatedAt);
    if (day >= today) groups[0].sessions.push(s);
    else if (day >= yesterday) groups[1].sessions.push(s);
    else groups[2].sessions.push(s);
  }

  return groups.filter((g) => g.sessions.length > 0);
}

