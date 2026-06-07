import { FiArrowRight } from "react-icons/fi";

interface OpportunityCardProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  skills: string[];
  matchScore: number;
  type: "job" | "internship" | "skill";
}

const typeStyles: Record<string, string> = {
  job: "bg-badge text-badge",
  internship: "bg-sage text-sage",
  skill: "bg-amber-bg text-amber-fg",
};

export default function OpportunityCard({ title, company, location, salary, skills, matchScore, type }: OpportunityCardProps) {
  const scoreColor = matchScore >= 70 ? "text-sage" : matchScore >= 50 ? "text-warning" : "text-disabled";
  const scoreBg = matchScore >= 70 ? "bg-sage" : matchScore >= 50 ? "bg-amber-bg" : "bg-elevated";

  return (
    <div className="group rounded-2xl border border-default bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-default">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-primary">{title}</h4>
          <p className="text-sm text-secondary">{company}</p>
          <p className="mt-1 text-xs text-disabled">{location} · {salary}</p>
        </div>
        <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium uppercase ${typeStyles[type] || "bg-elevated text-muted"}`}>{type}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <span key={s} className="rounded-md bg-elevated px-2 py-0.5 text-[11px] text-secondary">{s}</span>
        ))}
      </div>

      <div className={`mt-4 rounded-xl ${scoreBg} p-3`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-secondary">Match Score</span>
          <span className={`text-lg font-bold ${scoreColor}`}>{matchScore}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-card/50">
           <div className={`h-full rounded-full transition-all ${matchScore >= 70 ? "bg-sage" : matchScore >= 50 ? "bg-warning-fill" : "bg-default"}`}
            style={{ width: `${matchScore}%` }} />
        </div>
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-btn py-2.5 text-sm font-medium text-btn transition-colors hover:bg-btn-hover">
        Apply Now <FiArrowRight className="text-xs" />
      </button>
    </div>
  );
}
