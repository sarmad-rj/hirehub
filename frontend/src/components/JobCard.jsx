import React from "react";
import { Link } from "react-router-dom";
import { MapPin, DollarSign, Briefcase } from "lucide-react";
import { ROUTES } from "../utils/constants";

const JobCard = ({ job }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-emerald-100 hover:border-emerald-300 transition flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{job.title}</h3>
        <p className="text-sm font-medium text-emerald-700 mb-3">
          {job.company_name || "Company"}
        </p>

        <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-4">
          <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </span>
          <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
            <Briefcase className="w-3.5 h-3.5" />
            {job.employment_type}
          </span>
          {job.salary_range && (
            <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
              <DollarSign className="w-3.5 h-3.5" />
              {job.salary_range}
            </span>
          )}
        </div>
      </div>

      <Link
        to={ROUTES.JOB_DETAILS.replace(":jobId", job.id)}
        className="w-full text-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium py-2 rounded-lg text-sm transition border border-emerald-200"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
