import React from 'react';
import { useAuth } from '../auth/AuthContext';
import type { RoleCode } from '../../types/insforgeTypes';

interface Props {
  allowed: RoleCode[];
  children: React.ReactElement;
}

export function RequireRole({ allowed, children }: Props) {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Checking permissions…
      </div>
    );
  }

  if (!role || !allowed.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center px-4">
          <h1 className="text-xl font-semibold text-white mb-2">Not authorized</h1>
          <p className="text-sm text-slate-400">
            You do not have permission to view this section of the admin.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

