import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import {
  fetchAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../../../api/content';
import type { BlogPost } from '../../../types/insforgeTypes';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export function AdminBlogPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    slug: '',
    title: '',
    excerpt: '',
    content_markdown: '',
    seo_title: '',
    seo_description: '',
    status: 'draft' as 'draft' | 'published',
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllBlogPosts();
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
      excerpt: '',
      content_markdown: '',
      seo_title: '',
      seo_description: '',
      status: 'draft',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const payload = {
        slug,
        title: form.title,
        excerpt: form.excerpt,
        content_markdown: form.content_markdown,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        status: form.status,
        cover_image_url: null,
        published_at: form.status === 'published' ? new Date().toISOString() : null,
      };
      if (editing) {
        await updateBlogPost(editing.id, payload);
      } else {
        await createBlogPost(payload);
      }
      resetForm();
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      await deleteBlogPost(id);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content_markdown: p.content_markdown,
      seo_title: p.seo_title ?? '',
      seo_description: p.seo_description ?? '',
      status: p.status,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Blog</h1>
        <Button onClick={() => resetForm()} leftIcon={<Plus className="w-4 h-4" />}>
          New post
        </Button>
      </div>

      {(editing || !items.length) && (
        <form onSubmit={handleSave} className="mb-8 p-6 rounded-xl border border-white/10 bg-slate-900/50 space-y-4">
          <h2 className="text-lg font-semibold text-white">{editing ? 'Edit post' : 'New post'}</h2>
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto from title" />
          <Textarea label="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required />
          <Textarea label="Content (Markdown)" value={form.content_markdown} onChange={(e) => setForm({ ...form, content_markdown: e.target.value })} className="min-h-[200px]" />
          <Input label="SEO title" value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
          <Textarea label="SEO description" value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
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
                <th className="pb-3 pr-4">Published</th>
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
                  <td className="py-3 pr-4 text-slate-500">{p.published_at ? new Date(p.published_at).toLocaleDateString() : '-'}</td>
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
