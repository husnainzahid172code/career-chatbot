import { useState } from "react";
import { api } from "../../api/client";
import { FiBriefcase, FiRefreshCw, FiCopy, FiCheck, FiHeart } from "react-icons/fi";

const presets = [
  { label: "Internship Prep Plan", value: "Generate internship prep plan with interview questions, cover letter, HR email template, and mock interview prompts." },
  { label: "Cover Letter", value: "Write a professional cover letter for a software engineering internship application." },
  { label: "Interview Questions", value: "List the top 20 most common internship interview questions with detailed answers." },
  { label: "Follow-up Email", value: "Write a professional follow-up email template to send after an internship interview." },
];

export default function InternshipPage() {
  const [goal, setGoal] = useState(presets[0].value);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!goal.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/ai/internship-assistant", { goal });
      setResponse(data.response);
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  async function copy() {
    await navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Internship Assistant</h2>
        <p className="mt-1 text-sm text-muted">Generate cover letters, interview prep, and application materials</p>
      </div>

      <div className="rounded-2xl border border-subtle bg-card bg-gradient-to-br from-white/5 to-white/0 p-6 backdrop-blur-xl transition-colors duration-300">
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button key={p.label} onClick={() => { setGoal(p.value); setResponse(""); }}
              className={`rounded-lg px-3 py-1.5 text-xs transition ${
                goal === p.value ? "bg-rose-500/30 text-rose-300 border border-rose-500/50" : "bg-elevated text-secondary hover:bg-card-hover"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <textarea className="mt-4 w-full resize-none rounded-xl border border-subtle bg-input p-4 text-sm text-primary placeholder:text-disabled outline-none focus:border-rose-500/50 transition"
          rows={4} value={goal} onChange={(e) => setGoal(e.target.value)}
        />

        <button onClick={generate} disabled={loading || !goal.trim()}
          className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-40"
        >
          {loading ? <><FiRefreshCw className="animate-spin" /> Generating...</> : <><FiBriefcase /> Generate</>}
        </button>
      </div>

      {response && (
        <div className="mt-6 rounded-2xl border border-subtle bg-card bg-gradient-to-br from-white/5 to-white/0 p-6 backdrop-blur-xl transition-colors duration-300">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold"><FiHeart className="text-rose-400" /> Result</h3>
            <button onClick={copy} className="flex items-center gap-1.5 rounded-lg bg-elevated px-3 py-1.5 text-xs text-secondary hover:text-primary transition">
              {copied ? <><FiCheck className="text-green-400" /> Copied</> : <><FiCopy /> Copy All</>}
            </button>
          </div>
          <div className="whitespace-pre-wrap rounded-xl bg-input p-5 font-mono text-sm leading-relaxed text-secondary">{response}</div>
        </div>
      )}
    </div>
  );
}
