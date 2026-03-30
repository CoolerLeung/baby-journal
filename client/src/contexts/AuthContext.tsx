import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authApi, setToken, clearToken } from '../lib/api';

type User = { id: string; nickname?: string; email?: string; phone?: string } | null;

type AuthCtx = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (data: { email?: string; phone?: string; password: string; nickname?: string }) => Promise<string | null>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx>(null!);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }
      const res = await authApi.me();
      if (res.ok) setUser(res.data);
      else clearToken();
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    if (!res.ok) return res.error;
    setToken(res.data.token);
    setUser(res.data.user);
    return null;
  };

  const register = async (data: { email?: string; phone?: string; password: string; nickname?: string }) => {
    const res = await authApi.register(data);
    if (!res.ok) return res.error;
    setToken(res.data.token);
    setUser(res.data.user);
    return null;
  };

  const logout = () => { clearToken(); setUser(null); };

  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
