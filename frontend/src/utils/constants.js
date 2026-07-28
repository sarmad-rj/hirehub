export const ROLES = {
  SEEKER: "seeker",
  EMPLOYER: "employer",
  ADMIN: "admin",
};

export const ROLE_LABELS = {
  [ROLES.SEEKER]: "Job Seeker",
  [ROLES.EMPLOYER]: "Employer / Recruiter",
  [ROLES.ADMIN]: "Administrator",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  JOBS: "/jobs",
  JOB_DETAILS: "/jobs/:jobId",
  EMPLOYER_DASHBOARD: "/employer/dashboard",
  CREATE_JOB: "/employer/create-job",
  EMPLOYER_APPLICANTS: "/employer/dashboard/listings/:listingId/applicants",
  SEEKER_DASHBOARD: "/seeker/dashboard",
  NOT_FOUND: "*",
};

export const INITIAL_LOGIN_FORM = {
  email: "",
  password: "",
  role: ROLES.SEEKER,
};

export const INITIAL_SIGNUP_FORM = {
  email: "",
  password: "",
  role: ROLES.SEEKER,
};

export const APPLICATION_STATUS = {
  APPLIED: "applied",
  REVIEWED: "reviewed",
  INTERVIEW: "interview",
  OFFER: "offer",
  REJECTED: "rejected",
};

export const INITIAL_JOB_FORM = {
  title: "",
  description: "",
  location: "",
  salary_range: "",
  employment_type: "Full-time",
};
