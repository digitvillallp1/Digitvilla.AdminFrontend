export const ADMIN_TOKEN_KEY = "digitvilla_admin_token";
export const ADMIN_USER_KEY = "digitvilla_admin_user";

export type AdminUser = {
  id?: string;
  email: string;
  role: string;
  name?: string;
  expiresAt?: string;
};

export function setAdminAuth(token: string, user: AdminUser) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getAdminUser(): AdminUser | null {
  const storedUser = localStorage.getItem(ADMIN_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AdminUser;
  } catch {
    clearAdminAuth();
    return null;
  }
}

export function isAdminLoggedIn() {
  const token = getAdminToken();
  const user = getAdminUser();

  if (!token || !user) {
    return false;
  }

  return user.role?.toLowerCase() === "admin";
}

export function clearAdminAuth() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}