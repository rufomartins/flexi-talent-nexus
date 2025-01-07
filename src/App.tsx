import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Calendar from "@/pages/Calendar";
import Bookings from "@/pages/Bookings";
import TalentList from "@/pages/talents/TalentList";
import TalentProfile from "@/pages/TalentProfile";
import Castings from "@/pages/Castings";
import Projects from "@/pages/Projects";
import Messages from "@/pages/Messages";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Outlet />
                  </MainLayout>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="bookings" element={<Bookings />} />
              
              {/* Talent routes */}
              <Route path="talents">
                <Route index element={<TalentList />} />
                <Route path=":id" element={<TalentProfile />} />
              </Route>

              {/* Casting routes */}
              <Route path="castings" element={<Castings />} />
              
              {/* Project routes */}
              <Route path="projects" element={<Projects />} />

              {/* Messages route */}
              <Route path="messages" element={<Messages />} />
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;