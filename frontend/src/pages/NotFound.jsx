import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <AlertCircle className="w-16 h-16 text-emerald-600 mb-4" />
      <h1 className="text-4xl font-bold text-slate-800 mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-slate-600 mb-6 max-w-md">
        The page you are looking for does not exist or hasn't been implemented
        yet.
      </p>
      <Link
        to="/jobs"
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-lg transition"
      >
        Back to Jobs
      </Link>
    </div>
  );
}
