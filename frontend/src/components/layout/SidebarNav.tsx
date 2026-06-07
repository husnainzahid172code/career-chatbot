import { NavLink } from "react-router-dom";
import { FiBarChart2, FiHome, FiMessageCircle, FiUpload, FiUser, FiShield, FiBriefcase, FiX, FiSun, FiMoon, FiSearch } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import Logo from "../Logo";

const items = [
  { to: "/dashboard", label: "Overview", icon: FiHome },
  { to: "/dashboard/chat", label: "AI Chat", icon: FiMessageCircle },
  { to: "/dashboard/upload", label: "Resume Analyzer", icon: FiUpload },
  { to: "/dashboard/roadmap", label: "Roadmap", icon: FiBarChart2 },
  { to: "/dashboard/internship", label: "Internship", icon: FiBriefcase },
  { to: "/dashboard/matcher", label: "Job Matcher", icon: FiSearch },
  { to: "/dashboard/profile", label: "Profile", icon: FiUser },
  { to: "/dashboard/admin", label: "Admin", icon: FiShield },
];

export default function SidebarNav({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { theme, toggle } = useTheme();

  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-sidebar bg-sidebar p-5 transition-transform duration-200 md:relative md:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <div className="flex-1">
            <h1 className="text-base font-bold text-primary">CareerPilot AI</h1>
            <p className="text-[11px] text-disabled">Career & Internship Assistant</p>
          </div>
          <button onClick={onToggle} className="rounded-lg p-1.5 text-disabled hover:bg-elevated md:hidden">
            <FiX />
          </button>
        </div>

        <nav className="mt-7 space-y-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              onClick={() => { if (window.innerWidth < 768) onToggle(); }}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-badge text-badge font-semibold"
                    : "text-secondary hover:bg-elevated hover:text-primary"
                }`
              }
            >
              <Icon className="text-base" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 left-5 right-5 space-y-2">
          <button onClick={toggle} className="flex w-full items-center justify-between rounded-xl bg-elevated p-3 text-xs text-muted hover:bg-card-hover transition">
            <span className="flex items-center gap-2">{theme === "dark" ? <FiSun className="text-sm" /> : <FiMoon className="text-sm" />}{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            <span className="text-disabled text-[10px] uppercase tracking-wider">{theme}</span>
          </button>
          <div className="rounded-xl bg-elevated p-3">
            <p className="text-xs text-disabled">CareerPilot AI v1.0</p>
          </div>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-overlay md:hidden" onClick={onToggle} />}
    </>
  );
}
