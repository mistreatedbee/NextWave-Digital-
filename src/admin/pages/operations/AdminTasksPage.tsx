import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import {
  fetchTasks,
  fetchProjects,
  createTask,
  updateTask,
} from '../../../api/operations';
import type { Task, TaskStatus, TaskPriority } from '../../../types/insforgeTypes';
import { Plus, Pencil, X, LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';

const KANBAN_COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

export function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    project_id: '',
    status: 'backlog' as TaskStatus,
    priority: 'medium' as TaskPriority,
    due_date: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const [t, p] = await Promise.all([
        fetchTasks(),
        fetchProjects().then((ps) => ps.map((x) => ({ id: x.id, name: x.name })) as { id: string; name: string }[]),
      ]);
      setTasks(t);
      setProjects(p);
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
    setForm({ title: '', description: '', project_id: '', status: 'backlog', priority: 'medium', due_date: '' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        project_id: form.project_id || null,
        assignee_id: null,
        status: form.status,
        priority: form.priority,
        due_date: form.due_date || null,
        order_index: editing?.order_index ?? tasks.length,
      };
      if (editing) {
        await updateTask(editing.id, payload);
      } else {
        await createTask(payload);
      }
      resetForm();
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getProjectName = (id: string | null) =>
    projects.find((p) => p.id === id)?.name ?? '-';

  const tasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Tasks</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 hover:text-white'}`}
            title="Table view"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-2 rounded-md ${viewMode === 'kanban' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 hover:text-white'}`}
            title="Kanban view"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <Button onClick={() => resetForm()} leftIcon={<Plus className="w-4 h-4" />}>
            New task
          </Button>
        </div>
      </div>

      {(editing || true) && (
        <form onSubmit={handleSave} className="mb-8 p-6 rounded-xl border border-white/10 bg-slate-900/50 space-y-4">
          <h2 className="text-lg font-semibold text-white">{editing ? 'Edit task' : 'New task'}</h2>
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Project"
              value={form.project_id}
              onChange={(e) => setForm({ ...form, project_id: e.target.value })}
              options={[{ value: '', label: 'None' }, ...projects.map((p) => ({ value: p.id, label: p.name }))]}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
              options={KANBAN_COLUMNS.map((c) => ({ value: c.id, label: c.label }))}
            />
            <Select
              label="Priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
            />
          </div>
          <Input
            type="date"
            label="Due date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          />
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
      ) : viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {KANBAN_COLUMNS.map((col) => (
            <div key={col.id} className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">{col.label}</h3>
              <div className="space-y-3">
                {tasksByStatus(col.id).map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    className="p-3 rounded-lg bg-slate-800/80 border border-white/5 cursor-pointer hover:border-teal-500/30"
                    onClick={() => {
                      setEditing(t);
                      setForm({
                        title: t.title,
                        description: t.description ?? '',
                        project_id: t.project_id ?? '',
                        status: t.status,
                        priority: t.priority,
                        due_date: t.due_date ? t.due_date.split('T')[0] : '',
                      });
                    }}
                  >
                    <p className="text-white font-medium text-sm">{t.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{getProjectName(t.project_id)}</p>
                    <select
                      value={t.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(t.id, e.target.value as TaskStatus);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 text-xs bg-slate-700/50 border border-white/10 rounded px-2 py-1 text-slate-300"
                    >
                      {KANBAN_COLUMNS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-slate-400">
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Project</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Priority</th>
              <th className="pb-3 pr-4">Due</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} className="border-b border-white/5">
                <td className="py-3 pr-4 text-white font-medium">{t.title}</td>
                <td className="py-3 pr-4">{getProjectName(t.project_id)}</td>
                <td className="py-3 pr-4">
                  <span className="px-2 py-0.5 rounded text-xs bg-slate-500/20 text-slate-400">
                    {t.status}
                  </span>
                </td>
                <td className="py-3 pr-4">{t.priority}</td>
                <td className="py-3 pr-4 text-slate-500">
                  {t.due_date ? new Date(t.due_date).toLocaleDateString() : '-'}
                </td>
                <td className="py-3">
                  <button
                    onClick={() => {
                      setEditing(t);
                      setForm({
                        title: t.title,
                        description: t.description ?? '',
                        project_id: t.project_id ?? '',
                        status: t.status,
                        priority: t.priority,
                        due_date: t.due_date ? t.due_date.split('T')[0] : '',
                      });
                    }}
                    className="text-teal-400 hover:text-teal-300 p-1"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
