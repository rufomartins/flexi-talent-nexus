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

const router = createBrowserRouter([
  // Public routes (candidate-facing)
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/onboarding/welcome-video/:candidateId",
    element: <WelcomeVideoPage />,
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
      {
        path: "/onboarding",
        element: (
          <ProtectedRoute allowedRoles={['super_admin', 'super_user']}>
            <Onboarding />
          </ProtectedRoute>
        ),
      },
      {
        path: "/onboarding/:id",
        element: (
          <ProtectedRoute allowedRoles={['super_admin', 'super_user']}>
            <CandidateProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;