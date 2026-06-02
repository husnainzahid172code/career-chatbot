import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { FiMail, FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "../components/Logo";

function extractError(err: unknown): string {
  const e = err as any;
  if (e?.response?.data?.message) return e.response.data.message;
  if (e?.response?.status === 401) return "Invalid email or password";
  if (e?.response?.status === 409) return "Email already registered";
  if (e?.response?.status === 400) return "Please check your input";
  if (e?.message?.toLowerCase?.().includes("network") || e?.code === "ERR_NETWORK") return "Cannot reach server. Is it running?";
  if (e?.message) return e.message;
  return "Authentication failed";
}

export default function AuthPage() {
  const location = useLocation();
  const mode = location.pathname === "/signup" ? "signup" : "login";
  const nav = useNavigate();
  const auth = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      if (mode === "signup") await auth.signup(name, email, password);
      else await auth.login(email, password);
      nav("/dashboard");
    } catch (err) {
      setError(extractError(err));
    } finally { setLoading(false); }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-page p-6 text-primary transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <Logo size={48} />
          </div>
          <h2 className="mt-2 text-2xl font-bold">{mode === "signup" ? "Create your account" : "Welcome back"}</h2>
          <p className="mt-1 text-sm text-secondary">
            {mode === "signup" ? "Start your career journey with AI-powered guidance" : "Sign in to continue your career journey"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-subtle bg-card p-6 backdrop-blur-xl transition-colors duration-300">
          {mode === "signup" && (
            <div className="mb-4">
              <label className="text-xs font-medium uppercase tracking-wider text-muted">Full Name</label>
              <div className="relative mt-1.5">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input className="w-full rounded-xl border border-subtle bg-input py-3 pl-10 pr-3 text-sm text-primary outline-none placeholder:text-disabled focus:border-indigo-500/50 transition"
                  placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="text-xs font-medium uppercase tracking-wider text-muted">Email Address</label>
            <div className="relative mt-1.5">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input className="w-full rounded-xl border border-subtle bg-input py-3 pl-10 pr-3 text-sm text-primary outline-none placeholder:text-disabled focus:border-indigo-500/50 transition"
                placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium uppercase tracking-wider text-muted">Password</label>
            <div className="relative mt-1.5">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input className="w-full rounded-xl border border-subtle bg-input py-3 pl-10 pr-10 text-sm text-primary outline-none placeholder:text-disabled focus:border-indigo-500/50 transition"
                type={showPw ? "text" : "password"} placeholder={mode === "signup" ? "Minimum 8 characters" : "Enter your password"}
                value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition">
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {error && <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
          {info && <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">{info}</div>}

          <button type="submit" disabled={loading || !email || !password || (mode === "signup" && !name)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 py-3 text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> {mode === "signup" ? "Creating account..." : "Signing in..."}</span>
            ) : (
              <>{mode === "signup" ? "Create Account" : "Sign In"} <FiArrowRight /></>
            )}
          </button>

          {mode === "login" && (
            <button type="button" onClick={async () => {
              setInfo(""); if (!email) return setInfo("Enter your email first.");
              await api.post("/auth/forgot-password", { email });
              setInfo("If this email exists, reset instructions are sent.");
            }}
              className="mt-3 w-full text-center text-xs text-muted hover:text-secondary transition"
            >
              Forgot password?
            </button>
          )}

          <p className="mt-6 text-center text-sm text-muted">
            {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
            <Link to={mode === "signup" ? "/login" : "/signup"} className="font-medium text-indigo-400 hover:text-indigo-300 transition underline underline-offset-2">
              {mode === "signup" ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
