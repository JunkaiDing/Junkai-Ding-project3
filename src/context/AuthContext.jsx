import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  checkAuth,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth()
      .then((res) => {
        if (res.data.isLoggedIn) {
          setUser({ username: res.data.username });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await apiLogin(username, password);
    setUser({ username: res.data.username });
    return res;
  }, []);

  const registerUser = useCallback(async (username, password) => {
    const res = await apiRegister(username, password);
    setUser({ username: res.data.username });
    return res;
  }, []);

  const logoutUser = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isLoggedIn: !!user,
      login,
      register: registerUser,
      logout: logoutUser,
    }),
    [user, loading, login, registerUser, logoutUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
