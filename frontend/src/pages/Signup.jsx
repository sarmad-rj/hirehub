import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { signupApi, loginApi } from "../services/authService";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import GoogleAuthButton from "../components/GoogleAuthButton";
import {
  ROLES,
  ROUTES,
  ROLE_LABELS,
  INITIAL_SIGNUP_FORM,
} from "../utils/constants";

const Signup = () => {
  const [formData, setFormData] = useState(INITIAL_SIGNUP_FORM);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuthSuccess = (accessToken, userRole, email) => {
    login(accessToken, userRole, email);

    if (userRole === ROLES.EMPLOYER) {
      navigate(ROUTES.EMPLOYER_DASHBOARD);
    } else {
      navigate(ROUTES.JOBS);
    }
  };

  const { handleGoogleSuccess, handleGoogleError, googleError } =
    useGoogleAuth(handleAuthSuccess);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signupApi(formData);
      const loginData = await loginApi(formData.email, formData.password);
      handleAuthSuccess(
        loginData.access_token,
        loginData.role.toLowerCase(),
        formData.email,
      );
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create account");
    }
  };

  const activeError = error || googleError;

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-sm border border-emerald-100 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-2 text-emerald-950 text-center">
          Create HireHub Account
        </h2>
        <p className="text-sm text-emerald-700 text-center mb-6">
          Get started as a Seeker or Employer
        </p>

        {activeError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100">
            {activeError}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Account Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition shadow-sm"
        >
          Register Account
        </button>

        <GoogleAuthButton
          onSuccess={(res) =>
            handleGoogleSuccess(res, formData.role.toLowerCase())
          }
          onError={handleGoogleError}
        />

        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to={ROUTES.LOGIN}
            className="text-emerald-600 font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
