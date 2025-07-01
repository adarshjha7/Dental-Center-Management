import { User, AuthSession } from "../types";
import { getUsers, getAuthSession, setAuthSession } from "./storageService";

export const authenticateUser = async (
  email: string,
  password: string,
): Promise<User | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  return user || null;
};

export const login = async (
  email: string,
  password: string,
): Promise<AuthSession | null> => {
  const user = await authenticateUser(email, password);

  if (user) {
    const session: AuthSession = {
      user,
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
    };

    setAuthSession(session);
    return session;
  }

  return null;
};

export const logout = (): void => {
  setAuthSession(null);
};

export const getCurrentSession = (): AuthSession | null => {
  const session = getAuthSession();

  // Validate session exists and has required fields
  if (!session || !session.user || !session.isAuthenticated) {
    return null;
  }

  // Check if session is not too old (optional - you can adjust or remove this)
  const loginTime = new Date(session.loginTime).getTime();
  const now = new Date().getTime();
  const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);

  // Keep session for 24 hours
  if (hoursSinceLogin > 24) {
    setAuthSession(null);
    return null;
  }

  return session;
};

export const isAuthenticated = (): boolean => {
  const session = getCurrentSession();
  return !!session?.isAuthenticated;
};

export const hasRole = (role: "admin" | "patient"): boolean => {
  const session = getCurrentSession();
  return session?.user?.role === role || false;
};

export const isAdmin = (): boolean => {
  return hasRole("admin");
};

export const isPatient = (): boolean => {
  return hasRole("patient");
};

export const getCurrentUser = (): User | null => {
  const session = getCurrentSession();
  return session?.user || null;
};
