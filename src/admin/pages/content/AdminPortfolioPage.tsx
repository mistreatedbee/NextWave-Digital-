import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import {
  fetchAllPortfolioProjects,
  createPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
} from '../../../api/content';
import type { PortfolioProject } from '../../../types/insforgeTypes';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PortfolioProject | null>(null);
  const [form, setForm] = useState({
    slug: '',
    title: '',
    summary: '',
    description: '',
    industry: '',
    image_url: '',
    case_study_url: '',
    status: 'draft',
    featured: false,
    tags: '',
    tech_stack: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllPortfolioProjects();
      setItems(data);
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
      slug: '',
      title: '',
      summary: '',
      description: '',
      industry: '',
      image_url: '',
      case_study_url: '',
      status: 'draft',
      featured: false,
      tags: '',
      tech_stack: '',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
        title: form.title,
        summary: form.summary,
        description: form.description || null,
        industry: form.industry || null,
        image_url: form.image_url || null,
        case_study_url: form.case_study_url || null,
        status: form.status as 'draft' | 'published',
        featured: form.featured,
        tags: form.tags ? form.tags.split(',').map((s) => s.trim()).filter(Boolean) : null,
        tech_stack: form.tech_stack ? form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean) : null,
      };
      if (editing) {
        await updatePortfolioProject(editing.id, payload);
      } else {
        await createPortfolioProject(payload);
      }
      resetForm();
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      await deletePortfolioProject(id);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (p: PortfolioProject) => {
    setEditing(p);
    setForm({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      description: p.description ?? '',
      industry: p.industry ?? '',
      image_url: p.image_url ?? '',
      case_study_url: p.case_study_url ?? '',
      status: p.status,
      featured: p.featured,
      tags: (p.tags ?? []).join(', '),
      tech_stack: (p.tech_stack ?? []).join(', '),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Portfolio</h1>
        <Button onClick={() => resetForm()} leftIcon={<Plus className="w-4 h-4" />}>
          New project
        </Button>
      </div>

      {(editing || !items.length) && (
        <form onSubmit={handleSave} className="mb-8 p-6 rounded-xl border border-white/10 bg-slate-900/50 space-y-4">
          <h2 className="text-lg font-semibold text-white">{editing ? 'Edit project' : 'New project'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto from title" />
            <Input label="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            <Input label="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            <Input label="Case study URL" value={form.case_study_url} onChange={(e) => setForm({ ...form, case_study_url: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="featured" className="text-sm text-slate-300">Featured</label>
            </div>
          </div>
          <Textarea label="Summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Tags (comma)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="AI, Automation" />
          <Input label="Tech stack (comma)" value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} placeholder="React, Node" />
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="pb-3 pr-4">Title</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Featured</th>
                <th className="pb-3 pr-4">Updated</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-white/5">
                  <td className="py-3 pr-4 text-white font-medium">{p.title}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded text-xs ${p.status === 'published' ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">{p.featured ? 'Yes' : 'No'}</td>
                  <td className="py-3 pr-4 text-slate-500">{new Date(p.updated_at).toLocaleDateString()}</td>
                  <td className="py-3 flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-teal-400 hover:text-teal-300 p-1">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-4 h-4" />
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
