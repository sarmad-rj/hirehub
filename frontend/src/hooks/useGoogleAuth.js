import { useState } from "react";
import { googleLoginApi } from "../services/authService";

export const useGoogleAuth = (onSuccess) => {
  const [googleError, setGoogleError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse, role) => {
    setGoogleError("");
    setIsLoading(true);

    try {
      const data = await googleLoginApi(credentialResponse.credential, role);
      const userRole = data.role.toLowerCase();
      onSuccess(data.access_token, userRole, data.email);
    } catch (err) {
      setGoogleError(
        err.response?.data?.detail || "Google authentication failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setGoogleError("Google Sign-In was unsuccessful. Please try again.");
  };

  return {
    handleGoogleSuccess,
    handleGoogleError,
    googleError,
    isLoading,
  };
};
