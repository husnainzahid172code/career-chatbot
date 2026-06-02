import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className="rounded-md border border-zinc-700 bg-zinc-900/60 px-2 py-1 text-xs text-zinc-200 transition hover:bg-zinc-900 active:scale-[0.98]"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 900);
      }}
      type="button"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock(props: { inline?: boolean; className?: string; children?: unknown }) {
  const { inline, className, children } = props;
  const code = String(children ?? "");
  const lang = (className ?? "").replace("language-", "").trim();

  const highlighted = useMemo(() => {
    if (!lang) return null;
    try {
      if (!hljs.getLanguage(lang)) return null;
      return hljs.highlight(code, { language: lang }).value;
    } catch {
      return null;
    }
  }, [code, lang]);

  if (inline) {
    return (
      <code className="rounded bg-zinc-800/60 px-1 py-0.5 text-[0.92em] text-zinc-100">
        {code}
      </code>
    );
  }

  const label = lang ? lang.toUpperCase() : "CODE";

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/70 px-3 py-2">
        <div className="text-xs font-medium tracking-wide text-zinc-400">{label}</div>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-auto p-3 text-sm leading-relaxed">
        <code
          className="block text-zinc-100"
          dangerouslySetInnerHTML={highlighted ? { __html: highlighted } : undefined}
        >
          {highlighted ? null : code}
        </code>
      </pre>
    </div>
  );
}

export function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-a:text-brand-300 prose-a:no-underline hover:prose-a:underline">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({ inline, className, children }) => (
            <CodeBlock inline={inline} className={className} children={children} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

