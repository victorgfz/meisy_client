import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { userStorage, tokenStorage } from '../../../lib/storage';
import type { AuthUser } from '../../../lib/storage';

interface LoginData {
  token: string;
  name: string;
  companyCode: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(userStorage.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!tokenStorage.getToken());

  const login = useCallback((data: LoginData) => {
    tokenStorage.setToken(data.token);

    const newUser = { name: data.name, companyCode: data.companyCode };
    userStorage.setUser(newUser);

    setUser(newUser);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.removeToken();
    userStorage.removeUser();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
