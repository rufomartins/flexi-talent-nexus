import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Financial from "@/pages/Financial";
import Onboarding from "@/pages/Onboarding";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import WelcomePage from "@/pages/onboarding/WelcomePage";
import WelcomeVideoPage from "@/pages/onboarding/WelcomeVideoPage";
import ChatbotPage from "@/pages/onboarding/ChatbotPage";
import SchedulePage from "@/pages/onboarding/SchedulePage";
import CandidateProfile from "@/pages/onboarding/CandidateProfile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log("[App] Rendering App component");
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public candidate-facing onboarding routes */}
            <Route path="/onboarding">
              <Route path="welcome" element={<WelcomePage />} />
              <Route path="welcome-video/:candidateId" element={<WelcomeVideoPage />} />
              <Route path="chatbot/:candidateId" element={<ChatbotPage />} />
              <Route path="schedule/:candidateId" element={<SchedulePage />} />
            </Route>

            {/* Admin authentication */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected admin routes wrapped in MainLayout */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/financial" element={<Financial />} />
              <Route 
                path="/onboarding/admin" 
                element={
                  <ProtectedRoute 
                    allowedRoles={['super_admin', 'super_user']}
                  >
                    <Onboarding />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/onboarding/admin/:id" 
                element={
                  <ProtectedRoute 
                    allowedRoles={['super_admin', 'super_user']}
                  >
                    <CandidateProfile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch protected routes - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;