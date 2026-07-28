import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JobListings from "./pages/JobListings";
import JobDetail from "./pages/JobDetail";
import NotFound from "./pages/NotFound";
import { ROUTES } from "./utils/constants";

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
              <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
