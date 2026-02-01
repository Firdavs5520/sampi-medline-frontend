/* ===================== */
/* TOKEN */
/* ===================== */
export const getToken = () => localStorage.getItem("token");

export const setAuthData = ({ token, user, role }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("role", role);
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
};

/* ===================== */
/* TOKEN VALIDATION */
/* ===================== */
export const isTokenValid = (token) => {
  try {
    if (!token) return false;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000;

    return payload.exp && payload.exp > now;
  } catch {
    return false;
  }
};

/* ===================== */
/* USER / ROLE */
/* ===================== */
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getRole = () => localStorage.getItem("role");

export const isLoggedIn = () => {
  const token = getToken();
  return isTokenValid(token);
};

export const hasRole = (...roles) => {
  const role = getRole();
  return roles.includes(role);
};

/* ===================== */
/* LOGOUT */
/* ===================== */
export const logout = () => {
  clearAuthData();
  window.location.href = "/login";
};
