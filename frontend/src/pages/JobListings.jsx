import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJobsApi } from "../services/jobsService";
import JobCard from "../components/JobCard";
import { Search } from "lucide-react";

const JobListings = () => {
  const [search, setSearch] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  const {
    data: jobs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["jobs", search, employmentType],
    queryFn: () => fetchJobsApi(search, employmentType),
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-emerald-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
          />
        </div>
        <select
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white md:w-48"
        >
          <option value="">All Employment Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      {isLoading && (
        <div className="text-center py-12 text-slate-500 font-medium">
          Loading jobs...
        </div>
      )}

      {isError && (
        <div className="text-center py-12 text-red-500 font-medium">
          Failed to load jobs.
        </div>
      )}

      {!isLoading && !isError && jobs.length === 0 && (
        <div className="text-center py-12 text-slate-500 font-medium">
          No job listings found.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobListings;
