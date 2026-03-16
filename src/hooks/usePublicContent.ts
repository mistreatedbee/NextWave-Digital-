import { useEffect, useState } from 'react';
import { getInsforgeClientOptional } from '../lib/insforgeClient';
import {
  fetchPortfolioProjects,
  fetchBlogPosts,
  fetchBlogPostBySlug,
  fetchFaqs,
  fetchServices,
  fetchTestimonials,
  fetchHomeSettings,
  fetchFooterSettings,
} from '../api/content';
import { portfolioItems } from '../data/portfolio';
import { blogPosts } from '../data/blog';
import { faqs } from '../data/faqs';
import { testimonials } from '../data/testimonials';
import type {
  PortfolioProject,
  BlogPost,
  Faq,
  Service,
  Testimonial,
  HomeSettings,
  FooterSettings,
} from '../types/insforgeTypes';

/** Portfolio items: API first, static fallback */
export function usePortfolio() {
  const [data, setData] = useState<PortfolioProject[] | null>(null);
  const [staticUsed, setStaticUsed] = useState(false);

  useEffect(() => {
    const client = getInsforgeClientOptional();
    if (!client) {
      setStaticUsed(true);
      setData(
        portfolioItems.map((p) => ({
          id: p.id,
          slug: p.id,
          title: p.title,
          summary: p.shortDescription,
          description: p.longDescription ?? null,
          tags: [p.category],
          industry: p.category,
          tech_stack: p.technologies,
          image_url: p.thumbnail,
          case_study_url: p.href ?? null,
          status: 'published',
          featured: false,
          created_at: '',
          updated_at: '',
        })) as unknown as PortfolioProject[]
      );
      return;
    }
    fetchPortfolioProjects()
      .then((r) => setData(r))
      .catch(() => {
        setStaticUsed(true);
        setData(
          portfolioItems.map((p) => ({
            id: p.id,
            slug: p.id,
            title: p.title,
            summary: p.shortDescription,
            description: p.longDescription ?? null,
            tags: [p.category],
            industry: p.category,
            tech_stack: p.technologies,
            image_url: p.thumbnail,
            case_study_url: p.href ?? null,
            status: 'published',
            featured: false,
            created_at: '',
            updated_at: '',
          })) as unknown as PortfolioProject[]
        );
      });
  }, []);

  return { data: data ?? [], staticUsed };
}

/** Blog list: API first, static fallback */
export function useBlogList() {
  const [data, setData] = useState<BlogPost[] | null>(null);
  const [staticUsed, setStaticUsed] = useState(false);

  useEffect(() => {
    const client = getInsforgeClientOptional();
    if (!client) {
      setStaticUsed(true);
      setData(
        blogPosts.map((p) => ({
          id: p.slug,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          content_markdown: '',
          cover_image_url: null,
          seo_title: null,
          seo_description: null,
          status: 'published' as const,
          published_at: p.date,
          created_at: p.date,
          updated_at: p.date,
          category: p.category,
          readTime: p.readTime,
          author: p.author,
        })) as unknown as BlogPost[]
      );
      return;
    }
    fetchBlogPosts()
      .then(setData)
      .catch(() => {
        setStaticUsed(true);
      setData(
        blogPosts.map((p) => ({
          id: p.slug,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          content_markdown: '',
          cover_image_url: null,
          seo_title: null,
          seo_description: null,
          status: 'published' as const,
          published_at: p.date,
          created_at: p.date,
          updated_at: p.date,
          category: p.category,
          author: p.author,
          readTime: p.readTime,
        })) as unknown as BlogPost[]
        );
      });
  }, []);

  return { data: data ?? [], staticUsed };
}

/** Single blog post: API first, static fallback */
export function useBlogPost(slug: string | undefined) {
  const [data, setData] = useState<BlogPost | null>(null);
  const [staticUsed, setStaticUsed] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const client = getInsforgeClientOptional();
    if (!client) {
      const p = blogPosts.find((x) => x.slug === slug);
      setStaticUsed(true);
      setData(
        p
          ? ({
              id: p.slug,
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt,
              content_markdown: '',
              cover_image_url: null,
              seo_title: null,
              seo_description: null,
              status: 'published',
              published_at: p.date,
              created_at: p.date,
              updated_at: p.date,
            } as BlogPost)
          : null
      );
      return;
    }
    fetchBlogPostBySlug(slug)
      .then(setData)
      .catch(() => {
        const p = blogPosts.find((x) => x.slug === slug);
        setStaticUsed(true);
        setData(
          p
            ? ({
                id: p.slug,
                slug: p.slug,
                title: p.title,
                excerpt: p.excerpt,
                content_markdown: '',
                cover_image_url: null,
                seo_title: null,
                seo_description: null,
                status: 'published',
                published_at: p.date,
                created_at: p.date,
                updated_at: p.date,
              } as BlogPost)
            : null
        );
      });
  }, [slug]);

  return { data, staticUsed };
}

/** FAQs: API first, static fallback */
export function useFaqs() {
  const [data, setData] = useState<Faq[] | null>(null);
  const [staticUsed, setStaticUsed] = useState(false);

  useEffect(() => {
    const client = getInsforgeClientOptional();
    if (!client) {
      setStaticUsed(true);
      setData(
        faqs.map((f, i) => ({
          id: f.id,
          category: f.category,
          question: f.question,
          answer: f.answer,
          sort_order: i,
          is_active: true,
          created_at: '',
          updated_at: '',
        })) as unknown as Faq[]
      );
      return;
    }
    fetchFaqs()
      .then(setData)
      .catch(() => {
        setStaticUsed(true);
        setData(
          faqs.map((f, i) => ({
            id: f.id,
            category: f.category,
            question: f.question,
            answer: f.answer,
            sort_order: i,
            is_active: true,
            created_at: '',
            updated_at: '',
          })) as unknown as Faq[]
        );
      });
  }, []);

  return { data: data ?? [], staticUsed };
}

/** Services: API first, static fallback */
export function useServices() {
  const [data, setData] = useState<Service[] | null>(null);
  const [staticUsed, setStaticUsed] = useState(false);

  useEffect(() => {
    const client = getInsforgeClientOptional();
    if (!client) {
      setStaticUsed(true);
      setData([]);
      return;
    }
    fetchServices()
      .then(setData)
      .catch(() => {
        setStaticUsed(true);
        setData([]);
      });
  }, []);

  return { data: data ?? [], staticUsed };
}

/** Testimonials: API first, static fallback */
export function useTestimonials() {
  const [data, setData] = useState<Testimonial[] | null>(null);
  const [staticUsed, setStaticUsed] = useState(false);

  useEffect(() => {
    const client = getInsforgeClientOptional();
    if (!client) {
      setStaticUsed(true);
      setData(
        testimonials.map((t, i) => ({
          id: t.id,
          client_name: t.name,
          client_role: t.role,
          company: t.company,
          quote: t.quote,
          avatar_url: null,
          project_id: null,
          sort_order: i,
          is_featured: false,
          created_at: '',
          updated_at: '',
        })) as unknown as Testimonial[]
      );
      return;
    }
    fetchTestimonials()
      .then(setData)
      .catch(() => {
        setStaticUsed(true);
        setData(
          testimonials.map((t, i) => ({
            id: t.id,
            client_name: t.name,
            client_role: t.role,
            company: t.company,
            quote: t.quote,
            avatar_url: null,
            project_id: null,
            sort_order: i,
            is_featured: false,
            created_at: '',
            updated_at: '',
          })) as unknown as Testimonial[]
        );
      });
  }, []);

  return { data: data ?? [], staticUsed };
}

/** Home settings: API first, null fallback */
export function useHomeSettings() {
  const [data, setData] = useState<HomeSettings | null>(null);

  useEffect(() => {
    const client = getInsforgeClientOptional();
    if (!client) return;
    fetchHomeSettings().then(setData).catch(() => setData(null));
  }, []);

  return data;
}

/** Footer settings: API first, null fallback */
export function useFooterSettings() {
  const [data, setData] = useState<FooterSettings | null>(null);

  useEffect(() => {
    const client = getInsforgeClientOptional();
    if (!client) return;
    fetchFooterSettings().then(setData).catch(() => setData(null));
  }, []);

  return data;
}
