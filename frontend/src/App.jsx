import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationSubmitPage from './pages/ApplicationSubmitPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import SchemeManagementPage from './pages/SchemeManagementPage';
import AuditLogPage from './pages/AuditLogPage';
import DemoTesterPage from './pages/DemoTesterPage';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Root / Public Guard
const RootRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<RootRoute />} />
          <Route path="/portal-info" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Strictly Protected Application Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/applications/new" element={<ApplicationSubmitPage />} />
            <Route path="/applications/:id" element={<ApplicationDetailPage />} />
            <Route path="/demo-tester" element={<DemoTesterPage />} />

            <Route
              path="/schemes"
              element={
                <ProtectedRoute allowedRoles={['admin', 'officer']}>
                  <SchemeManagementPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/audit-logs"
              element={
                <ProtectedRoute allowedRoles={['admin', 'officer']}>
                  <AuditLogPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

