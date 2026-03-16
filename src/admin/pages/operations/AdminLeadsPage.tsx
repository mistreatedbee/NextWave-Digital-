import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { fetchLeads, updateLead } from '../../../api/operations';
import { addLeadNote } from '../../../api/leads';
import type { Lead, LeadStatus } from '../../../types/insforgeTypes';
import { Filter, MessageSquare, ChevronDown } from 'lucide-react';

const STATUSES: LeadStatus[] = ['new', 'in_progress', 'won', 'lost'];

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchLeads();
      setLeads(data);
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
    ? leads
    : leads.filter((l) => l.status === statusFilter);

  const updateStatus = async (id: string, status: LeadStatus) => {
    try {
      await updateLead(id, { status });
      load();
      if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status });
    } catch (e) {
      console.error(e);
    }
  };

  const addNote = async () => {
    if (!selectedLead || !noteText.trim()) return;
    try {
      await addLeadNote(selectedLead.id, noteText.trim());
      setNoteText('');
      load();
      setSelectedLead(null);
    } catch (e) {
      console.error(e);
    }
  };

  const notes = selectedLead?.notes_json
    ? (JSON.parse(selectedLead.notes_json) as { text: string; at: string }[])
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
            className="bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : (
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/60">
                  <tr className="text-left text-slate-400">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l) => (
                    <tr
                      key={l.id}
                      onClick={() => setSelectedLead(l)}
                      className={`border-t border-white/5 cursor-pointer hover:bg-slate-900/40 ${selectedLead?.id === l.id ? 'bg-slate-900/60' : ''}`}
                    >
                      <td className="px-4 py-3 text-white font-medium">{l.name}</td>
                      <td className="px-4 py-3 text-slate-300">{l.email}</td>
                      <td className="px-4 py-3 text-slate-400">{l.service_interest ?? '-'}</td>
                      <td className="px-4 py-3">
                        <select
                          value={l.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateStatus(l.id, e.target.value as LeadStatus)}
                          className="bg-slate-800 border border-white/10 rounded px-2 py-1 text-xs text-white"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{l.source_page ?? '-'}</td>
                      <td className="px-4 py-3 text-slate-500">{new Date(l.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6">
          {selectedLead ? (
            <>
              <h3 className="text-lg font-semibold text-white mb-4">{selectedLead.name}</h3>
              <p className="text-slate-400 text-sm mb-2">{selectedLead.email}</p>
              {selectedLead.phone && (
                <p className="text-slate-400 text-sm mb-2">{selectedLead.phone}</p>
              )}
              {selectedLead.service_interest && (
                <p className="text-slate-400 text-sm mb-2">Service: {selectedLead.service_interest}</p>
              )}
              {selectedLead.budget_range && (
                <p className="text-slate-400 text-sm mb-2">Budget: {selectedLead.budget_range}</p>
              )}
              {selectedLead.message && (
                <p className="text-slate-300 text-sm mb-4 mt-2 p-2 rounded bg-slate-800/50">
                  {selectedLead.message}
                </p>
              )}
              <div className="border-t border-white/10 pt-4 mt-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">Notes</p>
                <ul className="space-y-2 mb-4">
                  {notes.map((n, i) => (
                    <li key={i} className="text-sm text-slate-300 bg-slate-800/30 rounded p-2">
                      {n.text}
                      <span className="block text-xs text-slate-500 mt-1">{new Date(n.at).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note..."
                    className="min-h-[80px]"
                  />
                  <Button onClick={addNote} size="sm" leftIcon={<MessageSquare className="w-4 h-4" />}>
                    Add
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-slate-500 text-sm">Select a lead to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
