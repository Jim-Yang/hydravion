import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  cookie: string | null;
  setCookie: (cookie: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [cookie, setCookie] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ cookie, setCookie }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 