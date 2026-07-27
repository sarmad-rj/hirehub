import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-emerald-50/30 text-slate-800 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
