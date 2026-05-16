import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
}

export function SEO({ title, description }: SEOProps) {
  useEffect(() => {
    document.title = title;
    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
  }, [title, description]);

  return null;
}
