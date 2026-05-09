import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import UsersManagement from "@/pages/UsersManagement";
import AdminManagement from "@/pages/AdminManagement";

import NotFound from "@/pages/NotFound";

function ProtectedRoutes() {
  const { admin } = useAuth();
  if (!admin) return <Navigate to="/login" replace />;
  return <AppLayout />;
}

function LoginRoute() {
  const { admin } = useAuth();
  if (admin) return <Navigate to="/" replace />;
  return <Login />;
}

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/admins" element={<AdminManagement />} />
            
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
);

export default App;
