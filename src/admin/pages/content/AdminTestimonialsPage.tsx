import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import {
  fetchAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../../../api/content';
import type { Testimonial } from '../../../types/insforgeTypes';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({
    client_name: '',
    client_role: '',
    company: '',
    quote: '',
    avatar_url: '',
    sort_order: 0,
    is_featured: false,
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllTestimonials();
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
      client_name: '',
      client_role: '',
      company: '',
      quote: '',
      avatar_url: '',
      sort_order: items.length,
      is_featured: false,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        client_name: form.client_name,
        client_role: form.client_role || null,
        company: form.company || null,
        quote: form.quote,
        avatar_url: form.avatar_url || null,
        project_id: null,
        sort_order: form.sort_order,
        is_featured: form.is_featured,
      };
      if (editing) {
        await updateTestimonial(editing.id, payload);
      } else {
        await createTestimonial(payload);
      }
      resetForm();
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      client_name: t.client_name,
      client_role: t.client_role ?? '',
      company: t.company ?? '',
      quote: t.quote,
      avatar_url: t.avatar_url ?? '',
      sort_order: t.sort_order,
      is_featured: t.is_featured,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Testimonials</h1>
        <Button onClick={resetForm} leftIcon={<Plus className="w-4 h-4" />}>
          New testimonial
        </Button>
      </div>

      <form onSubmit={handleSave} className="mb-8 p-6 rounded-xl border border-white/10 bg-slate-900/50 space-y-4">
        <h2 className="text-lg font-semibold text-white">{editing ? 'Edit testimonial' : 'New testimonial'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Client name" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} required />
          <Input label="Role" value={form.client_role} onChange={(e) => setForm({ ...form, client_role: e.target.value })} />
          <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <Input label="Avatar URL" value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} />
          <Input type="number" label="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })} />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="feat" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded" />
            <label htmlFor="feat" className="text-sm text-slate-300">Featured</label>
          </div>
        </div>
        <Textarea label="Quote" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required />
        <div className="flex gap-2">
          <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
          {editing && (
            <Button type="button" variant="outline" onClick={resetForm} leftIcon={<X className="w-4 h-4" />}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-slate-400">
              <th className="pb-3 pr-4">Client</th>
              <th className="pb-3 pr-4">Company</th>
              <th className="pb-3 pr-4">Order</th>
              <th className="pb-3 pr-4">Featured</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="border-b border-white/5">
                <td className="py-3 pr-4 text-white font-medium">{t.client_name}</td>
                <td className="py-3 pr-4">{t.company ?? '-'}</td>
                <td className="py-3 pr-4">{t.sort_order}</td>
                <td className="py-3 pr-4">{t.is_featured ? 'Yes' : 'No'}</td>
                <td className="py-3 flex gap-2">
                  <button onClick={() => openEdit(t)} className="text-teal-400 hover:text-teal-300 p-1"><Pencil className="w-4 h-4" /></button>
                  <button onClick={async () => { if (confirm('Delete?')) { await deleteTestimonial(t.id); load(); } }} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
