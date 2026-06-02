import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMessageCircle, FiUpload, FiBarChart2, FiBriefcase, FiArrowRight, FiStar } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: FiMessageCircle, title: "AI Career Chat", desc: "Get instant answers about careers, resumes, and internships from our AI assistant." },
  { icon: FiUpload, title: "Resume Analysis", desc: "Upload your resume for ATS scoring and actionable improvement suggestions." },
  { icon: FiBarChart2, title: "Career Roadmaps", desc: "Generate personalized career development plans based on your goals." },
  { icon: FiBriefcase, title: "Internship Prep", desc: "Prepare with cover letters, interview questions, and application templates." },
];

export default function LandingPage() {
  const { token } = useAuth();

  return (
    <div className="min-h-dvh bg-page text-primary transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <header className="flex items-center justify-between">
          <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 p-[1px]">
            <div className="rounded-xl bg-page px-4 py-2">
              <h1 className="text-lg font-bold text-primary">CareerPilot AI</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {token ? (
              <Link to="/dashboard" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
                Dashboard <FiArrowRight />
              </Link>
            ) : (
              <>
                <Link to="/login" className="rounded-xl px-4 py-2 text-sm text-secondary hover:text-primary transition">Sign in</Link>
                <Link to="/signup" className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition">Get Started</Link>
              </>
            )}
          </div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 rounded-3xl border border-subtle bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/5 to-transparent p-10 backdrop-blur-xl text-center"
        >
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500">
              <FiStar className="text-xl text-white" />
            </div>
            <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
              AI-Powered Career Growth for{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">Students & Job Seekers</span>
            </h2>
            <p className="mt-4 text-lg text-secondary">
              Chat guidance, resume analysis, interview prep, internship support, and personalized roadmaps — all in one modern SaaS workspace.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/signup" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition">
                Get Started Free <FiArrowRight />
              </Link>
              <Link to="/dashboard" className="rounded-xl border border-default px-6 py-3 text-sm text-secondary hover:bg-card transition">
                Open Dashboard
              </Link>
            </div>
          </div>
        </motion.section>

        <section className="mt-20">
          <h3 className="text-center text-2xl font-bold">Everything you need for your career journey</h3>
          <p className="mt-2 text-center text-sm text-muted">AI-powered tools to help you land your dream role</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="group rounded-2xl border border-subtle bg-card p-6 hover:border-default hover:bg-card-hover transition-all"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/30 transition">
                  <Icon className="text-indigo-400" />
                </div>
                <h4 className="font-semibold">{title}</h4>
                <p className="mt-1.5 text-sm text-muted">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="mt-20 border-t border-subtle py-8 text-center text-sm text-disabled">
          CareerPilot AI — Built for students and job seekers
        </footer>
      </div>
    </div>
  );
}
