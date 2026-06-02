import { useCallback, useEffect, useMemo, useState } from "react";
import type { Message } from "../types";
import type { ChatSession } from "./types";
import { loadSessions, saveSessions } from "./storage";

function now() {
  return Date.now();
}

function newId() {
  return crypto.randomUUID();
}

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadSessions();
    setSessions(loaded);
    setActiveId(loaded[0]?.id ?? null);
  }, []);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const activeSession = useMemo(() => {
    if (!activeId) return null;
    return sessions.find((s) => s.id === activeId) ?? null;
  }, [activeId, sessions]);

  const createSession = useCallback((title = "New chat") => {
    const ts = now();
    const session: ChatSession = {
      id: newId(),
      title,
      createdAt: ts,
      updatedAt: ts,
      messages: []
    };
    setSessions((prev) => [session, ...prev]);
    setActiveId(session.id);
    return session.id;
  }, []);

  const selectSession = useCallback((id: string) => setActiveId(id), []);

  const renameSession = useCallback((id: string, title: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title, updatedAt: now() } : s))
    );
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      setActiveId((cur) => (cur === id ? next[0]?.id ?? null : cur));
      return next;
    });
  }, []);

  const clearAllSessions = useCallback(() => {
    setSessions([]);
    setActiveId(null);
  }, []);

  const upsertMessage = useCallback((sessionId: string, message: Message) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, updatedAt: now(), messages: [...s.messages, message] }
          : s
      )
    );
  }, []);

  const updateLastAssistant = useCallback((sessionId: string, newContent: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const idx = [...s.messages].reverse().findIndex((m) => m.role === "assistant");
        if (idx < 0) return s;
        const realIdx = s.messages.length - 1 - idx;
        const next = [...s.messages];
        next[realIdx] = { ...next[realIdx], content: newContent };
        return { ...s, updatedAt: now(), messages: next };
      })
    );
  }, []);

  return {
    sessions,
    activeId,
    activeSession,
    createSession,
    selectSession,
    renameSession,
    deleteSession,
    clearAllSessions,
    upsertMessage,
    updateLastAssistant
  };
}

