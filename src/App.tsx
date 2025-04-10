
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import { MainLayout } from "@/components/layout/MainLayout";
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
import TalentProfile from "@/pages/TalentProfile";
import Castings from "@/pages/Castings";
import { useAuth } from "@/contexts/auth";

function App() {
  const { user } = useAuth();
  console.log("[App] Rendering App component");
  
  return (
    <Routes>
      {/* Public onboarding routes - NO auth required */}
      <Route 
        path="/onboarding/welcome" 
        element={<WelcomePage />} 
      />
      <Route 
        path="/onboarding/welcome-video/:candidateId" 
        element={
          <PublicRoute>
            <WelcomeVideoPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/onboarding/chatbot/:candidateId" 
        element={<ChatbotPage />} 
      />
      <Route 
        path="/onboarding/schedule/:candidateId" 
        element={<SchedulePage />} 
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
      
      {/* Protected routes (admin-facing) wrapped in MainLayout */}
      <Route element={
        <ProtectedRoute allowedRoles={['super_admin', 'admin', 'super_user']}>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/talents" element={<TalentList />} />
        <Route path="/talents/:id" element={<TalentProfile />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/castings" element={<Castings />} />
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
      
      {/* Root and unknown routes */}
      <Route 
        path="/" 
        element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="*" 
        element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
}

export default App;
