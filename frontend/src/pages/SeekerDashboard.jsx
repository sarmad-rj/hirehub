import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyApplicationsApi } from "../services/applicationsService";

const SeekerDashboard = () => {
  const {
    data: applications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myApplications"],
    queryFn: fetchMyApplicationsApi,
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 space-y-4">
      <h1 className="text-xl font-bold text-slate-900">My Applications</h1>

      {isLoading && (
        <div className="text-center py-6 text-slate-500 text-sm">
          Loading applications...
        </div>
      )}

      {isError && (
        <div className="text-center py-6 text-red-500 text-sm">
          Failed to load applications.
        </div>
      )}

      {!isLoading && !isError && applications.length === 0 && (
        <div className="text-center py-6 text-slate-500 text-sm">
          You haven't applied to any jobs yet.
        </div>
      )}

      <div className="space-y-3">
        {applications.map((app) => (
          <div
            key={app.id}
            className="p-4 border border-slate-100 rounded-lg flex justify-between items-center text-sm"
          >
            <div>
              <h3 className="font-bold text-slate-900">
                {app.job_title || `Job ID: ${app.job_id}`}
              </h3>
              <p className="text-xs text-slate-500">
                Applied on: {new Date(app.applied_at).toLocaleDateString()}
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold uppercase">
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeekerDashboard;
