import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const GoogleAuthButton = ({ onSuccess, onError }) => {
  return (
    <div className="w-full">
      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <span className="relative bg-white px-3 text-xs text-slate-500 uppercase tracking-wider">
          Or continue with
        </span>
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          theme="outline"
          shape="rectangular"
          width="350"
        />
      </div>
    </div>
  );
};

export default GoogleAuthButton;
