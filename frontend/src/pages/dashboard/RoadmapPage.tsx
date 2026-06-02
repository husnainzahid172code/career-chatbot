import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { FiBarChart2, FiRefreshCw, FiClock, FiTarget, FiTrendingUp } from "react-icons/fi";

const levels = ["Beginner", "Intermediate", "Advanced"];

export default function RoadmapPage() {
  const [field, setField] = useState("Software Engineering");
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [desiredRole, setDesiredRole] = useState("Backend Developer");
  const [roadmap, setRoadmap] = useState("");
  const [saved, setSaved] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);

  async function loadSaved() {
    try { const { data } = await api.get("/ai/roadmaps"); setSaved(data.items || []); } catch { /* ignore */ }
  }

  useEffect(() => { loadSaved(); }, []);

  async function generate() {
    if (!field.trim() || !desiredRole.trim()) return;
    setGenerating(true);
    try {
      const { data } = await api.post("/ai/career-roadmap", { field, skillLevel, desiredRole });
      setRoadmap(data.roadmap);
      await loadSaved();
    } catch { /* ignore */ } finally { setGenerating(false); }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Career Roadmap Generator</h2>
        <p className="mt-1 text-sm text-muted">Create a personalized career development plan</p>
      </div>

      <div className="rounded-2xl border border-subtle bg-card bg-gradient-to-br from-white/5 to-white/0 p-6 backdrop-blur-xl transition-colors duration-300">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted">Field / Industry</label>
            <input className="mt-1.5 w-full rounded-xl border border-subtle bg-input p-3 text-sm text-primary outline-none placeholder:text-disabled focus:border-amber-500/50 transition" value={field} onChange={(e) => setField(e.target.value)} placeholder="e.g. Data Science" />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted">Skill Level</label>
            <select className="mt-1.5 w-full rounded-xl border border-subtle bg-input p-3 text-sm text-primary outline-none focus:border-amber-500/50 transition" value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)}>
              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted">Desired Role</label>
            <input className="mt-1.5 w-full rounded-xl border border-subtle bg-input p-3 text-sm text-primary outline-none placeholder:text-disabled focus:border-amber-500/50 transition" value={desiredRole} onChange={(e) => setDesiredRole(e.target.value)} placeholder="e.g. ML Engineer" />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={generate}
            disabled={generating || !field.trim() || !desiredRole.trim()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-40"
          >
            {generating ? <><FiRefreshCw className="animate-spin" /> Generating...</> : <><FiBarChart2 /> Generate Roadmap</>}
          </button>
          <button onClick={loadSaved} className="flex items-center gap-2 rounded-xl border border-subtle px-5 py-2.5 text-sm text-secondary hover:bg-card hover:text-primary transition">
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {roadmap && (
        <div className="mt-6 rounded-2xl border border-subtle bg-card bg-gradient-to-br from-white/5 to-white/0 p-6 backdrop-blur-xl transition-colors duration-300">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold"><FiTarget className="text-amber-400" /> Your Roadmap</h3>
          <div className="whitespace-pre-wrap rounded-xl bg-input p-5 font-mono text-sm leading-relaxed text-secondary">{roadmap}</div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold"><FiClock /> Saved Roadmaps</h3>
        {saved.length === 0 ? (
          <div className="rounded-xl border border-dashed border-subtle p-8 text-center text-sm text-disabled">
            <FiTrendingUp className="mx-auto mb-2 text-2xl" />
            No roadmaps yet. Generate your first career roadmap above.
          </div>
        ) : (
          <div className="space-y-3">
            {saved.map((r: any) => (
              <div key={r._id} className="group cursor-pointer rounded-xl border border-subtle bg-card p-4 hover:border-default transition"
                onClick={() => setRoadmap(r.content)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-amber-500/20 p-1.5"><FiBarChart2 className="text-amber-400" /></div>
                    <div>
                      <p className="text-sm font-medium">{r.field} → {r.desiredRole}</p>
                      <p className="text-xs text-muted">{r.skillLevel} · {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</p>
                    </div>
                  </div>
                  <span className="text-xs text-disabled group-hover:text-secondary transition">View →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
