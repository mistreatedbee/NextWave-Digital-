import React, { createContext, useContext, useEffect, useState } from 'react';
import { getInsforgeClientOptional } from '../../lib/insforgeClient';
import type { RoleCode, User } from '../../types/insforgeTypes';

interface AuthState {
  user: User | null;
  role: RoleCode | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const client = getInsforgeClientOptional();
    if (!client) {
      setState({ user: null, role: null, loading: false });
      return;
    }

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      setState((prev) => ({
        ...prev,
        user: null,
        role: null,
        loading: false,
      }));
    });

    client.auth.getSession().catch(() => {
      setState({ user: null, role: null, loading: false });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const client = getInsforgeClientOptional();
    if (!client) throw new Error('Website admin authentication is not configured.');
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const client = getInsforgeClientOptional();
    if (client) await client.auth.signOut();
    setState({ user: null, role: null, loading: false });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

