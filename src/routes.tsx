import { Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Onboarding from "@/pages/Onboarding";
import CandidateProfile from "@/pages/onboarding/CandidateProfile";

export const routes = [
  {
    path: "/onboarding",
    element: (
      <ProtectedRoute>
        <Onboarding />
      </ProtectedRoute>
    ),
  },
  {
    path: "/onboarding/:id",
    element: (
      <ProtectedRoute>
        <CandidateProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/onboarding" replace />,
  },
];