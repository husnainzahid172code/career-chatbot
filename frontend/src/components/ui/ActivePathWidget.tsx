import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const phases = [
  { label: "Skill Building", status: "done" as const },
  { label: "Interview Prep", status: "current" as const },
  { label: "Resume Polish", status: "next" as const },
  { label: "Apply", status: "upcoming" as const },
];

export default function ActivePathWidget() {
  return (
    <div className="rounded-2xl border border-default bg-card p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-primary">Your Active Path</h3>
        <span className="rounded-full bg-badge px-3 py-0.5 text-xs font-medium text-badge">In Progress</span>
      </div>

      <div className="flex items-center gap-1">
        {phases.map((phase, i) => (
          <div key={phase.label} className="flex items-center gap-1 flex-1">
            <div className="flex flex-col items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                phase.status === "done" ? "bg-sage text-sage" :
                phase.status === "current" ? "bg-badge text-badge ring-2 ring-badge ring-offset-2 ring-offset-card" :
                phase.status === "next" ? "border-2 border-default text-disabled" :
                "border-2 border-dashed border-muted text-disabled"
              }`}>
                {phase.status === "done" ? "✓" : i + 1}
              </div>
              <span className={`mt-1.5 text-[10px] font-medium whitespace-nowrap ${
                phase.status === "current" ? "text-badge font-semibold" : "text-disabled"
              }`}>{phase.label}</span>
            </div>
            {i < phases.length - 1 && (
              <div className={`h-0.5 flex-1 translate-y-5 ${
                phase.status === "done" ? "bg-sage" : "border-t border-dashed border-default"
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-muted flex items-center justify-between">
        <p className="text-xs text-muted">
          <span className="font-medium text-primary">Current:</span> Interview Preparation
        </p>
        <Link to="/dashboard/roadmap" className="flex items-center gap-1 text-xs font-medium text-badge hover:text-badge transition">
          View full roadmap <FiArrowRight className="text-[10px]" />
        </Link>
      </div>
    </div>
  );
}
