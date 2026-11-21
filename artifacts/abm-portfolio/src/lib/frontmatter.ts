export type FrontMatter = Record<string, string>;

export type MarkdownEntry = {
  slug: string;
  meta: FrontMatter;
  body: string;
};

export function parseFrontmatter(source: string): { meta: FrontMatter; body: string } {
  const match = source.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: source.trim() };
  const meta: FrontMatter = {};
  for (const line of match[1].split('\n')) {
    const index = line.indexOf(':');
    if (index <= 0) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, '');
    if (key) meta[key] = value;
  }
  return { meta, body: match[2].trim() };
}

export function splitList(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseLinks(value: string | undefined): { label: string; href: string }[] {
  return splitList(value)
    .map((entry) => {
      const [label, href] = entry.split('|').map((part) => part.trim());
      return { label: label || href || 'Link', href: href || label };
    })
    .filter((link) => Boolean(link.href));
}

export function isTruthy(value: string | undefined): boolean {
  return /^(true|yes|on|1)$/i.test((value ?? '').trim());
}

export function readCollection(modules: Record<string, string>): MarkdownEntry[] {
  return Object.entries(modules)
    .filter(([file]) => !file.split('/').pop()!.startsWith('_'))
    .map(([file, source]) => {
      const slug = file.split('/').pop()!.replace(/\.md$/, '');
      const { meta, body } = parseFrontmatter(source);
      return { slug, meta, body };
    });
}

export function orderOf(meta: FrontMatter): number {
  const order = Number(meta.order);
  return Number.isFinite(order) ? order : 0;
}
