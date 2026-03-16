import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import {
  fetchAllServices,
  createService,
  updateService,
  deleteService,
  fetchAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from '../../../api/content';
import type { Service, Offer } from '../../../types/insforgeTypes';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Tabs } from '../../../components/ui/Tabs';

export function AdminServicesOffersPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'offers'>('services');

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', icon_key: '', benefits: '', is_active: true });

  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    badge_text: '',
    start_date: '',
    end_date: '',
    is_active: true,
  });

  const load = async () => {
    setLoading(true);
    try {
      const [s, o] = await Promise.all([fetchAllServices(), fetchAllOffers()]);
      setServices(s);
      setOffers(o);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: serviceForm.name,
        description: serviceForm.description,
        icon_key: serviceForm.icon_key || null,
        benefits_json: serviceForm.benefits ? JSON.stringify(serviceForm.benefits.split('\n').filter(Boolean)) : null,
        is_active: serviceForm.is_active,
      };
      if (editingService) {
        await updateService(editingService.id, payload);
      } else {
        await createService(payload);
      }
      setEditingService(null);
      setServiceForm({ name: '', description: '', icon_key: '', benefits: '', is_active: true });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const saveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: offerForm.title,
        description: offerForm.description,
        badge_text: offerForm.badge_text || null,
        start_date: offerForm.start_date || null,
        end_date: offerForm.end_date || null,
        is_active: offerForm.is_active,
      };
      if (editingOffer) {
        await updateOffer(editingOffer.id, payload);
      } else {
        await createOffer(payload);
      }
      setEditingOffer(null);
      setOfferForm({ title: '', description: '', badge_text: '', start_date: '', end_date: '', is_active: true });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Services & Offers</h1>

      <Tabs
        tabs={[
          { id: 'services', label: 'Services' },
          { id: 'offers', label: 'Offers' },
        ]}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as 'services' | 'offers')}
      />

      {activeTab === 'services' && (
        <div className="mt-6">
          <form onSubmit={saveService} className="mb-8 p-6 rounded-xl border border-white/10 bg-slate-900/50 space-y-4">
            <h2 className="text-lg font-semibold text-white">{editingService ? 'Edit service' : 'New service'}</h2>
            <Input label="Name" value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} required />
            <Textarea label="Description" value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} required />
            <Input label="Icon key" value={serviceForm.icon_key} onChange={(e) => setServiceForm({ ...serviceForm, icon_key: e.target.value })} placeholder="brain, code2, globe" />
            <Textarea label="Benefits (one per line)" value={serviceForm.benefits} onChange={(e) => setServiceForm({ ...serviceForm, benefits: e.target.value })} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="svc-active" checked={serviceForm.is_active} onChange={(e) => setServiceForm({ ...serviceForm, is_active: e.target.checked })} className="rounded" />
              <label htmlFor="svc-active" className="text-sm text-slate-300">Active</label>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingService ? 'Update' : 'Create'}</Button>
              {editingService && (
                <Button type="button" variant="outline" onClick={() => { setEditingService(null); setServiceForm({ name: '', description: '', icon_key: '', benefits: '', is_active: true }); }} leftIcon={<X className="w-4 h-4" />}>
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
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Active</th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id} className="border-b border-white/5">
                    <td className="py-3 pr-4 text-white font-medium">{s.name}</td>
                    <td className="py-3 pr-4">{s.is_active ? 'Yes' : 'No'}</td>
                    <td className="py-3 flex gap-2">
                      <button onClick={() => { setEditingService(s); setServiceForm({ name: s.name, description: s.description, icon_key: s.icon_key ?? '', benefits: s.benefits_json ? JSON.parse(s.benefits_json).join('\n') : '', is_active: s.is_active }); }} className="text-teal-400 hover:text-teal-300 p-1"><Pencil className="w-4 h-4" /></button>
                      <button onClick={async () => { if (confirm('Delete?')) { await deleteService(s.id); load(); } }} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'offers' && (
        <div className="mt-6">
          <form onSubmit={saveOffer} className="mb-8 p-6 rounded-xl border border-white/10 bg-slate-900/50 space-y-4">
            <h2 className="text-lg font-semibold text-white">{editingOffer ? 'Edit offer' : 'New offer'}</h2>
            <Input label="Title" value={offerForm.title} onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })} required />
            <Textarea label="Description" value={offerForm.description} onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })} required />
            <Input label="Badge text" value={offerForm.badge_text} onChange={(e) => setOfferForm({ ...offerForm, badge_text: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input type="date" label="Start date" value={offerForm.start_date} onChange={(e) => setOfferForm({ ...offerForm, start_date: e.target.value })} />
              <Input type="date" label="End date" value={offerForm.end_date} onChange={(e) => setOfferForm({ ...offerForm, end_date: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="off-active" checked={offerForm.is_active} onChange={(e) => setOfferForm({ ...offerForm, is_active: e.target.checked })} className="rounded" />
              <label htmlFor="off-active" className="text-sm text-slate-300">Active</label>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingOffer ? 'Update' : 'Create'}</Button>
              {editingOffer && (
                <Button type="button" variant="outline" onClick={() => { setEditingOffer(null); setOfferForm({ title: '', description: '', badge_text: '', start_date: '', end_date: '', is_active: true }); }} leftIcon={<X className="w-4 h-4" />}>
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
                  <th className="pb-3 pr-4">Title</th>
                  <th className="pb-3 pr-4">Badge</th>
                  <th className="pb-3 pr-4">Active</th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody>
                {offers.map((o) => (
                  <tr key={o.id} className="border-b border-white/5">
                    <td className="py-3 pr-4 text-white font-medium">{o.title}</td>
                    <td className="py-3 pr-4">{o.badge_text ?? '-'}</td>
                    <td className="py-3 pr-4">{o.is_active ? 'Yes' : 'No'}</td>
                    <td className="py-3 flex gap-2">
                      <button onClick={() => { setEditingOffer(o); setOfferForm({ title: o.title, description: o.description, badge_text: o.badge_text ?? '', start_date: o.start_date ?? '', end_date: o.end_date ?? '', is_active: o.is_active }); }} className="text-teal-400 hover:text-teal-300 p-1"><Pencil className="w-4 h-4" /></button>
                      <button onClick={async () => { if (confirm('Delete?')) { await deleteOffer(o.id); load(); } }} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
