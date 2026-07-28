import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JobListings from "./pages/JobListings";
import JobDetail from "./pages/JobDetail";
import EmployerDashboard from "./pages/EmployerDashboard";
import SeekerDashboard from "./pages/SeekerDashboard";
import NotFound from "./pages/NotFound";
import { ROLES, ROUTES } from "./utils/constants";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route
                path={ROUTES.HOME}
                element={<Navigate to={ROUTES.JOBS} replace />}
              />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.SIGNUP} element={<Signup />} />
              <Route path={ROUTES.JOBS} element={<JobListings />} />
              <Route path={ROUTES.JOB_DETAILS} element={<JobDetail />} />

              <Route
                path={ROUTES.EMPLOYER_DASHBOARD}
                element={
                  <ProtectedRoute requiredRole={ROLES.EMPLOYER}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path={ROUTES.SEEKER_DASHBOARD}
                element={
                  <ProtectedRoute requiredRole={ROLES.SEEKER}>
                    <SeekerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
