import API from "../api/axios";

export const fetchJobsApi = async (search = "", employmentType = "") => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (employmentType) params.append("employment_type", employmentType);
  const response = await API.get(`/jobs?${params.toString()}`);
  return response.data;
};

export const fetchJobDetailApi = async (jobId) => {
  const response = await API.get(`/jobs/${jobId}`);
  return response.data;
};

export const createJobApi = async (jobData) => {
  const response = await API.post("/jobs/", jobData);
  return response.data;
};
