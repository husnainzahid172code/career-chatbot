import { Link } from "react-router-dom";
import { IconType } from "react-icons";

interface StatCardProps {
  label: string;
  value: number;
  icon: IconType;
  link: string;
  loading?: boolean;
  accent?: string;
}

export default function StatCard({ label, value, icon: Icon, link, loading, accent = "accent-indigo" }: StatCardProps) {
  return (
    <Link to={link} className={`group rounded-2xl border border-default bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${accent}`}>
      <div className="flex items-center justify-between">
        <div className="rounded-xl p-2.5" style={{ backgroundColor: "var(--accent-bg)" }}>
          <Icon className="text-lg" style={{ color: "var(--accent)" }} />
        </div>
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      {loading ? (
        <div className="mt-2 h-8 w-20 animate-pulse rounded bg-elevated" />
      ) : (
        <p className="mt-1 text-3xl font-bold text-primary">{value}</p>
      )}
    </Link>
  );
}
