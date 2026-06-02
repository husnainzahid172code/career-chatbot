import { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarNav from "../../components/layout/SidebarNav";
import { FiMenu } from "react-icons/fi";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-page text-primary transition-colors duration-300">
      <button
        className="fixed left-3 top-3 z-50 rounded-xl bg-elevated p-2.5 text-sm text-secondary hover:bg-card-hover hover:text-primary transition md:hidden"
        onClick={() => setOpen((v) => !v)}
      >
        <FiMenu />
      </button>
      <SidebarNav open={open} onToggle={() => setOpen((v) => !v)} />
      <div className="flex-1 overflow-auto p-4 pt-14 md:p-8 md:pt-8">
        <Outlet />
      </div>
    </div>
  );
}
