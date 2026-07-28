import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJobsApi } from "../services/jobsService";
import { Briefcase, Users, Shield, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
  const { data: jobs = [], isLoading: loadingJobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => fetchJobsApi(),
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Administrator Panel
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Platform governance and job moderation
          </p>
        </div>
        <div className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold">
          <Shield className="w-4 h-4 text-emerald-700" />
          <span>Admin Privilege</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Total Live Jobs
            </p>
            <p className="text-2xl font-bold text-slate-900">{jobs.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">System Role</p>
            <p className="text-xl font-bold text-slate-900">Platform Admin</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">API Gateway</p>
            <p className="text-xl font-bold text-emerald-600">Connected</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          All Active Listings (Audit View)
        </h2>

        {loadingJobs && (
          <p className="text-sm text-slate-500 text-center py-6">
            Fetching platform jobs...
          </p>
        )}

        {!loadingJobs && jobs.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-6">
            No active jobs found across the platform.
          </p>
        )}

        <div className="divide-y divide-slate-100">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="py-3 flex justify-between items-center text-sm"
            >
              <div>
                <p className="font-bold text-slate-900">{job.title}</p>
                <p className="text-xs text-slate-500">
                  Company: {job.company_name || "N/A"} | Location:{" "}
                  {job.location} | Type: {job.employment_type}
                </p>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded font-semibold border border-emerald-200">
                Active Listing
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
