import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { Link } from "react-router-dom";
import { FiMessageCircle, FiUpload, FiBarChart2, FiHeart, FiArrowRight } from "react-icons/fi";
import SearchBar from "../../components/ui/SearchBar";
import ActivePathWidget from "../../components/ui/ActivePathWidget";
import StatCard from "../../components/ui/StatCard";
import OpportunityCard from "../../components/ui/OpportunityCard";

const statCards = [
  { label: "Chats", key: "chats", icon: FiMessageCircle, link: "/dashboard/chat", accent: "accent-indigo" },
  { label: "Resumes Analyzed", key: "reports", icon: FiUpload, link: "/dashboard/upload", accent: "accent-emerald" },
  { label: "Roadmaps Generated", key: "roadmaps", icon: FiBarChart2, link: "/dashboard/roadmap", accent: "accent-amber" },
  { label: "Favorites", key: "favorites", icon: FiHeart, link: "/dashboard/internship", accent: "accent-rose" },
];

const opportunities = [
  { title: "Software Engineering Intern", company: "Google", location: "Remote", salary: "$50/hr", skills: ["React", "Python", "SQL"], matchScore: 78, type: "internship" as const },
  { title: "Frontend Developer", company: "Stripe", location: "San Francisco, CA", salary: "$120k/yr", skills: ["TypeScript", "React", "Next.js"], matchScore: 85, type: "job" as const },
  { title: "Data Science Bootcamp", company: "DataCamp", location: "Online", salary: "Free", skills: ["Python", "ML", "Statistics"], matchScore: 62, type: "skill" as const },
];

export default function OverviewPage() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-badge/10 via-sage/5 to-warning/5 p-6">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-primary">Dashboard</h2>
          <p className="mt-1 text-sm text-muted">Welcome back to CareerPilot AI</p>
        </div>
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-indigo-200/10 to-transparent dark:from-indigo-500/5" />
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <div className="relative">
        <div className="absolute left-0 top-0 h-full w-0.5 rounded-full bg-gradient-to-b from-indigo-400 via-emerald-400 to-amber-400 opacity-40" />
        <ActivePathWidget />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, key, icon, link, accent }) => (
          <StatCard key={key} label={label} value={stats[key] ?? 0} icon={icon} link={link} loading={loading} accent={accent} />
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-5 w-1 rounded-full bg-gradient-to-b from-badge to-sage" />
            <h3 className="font-semibold text-primary">Recommended Opportunities</h3>
            <span className="rounded-full bg-badge px-2 py-0.5 text-[10px] font-medium text-badge">{opportunities.length} new</span>
          </div>
          <Link to="/dashboard/matcher" className="flex items-center gap-1 text-xs font-medium text-badge hover:text-badge transition">View all <FiArrowRight className="text-[10px]" /></Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.title} {...opp} />
          ))}
        </div>
      </div>
    </div>
  );
}
