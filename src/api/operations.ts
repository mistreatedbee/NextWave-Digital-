import { getInsforgeClient } from '../lib/insforgeClient';
import type { Client, Lead, Project, Task } from '../types/insforgeTypes';

const client = getInsforgeClient();

export async function fetchLeads(): Promise<Lead[]> {
  const { data, error } = await client
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Lead[];
}

export async function updateLeadStatus(
  id: string,
  status: Lead['status'],
): Promise<void> {
  const { error } = await client.from('leads').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function fetchClients(): Promise<Client[]> {
  const { data, error } = await client
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Client[];
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await client
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await client
    .from('tasks')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Task[];
}

export async function updateTask(
  id: string,
  patch: Partial<Task>,
): Promise<void> {
  const { error } = await client.from('tasks').update(patch).eq('id', id);
  if (error) throw error;
}

export async function createLead(
  input: Omit<Lead, 'id' | 'created_at' | 'updated_at'>
): Promise<Lead> {
  const { data, error } = await client.from('leads').insert(input).select().single();
  if (error) throw error;
  return data as Lead;
}

export async function updateLead(
  id: string,
  patch: Partial<Omit<Lead, 'id' | 'created_at'>>
): Promise<Lead> {
  const { data, error } = await client
    .from('leads')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Lead;
}

export async function fetchClientById(id: string): Promise<Client | null> {
  const { data, error } = await client.from('clients').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as Client | null;
}

export async function createClient(
  input: Omit<Client, 'id' | 'created_at' | 'updated_at'>
): Promise<Client> {
  const { data, error } = await client.from('clients').insert(input).select().single();
  if (error) throw error;
  return data as Client;
}

export async function updateClient(
  id: string,
  patch: Partial<Omit<Client, 'id' | 'created_at'>>
): Promise<Client> {
  const { data, error } = await client
    .from('clients')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Client;
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  const { data, error } = await client.from('projects').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as Project | null;
}

export async function createProject(
  input: Omit<Project, 'id' | 'created_at' | 'updated_at'>
): Promise<Project> {
  const { data, error } = await client.from('projects').insert(input).select().single();
  if (error) throw error;
  return data as Project;
}

export async function updateProject(
  id: string,
  patch: Partial<Omit<Project, 'id' | 'created_at'>>
): Promise<Project> {
  const { data, error } = await client
    .from('projects')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

export async function createTask(
  input: Omit<Task, 'id' | 'created_at' | 'updated_at'>
): Promise<Task> {
  const { data, error } = await client.from('tasks').insert(input).select().single();
  if (error) throw error;
  return data as Task;
}

