import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthState } from "./authState";

const RequireAuth = ({ children }) => {
  const { token } = getAuthState();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default RequireAuth;
