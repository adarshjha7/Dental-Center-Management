import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Authentication
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

// Pages
import Index from "./pages/Index"; // Login page
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import EnhancedAdminDashboard from "./pages/EnhancedAdminDashboard";
import PatientsManagement from "./pages/PatientsManagement";
import AppointmentsManagement from "./pages/AppointmentsManagement";
import CalendarView from "./pages/CalendarView";
import PatientDashboard from "./pages/PatientDashboard";
import PatientProfile from "./pages/PatientProfile";
import PatientAppointments from "./pages/PatientAppointments";
import TestRouteProtection from "./pages/TestRouteProtection";
import DataTest from "./pages/DataTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Index />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Routes with Layout */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Admin Routes */}
              <Route
                path="admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <EnhancedAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/patients"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <PatientsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/appointments"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AppointmentsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/calendar"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <CalendarView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/test-protection"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <TestRouteProtection />
                  </ProtectedRoute>
                }
              />

              {/* Patient Routes */}
              <Route
                path="patient"
                element={
                  <ProtectedRoute requiredRole="patient">
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="patient/profile"
                element={
                  <ProtectedRoute requiredRole="patient">
                    <PatientProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="patient/appointments"
                element={
                  <ProtectedRoute requiredRole="patient">
                    <PatientAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="patient/test"
                element={
                  <ProtectedRoute requiredRole="patient">
                    <DataTest />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// Prevent multiple root creation during development hot reload
const container = document.getElementById("root")!;
const existingRoot = (container as any)._reactRootContainer;

if (!existingRoot) {
  const root = createRoot(container);
  (container as any)._reactRootContainer = root;
  root.render(<App />);
} else {
  existingRoot.render(<App />);
}
