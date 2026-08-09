import API from "../api/axios";

export const loginApi = async (email, password) => {
  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", password);
  const response = await API.post("/auth/login", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
};

export const signupApi = async (userPayload) => {
  const response = await API.post("/auth/signup", userPayload);
  return response.data;
};

export const googleLoginApi = async (idToken, role = "seeker") => {
  const response = await API.post("/auth/google", {
    id_token: idToken,
    role: role,
  });
  return response.data;
};
