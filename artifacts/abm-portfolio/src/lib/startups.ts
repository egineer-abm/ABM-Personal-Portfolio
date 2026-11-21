import { orderOf, readCollection, splitList } from '@/lib/frontmatter';

export type Startup = {
  slug: string;
  name: string;
  role: string;
  year: string;
  status: string;
  tagline: string;
  url: string;
  urlLabel: string;
  tags: string[];
  order: number;
  body: string;
};

const modules = import.meta.glob('/src/content/startups/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const startups: Startup[] = readCollection(modules)
  .map(({ slug, meta, body }) => ({
    slug,
    name: meta.name || slug.replace(/-/g, ' '),
    role: meta.role || '',
    year: meta.year || '',
    status: meta.status || '',
    tagline: meta.tagline || '',
    url: meta.url || '',
    urlLabel: meta.urlLabel || 'Visit',
    tags: splitList(meta.tags),
    order: orderOf(meta),
    body,
  }))
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
