export function isTokenValid(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000;
    return payload.exp && payload.exp > now;
  } catch {
    return false;
  }
}
