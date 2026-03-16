export type RoleCode = 'admin' | 'editor' | 'ops' | 'viewer';

export interface Service {
  id: string;
  name: string;
  description: string;
  icon_key: string | null;
  benefits_json: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  badge_text: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  tags: string[] | null;
  industry: string | null;
  tech_stack: string[] | null;
  image_url: string | null;
  case_study_url: string | null;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_markdown: string;
  cover_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  project_id: string | null;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Faq {
  id: string;
  category: 'General' | 'Services' | 'Pricing' | 'Projects' | string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  expertise_tags: string[] | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface HomeSettings {
  id: string;
  hero_headline: string;
  hero_subtitle: string;
  cta_primary_label: string;
  cta_secondary_label: string | null;
  badges_json: string | null;
  tech_logos_json: string | null;
  highlighted_metrics_json: string | null;
  created_at: string;
  updated_at: string;
}

export interface FooterSettings {
  id: string;
  company_name: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  social_links_json: string | null;
  copyright_text: string | null;
  created_at: string;
  updated_at: string;
}

export type LeadStatus = 'new' | 'in_progress' | 'won' | 'lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service_interest: string | null;
  budget_range: string | null;
  message: string | null;
  source_page: string | null;
  status: LeadStatus;
  notes_json: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  primary_contact_name: string | null;
  primary_contact_email: string | null;
  primary_contact_phone: string | null;
  industry: string | null;
  size: string | null;
  website_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = 'planned' | 'active' | 'on_hold' | 'completed';

export interface Project {
  id: string;
  client_id: string | null;
  name: string;
  code: string | null;
  description: string | null;
  status: ProjectStatus;
  start_date: string | null;
  end_date: string | null;
  github_url: string | null;
  staging_url: string | null;
  production_url: string | null;
  budget: number | null;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  project_id: string | null;
  assignee_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: RoleCode;
  created_at: string;
  last_login_at: string | null;
}

export interface Role {
  id: string;
  code: RoleCode;
  label: string;
}

export interface Notification {
  id: string;
  type: string;
  payload_json: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  changes_json: string;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  company_name: string;
  default_seo_title: string | null;
  default_seo_description: string | null;
  social_links_json: string | null;
  created_at: string;
  updated_at: string;
}

export interface InsforgeEntityTables {
  services: Service;
  offers: Offer;
  portfolio_projects: PortfolioProject;
  blog_posts: BlogPost;
  testimonials: Testimonial;
  faqs: Faq;
  team_members: TeamMember;
  home_settings: HomeSettings;
  footer_settings: FooterSettings;
  leads: Lead;
  clients: Client;
  projects: Project;
  tasks: Task;
  users: User;
  roles: Role;
  notifications: Notification;
  audit_logs: AuditLog;
  site_settings: SiteSettings;
}

