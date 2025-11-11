// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

// Extiende ImportMeta para incluir 'env' (Vite)
interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

type User = {
  id: number;
  username: string;
  name: string;
  role: 'admin' | 'user' | string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5174';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const data = localStorage.getItem('auth_user');
    return data ? JSON.parse(data) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user));
    else localStorage.removeItem('auth_user');
  }, [user]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      // Query json-server for user with username & password
      const url = `${API_BASE}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
      const res = await fetch(url);
      if (!res.ok) {
        setLoading(false);
        return { ok: false, message: 'Error en el servidor' };
      }
      const users = await res.json();
      if (users.length === 0) {
        setLoading(false);
        return { ok: false, message: 'Credenciales incorrectas' };
      }
      const u = users[0];
      const userObj: User = {
        id: u.id,
        username: u.username,
        name: u.name,
        role: u.role
      };
      setUser(userObj);
      setLoading(false);
      return { ok: true };
    } catch (err) {
      console.error(err);
      setLoading(false);
      return { ok: false, message: 'Error de red' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
