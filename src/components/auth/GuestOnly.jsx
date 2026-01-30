import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthState } from "./authState";

const GuestOnly = ({ children }) => {
  const { token } = getAuthState();
  if (token) return <Navigate to="/" replace />;
  return children;
};

export default GuestOnly;
