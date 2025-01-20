import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import WelcomeVideoPage from "@/pages/onboarding/WelcomeVideoPage";

const router = createBrowserRouter([
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
    element: (
      <ProtectedRoute>
        <WelcomeVideoPage 
          candidateId={useParams().candidateId || ''}
          videoUrl="https://example.com/welcome-video.mp4" // Replace with actual video URL
        />
      </ProtectedRoute>
    ),
  },
]);

export default router;