import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Public/Home';
import { Dashboard as PublicDashboard } from './pages/Public/Dashboard';
import { ApplicationForm } from './pages/Public/ApplicationForm';
import { Dashboard as AdminDashboard } from './pages/Admin/Dashboard';
import { Dashboard as LeaderDashboard } from './pages/Leader/Dashboard';
import { Dashboard as SuperAdminDashboard } from './pages/SuperAdmin/Dashboard';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  
  if (!user) return <Navigate to="/" replace />;
  
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Public Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['public', 'admin', 'leader', 'superadmin']}>
                <PublicDashboard />
              </ProtectedRoute>
            } />
            <Route path="/apply/:serviceId" element={<ApplicationForm />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Leader Routes */}
            <Route path="/leader" element={
              <ProtectedRoute allowedRoles={['leader', 'superadmin']}>
                <LeaderDashboard />
              </ProtectedRoute>
            } />

            {/* Super Admin Routes */}
            <Route path="/superadmin" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
