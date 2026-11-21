import { isTruthy, orderOf, parseLinks, readCollection, splitList } from '@/lib/frontmatter';

export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  detail: string;
  category: string;
  status: string;
  year: string;
  stack: string[];
  links: { label: string; href: string }[];
  featured?: boolean;
};

export type Writing = {
  slug: string;
  date: string;
  title: string;
  tags: string[];
  excerpt: string;
  body: string;
};

export type Note = {
  slug: string;
  date: string;
  title: string;
  tags: string[];
  body: string;
};

const projectModules = import.meta.glob('/src/content/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const writingModules = import.meta.glob('/src/content/writings/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const noteModules = import.meta.glob('/src/content/notes/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const projects: Project[] = readCollection(projectModules)
  .map(({ slug, meta, body }) => ({
    slug,
    meta,
    project: {
      slug,
      title: meta.title || slug.replace(/-/g, ' '),
      eyebrow: meta.eyebrow || '',
      description: meta.description || body.split('\n')[0] || '',
      detail: body,
      category: meta.category || 'Tools',
      status: meta.status || '',
      year: meta.year || '',
      stack: splitList(meta.stack),
      links: parseLinks(meta.links),
      featured: isTruthy(meta.featured) || undefined,
    } satisfies Project,
  }))
  .sort((a, b) => orderOf(a.meta) - orderOf(b.meta) || a.project.title.localeCompare(b.project.title))
  .map(({ project }) => project);

export const writings: Writing[] = readCollection(writingModules)
  .map(({ slug, meta, body }) => ({
    slug,
    meta,
    writing: {
      slug,
      date: meta.date || '',
      title: meta.title || slug.replace(/-/g, ' '),
      tags: splitList(meta.tags),
      excerpt: meta.excerpt || body.split('\n')[0] || '',
      body,
    } satisfies Writing,
  }))
  .sort((a, b) => orderOf(a.meta) - orderOf(b.meta) || a.writing.title.localeCompare(b.writing.title))
  .map(({ writing }) => writing);

export const notes: Note[] = readCollection(noteModules)
  .map(({ slug, meta, body }) => ({
    slug,
    meta,
    note: {
      slug,
      date: meta.date || '',
      title: meta.title || slug.replace(/-/g, ' '),
      tags: splitList(meta.tags),
      body,
    } satisfies Note,
  }))
  .sort((a, b) => orderOf(a.meta) - orderOf(b.meta) || a.note.title.localeCompare(b.note.title))
  .map(({ note }) => note);

export const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/startups', label: 'Startups' },
  { href: '/publications', label: 'Publications' },
  { href: '/writings', label: 'Writings' },
  { href: '/notes', label: 'Notes' },
  { href: '/contact', label: 'Contact' },
];
