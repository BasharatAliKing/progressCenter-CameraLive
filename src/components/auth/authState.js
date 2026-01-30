export const getAuthState = () => {
  const token = localStorage.getItem("auth_token");
  const expiresAtRaw = localStorage.getItem("auth_expires_at");
  const expiresAt = expiresAtRaw ? Number(expiresAtRaw) : null;
  if (token && expiresAt && Date.now() > expiresAt) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_expires_at");
    return { token: null, expiresAt: null };
  }
  return { token, expiresAt };
};
