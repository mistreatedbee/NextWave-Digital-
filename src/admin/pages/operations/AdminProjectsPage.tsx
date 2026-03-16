import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import {
  fetchProjects,
  fetchClients,
  fetchTasks,
  createProject,
  updateProject,
} from '../../../api/operations';
import type { Project, ProjectStatus, Client } from '../../../types/insforgeTypes';
import { Plus, Pencil, X, ExternalLink, Github } from 'lucide-react';

const STATUSES: ProjectStatus[] = ['planned', 'active', 'on_hold', 'completed'];

export function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [tasksByProject, setTasksByProject] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({
    name: '',
    client_id: '',
    code: '',
    description: '',
    status: 'planned' as ProjectStatus,
    start_date: '',
    end_date: '',
    github_url: '',
    staging_url: '',
    production_url: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const [pr, cl, tk] = await Promise.all([fetchProjects(), fetchClients(), fetchTasks()]);
      setProjects(pr);
      setClients(cl);
      const counts: Record<string, number> = {};
      for (const t of tk) {
        if (t.project_id) counts[t.project_id] = (counts[t.project_id] ?? 0) + 1;
      }
      setTasksByProject(counts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = statusFilter === 'all'
    ? projects
    : projects.filter((p) => p.status === statusFilter);

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: '',
      client_id: '',
      code: '',
      description: '',
      status: 'planned',
      start_date: '',
      end_date: '',
      github_url: '',
      staging_url: '',
      production_url: '',
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        client_id: form.client_id || null,
        code: form.code || null,
        description: form.description || null,
        status: form.status,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        github_url: form.github_url || null,
        staging_url: form.staging_url || null,
        production_url: form.production_url || null,
      };
      if (editing) {
        await updateProject(editing.id, payload);
      } else {
        await createProject(payload);
      }
      resetForm();
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      name: p.name,
      client_id: p.client_id ?? '',
      code: p.code ?? '',
      description: p.description ?? '',
      status: p.status,
      start_date: p.start_date ? p.start_date.slice(0, 10) : '',
      end_date: p.end_date ? p.end_date.slice(0, 10) : '',
      github_url: p.github_url ?? '',
      staging_url: p.staging_url ?? '',
      production_url: p.production_url ?? '',
    });
  };

  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c.name]));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <div className="flex gap-4 items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
            className="bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
          <Button onClick={() => resetForm()} leftIcon={<Plus className="w-4 h-4" />}>
            New project
          </Button>
        </div>
      </div>

      {(editing || !projects.length) && (
        <form onSubmit={save} className="mb-8 p-6 rounded-xl border border-white/10 bg-slate-900/50 space-y-4">
          <h2 className="text-lg font-semibold text-white">{editing ? 'Edit project' : 'New project'}</h2>
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Client</label>
            <select
              value={form.client_id}
              onChange={(e) => setForm({ ...form, client_id: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            >
              <option value="">None</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <Input label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. NEXUS-001" />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input type="date" label="Start" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            <Input type="date" label="End" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          </div>
          <Input label="GitHub URL" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
          <Input label="Staging URL" value={form.staging_url} onChange={(e) => setForm({ ...form, staging_url: e.target.value })} />
          <Input label="Production URL" value={form.production_url} onChange={(e) => setForm({ ...form, production_url: e.target.value })} />
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
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tasks</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-white/5">
                  <td className="px-4 py-3 text-white font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-slate-300">{p.client_id ? clientMap[p.client_id] ?? '-' : '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${p.status === 'completed' ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {p.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">{tasksByProject[p.id] ?? 0}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {p.start_date ? new Date(p.start_date).toLocaleDateString() : '-'}
                    {p.end_date && ` → ${new Date(p.end_date).toLocaleDateString()}`}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {p.staging_url && (
                      <a href={p.staging_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => openEdit(p)} className="text-teal-400 hover:text-teal-300 p-1">
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
