import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { FiUser, FiMail, FiShield, FiLogOut, FiRefreshCw } from "react-icons/fi";

export default function ProfilePage() {
  const { user, logout, hydrateMe } = useAuth();
  useEffect(() => { hydrateMe().catch(() => {}); }, [hydrateMe]);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">Profile</h2>
        <p className="mt-1 text-sm text-muted">Your account information</p>
      </div>

      <div className="max-w-2xl rounded-2xl border border-default bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-btn text-xl font-bold text-btn">
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">{user?.name || "User"}</h3>
            <p className="flex items-center gap-1.5 text-sm text-muted"><FiMail className="text-xs" /> {user?.email || "—"}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-elevated p-4">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted"><FiUser /> Name</p>
            <p className="mt-1 text-sm text-primary">{user?.name || "—"}</p>
          </div>
          <div className="rounded-xl bg-elevated p-4">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted"><FiMail /> Email</p>
            <p className="mt-1 text-sm text-primary">{user?.email || "—"}</p>
          </div>
          <div className="rounded-xl bg-elevated p-4">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted"><FiShield /> Role</p>
            <p className="mt-1 text-sm text-primary capitalize">{user?.role || "—"}</p>
          </div>
          <div className="rounded-xl bg-elevated p-4">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted"><FiRefreshCw /> Account Status</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-sage"><span className="h-2 w-2 rounded-full bg-sage" /> Active</p>
          </div>
        </div>

        <div className="mt-8 border-t border-subtle pt-6">
          <button onClick={logout}
            className="flex items-center gap-2 rounded-xl bg-danger-btn px-5 py-2.5 text-sm font-semibold text-white hover:bg-danger-btn-hover transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
