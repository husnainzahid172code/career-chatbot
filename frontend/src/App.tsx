import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./layouts/ProtectedRoute";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const DashboardLayout = lazy(() => import("./pages/dashboard/DashboardLayout"));
const OverviewPage = lazy(() => import("./pages/dashboard/OverviewPage"));
const ChatPage = lazy(() => import("./pages/dashboard/ChatPage"));
const UploadPage = lazy(() => import("./pages/dashboard/UploadPage"));
const RoadmapPage = lazy(() => import("./pages/dashboard/RoadmapPage"));
const ProfilePage = lazy(() => import("./pages/dashboard/ProfilePage"));
const AdminPage = lazy(() => import("./pages/dashboard/AdminPage"));
const InternshipPage = lazy(() => import("./pages/dashboard/InternshipPage"));

export default function App() {
  return (
    <Suspense fallback={<div className="grid min-h-dvh place-items-center text-zinc-400">Loading...</div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="internship" element={<InternshipPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

