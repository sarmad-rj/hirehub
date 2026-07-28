import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Briefcase, LogOut } from "lucide-react";
import { ROLES, ROUTES } from "../utils/constants";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className="bg-white border-b border-emerald-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to={ROUTES.HOME}
          className="flex items-center space-x-2 text-xl font-extrabold text-emerald-700"
        >
          <Briefcase className="w-6 h-6 text-emerald-600" />
          <span>HireHub</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            to={ROUTES.JOBS}
            className="text-slate-600 hover:text-emerald-700 font-medium transition"
          >
            Browse Jobs
          </Link>
          {user ? (
            <>
              {user.role === ROLES.EMPLOYER && (
                <Link
                  to={ROUTES.EMPLOYER_DASHBOARD}
                  className="text-slate-600 hover:text-emerald-700 font-medium transition"
                >
                  Employer Dashboard
                </Link>
              )}

              {user.role === ROLES.ADMIN && (
                <Link
                  to={ROUTES.ADMIN_DASHBOARD}
                  className="text-slate-600 hover:text-emerald-700 font-medium transition"
                >
                  Admin Dashboard
                </Link>
              )}

              {user.role === ROLES.SEEKER && (
                <Link
                  to={ROUTES.SEEKER_DASHBOARD}
                  className="text-slate-600 hover:text-emerald-700 font-medium transition"
                >
                  My Applications
                </Link>
              )}

              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold border border-emerald-200">
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm transition border border-red-200 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="text-slate-600 hover:text-emerald-700 font-medium transition"
              >
                Login
              </Link>
              <Link
                to={ROUTES.SIGNUP}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
