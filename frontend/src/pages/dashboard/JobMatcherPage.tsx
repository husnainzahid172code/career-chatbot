import { useState } from "react";
import { api } from "../../api/client";
import { FiSearch, FiTarget, FiCheck, FiX, FiRefreshCw, FiBriefcase, FiTrendingUp, FiCode } from "react-icons/fi";

const SAMPLE_RESUME = `Experienced software engineer with 5 years of experience building web applications. Proficient in JavaScript, TypeScript, React, Node.js, and Python. Strong background in REST API design, SQL databases, and AWS cloud services. Experienced with Docker, Git, and agile methodologies. Passionate about building scalable microservices and intuitive user interfaces.`;

function getScoreColor(score: number): string {
  if (score >= 80) return "text-sage";
  if (score >= 60) return "text-warning";
  return "text-danger";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-sage";
  if (score >= 60) return "bg-warning-fill";
  return "bg-danger-fill";
}

export default function JobMatcherPage() {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ resumeSkills: string[]; matches: any[] } | null>(null);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  async function handleMatch() {
    if (!resumeText.trim()) return;
    setLoading(true);
    setResult(null);
    setSelectedJob(null);
    try {
      const { data } = await api.post("/matcher/match", { resumeText });
      setResult(data);
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  const bestScore = result?.matches?.[0]?.score ?? 0;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">Job Matcher</h2>
        <p className="mt-1 text-sm text-muted">AI-powered resume screening and job matching</p>
      </div>

      <div className="rounded-2xl border border-default bg-card p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-secondary">Paste your resume text</label>
              <button onClick={() => setResumeText(SAMPLE_RESUME)} className="text-xs text-muted hover:text-primary transition">
                Use sample resume
              </button>
            </div>
            <textarea
              className="mt-2 h-48 w-full resize-none rounded-xl border border-subtle bg-card p-4 text-sm text-primary placeholder:text-disabled outline-none focus:border-primary transition font-mono"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
            />
            <p className="mt-1 text-xs text-disabled">{resumeText.length} characters</p>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <label className="text-sm font-medium text-secondary">How it works</label>
              <ul className="mt-2 space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2"><FiCode className="mt-0.5 text-muted shrink-0" /> Extracts skills from your resume using NLP-style keyword matching</li>
                <li className="flex items-start gap-2"><FiBriefcase className="mt-0.5 text-muted shrink-0" /> Compares against 10 curated job profiles across tech roles</li>
                <li className="flex items-start gap-2"><FiTarget className="mt-0.5 text-muted shrink-0" /> Scores each match based on skill overlap and relevance</li>
                <li className="flex items-start gap-2"><FiTrendingUp className="mt-0.5 text-muted shrink-0" /> Ranks jobs from best to worst fit</li>
              </ul>
            </div>
            <button
              onClick={handleMatch}
              disabled={loading || !resumeText.trim()}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-btn px-6 py-3 text-sm font-semibold text-btn hover:bg-btn-hover transition disabled:opacity-40"
            >
              {loading ? <><FiRefreshCw className="animate-spin" /> Analyzing resume...</> : <><FiSearch /> Find Matching Jobs</>}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-primary">Match Results</h3>
              <span className="rounded-full bg-elevated px-3 py-0.5 text-xs text-muted">{result.matches.length} jobs</span>
            </div>
            {result.resumeSkills.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-disabled">Detected skills:</span>
                {result.resumeSkills.map((s) => (
                  <span key={s} className="rounded-md bg-elevated px-2 py-0.5 text-xs text-secondary">{s}</span>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-3">
            {result.matches.map((m: any, i: number) => (
              <div
                key={m.jobIndex}
                className={`group cursor-pointer rounded-xl border p-4 transition-all ${
                  selectedJob === m.jobIndex
                    ? "border-primary bg-elevated"
                    : "border-default bg-card hover:border-default hover:bg-elevated"
                }`}
                onClick={() => setSelectedJob(selectedJob === m.jobIndex ? null : m.jobIndex)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      i === 0 ? "bg-btn text-btn" : i === 1 ? "bg-elevated" : i === 2 ? "bg-elevated" : "bg-elevated"
                    }`}>
                      <span className={`text-sm font-bold ${i === 0 ? "text-btn" : "text-secondary"}`}>
                        #{i + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">{m.job.title}</p>
                      <p className="text-sm text-secondary">{m.job.company}</p>
                      <p className="mt-1 text-xs text-disabled line-clamp-1">{m.job.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-2xl font-bold ${getScoreColor(m.score)}`}>{m.score}%</span>
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-elevated">
                      <div className={`h-full rounded-full transition-all ${getScoreBg(m.score)}`} style={{ width: `${m.score}%` }} />
                    </div>
                  </div>
                </div>

                {selectedJob === m.jobIndex && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 border-t border-subtle pt-4">
                    <div>
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-sage"><FiCheck /> Matched Skills ({m.matchedSkills.length})</p>
                      <div className="flex flex-wrap gap-1">
                        {m.matchedSkills.length > 0 ? m.matchedSkills.map((s: string) => (
                          <span key={s} className="rounded-md bg-sage px-2 py-0.5 text-xs text-sage">{s}</span>
                        )) : <span className="text-xs text-disabled">None</span>}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-warning"><FiX /> Missing Skills ({m.missingSkills.length})</p>
                      <div className="flex flex-wrap gap-1">
                        {m.missingSkills.length > 0 ? m.missingSkills.map((s: string) => (
                          <span key={s} className="rounded-md bg-warning-bg px-2 py-0.5 text-xs text-warning">{s}</span>
                        )) : <span className="text-xs text-disabled">None — great fit!</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="mt-8 rounded-xl border border-dashed border-subtle p-12 text-center">
          <FiSearch className="mx-auto mb-3 text-3xl text-disabled" />
          <p className="text-sm text-disabled">Paste your resume above and click "Find Matching Jobs" to see results</p>
        </div>
      )}
    </div>
  );
}
