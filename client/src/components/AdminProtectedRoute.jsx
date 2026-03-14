import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="font-[Zen_Dots] animate-pulse">Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user?._id) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if not admin or superadmin
  if (user.role !== "admin" && user.role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  // Render children if user is admin
  return children;
}