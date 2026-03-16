import { getInsforgeClient } from '../lib/insforgeClient';
import type {
  BlogPost,
  Faq,
  FooterSettings,
  HomeSettings,
  Offer,
  PortfolioProject,
  Service,
  Testimonial,
} from '../types/insforgeTypes';

const client = getInsforgeClient();

export async function fetchPortfolioProjects(): Promise<PortfolioProject[]> {
  const { data, error } = await client
    .from('portfolio_projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as PortfolioProject[];
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function fetchBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return (data as BlogPost | null) ?? null;
}

export async function fetchFaqs(): Promise<Faq[]> {
  const { data, error } = await client
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Faq[];
}

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await client
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Service[];
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await client
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}

export async function fetchHomeSettings(): Promise<HomeSettings | null> {
  const { data, error } = await client
    .from('home_settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as HomeSettings | null) ?? null;
}

export async function fetchFooterSettings(): Promise<FooterSettings | null> {
  const { data, error } = await client
    .from('footer_settings')
    .select('*')
    .limit(1);
  if (error) throw error;
  const rows = (data ?? []) as FooterSettings[];
  return rows[0] ?? null;
}

// ─── Admin CRUD ─────────────────────────────────────────────────────────────

export async function fetchAllPortfolioProjects(): Promise<PortfolioProject[]> {
  const { data, error } = await client
    .from('portfolio_projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as PortfolioProject[];
}

export async function createPortfolioProject(
  input: Omit<PortfolioProject, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<PortfolioProject, 'id'>>
): Promise<PortfolioProject> {
  const { data, error } = await client
    .from('portfolio_projects')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as PortfolioProject;
}

export async function updatePortfolioProject(
  id: string,
  patch: Partial<Omit<PortfolioProject, 'id' | 'created_at'>>
): Promise<PortfolioProject> {
  const { data, error } = await client
    .from('portfolio_projects')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as PortfolioProject;
}

export async function deletePortfolioProject(id: string): Promise<void> {
  const { error } = await client.from('portfolio_projects').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchAllBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .order('published_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function createBlogPost(
  input: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<BlogPost, 'id'>>
): Promise<BlogPost> {
  const { data, error } = await client.from('blog_posts').insert(input).select().single();
  if (error) throw error;
  return data as BlogPost;
}

export async function updateBlogPost(
  id: string,
  patch: Partial<Omit<BlogPost, 'id' | 'created_at'>>
): Promise<BlogPost> {
  const { data, error } = await client
    .from('blog_posts')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as BlogPost;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const { error } = await client.from('blog_posts').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchAllServices(): Promise<Service[]> {
  const { data, error } = await client.from('services').select('*').order('created_at');
  if (error) throw error;
  return (data ?? []) as Service[];
}

export async function createService(
  input: Omit<Service, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Service, 'id'>>
): Promise<Service> {
  const { data, error } = await client.from('services').insert(input).select().single();
  if (error) throw error;
  return data as Service;
}

export async function updateService(
  id: string,
  patch: Partial<Omit<Service, 'id' | 'created_at'>>
): Promise<Service> {
  const { data, error } = await client
    .from('services')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Service;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await client.from('services').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchAllOffers(): Promise<Offer[]> {
  const { data, error } = await client.from('offers').select('*').order('created_at');
  if (error) throw error;
  return (data ?? []) as Offer[];
}

export async function createOffer(
  input: Omit<Offer, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Offer, 'id'>>
): Promise<Offer> {
  const { data, error } = await client.from('offers').insert(input).select().single();
  if (error) throw error;
  return data as Offer;
}

export async function updateOffer(
  id: string,
  patch: Partial<Omit<Offer, 'id' | 'created_at'>>
): Promise<Offer> {
  const { data, error } = await client
    .from('offers')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Offer;
}

export async function deleteOffer(id: string): Promise<void> {
  const { error } = await client.from('offers').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchAllTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await client.from('testimonials').select('*').order('sort_order');
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}

export async function createTestimonial(
  input: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Testimonial, 'id'>>
): Promise<Testimonial> {
  const { data, error } = await client.from('testimonials').insert(input).select().single();
  if (error) throw error;
  return data as Testimonial;
}

export async function updateTestimonial(
  id: string,
  patch: Partial<Omit<Testimonial, 'id' | 'created_at'>>
): Promise<Testimonial> {
  const { data, error } = await client
    .from('testimonials')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Testimonial;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await client.from('testimonials').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchAllFaqs(): Promise<Faq[]> {
  const { data, error } = await client.from('faqs').select('*').order('sort_order');
  if (error) throw error;
  return (data ?? []) as Faq[];
}

export async function createFaq(
  input: Omit<Faq, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Faq, 'id'>>
): Promise<Faq> {
  const { data, error } = await client.from('faqs').insert(input).select().single();
  if (error) throw error;
  return data as Faq;
}

export async function updateFaq(
  id: string,
  patch: Partial<Omit<Faq, 'id' | 'created_at'>>
): Promise<Faq> {
  const { data, error } = await client
    .from('faqs')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Faq;
}

export async function deleteFaq(id: string): Promise<void> {
  const { error } = await client.from('faqs').delete().eq('id', id);
  if (error) throw error;
}

export async function upsertHomeSettings(
  input: Partial<Omit<HomeSettings, 'id' | 'created_at' | 'updated_at'>>
): Promise<HomeSettings> {
  const row = { ...input, updated_at: new Date().toISOString() };
  const { data, error } = await client
    .from('home_settings')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data as HomeSettings;
}

export async function upsertFooterSettings(
  input: Partial<Omit<FooterSettings, 'id' | 'created_at' | 'updated_at'>>
): Promise<FooterSettings> {
  const row = { ...input, updated_at: new Date().toISOString() };
  const { data, error } = await client
    .from('footer_settings')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data as FooterSettings;
}

