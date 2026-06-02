import { useCallback, useEffect, useRef, useState } from "react";
import { useGeminiStream } from "../../gemini/useGeminiStream";
import { MarkdownMessage } from "../../chat/components/MarkdownMessage";
import { FiSend, FiRotateCcw, FiCopy, FiCheck, FiTrash2, FiPlus } from "react-icons/fi";

type ChatMsg = { id: string; role: "user" | "assistant"; content: string };

function newId() { return crypto.randomUUID(); }

const STORAGE_KEY = "careerpilot.chatMessages";
const WELCOME = "Welcome to CareerPilot AI. Ask me about careers, internships, resume tips, or interview prep!";

function loadMessages(): ChatMsg[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function saveMessages(msgs: ChatMsg[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMsg[]>(() => {
    const saved = loadMessages();
    return saved.length ? saved : [{ id: "welcome", role: "assistant", content: WELCOME }];
  });
  const [prompt, setPrompt] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { state, send, stop } = useGeminiStream();
  const isStreaming = state.status === "streaming";

  useEffect(() => { saveMessages(messages); }, [messages]);

  useEffect(() => {
    if (autoScroll) wrapRef.current?.scrollTo({ top: wrapRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, autoScroll]);

  const sendMessage = useCallback(async (input: string) => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setPrompt("");
    const userMsg: ChatMsg = { id: newId(), role: "user", content: text };
    const assistantMsg: ChatMsg = { id: newId(), role: "assistant", content: "" };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);

    try {
      let acc = "";
      await send({
        messages: [],
        userText: text,
        onToken: (delta) => {
          acc += delta;
          setMessages((prev) => {
            const next = [...prev];
            const idx = next.length - 1;
            if (next[idx]?.role === "assistant") next[idx] = { ...next[idx], content: acc };
            return next;
          });
        },
      });
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === "assistant" && !last.content) {
          next[next.length - 1] = { ...last, content: "Sorry, I couldn't generate a response. Please try again." };
        }
        return next;
      });
    }
  }, [send, isStreaming]);

  async function copyContent(content: string, id: string) {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 1500);
  }

  function deleteMessage(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  function clearChat() {
    setMessages([{ id: "welcome", role: "assistant", content: WELCOME }]);
    localStorage.removeItem(STORAGE_KEY);
  }

  function regenerate() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      setMessages((prev) => prev.filter((m) => m.id !== prev[prev.length - 1]?.id));
      sendMessage(lastUser.content);
    }
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Career Chat</h2>
        <div className="flex gap-2">
          {messages.length > 1 && (
            <button onClick={clearChat} className="flex items-center gap-1.5 rounded-lg border border-subtle px-3 py-1.5 text-xs text-secondary hover:bg-card hover:text-primary transition">
              <FiTrash2 className="text-xs" /> Clear
            </button>
          )}
          {messages.length > 1 && (
            <button onClick={regenerate} disabled={isStreaming} className="flex items-center gap-1.5 rounded-lg border border-subtle px-3 py-1.5 text-xs text-secondary hover:bg-card hover:text-primary transition disabled:opacity-40">
              <FiRotateCcw className="text-xs" /> Regenerate
            </button>
          )}
        </div>
      </div>

      <div
        ref={wrapRef}
        className="flex-1 space-y-4 overflow-auto rounded-2xl border border-subtle bg-card p-4 transition-colors duration-300"
        onScroll={(e) => {
          const el = e.currentTarget;
          setAutoScroll(el.scrollHeight - el.scrollTop - el.clientHeight < 100);
        }}
      >
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`group relative max-w-[80%] rounded-2xl p-4 ${
              m.role === "user"
                ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white"
                : "border border-subtle bg-input"
            }`}>
              {m.role === "assistant" ? (
                <MarkdownMessage content={m.content} />
              ) : (
                <p className="whitespace-pre-wrap text-sm">{m.content}</p>
              )}
              {m.role === "assistant" && m.content && (
                <div className="mt-2 flex items-center gap-2 border-t border-subtle pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => copyContent(m.content, m.id)}
                    className="flex items-center gap-1 rounded bg-elevated px-2 py-1 text-xs text-secondary hover:text-primary transition"
                  >
                    {copiedId === m.id ? <FiCheck className="text-green-400" /> : <FiCopy />}
                    {copiedId === m.id ? "Copied" : "Copy"}
                  </button>
                  {m.id !== "welcome" && (
                    <button onClick={() => deleteMessage(m.id)} className="rounded bg-elevated px-2 py-1 text-xs text-secondary hover:text-red-400 transition">
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isStreaming && (
          <div className="flex items-center gap-2 text-sm text-secondary">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: "300ms" }} />
            </div>
            <span>CareerPilot is thinking...</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <div className="relative flex-1">
          <input
            className="w-full rounded-xl border border-subtle bg-input p-3 pr-12 text-sm text-primary placeholder:text-disabled outline-none focus:border-indigo-500/50 transition"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(prompt); } }}
            placeholder="Ask a career question..."
            disabled={isStreaming}
          />
          {isStreaming && (
            <button onClick={stop} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-red-500/20 px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/30 transition">
              Stop
            </button>
          )}
        </div>
        <button
          onClick={() => sendMessage(prompt)}
          disabled={!prompt.trim() || isStreaming}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-40"
        >
          <FiSend /> Send
        </button>
      </div>
    </div>
  );
}
