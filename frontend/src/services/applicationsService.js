import API from "../api/axios";

export const applyForJobApi = async (formData) => {
  const response = await API.post("/applications/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const fetchMyApplicationsApi = async () => {
  const response = await API.get("/applications/me");
  return response.data;
};

export const fetchJobApplicantsApi = async (jobId) => {
  const response = await API.get(`/applications/job/${jobId}`);
  return response.data;
};

export const updateApplicationStatusApi = async (appId, status) => {
  const response = await API.patch(`/applications/${appId}/status`, { status });
  return response.data;
};
