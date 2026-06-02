import { useCallback, useRef, useState } from "react";
import type { Message } from "../types";
import { askBackend } from "./geminiClient";

type StreamState =
  | { status: "idle" }
  | { status: "streaming" }
  | { status: "error"; message: string };

export type SendParams = {
  messages: Message[];
  userText: string;
  groundingText?: string | null;
  onToken?: (deltaText: string) => void;
};

export function useGeminiStream() {
  const abortRef = useRef<boolean>(false);
  const [state, setState] = useState<StreamState>({ status: "idle" });

  const stop = useCallback(() => {
    abortRef.current = true;
    setState({ status: "idle" });
  }, []);

  const send = useCallback(async (params: SendParams) => {
    const { messages, userText, onToken } = params;

    abortRef.current = false;
    setState({ status: "streaming" });

    try {
      const historyText = messages
        .slice(-20)
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n");

      const context = historyText || "";
      const { text } = await askBackend(userText, context);

      if (abortRef.current) return "";

      onToken?.(text);

      setState({ status: "idle" });
      return text;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const friendly = msg.toLowerCase().includes("network") || msg.toLowerCase().includes("fetch")
        ? "Network error while contacting the server. Check connectivity and try again."
        : msg;
      setState({ status: "error", message: friendly });
      throw new Error(friendly);
    }
  }, []);

  return { state, send, stop };
}
