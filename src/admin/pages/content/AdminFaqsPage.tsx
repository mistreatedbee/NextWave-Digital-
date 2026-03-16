import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { fetchAllFaqs, createFaq, updateFaq, deleteFaq } from '../../../api/content';
import type { Faq } from '../../../types/insforgeTypes';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Select } from '../../../components/ui/Select';

const FAQ_CATEGORIES = ['General', 'Services', 'Pricing', 'Projects'];

export function AdminFaqsPage() {
  const [items, setItems] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState({
    category: 'General',
    question: '',
    answer: '',
    sort_order: 0,
    is_active: true,
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllFaqs();
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
      category: 'General',
      question: '',
      answer: '',
      sort_order: items.length,
      is_active: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        category: form.category,
        question: form.question,
        answer: form.answer,
        sort_order: form.sort_order,
        is_active: form.is_active,
      };
      if (editing) {
        await updateFaq(editing.id, payload);
      } else {
        await createFaq(payload);
      }
      resetForm();
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (f: Faq) => {
    setEditing(f);
    setForm({
      category: f.category,
      question: f.question,
      answer: f.answer,
      sort_order: f.sort_order,
      is_active: f.is_active,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">FAQs</h1>
        <Button onClick={resetForm} leftIcon={<Plus className="w-4 h-4" />}>
          New FAQ
        </Button>
      </div>

      <form onSubmit={handleSave} className="mb-8 p-6 rounded-xl border border-white/10 bg-slate-900/50 space-y-4">
        <h2 className="text-lg font-semibold text-white">{editing ? 'Edit FAQ' : 'New FAQ'}</h2>
        <Select
          label="Category"
          options={FAQ_CATEGORIES.map((c) => ({ value: c, label: c }))}
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <Input label="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required />
        <Textarea label="Answer" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required />
        <Input type="number" label="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })} />
        <div className="flex items-center gap-2">
          <input type="checkbox" id="active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
          <label htmlFor="active" className="text-sm text-slate-300">Active</label>
        </div>
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
        <div className="space-y-4">
          {FAQ_CATEGORIES.map((cat) => {
            const faqsInCat = items.filter((f) => f.category === cat);
            if (!faqsInCat.length) return null;
            return (
              <div key={cat} className="border border-white/10 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-teal-400 mb-3">{cat}</h3>
                <ul className="space-y-2">
                  {faqsInCat.map((f) => (
                    <li key={f.id} className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 last:border-0">
                      <div>
                        <p className="text-white font-medium">{f.question}</p>
                        <p className="text-slate-400 text-sm line-clamp-1">{f.answer}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => openEdit(f)} className="text-teal-400 hover:text-teal-300 p-1"><Pencil className="w-4 h-4" /></button>
                        <button onClick={async () => { if (confirm('Delete?')) { await deleteFaq(f.id); load(); } }} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
