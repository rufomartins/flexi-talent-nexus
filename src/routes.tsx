import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import WelcomeVideoPage from "@/pages/onboarding/WelcomeVideoPage";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Financial from "@/pages/Financial";
import Onboarding from "@/pages/Onboarding";
import CandidateProfile from "@/pages/onboarding/CandidateProfile";
import WelcomePage from "@/pages/onboarding/WelcomePage";
import ChatbotPage from "@/pages/onboarding/ChatbotPage";
import SchedulePage from "@/pages/onboarding/SchedulePage";
import InboxPage from "@/pages/InboxPage";

const router = createBrowserRouter([
  // Public routes (no authentication required)
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  // Public candidate-facing onboarding routes
  {
    path: "/onboarding",
    children: [
      {
        path: "welcome",
        element: <WelcomePage />,
      },
      {
        path: "welcome-video/:candidateId",
        element: <WelcomeVideoPage />,
      },
      {
        path: "chatbot/:candidateId",
        element: <ChatbotPage />,
      },
      {
        path: "schedule/:candidateId",
        element: <SchedulePage />,
      },
    ],
  },
  
  // Protected routes (admin-facing) wrapped in MainLayout
  {
    element: (
      <ProtectedRoute allowedRoles={['super_admin', 'admin', 'super_user']}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/financial",
        element: (
          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
            <Financial />
          </ProtectedRoute>
        ),
      },
      // Protected admin onboarding routes
      {
        path: "/onboarding/admin",
        element: (
          <ProtectedRoute allowedRoles={['super_admin', 'super_user']}>
            <Onboarding />
          </ProtectedRoute>
        ),
      },
      {
        path: "/onboarding/admin/:id",
        element: (
          <ProtectedRoute allowedRoles={['super_admin', 'super_user']}>
            <CandidateProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/inbox",
        element: (
          <ProtectedRoute allowedRoles={['super_admin', 'super_user']}>
            <InboxPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;