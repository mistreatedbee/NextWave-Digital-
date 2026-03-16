import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Link } from 'react-router-dom';
import {
  fetchClients,
  fetchProjects,
  createClient,
  updateClient,
} from '../../../api/operations';
import type { Client } from '../../../types/insforgeTypes';
import { Plus, Pencil, X } from 'lucide-react';

export function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [projectsByClient, setProjectsByClient] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState({
    name: '',
    primary_contact_name: '',
    primary_contact_email: '',
    primary_contact_phone: '',
    industry: '',
    size: '',
    website_url: '',
    notes: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const [cl, pr] = await Promise.all([fetchClients(), fetchProjects()]);
      setClients(cl);
      const counts: Record<string, number> = {};
      for (const p of pr) {
        if (p.client_id) counts[p.client_id] = (counts[p.client_id] ?? 0) + 1;
      }
      setProjectsByClient(counts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: '',
      primary_contact_name: '',
      primary_contact_email: '',
      primary_contact_phone: '',
      industry: '',
      size: '',
      website_url: '',
      notes: '',
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        primary_contact_name: form.primary_contact_name || null,
        primary_contact_email: form.primary_contact_email || null,
        primary_contact_phone: form.primary_contact_phone || null,
        industry: form.industry || null,
        size: form.size || null,
        website_url: form.website_url || null,
        notes: form.notes || null,
      };
      if (editing) {
        await updateClient(editing.id, payload);
      } else {
        await createClient(payload);
      }
      resetForm();
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (c: Client) => {
    setEditing(c);
    setForm({
      name: c.name,
      primary_contact_name: c.primary_contact_name ?? '',
      primary_contact_email: c.primary_contact_email ?? '',
      primary_contact_phone: c.primary_contact_phone ?? '',
      industry: c.industry ?? '',
      size: c.size ?? '',
      website_url: c.website_url ?? '',
      notes: c.notes ?? '',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <Button onClick={() => resetForm()} leftIcon={<Plus className="w-4 h-4" />}>
          New client
        </Button>
      </div>

      {(editing || !clients.length) && (
        <form onSubmit={save} className="mb-8 p-6 rounded-xl border border-white/10 bg-slate-900/50 space-y-4">
          <h2 className="text-lg font-semibold text-white">{editing ? 'Edit client' : 'New client'}</h2>
          <Input label="Company name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Contact name" value={form.primary_contact_name} onChange={(e) => setForm({ ...form, primary_contact_name: e.target.value })} />
            <Input label="Contact email" value={form.primary_contact_email} onChange={(e) => setForm({ ...form, primary_contact_email: e.target.value })} type="email" />
            <Input label="Contact phone" value={form.primary_contact_phone} onChange={(e) => setForm({ ...form, primary_contact_phone: e.target.value })} />
            <Input label="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            <Input label="Size" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="e.g. 10-50" />
            <Input label="Website" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} />
          </div>
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex gap-2">
            <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
            {editing && (
              <Button type="button" variant="outline" onClick={resetForm} leftIcon={<X className="w-4 h-4" />}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/60">
              <tr className="text-left text-slate-400">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Industry</th>
                <th className="px-4 py-3">Projects</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-t border-white/5">
                  <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-slate-300">{c.primary_contact_email ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-400">{c.industry ?? '-'}</td>
                  <td className="px-4 py-3">{projectsByClient[c.id] ?? 0}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(c)} className="text-teal-400 hover:text-teal-300 p-1">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
