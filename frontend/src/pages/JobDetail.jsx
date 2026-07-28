import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchJobDetailApi } from "../services/jobsService";
import { applyForJobApi } from "../services/applicationsService";
import { useAuth } from "../auth/AuthContext";
import { ROLES } from "../utils/constants";

const JobDetail = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const {
    data: job,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => fetchJobDetailApi(jobId),
  });

  const handleApply = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("job_id", jobId);
    if (coverLetter) formData.append("cover_letter", coverLetter);
    if (resume) formData.append("resume", resume);

    try {
      await applyForJobApi(formData);
      setMessage("Application submitted successfully!");
      setCoverLetter("");
      setResume(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit application");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-slate-500 font-medium">
        Loading job details...
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="text-center py-12 text-red-500 font-medium">
        Job listing not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{job.title}</h1>
        <p className="text-emerald-700 font-semibold mb-4">
          {job.company_name}
        </p>
        <div className="flex gap-4 text-sm text-slate-600 border-b border-slate-100 pb-4 mb-4">
          <span>Location: {job.location}</span>
          <span>Type: {job.employment_type}</span>
          {job.salary_range && <span>Salary: {job.salary_range}</span>}
        </div>
        <p className="text-slate-700 whitespace-pre-line">{job.description}</p>
      </div>

      {user?.role === ROLES.SEEKER && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Apply for this Position
          </h2>

          {message && (
            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg mb-4 text-sm border border-emerald-200">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Cover Letter
              </label>
              <textarea
                rows="4"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Resume (PDF only)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResume(e.target.files[0])}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded-lg transition shadow-sm text-sm"
            >
              Submit Application
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
