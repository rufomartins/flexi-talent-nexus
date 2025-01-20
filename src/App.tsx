import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import WelcomeVideoPage from "@/pages/onboarding/WelcomeVideoPage";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Financial from "@/pages/Financial";
import Onboarding from "@/pages/Onboarding";
import CandidateProfile from "@/pages/onboarding/CandidateProfile";
import WelcomePage from "@/pages/onboarding/WelcomePage";
import ChatbotPage from "@/pages/onboarding/ChatbotPage";
import SchedulePage from "@/pages/onboarding/SchedulePage";
import { useAuth } from "@/contexts/auth";

function App() {
  const { user } = useAuth();
  console.log("[App] Rendering App component");
  
  return (
    <Routes>
      {/* Root redirect based on auth status */}
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
      />
      
      {/* Public routes (no authentication required) */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      
      {/* Public candidate-facing onboarding routes */}
      <Route path="/onboarding">
        <Route 
          path="welcome" 
          element={
            <PublicRoute>
              <WelcomePage />
            </PublicRoute>
          } 
        />
        <Route 
          path="welcome-video/:candidateId" 
          element={
            <PublicRoute>
              <WelcomeVideoPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="chatbot/:candidateId" 
          element={
            <PublicRoute>
              <ChatbotPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="schedule/:candidateId" 
          element={
            <PublicRoute>
              <SchedulePage />
            </PublicRoute>
          } 
        />
      </Route>
      
      {/* Protected routes (admin-facing) wrapped in MainLayout */}
      <Route element={
        <ProtectedRoute allowedRoles={['super_admin', 'admin', 'super_user']}>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/financial" element={
          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
            <Financial />
          </ProtectedRoute>
        } />
        
        {/* Protected admin onboarding routes */}
        <Route path="/onboarding/admin" element={
          <ProtectedRoute allowedRoles={['super_admin', 'super_user']}>
            <Onboarding />
          </ProtectedRoute>
        } />
        <Route path="/onboarding/admin/:id" element={
          <ProtectedRoute allowedRoles={['super_admin', 'super_user']}>
            <CandidateProfile />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Catch all route - redirect to login if not authenticated */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;