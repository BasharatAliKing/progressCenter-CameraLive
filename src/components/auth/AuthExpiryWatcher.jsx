import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthState } from "./authState";

const AuthExpiryWatcher = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { token, expiresAt } = getAuthState();
    if (!token || !expiresAt) return;
    const timeout = Math.max(expiresAt - Date.now(), 0);
    const timer = setTimeout(() => {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_expires_at");
      navigate("/login", { replace: true });
    }, timeout);
    return () => clearTimeout(timer);
  }, [navigate]);

  return null;
};

export default AuthExpiryWatcher;
