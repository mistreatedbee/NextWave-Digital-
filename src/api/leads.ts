import { getInsforgeClientOptional } from '../lib/insforgeClient';
import type { Lead } from '../types/insforgeTypes';

export interface SubmitLeadInput {
  name: string;
  email: string;
  phone?: string;
  service_interest?: string;
  budget_range?: string;
  message?: string;
  source_page?: string;
}

/** Submit a lead from public forms. Creates lead + notification. Works without Insforge (no-op). */
export async function submitLead(input: SubmitLeadInput): Promise<{ ok: boolean; id?: string }> {
  const client = getInsforgeClientOptional();
  if (!client) return { ok: true };

  const { data: lead, error: leadErr } = await client
    .from('leads')
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      service_interest: input.service_interest ?? null,
      budget_range: input.budget_range ?? null,
      message: input.message ?? null,
      source_page: input.source_page ?? null,
      status: 'new',
    })
    .select('id')
    .single();

  if (leadErr || !lead) return { ok: false };

  await client.from('notifications').insert({
    type: 'new_lead',
    payload_json: JSON.stringify({
      lead_id: lead.id,
      name: input.name,
      email: input.email,
      service_interest: input.service_interest,
      source_page: input.source_page,
    }),
    is_read: false,
  });

  return { ok: true, id: lead.id };
}

export async function addLeadNote(
  leadId: string,
  note: string,
  userId?: string
): Promise<void> {
  const client = getInsforgeClientOptional();
  if (!client) return;

  const { data: lead } = await client
    .from('leads')
    .select('notes_json')
    .eq('id', leadId)
    .single();

  const notes: { text: string; at: string; userId?: string }[] = JSON.parse(
    (lead?.notes_json as string) ?? '[]'
  );
  notes.push({ text: note, at: new Date().toISOString(), userId });
  const { error } = await client
    .from('leads')
    .update({ notes_json: JSON.stringify(notes) })
    .eq('id', leadId);
  if (error) throw error;
}
