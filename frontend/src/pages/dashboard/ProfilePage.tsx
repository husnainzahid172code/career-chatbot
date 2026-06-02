import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { FiUser, FiMail, FiShield, FiLogOut, FiRefreshCw } from "react-icons/fi";

export default function ProfilePage() {
  const { user, logout, hydrateMe } = useAuth();
  useEffect(() => { hydrateMe().catch(() => {}); }, [hydrateMe]);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">Profile</h2>
        <p className="mt-1 text-sm text-muted">Your account information</p>
      </div>

      <div className="max-w-2xl rounded-2xl border border-subtle bg-card bg-gradient-to-br from-white/5 to-white/0 p-6 backdrop-blur-xl transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-xl font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <h3 className="text-xl font-bold">{user?.name || "User"}</h3>
            <p className="flex items-center gap-1.5 text-sm text-secondary"><FiMail className="text-xs" /> {user?.email || "—"}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-input p-4">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted"><FiUser /> Name</p>
            <p className="mt-1 text-sm">{user?.name || "—"}</p>
          </div>
          <div className="rounded-xl bg-input p-4">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted"><FiMail /> Email</p>
            <p className="mt-1 text-sm">{user?.email || "—"}</p>
          </div>
          <div className="rounded-xl bg-input p-4">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted"><FiShield /> Role</p>
            <p className="mt-1 text-sm capitalize">{user?.role || "—"}</p>
          </div>
          <div className="rounded-xl bg-input p-4">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted"><FiRefreshCw /> Account Status</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-emerald-400"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Active</p>
          </div>
        </div>

        <div className="mt-8 border-t border-subtle pt-6">
          <button onClick={logout}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
