import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { FiUpload, FiRefreshCw, FiDownload, FiCheckCircle, FiAlertCircle, FiTrendingUp } from "react-icons/fi";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  async function loadReports() {
    try {
      const { data } = await api.get("/upload/reports");
      setReports(data.items || []);
    } catch { /* ignore */ }
  }

  useEffect(() => { loadReports(); }, []);

  function getScoreColor(score: number) {
    if (score >= 85) return "text-sage";
    if (score >= 70) return "text-warning";
    return "text-danger";
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">Resume & Document Analyzer</h2>
        <p className="mt-1 text-sm text-muted">Upload your resume for ATS scoring and improvement suggestions</p>
      </div>

      <div className="rounded-2xl border border-default bg-card p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-secondary">Upload Resume (PDF, DOCX, TXT)</label>
            <div className="mt-2 flex items-center justify-center rounded-xl border-2 border-dashed border-default bg-elevated p-8 hover:border-btn/50 transition cursor-pointer"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <div className="text-center">
                <FiUpload className="mx-auto text-2xl text-disabled" />
                <p className="mt-2 text-sm text-secondary">{file ? file.name : "Click to upload or drag & drop"}</p>
                <p className="mt-1 text-xs text-disabled">PDF, DOCX, or TXT up to 10MB</p>
              </div>
            </div>
            <input id="file-input" type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <div>
            <label className="text-sm font-medium text-secondary">Job Description (optional)</label>
            <textarea
              className="mt-2 h-32 w-full resize-none rounded-xl border border-subtle bg-card p-3 text-sm text-primary placeholder:text-disabled outline-none focus:border-primary transition"
              placeholder="Paste the job description here for targeted matching..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            disabled={!file || uploading}
            onClick={async () => {
              if (!file) return;
              setUploading(true);
              try {
                const form = new FormData();
                form.append("file", file);
                form.append("jobDescription", jobDescription);
                const { data } = await api.post("/upload/resume", form);
                setResult(data);
                await loadReports();
              } catch { /* ignore */ } finally { setUploading(false); }
            }}
            className="flex items-center gap-2 rounded-xl bg-btn px-6 py-2.5 text-sm font-semibold text-btn hover:bg-btn-hover transition disabled:opacity-40"
          >
            {uploading ? (
              <><FiRefreshCw className="animate-spin" /> Analyzing...</>
            ) : (
              <><FiUpload /> Analyze Resume</>
            )}
          </button>
          <button onClick={loadReports} className="flex items-center gap-2 rounded-xl border border-subtle px-5 py-2.5 text-sm text-muted hover:bg-elevated hover:text-primary transition">
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-6 rounded-2xl border border-default bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-primary">
            <FiCheckCircle className="text-muted" /> Analysis Result
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-elevated p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted">ATS Score</p>
              <p className={`mt-1 text-4xl font-bold ${getScoreColor(result.atsScore)}`}>{result.atsScore}%</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-elevated">
                  <div className={`h-full rounded-full transition-all duration-500 ${
                    result.atsScore >= 85 ? "bg-sage" : result.atsScore >= 70 ? "bg-warning-fill" : "bg-danger-fill"
                  }`} style={{ width: `${result.atsScore}%` }} />
              </div>
            </div>
            <div className="rounded-xl bg-elevated p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted">Keyword Match</p>
              <p className={`mt-1 text-4xl font-bold ${getScoreColor(result.keywordMatch)}`}>{result.keywordMatch}%</p>
            </div>
            <div className="rounded-xl bg-elevated p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-muted">Format Score</p>
              <p className={`mt-1 text-4xl font-bold ${getScoreColor(result.formatScore)}`}>{result.formatScore}%</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-sage bg-sage p-4">
              <p className="flex items-center gap-1.5 text-sm font-medium text-sage"><FiCheckCircle /> Strengths</p>
                <ul className="mt-2 space-y-1">
                  {result.strengths?.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-secondary">• {s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {result.summary && (
              <div className="mt-4 rounded-xl bg-elevated p-4">
                <p className="text-sm text-secondary">{result.summary}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <h3 className="mb-3 text-lg font-semibold text-primary">Saved Reports</h3>
        {reports.length === 0 ? (
          <div className="rounded-xl border border-dashed border-subtle p-8 text-center text-sm text-disabled">
            <FiTrendingUp className="mx-auto mb-2 text-2xl" />
            No reports yet. Upload your first resume to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((r: any) => (
              <div key={r._id} className="flex items-center justify-between rounded-xl border border-default bg-card p-4 hover:border-default transition">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-elevated p-2">
                    <FiUpload className="text-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">{r.fileName || r.uploadFileId?.originalName || "Resume"}</p>
                    <p className="text-xs text-disabled">{r.uploadedAt ? new Date(r.uploadedAt).toLocaleDateString() : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${getScoreColor(r.atsScore)}`}>{r.atsScore}%</span>
                  <a
                    className="flex items-center gap-1 rounded-lg bg-elevated px-3 py-1.5 text-xs text-secondary hover:bg-card-hover transition"
                    href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/upload/reports/${r._id}/download?accessToken=${localStorage.getItem("careerpilot.accessToken") || ""}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FiDownload /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
