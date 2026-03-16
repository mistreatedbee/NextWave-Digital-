import React, { createContext, useContext, useEffect, useState } from 'react';
import { getInsforgeClient } from '../../lib/insforgeClient';
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
    const client = getInsforgeClient();
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (event, session) => {
      if (!session?.user) {
        setState({ user: null, role: null, loading: false });
        return;
      }

      const { data, error } = await client
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error || !data) {
        setState({ user: null, role: null, loading: false });
        return;
      }

      setState({
        user: data,
        role: data.role,
        loading: false,
      });
    });

    client.auth
      .getSession()
      .then(async ({ data }) => {
        if (!data.session?.user) {
          setState((prev) => ({ ...prev, loading: false }));
          return;
        }
        const { data: userRow } = await client
          .from('users')
          .select('*')
          .eq('id', data.session.user.id)
          .maybeSingle();
        if (userRow) {
          setState({
            user: userRow,
            role: userRow.role,
            loading: false,
          });
        } else {
          setState({ user: null, role: null, loading: false });
        }
      })
      .catch(() => {
        setState({ user: null, role: null, loading: false });
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const client = getInsforgeClient();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (!data.session?.user) return;

    const { data: userRow } = await client
      .from('users')
      .select('*')
      .eq('id', data.session.user.id)
      .maybeSingle();

    if (userRow) {
      setState({
        user: userRow,
        role: userRow.role,
        loading: false,
      });
    }
  };

  const signOut = async () => {
    const client = getInsforgeClient();
    await client.auth.signOut();
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

