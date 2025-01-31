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
import InboxPage from "@/pages/InboxPage";
import Settings from "@/pages/settings";
import Calendar from "@/pages/Calendar";
import TalentList from "@/pages/talents/TalentList";
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
          element={<WelcomePage />} 
        />
        <Route 
          path="welcome-video/:candidateId" 
          element={<WelcomeVideoPage />} 
        />
        <Route 
          path="chatbot/:candidateId" 
          element={<ChatbotPage />} 
        />
        <Route 
          path="schedule/:candidateId" 
          element={<SchedulePage />} 
        />
      </Route>
      
      {/* Protected routes (admin-facing) wrapped in MainLayout */}
      <Route element={
        <ProtectedRoute allowedRoles={['super_admin', 'admin', 'super_user']}>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/talents" element={<TalentList />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/financial" element={
          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
            <Financial />
          </ProtectedRoute>
        } />
        <Route path="/inbox" element={
          <ProtectedRoute allowedRoles={['super_admin', 'super_user']}>
            <InboxPage />
          </ProtectedRoute>
        } />
        
        {/* Protected admin onboarding routes */}
        <Route path="/onboarding/admin" element={
          <ProtectedRoute allowedRoles={['super_admin', 'super_user']}>
            <Onboarding />
          </ProtectedRoute>
        } />
        <Route path="/onboarding/admin/evaluation" element={
          <ProtectedRoute allowedRoles={['super_admin', 'super_user']}>
            <Onboarding />
          </ProtectedRoute>
        } />
        <Route path="/onboarding/admin/approved" element={
          <ProtectedRoute allowedRoles={['super_admin', 'super_user']}>
            <Onboarding />
          </ProtectedRoute>
        } />
        <Route path="/onboarding/admin/rejected" element={
          <ProtectedRoute allowedRoles={['super_admin', 'super_user']}>
            <Onboarding />
          </ProtectedRoute>
        } />
        <Route path="/onboarding/admin/archived" element={
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