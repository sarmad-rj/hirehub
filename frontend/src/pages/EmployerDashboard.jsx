import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJobsApi, createJobApi } from "../services/jobsService";
import {
  fetchJobApplicantsApi,
  updateApplicationStatusApi,
} from "../services/applicationsService";
import { APPLICATION_STATUS, INITIAL_JOB_FORM } from "../utils/constants";

const EmployerDashboard = () => {
  const [formData, setFormData] = useState(INITIAL_JOB_FORM);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const queryClient = useQueryClient();

  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => fetchJobsApi(),
  });

  const { data: applicants = [] } = useQuery({
    queryKey: ["applicants", selectedJobId],
    queryFn: () => fetchJobApplicantsApi(selectedJobId),
    enabled: !!selectedJobId,
  });

  const createJobMutation = useMutation({
    mutationFn: createJobApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
      setFormData(INITIAL_JOB_FORM);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ appId, status }) =>
      updateApplicationStatusApi(appId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["applicants", selectedJobId]);
    },
  });

  const handleCreateJob = (e) => {
    e.preventDefault();
    createJobMutation.mutate(formData);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Post a New Job
        </h2>
        <form
          onSubmit={handleCreateJob}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Job Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            className="px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
            className="px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <input
            type="text"
            placeholder="Salary Range (optional)"
            value={formData.salary_range}
            onChange={(e) =>
              setFormData({ ...formData, salary_range: e.target.value })
            }
            className="px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <select
            value={formData.employment_type}
            onChange={(e) =>
              setFormData({ ...formData, employment_type: e.target.value })
            }
            className="px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
          <textarea
            placeholder="Job Description"
            rows="3"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            className="md:col-span-2 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          ></textarea>
          <button
            type="submit"
            className="md:col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition text-sm"
          >
            Publish Job
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
          <h3 className="font-bold text-slate-900 mb-3">Your Job Postings</h3>
          <div className="space-y-2">
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`w-full text-left p-3 rounded-lg border text-sm transition ${
                  selectedJobId === job.id
                    ? "border-emerald-500 bg-emerald-50 font-semibold text-emerald-900"
                    : "border-slate-100 hover:bg-slate-50 text-slate-700"
                }`}
              >
                {job.title}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
          <h3 className="font-bold text-slate-900 mb-3">Applicants</h3>
          {!selectedJobId && (
            <p className="text-sm text-slate-500 py-6 text-center">
              Select a job to view applicants.
            </p>
          )}
          {selectedJobId && applicants.length === 0 && (
            <p className="text-sm text-slate-500 py-6 text-center">
              No applicants for this job yet.
            </p>
          )}
          <div className="space-y-3">
            {applicants.map((app) => (
              <div
                key={app.id}
                className="p-3 border border-slate-100 rounded-lg flex justify-between items-center text-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    Applicant ID: {app.seeker_id}
                  </p>
                  <p className="text-xs text-slate-500">
                    {app.cover_letter || "No cover letter provided."}
                  </p>
                </div>
                <select
                  value={app.status}
                  onChange={(e) =>
                    statusMutation.mutate({
                      appId: app.id,
                      status: e.target.value,
                    })
                  }
                  className="px-2 py-1 border border-slate-200 rounded text-xs bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                >
                  {Object.values(APPLICATION_STATUS).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
