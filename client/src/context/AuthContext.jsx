import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const ADMIN_EMAILS = ['anthony.okoro@clubconcierge.com', 'ceo@gotravelcc.com'];

export function AuthProvider({ children }) {
  const [branch, setBranch] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedBranch = localStorage.getItem('branch');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedBranch) {
      setToken(savedToken);
      setBranch(JSON.parse(savedBranch));
      if (savedUser) setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (tokenValue, branchData, userData) => {
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('branch', JSON.stringify(branchData));
    if (userData) localStorage.setItem('user', JSON.stringify(userData));
    setToken(tokenValue);
    setBranch(branchData);
    if (userData) setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('branch');
    localStorage.removeItem('user');
    setToken(null);
    setBranch(null);
    setUser(null);
  };

  const isAdmin = user ? ADMIN_EMAILS.includes(user.email?.toLowerCase()) : false;

  return (
    <AuthContext.Provider value={{ branch, token, user, loading, login, logout, isAuthenticated: !!token, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
