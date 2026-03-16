import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { fetchHomeSettings, fetchFooterSettings, upsertHomeSettings, upsertFooterSettings } from '../../../api/content';
import type { HomeSettings, FooterSettings } from '../../../types/insforgeTypes';
import { Tabs } from '../../../components/ui/Tabs';

export function AdminHomeFooterPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'footer'>('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [home, setHome] = useState<Partial<HomeSettings>>({
    hero_headline: '',
    hero_subtitle: '',
    cta_primary_label: '',
    cta_secondary_label: '',
    badges_json: '',
    tech_logos_json: '',
    highlighted_metrics_json: '',
  });
  const [footer, setFooter] = useState<Partial<FooterSettings>>({
    company_name: '',
    address: '',
    email: '',
    phone: '',
    social_links_json: '',
    copyright_text: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const [h, f] = await Promise.all([fetchHomeSettings(), fetchFooterSettings()]);
      if (h) setHome({ ...home, ...h, badges_json: h.badges_json ?? '', tech_logos_json: h.tech_logos_json ?? '', highlighted_metrics_json: h.highlighted_metrics_json ?? '' });
      if (f) setFooter({ ...footer, ...f, social_links_json: f.social_links_json ?? '' });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveHome = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await upsertHomeSettings({
        hero_headline: home.hero_headline ?? '',
        hero_subtitle: home.hero_subtitle ?? '',
        cta_primary_label: home.cta_primary_label ?? '',
        cta_secondary_label: home.cta_secondary_label || null,
        badges_json: home.badges_json || null,
        tech_logos_json: home.tech_logos_json || null,
        highlighted_metrics_json: home.highlighted_metrics_json || null,
      });
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const saveFooter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await upsertFooterSettings({
        company_name: footer.company_name ?? '',
        address: footer.address || null,
        email: footer.email || null,
        phone: footer.phone || null,
        social_links_json: footer.social_links_json || null,
        copyright_text: footer.copyright_text || null,
      });
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Home & Footer</h1>
      <Tabs tabs={[{ id: 'home', label: 'Home' }, { id: 'footer', label: 'Footer' }]} activeId={activeTab} onChange={(id) => setActiveTab(id as 'home' | 'footer')} />

      {activeTab === 'home' && (
        <form onSubmit={saveHome} className="mt-6 p-6 rounded-xl border border-white/10 bg-slate-900/50 space-y-4">
          <Input label="Hero headline" value={home.hero_headline ?? ''} onChange={(e) => setHome({ ...home, hero_headline: e.target.value })} />
          <Textarea label="Hero subtitle" value={home.hero_subtitle ?? ''} onChange={(e) => setHome({ ...home, hero_subtitle: e.target.value })} />
          <Input label="CTA primary label" value={home.cta_primary_label ?? ''} onChange={(e) => setHome({ ...home, cta_primary_label: e.target.value })} />
          <Input label="CTA secondary label" value={home.cta_secondary_label ?? ''} onChange={(e) => setHome({ ...home, cta_secondary_label: e.target.value })} />
          <Textarea label="Badges JSON" value={home.badges_json ?? ''} onChange={(e) => setHome({ ...home, badges_json: e.target.value })} placeholder='["Badge 1","Badge 2"]' />
          <Textarea label="Tech logos JSON" value={home.tech_logos_json ?? ''} onChange={(e) => setHome({ ...home, tech_logos_json: e.target.value })} />
          <Textarea label="Metrics JSON" value={home.highlighted_metrics_json ?? ''} onChange={(e) => setHome({ ...home, highlighted_metrics_json: e.target.value })} />
          <Button type="submit" isLoading={saving}>Save home</Button>
        </form>
      )}

      {activeTab === 'footer' && (
        <form onSubmit={saveFooter} className="mt-6 p-6 rounded-xl border border-white/10 bg-slate-900/50 space-y-4">
          <Input label="Company name" value={footer.company_name ?? ''} onChange={(e) => setFooter({ ...footer, company_name: e.target.value })} />
          <Textarea label="Address" value={footer.address ?? ''} onChange={(e) => setFooter({ ...footer, address: e.target.value })} />
          <Input label="Email" value={footer.email ?? ''} onChange={(e) => setFooter({ ...footer, email: e.target.value })} type="email" />
          <Input label="Phone" value={footer.phone ?? ''} onChange={(e) => setFooter({ ...footer, phone: e.target.value })} />
          <Textarea label="Social links JSON" value={footer.social_links_json ?? ''} onChange={(e) => setFooter({ ...footer, social_links_json: e.target.value })} placeholder='{"twitter":"...","linkedin":"..."}' />
          <Input label="Copyright" value={footer.copyright_text ?? ''} onChange={(e) => setFooter({ ...footer, copyright_text: e.target.value })} />
          <Button type="submit" isLoading={saving}>Save footer</Button>
        </form>
      )}

      {loading && <p className="mt-4 text-slate-400">Loading...</p>}
    </div>
  );
}
