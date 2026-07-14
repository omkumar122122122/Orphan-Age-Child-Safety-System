import { createContext, useContext, useMemo, useState } from "react";
import { fakeLogin } from "../services/authService";

const AuthContext = createContext(null);
const USER_STORAGE_KEY = "child_safety_user";
const TOKEN_STORAGE_KEY = "child_safety_token";

function readStoredAuth() {
  const storages = [localStorage, sessionStorage];

  for (const storage of storages) {
    try {
      const savedUser = storage.getItem(USER_STORAGE_KEY);
      const savedToken = storage.getItem(TOKEN_STORAGE_KEY);

      if (savedUser && savedToken) {
        return {
          user: JSON.parse(savedUser),
          token: savedToken
        };
      }
    } catch {
      storage.removeItem(USER_STORAGE_KEY);
      storage.removeItem(TOKEN_STORAGE_KEY);
    }
  }

  return { user: null, token: null };
}

function persistAuth(user, token) {
  const serializedUser = JSON.stringify(user);
  const serializedToken = token || `jwt-${user.role}-${Date.now()}`;

  localStorage.setItem(USER_STORAGE_KEY, serializedUser);
  localStorage.setItem(TOKEN_STORAGE_KEY, serializedToken);
  sessionStorage.setItem(USER_STORAGE_KEY, serializedUser);
  sessionStorage.setItem(TOKEN_STORAGE_KEY, serializedToken);
}

function clearStoredAuth() {
  [localStorage, sessionStorage].forEach((storage) => {
    storage.removeItem(USER_STORAGE_KEY);
    storage.removeItem(TOKEN_STORAGE_KEY);
  });
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => readStoredAuth());
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const loggedInUser = await fakeLogin(credentials);
      const token = `jwt-${loggedInUser.role}-${Date.now()}`;
      setAuthState({ user: loggedInUser, token });
      persistAuth(loggedInUser, token);
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthState({ user: null, token: null });
    clearStoredAuth();
  };

  const value = useMemo(() => ({
    user: authState.user,
    token: authState.token,
    loading,
    login,
    logout,
    isAuthenticated: Boolean(authState.user && authState.token)
  }), [authState.user, authState.token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
