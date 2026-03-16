import React, { useEffect, useState } from 'react';
import { getInsforgeClient } from '../../lib/insforgeClient';
import type { Lead, Notification } from '../../types/insforgeTypes';

export function AdminOverviewPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const client = getInsforgeClient();
    client
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setLeads(data as Lead[]);
      });

    client
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setNotifications(data as Notification[]);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-1">Admin Overview</h1>
        <p className="text-sm text-slate-400">
          Recent leads and system notifications at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Recent Leads</h2>
          </div>
          <div className="space-y-2 text-xs">
            {leads.length === 0 && (
              <p className="text-slate-500">No leads captured yet.</p>
            )}
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-md border border-white/10 bg-slate-900/60 px-3 py-2"
              >
                <p className="font-medium text-slate-100">
                  {lead.name}{' '}
                  <span className="text-slate-500 text-[10px]">
                    {lead.email}
                  </span>
                </p>
                <p className="text-[11px] text-slate-500">
                  {lead.service_interest || 'General enquiry'} •{' '}
                  {lead.status.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-2 text-xs">
            {notifications.length === 0 && (
              <p className="text-slate-500">No notifications yet.</p>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                className="rounded-md border border-white/10 bg-slate-900/60 px-3 py-2"
              >
                <p className="font-medium text-slate-100">{n.type}</p>
                <p className="text-[11px] text-slate-500">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

