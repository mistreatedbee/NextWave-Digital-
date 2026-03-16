import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { getInsforgeClient } from '../../lib/insforgeClient';
import type { SiteSettings } from '../types/insforgeTypes';
import { Shield, Key } from 'lucide-react';

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company_name: '',
    default_seo_title: '',
    default_seo_description: '',
    social_links: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const client = getInsforgeClient();
      const { data } = await client.from('site_settings').select('*').limit(1).maybeSingle();
      const row = (data ?? null) as SiteSettings | null;
      setSettings(row);
      if (row) {
        setForm({
          company_name: row.company_name,
          default_seo_title: row.default_seo_title ?? '',
          default_seo_description: row.default_seo_description ?? '',
          social_links: row.social_links_json
            ? JSON.stringify(JSON.parse(row.social_links_json), null, 2)
            : '{}',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const client = getInsforgeClient();
      const payload = {
        company_name: form.company_name,
        default_seo_title: form.default_seo_title || null,
        default_seo_description: form.default_seo_description || null,
        social_links_json: (() => {
          try {
            JSON.parse(form.social_links);
            return form.social_links;
          } catch {
            return '{}';
          }
        })(),
      };
      if (settings?.id) {
        await client.from('site_settings').update(payload).eq('id', settings.id);
      } else {
        await client.from('site_settings').insert(payload);
      }
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Site & Security</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="rounded-xl border border-white/10 bg-slate-900/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-400" />
            Site configuration
          </h2>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Company name"
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                required
              />
              <Input
                label="Default SEO title"
                value={form.default_seo_title}
                onChange={(e) => setForm({ ...form, default_seo_title: e.target.value })}
              />
              <Textarea
                label="Default SEO description"
                value={form.default_seo_description}
                onChange={(e) => setForm({ ...form, default_seo_description: e.target.value })}
                rows={3}
              />
              <Textarea
                label="Social links (JSON)"
                value={form.social_links}
                onChange={(e) => setForm({ ...form, social_links: e.target.value })}
                placeholder='{"twitter":"","linkedin":"","facebook":""}'
                className="font-mono text-sm"
                rows={6}
              />
              <Button type="submit" isLoading={saving}>
                Save settings
              </Button>
            </form>
          )}
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-900/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-teal-400" />
            Integrations
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            API keys and secrets are stored securely in environment variables.
            Only masked or placeholder values are shown here.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">Insforge / Supabase URL</span>
              <code className="text-slate-500 text-xs">••••••••</code>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">Anon key</span>
              <code className="text-slate-500 text-xs">••••••••</code>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">Email (Resend/SendGrid)</span>
              <code className="text-slate-500 text-xs">Configure in env</code>
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-4">
            Configure VITE_INSFORGE_URL and VITE_INSFORGE_ANON_KEY in .env for the
            frontend. Backend email triggers use server-side env vars.
          </p>
        </section>
      </div>

      <section className="mt-8 rounded-xl border border-white/10 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Audit logs</h2>
        <p className="text-slate-400 text-sm">
          Admin actions (create, update, delete) on content and operations
          tables are logged to the audit_logs table. Query them in your database
          or add an audit log viewer here.
        </p>
      </section>
    </div>
  );
}
