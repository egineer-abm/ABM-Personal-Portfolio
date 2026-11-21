import type { ReactNode } from 'react';

type Block =
  | { type: 'heading'; level: 1 | 2 | 3 | 4; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'blockquote'; text: string }
  | { type: 'code'; lang: string; code: string }
  | { type: 'hr' };

const inlinePattern = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*)|(\[[^\]\n]+\]\([^)\s]+\))/g;

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  for (const match of text.matchAll(inlinePattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) nodes.push(text.slice(lastIndex, index));
    const token = match[0];
    key += 1;
    if (token.startsWith('`')) {
      nodes.push(<code key={key} className="font-mono-ui text-[13px]">{token.slice(1, -1)}</code>);
    } else if (token.startsWith('**')) {
      nodes.push(<strong key={key} className="font-semibold text-[hsl(var(--foreground))]">{renderInline(token.slice(2, -2))}</strong>);
    } else if (token.startsWith('*')) {
      nodes.push(<em key={key}>{renderInline(token.slice(1, -1))}</em>);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (link) nodes.push(<a key={key} href={link[2]} target="_blank" rel="noreferrer" className="text-[hsl(var(--accent))] underline underline-offset-4">{link[1]}</a>);
      else nodes.push(token);
    }
    lastIndex = index + token.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i += 1; continue; }
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const buffer: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith('```')) { buffer.push(lines[i]); i += 1; }
      i += 1;
      blocks.push({ type: 'code', lang, code: buffer.join('\n') });
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) { blocks.push({ type: 'heading', level: heading[1].length as 1 | 2 | 3 | 4, text: heading[2].trim() }); i += 1; continue; }
    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(line.trim())) { blocks.push({ type: 'hr' }); i += 1; continue; }
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length) {
        const item = lines[i].match(/^\s*[-*+]\s+(.*)$/);
        if (!item) break;
        items.push(item[1]);
        i += 1;
      }
      blocks.push({ type: 'list', ordered: false, items });
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length) {
        const item = lines[i].match(/^\s*\d+[.)]\s+(.*)$/);
        if (!item) break;
        items.push(item[1]);
        i += 1;
      }
      blocks.push({ type: 'list', ordered: true, items });
      continue;
    }
    if (line.startsWith('>')) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) { quote.push(lines[i].replace(/^>\s?/, '')); i += 1; }
      blocks.push({ type: 'blockquote', text: quote.join(' ') });
      continue;
    }
    const paragraph: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^#{1,4}\s/.test(lines[i]) && !lines[i].startsWith('```') && !lines[i].startsWith('>') && !/^\s*[-*+]\s+/.test(lines[i]) && !/^\s*\d+[.)]\s+/.test(lines[i])) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
  }
  return blocks;
}

const headingClass = (level: number): string =>
  level === 1 ? 'mt-10 first:mt-0 text-[24px] font-semibold tracking-[-.03em]'
  : level === 2 ? 'mt-9 first:mt-0 text-[20px] font-semibold tracking-[-.02em]'
  : level === 3 ? 'mt-8 first:mt-0 text-[16px] tracking-[-.02em]'
  : 'mt-8 first:mt-0 font-mono-ui text-[12px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]';

function renderBlock(block: Block, key: number): ReactNode {
  switch (block.type) {
    case 'heading': {
      const Tag = `h${block.level}` as 'h1';
      return <Tag key={key} className={headingClass(block.level)}>{renderInline(block.text)}</Tag>;
    }
    case 'paragraph':
      return <p key={key} className="mt-5 first:mt-0 text-[15px] leading-[1.8] text-[hsl(var(--muted-foreground))]">{renderInline(block.text)}</p>;
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag key={key} className={`mt-5 first:mt-0 space-y-2 pl-5 ${block.ordered ? 'list-decimal' : 'list-disc'} text-[15px] leading-[1.8] text-[hsl(var(--muted-foreground))]`}>
          {block.items.map((item, index) => <li key={index}>{renderInline(item)}</li>)}
        </Tag>
      );
    }
    case 'blockquote':
      return <blockquote key={key} className="mt-6 first:mt-0 border-l-2 border-[hsl(var(--accent))] pl-5 text-[15px] italic leading-[1.8] text-[hsl(var(--muted-foreground))]">{renderInline(block.text)}</blockquote>;
    case 'code':
      return (
        <pre key={key} className="mt-6 overflow-x-auto border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.36)] p-4 font-mono-ui text-[12px] leading-[1.7]"><code>{block.code}</code></pre>
      );
    case 'hr':
      return <hr key={key} className="my-10 border-t border-[hsl(var(--border))]" />;
  }
}

export function Markdown({ source }: { source: string }) {
  return <>{parseBlocks(source).map(renderBlock)}</>;
}
