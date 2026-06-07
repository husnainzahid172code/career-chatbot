import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { FiShield, FiUsers, FiMessageCircle, FiUpload, FiBarChart2, FiRefreshCw } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const cardMeta: Record<string, { label: string; icon: any }> = {
  users: { label: "Total Users", icon: FiUsers },
  chats: { label: "Total Chats", icon: FiMessageCircle },
  messages: { label: "Total Messages", icon: FiMessageCircle },
  reports: { label: "Resume Reports", icon: FiUpload },
  roadmaps: { label: "Roadmaps", icon: FiBarChart2 },
};

export default function AdminPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { loadAnalytics(); }, []);

  async function loadAnalytics() {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.get("/admin/analytics");
      setCards(data.cards);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load analytics");
    } finally { setLoading(false); }
  }

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FiShield className="text-5xl text-disabled" />
        <h2 className="mt-4 text-2xl font-bold text-primary">Admin Access Required</h2>
        <p className="mt-2 text-sm text-disabled">You need admin privileges to view this page.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary">Admin Analytics</h2>
        <p className="mt-1 text-sm text-muted">Platform overview and usage statistics</p>
      </div>

      <button onClick={loadAnalytics} disabled={loading}
        className="mb-6 flex items-center gap-2 rounded-xl bg-btn px-5 py-2.5 text-sm font-semibold text-btn hover:bg-btn-hover transition disabled:opacity-40"
      >
        <FiRefreshCw className={loading ? "animate-spin" : ""} /> {loading ? "Loading..." : "Refresh Analytics"}
      </button>

      {error && <div className="mb-4 rounded-xl border border-danger bg-danger p-3 text-sm text-danger">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards && Object.entries(cards).map(([key, value]) => {
          const meta = cardMeta[key] || { label: key, icon: FiBarChart2 };
          const Icon = meta.icon;
          return (
            <div key={key} className="rounded-2xl border border-default bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-elevated p-2.5"><Icon className="text-muted" /></div>
              </div>
              <p className="mt-4 text-3xl font-bold text-primary">{value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">{meta.label}</p>
            </div>
          );
        })}
      </div>

      {!cards && !loading && (
        <div className="mt-8 rounded-xl border border-dashed border-subtle p-8 text-center text-sm text-disabled">
          <FiBarChart2 className="mx-auto mb-2 text-2xl" />
          Click "Refresh Analytics" to load platform data.
        </div>
      )}
    </div>
  );
}
