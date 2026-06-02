import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { Link } from "react-router-dom";
import { FiMessageCircle, FiUpload, FiBarChart2, FiHeart, FiArrowRight } from "react-icons/fi";

const cards = [
  { label: "Chats", key: "chats", icon: FiMessageCircle, color: "from-indigo-500/20 to-indigo-600/10", link: "/dashboard/chat" },
  { label: "Resumes Analyzed", key: "reports", icon: FiUpload, color: "from-emerald-500/20 to-emerald-600/10", link: "/dashboard/upload" },
  { label: "Roadmaps Generated", key: "roadmaps", icon: FiBarChart2, color: "from-amber-500/20 to-amber-600/10", link: "/dashboard/roadmap" },
  { label: "Favorites", key: "favorites", icon: FiHeart, color: "from-rose-500/20 to-rose-600/10", link: "/dashboard/internship" },
];

export default function OverviewPage() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/analytics");
        setStats(res.data.cards || {});
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">Dashboard</h2>
        <p className="mt-1 text-sm text-muted">Welcome back to CareerPilot AI</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, key, icon: Icon, color, link }) => (
          <Link to={link} key={key} className={`group rounded-2xl border border-subtle bg-gradient-to-br ${color} p-5 backdrop-blur-xl hover:border-default transition-all`}>
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-elevated p-2.5">
                <Icon className="text-lg text-secondary" />
              </div>
              <FiArrowRight className="text-disabled opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
            {loading ? (
              <div className="mt-2 h-8 w-20 animate-pulse rounded bg-elevated" />
            ) : (
              <p className="mt-1 text-3xl font-bold">{stats[key] ?? 0}</p>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-subtle bg-card p-5 transition-colors duration-300">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="mt-4 space-y-3">
            {[
              { label: "Start a Career Chat", desc: "Ask AI about jobs, skills, or interviews", to: "/dashboard/chat", icon: FiMessageCircle },
              { label: "Upload Your Resume", desc: "Get ATS score and improvement suggestions", to: "/dashboard/upload", icon: FiUpload },
              { label: "Generate a Roadmap", desc: "Personalized career pathway plan", to: "/dashboard/roadmap", icon: FiBarChart2 },
              { label: "Prepare for Internships", desc: "Cover letters, interview questions & more", to: "/dashboard/internship", icon: FiHeart },
            ].map(({ label, desc, to, icon: Icon }) => (
              <Link to={to} key={label} className="flex items-center gap-3 rounded-xl bg-card p-3 hover:bg-card-hover transition">
                <div className="rounded-lg bg-indigo-500/20 p-2"><Icon className="text-indigo-400" /></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
                <FiArrowRight className="text-disabled" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-subtle bg-card p-5 transition-colors duration-300">
          <h3 className="text-lg font-semibold">Tips & Resources</h3>
          <div className="mt-4 space-y-3">
            {[
              { title: "Tailor your resume", desc: "Customize your resume for each job application to increase ATS score." },
              { title: "Practice interviews", desc: "Use the Internship Assistant to prepare for common interview questions." },
              { title: "Build your network", desc: "Connect with professionals on LinkedIn in your target industry." },
              { title: "Stay consistent", desc: "Set aside 30 minutes daily for skill development and applications." },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-xl border border-muted bg-card p-3">
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-xs text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
