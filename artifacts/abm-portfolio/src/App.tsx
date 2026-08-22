import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, Command, ExternalLink, Github, Linkedin, Mail, Menu, Search, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, Route, Switch, Router as WouterRouter, useLocation, useParams } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { navItems, notes, projects, writings, type Project } from '@/lib/content';

const queryClient = new QueryClient();

function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const setMeta = (selector: string, content: string) => {
      let meta = document.querySelector<HTMLMetaElement>(selector);
      if (!meta) {
        meta = document.createElement('meta');
        const match = selector.match(/(?:name|property)="([^"]+)"/);
        if (match) meta.setAttribute(selector.includes('property') ? 'property' : 'name', match[1]);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', window.location.href.split('?')[0]);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href.split('?')[0];
  }, [title, description]);
}

function ArrowLink({ href, children, external = false, className = '' }: { href: string; children: ReactNode; external?: boolean; className?: string }) {
  if (external) {
    return <a data-testid={`link-external-${href.replace(/\W/g, '-')}`} href={href} target="_blank" rel="noreferrer" className={`group inline-flex items-center gap-2 focus-ring ${className}`}>{children}<ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>;
  }
  return <Link data-testid={`link-${href.replace(/\W/g, '-')}`} href={href} className={`group inline-flex items-center gap-2 focus-ring ${className}`}>{children}<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></Link>;
}

function SiteHeader({ onCommand }: { onCommand: () => void }) {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => href === '/' ? location === '/' : location === href || location.startsWith(`${href}/`);
  const go = (href: string) => { setOpen(false); setLocation(href); };
  return (
    <header className="relative z-20">
       <div className="mx-auto flex min-h-[72px] max-w-[1180px] items-center justify-between px-5 md:px-8">
        <Link href="/" data-testid="link-brand" className="focus-ring group flex items-center gap-3">
          <span className="text-[15px] font-semibold tracking-[-.04em]">abm</span>
        </Link>
        <nav className="hidden flex-wrap items-center justify-end gap-x-4 gap-y-1 text-[11px] md:flex" aria-label="Primary navigation">
          {navItems.slice(1).map((item) => <Link key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase()}`} className={`focus-ring transition-colors ${isActive(item.href) ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))]'}`}>{item.label.toLowerCase()}</Link>)}
        </nav>
        <button data-testid="button-mobile-menu" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} className="focus-ring flex items-center gap-2 text-[12px] md:hidden">
          {open ? <X size={17} /> : <Menu size={17} />}<span>{open ? 'Close' : 'Menu'}</span>
        </button>
      </div>
      {open && <div className="border-t border-[hsl(var(--border))] px-5 py-4 md:hidden">
        <nav className="mx-auto flex max-w-[680px] flex-col gap-1" aria-label="Mobile navigation">
           {navItems.map((item) => <button key={item.href} data-testid={`button-mobile-${item.label.toLowerCase()}`} onClick={() => go(item.href)} className="focus-ring flex w-full items-center justify-between border-b border-[hsl(var(--border)/.7)] py-3 text-left text-[14px]">{item.label}<ArrowRight size={14} className={isActive(item.href) ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--muted-foreground))]'} /></button>)}
          <button data-testid="button-command-mobile" onClick={() => { setOpen(false); onCommand(); }} className="focus-ring flex items-center gap-2 pt-4 text-left text-[12px] text-[hsl(var(--muted-foreground))]"><Search size={14} /> Search this site <span className="font-mono-ui ml-auto">⌘K</span></button>
        </nav>
      </div>}
    </header>
  );
}

function SiteFooter() {
  return <footer className="mx-auto mt-20 max-w-[680px] border-t border-[hsl(var(--border))] px-5 py-8">
    <div className="flex flex-col gap-4 text-[12px] text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between">
      <div><span className="font-medium text-[hsl(var(--foreground))]">abm</span><span className="mx-2">·</span>built with curiosity and too many browser tabs.</div>
      <div className="flex items-center gap-4">
        <a data-testid="link-footer-github" href="https://github.com/abm1119" target="_blank" rel="noreferrer" className="focus-ring hover:text-[hsl(var(--foreground))]">GitHub</a>
        <a data-testid="link-footer-linkedin" href="https://pk.linkedin.com/in/abdul-basit-memon-614961166" target="_blank" rel="noreferrer" className="focus-ring hover:text-[hsl(var(--foreground))]">LinkedIn</a>
        <a data-testid="link-footer-email" href="mailto:abm1119@ethz.ch" className="focus-ring hover:text-[hsl(var(--foreground))]">Email</a>
        <span className="font-mono-ui text-[10px]">© {new Date().getFullYear()}</span>
      </div>
    </div>
  </footer>;
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState('');
  const commands = navItems;
  const results = commands.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
  const go = (href: string) => { setLocation(href); onClose(); };
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [onClose]);
  return <div className="fixed inset-0 z-50 flex items-start justify-center bg-[hsl(var(--foreground)/.16)] px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="w-full max-w-[560px] overflow-hidden border border-[hsl(var(--foreground)/.18)] bg-[hsl(var(--background))] shadow-2xl">
      <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] px-4">
        <Search size={16} className="text-[hsl(var(--muted-foreground))]" />
        <input data-testid="input-command-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search or jump to…" className="h-14 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[hsl(var(--muted-foreground))]" />
        <kbd className="font-mono-ui text-[10px] text-[hsl(var(--muted-foreground))]">esc</kbd>
      </div>
      <div className="p-2">
        <p className="px-3 py-2 font-mono-ui text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">Navigate</p>
        {results.length > 0 ? results.map((item) => <button key={item.href} data-testid={`button-command-${item.label.toLowerCase()}`} onClick={() => go(item.href)} className="focus-ring flex w-full items-center justify-between px-3 py-3 text-left text-[14px] hover:bg-[hsl(var(--secondary))]">{item.label}<ArrowRight size={14} className="text-[hsl(var(--muted-foreground))]" /></button>) : <p className="px-3 py-5 text-[13px] text-[hsl(var(--muted-foreground))]">No pages match that search.</p>}
      </div>
      <div className="flex items-center gap-2 border-t border-[hsl(var(--border))] px-4 py-3 font-mono-ui text-[10px] text-[hsl(var(--muted-foreground))]"><Command size={11} /> tip: press <span className="text-[hsl(var(--foreground))]">⌘ K</span> anytime</div>
    </div>
  </div>;
}

function Layout({ children }: { children: ReactNode }) {
  const [palette, setPalette] = useState(false);
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setPalette(true); } };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, []);
  return <div className="min-h-[100dvh]"><SiteHeader onCommand={() => setPalette(true)} /><main className="page-enter">{children}</main><SiteFooter />{palette && <CommandPalette onClose={() => setPalette(false)} />}</div>;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="mb-6 flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.18em] text-[hsl(var(--accent))]"><span className="h-1.5 w-1.5 animate-[pulse-dot_2.4s_ease-in-out_infinite] rounded-full bg-[hsl(var(--accent))]" />{children}</div>;
}

function PageIntro({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  return <div className="mb-20 max-w-[780px]">
    <div className="mb-4 font-mono-ui text-[11px] text-[hsl(var(--muted-foreground))]">{kicker.toLowerCase()}</div>
    <h1 className="text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight tracking-[-.05em]">{title}</h1>
    <div className="mt-5 max-w-[580px] text-[16px] leading-[1.7] text-[hsl(var(--muted-foreground))]">{children}</div>
  </div>;
}

function Home() {
  usePageMeta('Abdul Basit Memon — Software, AI, Research, Design', 'The personal corner of Abdul Basit Memon: a computer systems engineer, independent builder, and AI explorer from Pakistan.');
  const homeLinks = [
    { href: '/projects', label: 'projects', description: 'things I have built, tested, and shipped' },
    { href: '/writings', label: 'writings', description: 'longer thoughts about software and AI' },
    { href: '/notes', label: 'notes', description: 'small ideas before they become articles' },
    { href: '/about', label: 'about', description: 'the person behind the tabs' },
    { href: '/now', label: 'now', description: 'what has my attention lately' },
    { href: '/experience', label: 'experience', description: 'education, programs, and builder background' },
    { href: '/publications', label: 'publications', description: 'research and academic work' },
    { href: '/contact', label: 'contact', description: 'start a conversation about a role or project' },
    { href: '/raw', label: 'raw', description: 'the plain-text map of this site' },
  ];
  return <div className="mx-auto max-w-[680px] px-5">
    <section className="py-24 sm:py-32">
      <div className="font-mono-ui text-[11px] text-[hsl(var(--muted-foreground))]">Abdul Basit Memon · Pakistan</div>
      <h1 className="mt-6 max-w-[610px] text-[clamp(2.5rem,8vw,4.6rem)] font-semibold leading-[1.02] tracking-[-.065em]">I build things with software, AI, and an unreasonable number of browser tabs.</h1>
       <p className="mt-7 max-w-[520px] text-[16px] leading-[1.7] text-[hsl(var(--muted-foreground))]">Computer systems engineer, AI builder, and creative technologist from Pakistan. I make useful software across agentic AI, developer tools, education, local-first systems, mobile apps, and embedded technology.</p>
       <p className="mt-5 max-w-[520px] text-[15px] leading-[1.7] text-[hsl(var(--muted-foreground))]">If you’re hiring for a curious engineer who can move from a rough idea to a working prototype, <Link href="/experience" className="focus-ring text-[hsl(var(--accent))] underline decoration-[hsl(var(--accent)/.35)] underline-offset-4">start with my experience</Link> or <Link href="/contact" className="focus-ring text-[hsl(var(--accent))] underline decoration-[hsl(var(--accent)/.35)] underline-offset-4">send me a note</Link>.</p>
    </section>
    <section className="border-t border-[hsl(var(--border))] py-10">
      <SectionLabel>Around here</SectionLabel>
      <div className="space-y-1">
        {homeLinks.map((item) => <Link key={item.href} href={item.href} data-testid={`link-home-${item.label}`} className="group flex items-baseline justify-between gap-5 py-3 text-[15px] focus-ring"><span><span className="text-[hsl(var(--accent))]">/{item.label}</span><span className="text-[hsl(var(--muted-foreground))]"> — {item.description}</span></span><ArrowRight size={14} className="shrink-0 text-[hsl(var(--muted-foreground))] transition-transform group-hover:translate-x-1 group-hover:text-[hsl(var(--accent))]" /></Link>)}
      </div>
    </section>
    <section className="border-t border-[hsl(var(--border))] py-10">
      <SectionLabel>Currently</SectionLabel>
      <div className="space-y-4 text-[15px] leading-[1.65]">
        <p><span className="font-mono-ui text-[11px] text-[hsl(var(--accent))]">building</span><br />AI tools, open resources, and a YouTube knowledge practice.</p>
        <p><span className="font-mono-ui text-[11px] text-[hsl(var(--accent))]">learning</span><br />Agentic systems, diffusion models, and better ways to teach with software.</p>
      </div>
    </section>
    <section className="border-t border-[hsl(var(--border))] py-10 text-[14px] text-[hsl(var(--muted-foreground))]">
      <span>elsewhere: </span><a className="focus-ring text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]" href="https://github.com/abm1119" target="_blank" rel="noreferrer">github</a><span> · </span><a className="focus-ring text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]" href="https://pk.linkedin.com/in/abdul-basit-memon-614961166" target="_blank" rel="noreferrer">linkedin</a><span> · </span><a className="focus-ring text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]" href="mailto:abm1119@ethz.ch">email</a>
    </section>
  </div>;
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return <Link href={`/projects/${project.slug}`} data-testid={`link-project-${project.slug}`} className="group grid grid-cols-[34px_1fr_auto] items-baseline gap-4 border-b border-[hsl(var(--border))] py-5 focus-ring md:grid-cols-[42px_1fr_1fr_auto] md:gap-6">
    <span className="font-mono-ui text-[11px] text-[hsl(var(--muted-foreground))]">{String(index + 1).padStart(2, '0')}</span>
    <div><h3 className="text-[18px] tracking-[-.02em] transition-transform duration-200 group-hover:translate-x-1">{project.title}</h3><p className="mt-1 text-[13px] text-[hsl(var(--muted-foreground))]">{project.eyebrow}</p></div>
    <div className="hidden text-[12px] text-[hsl(var(--muted-foreground))] md:block">{project.stack.slice(0, 3).join(' · ')}</div>
    <ArrowUpRight size={16} className="text-[hsl(var(--muted-foreground))] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
  </Link>;
}

function Projects() {
  usePageMeta('Projects — Abdul Basit Memon', 'A working archive of AI systems, developer tools, mobile apps, embedded experiments, and academic projects.');
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'AI', 'Tools', 'Open source', 'Mobile', 'Hardware', 'Web'];
  const filtered = filter === 'All' ? projects : projects.filter((project) => project.category === filter);
  return <div className="mx-auto max-w-[1180px] px-5 py-20 md:px-8 md:py-28"><PageIntro kicker="Archive / 01" title="Projects"><span>Things I’ve built, experimented with, broken, rebuilt, and occasionally shipped. The archive spans agentic AI, local-first tools, education, mobile software, and hardware.</span></PageIntro>
    <div className="mb-8 flex flex-wrap gap-x-5 gap-y-3 border-y border-[hsl(var(--border))] py-4" role="tablist" aria-label="Filter projects">{categories.map((category) => <button key={category} data-testid={`button-filter-${category.toLowerCase().replace(' ', '-')}`} onClick={() => setFilter(category)} role="tab" aria-selected={filter === category} className={`focus-ring font-mono-ui text-[10px] uppercase tracking-[.12em] transition-colors ${filter === category ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}>{category}</button>)}</div>
    <div className="grid gap-x-12 lg:grid-cols-2">{filtered.map((project, index) => <ProjectRow key={project.slug} project={project} index={index} />)}</div>
    {filtered.length === 0 && <div className="border border-dashed border-[hsl(var(--border))] py-16 text-center text-[14px] text-[hsl(var(--muted-foreground))]">No projects in this section yet.</div>}
  </div>;
}

function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((item) => item.slug === slug);
  if (!project) return <NotFound />;
  usePageMeta(`${project.title} — Abdul Basit Memon`, project.description);
  const related = projects.filter((item) => item.slug !== project.slug && item.category === project.category).slice(0, 2);
  return <div className="mx-auto max-w-[980px] px-5 py-16 md:px-8 md:py-24">
    <ArrowLink href="/projects" className="mb-16 text-[12px] text-[hsl(var(--muted-foreground))]"><ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />Back to projects</ArrowLink>
    <div className="max-w-[780px]"><SectionLabel>{project.category} / {project.year}</SectionLabel><h1 className="font-display text-[clamp(3.4rem,8vw,7rem)] leading-[.86] tracking-[-.055em]">{project.title}</h1><p className="mt-7 max-w-[620px] text-[20px] leading-[1.45] text-[hsl(var(--muted-foreground))]">{project.description}</p></div>
    <div className="mt-16 grid gap-8 border-y border-[hsl(var(--border))] py-7 sm:grid-cols-3"><div><span className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">Status</span><p className="mt-2 text-[13px]">{project.status}</p></div><div><span className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">Year</span><p className="mt-2 text-[13px]">{project.year}</p></div><div><span className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">Stack</span><p className="mt-2 text-[13px] leading-[1.7]">{project.stack.join(' · ')}</p></div></div>
    <article className="mt-20 max-w-[650px]"><SectionLabel>Notes on the build</SectionLabel><h2 className="font-display text-[2.5rem] leading-none tracking-[-.035em]">A useful problem is usually close to home.</h2><p className="mt-7 text-[17px] leading-[1.8] text-[hsl(var(--muted-foreground))]">{project.detail}</p></article>
    {project.links.length > 0 && <section className="mt-16 border-t border-[hsl(var(--border))] pt-7"><span className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">Links</span><div className="mt-4 flex flex-wrap gap-x-7 gap-y-3">{project.links.map((link) => <ArrowLink key={link.href} href={link.href} external className="text-[13px] text-[hsl(var(--accent))]">{link.label}</ArrowLink>)}</div></section>}
    {related.length > 0 && <section className="mt-24"><SectionLabel>Keep exploring</SectionLabel><div className="grid gap-8 sm:grid-cols-2">{related.map((item) => <Link key={item.slug} href={`/projects/${item.slug}`} data-testid={`link-related-${item.slug}`} className="group border-t border-[hsl(var(--border))] pt-4 focus-ring"><div className="flex items-center justify-between"><span className="font-mono-ui text-[10px] uppercase tracking-[.14em] text-[hsl(var(--muted-foreground))]">{item.category}</span><ArrowUpRight size={14} className="text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--accent))]" /></div><h3 className="mt-5 text-[19px]">{item.title}</h3><p className="mt-2 text-[13px] text-[hsl(var(--muted-foreground))]">{item.description}</p></Link>)}</div></section>}
  </div>;
}

function Writings() {
  usePageMeta('Writings — Abdul Basit Memon', 'Essays, build logs, and ideas from Abdul Basit Memon.');
  return <div className="mx-auto max-w-[900px] px-5 py-20 md:px-8 md:py-28"><PageIntro kicker="Notebook / 02" title="Writings"><span>Long-form thoughts about software, AI, learning, and the strange space between a useful tool and an interesting experiment.</span></PageIntro><div className="border-t border-[hsl(var(--border))]">{writings.map((writing, index) => <Link key={writing.slug} href={`/writings/${writing.slug}`} data-testid={`link-writing-archive-${writing.slug}`} className="group grid gap-3 border-b border-[hsl(var(--border))] py-8 focus-ring sm:grid-cols-[120px_1fr_auto] sm:gap-8"><div className="font-mono-ui text-[10px] uppercase tracking-[.13em] text-[hsl(var(--accent))]">{writing.date}</div><div><h2 className="text-[22px] tracking-[-.025em] transition-transform group-hover:translate-x-1">{writing.title}</h2><p className="mt-2 max-w-[530px] text-[14px] leading-[1.65] text-[hsl(var(--muted-foreground))]">{writing.excerpt}</p><div className="mt-3 flex gap-2 font-mono-ui text-[10px] text-[hsl(var(--muted-foreground))]">{writing.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></div><ArrowUpRight size={16} className="hidden text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--accent))] sm:block" /></Link>)}</div></div>;
}

function WritingDetail() {
  const { slug } = useParams<{ slug: string }>();
  const writing = writings.find((item) => item.slug === slug);
  if (!writing) return <NotFound />;
  usePageMeta(`${writing.title} — Abdul Basit Memon`, writing.excerpt);
  return <div className="mx-auto max-w-[820px] px-5 py-16 md:px-8 md:py-24"><ArrowLink href="/writings" className="mb-16 text-[12px] text-[hsl(var(--muted-foreground))]"><ArrowLeft size={14} />Back to writings</ArrowLink><SectionLabel>{writing.date} · field note</SectionLabel><h1 className="max-w-[720px] font-display text-[clamp(3rem,7vw,5.75rem)] leading-[.9] tracking-[-.05em]">{writing.title}</h1><p className="mt-7 max-w-[580px] text-[18px] leading-[1.65] text-[hsl(var(--muted-foreground))]">{writing.excerpt}</p><div className="prose prose-neutral mt-16 max-w-[650px] prose-p:font-sans prose-p:text-[16px] prose-p:leading-[1.8]"><p>This is a working note rather than a finished essay. The idea is being kept here in its useful, slightly unfinished state — the way most of my better questions begin.</p><p>{writing.title} is part of a larger thread I keep returning to: how tools can make knowledge more accessible without making the person using them less curious. I am still collecting examples, building small systems, and trying to describe what changes when software meets an actual life.</p><p>The final version will arrive when it has earned its shape.</p></div><div className="mt-16 flex gap-2 font-mono-ui text-[10px] text-[hsl(var(--muted-foreground))]">{writing.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></div>;
}

function Notes() {
  usePageMeta('Notes — Abdul Basit Memon', 'Short thoughts, fragments, and observations from Abdul Basit Memon’s technical notebook.');
  return <div className="mx-auto max-w-[820px] px-5 py-20 md:px-8 md:py-28"><PageIntro kicker="Raw ideas / 03" title="Notes"><span>Short thoughts, fragments, links, and technical observations. Not everything here has decided what it wants to become.</span></PageIntro><div className="border-t border-[hsl(var(--border))]">{notes.map((note) => <Link key={note.slug} href={`/notes/${note.slug}`} data-testid={`link-note-${note.slug}`} className="group block border-b border-[hsl(var(--border))] py-7 focus-ring"><div className="flex items-center justify-between"><span className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">{note.date}</span><ArrowUpRight size={15} className="text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--accent))]" /></div><h2 className="mt-4 max-w-[650px] font-display text-[clamp(1.8rem,3vw,2.5rem)] leading-[1] tracking-[-.025em] transition-colors group-hover:text-[hsl(var(--accent))]">{note.title}</h2><div className="mt-4 flex gap-2 font-mono-ui text-[10px] text-[hsl(var(--muted-foreground))]">{note.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></Link>)}</div></div>;
}

function NoteDetail() {
  const { slug } = useParams<{ slug: string }>();
  const note = notes.find((item) => item.slug === slug);
  if (!note) return <NotFound />;
  usePageMeta(`${note.title} — Notes — Abdul Basit Memon`, note.title);
  return <div className="mx-auto max-w-[720px] px-5 py-16 md:px-8 md:py-24"><ArrowLink href="/notes" className="mb-16 text-[12px] text-[hsl(var(--muted-foreground))]"><ArrowLeft size={14} />Back to notes</ArrowLink><div className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[hsl(var(--accent))]">note / {note.date}</div><h1 className="mt-6 font-display text-[clamp(2.8rem,6vw,5.25rem)] leading-[.9] tracking-[-.05em]">{note.title}</h1><div className="mt-12 border-l-2 border-[hsl(var(--accent))] pl-6 text-[18px] leading-[1.8] text-[hsl(var(--muted-foreground))]"><p>This is the sort of thought I want to keep close before it becomes polished. Local-first systems feel right to me because they respect the conditions where people actually learn and work: imperfect connections, private context, and the need to keep going without asking permission from a server.</p><p className="mt-6">Still thinking about this.</p></div><div className="mt-12 flex gap-2 font-mono-ui text-[10px] text-[hsl(var(--muted-foreground))]">{note.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></div>;
}

function About() {
  usePageMeta('About — Abdul Basit Memon', 'About Abdul Basit Memon, a computer systems engineer and independent builder from Pakistan.');
  return <div className="mx-auto max-w-[1000px] px-5 py-20 md:px-8 md:py-28"><PageIntro kicker="A person, not a résumé / 04" title="About"><span>I’m Abdul Basit, a computer systems engineer and independent builder from Pakistan. I like making things. Sometimes they’re useful. Sometimes they’re experiments. Sometimes they’re terrible ideas that teach me something.</span></PageIntro>
    <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr]"><div className="space-y-10"><div><SectionLabel>Who I am</SectionLabel><p className="text-[16px] leading-[1.8] text-[hsl(var(--muted-foreground))]">I graduated in Computer Systems Engineering from Sukkur IBA University. I move between software, AI, design, embedded systems, and the questions that appear when those things overlap.</p></div><div><SectionLabel>What I build</SectionLabel><p className="text-[16px] leading-[1.8] text-[hsl(var(--muted-foreground))]">Tools that make knowledge easier to reach, ideas easier to test, and everyday work a little less frustrating. Prologware Solutions is the larger community-shaped version of that instinct; Trubblx is an interactive learning and training platform.</p></div><div><SectionLabel>Research interests</SectionLabel><ul className="space-y-3 text-[14px] text-[hsl(var(--muted-foreground))]">{['Intelligent decentralized communication networks for businesses', 'AI for education', 'AI-based route optimization and ride matching', 'Agentic AI systems for personalized purposes'].map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[hsl(var(--accent))]" />{item}</li>)}</ul></div></div><div className="border-t border-[hsl(var(--border))] pt-7 lg:pt-0 lg:border-l lg:border-t-0 lg:pl-12"><SectionLabel>Tools I think with</SectionLabel><div className="space-y-7"><div><h3 className="text-[15px]">AI & generative systems</h3><p className="mt-2 text-[13px] leading-[1.7] text-[hsl(var(--muted-foreground))]">LLMs, RAG, MCPs, tool calling, agentic systems, ComfyUI, Flux, ControlNet, LoRA training, vector search, and evaluation.</p></div><div><h3 className="text-[15px]">Software & data</h3><p className="mt-2 text-[13px] leading-[1.7] text-[hsl(var(--muted-foreground))]">React + Vite, Node.js, FastAPI, Streamlit, Gradio, Supabase, PostgreSQL, SQLite, SQL Server, Python, C++, Java, C#, and Verilog.</p></div><div><h3 className="text-[15px]">Beyond software</h3><p className="mt-2 text-[13px] leading-[1.7] text-[hsl(var(--muted-foreground))]">I run my family’s bakery business, Khalid Bakers and Brothers, in Khairpur Mir’s. I do origami, make small IoT gadgets, listen to classical music, and keep learning because curiosity rarely respects a category.</p></div></div></div></div>
    <div className="mt-20 border-t border-[hsl(var(--border))] pt-8"><SectionLabel>Links</SectionLabel><div className="flex flex-wrap gap-x-8 gap-y-4 text-[13px]"><ArrowLink href="https://github.com/abm1119" external>GitHub</ArrowLink><ArrowLink href="https://pk.linkedin.com/in/abdul-basit-memon-614961166" external>LinkedIn</ArrowLink><ArrowLink href="https://twitter.com/abm1119" external>Twitter / X</ArrowLink><ArrowLink href="/contact">Contact</ArrowLink></div></div>
  </div>;
}

function Experience() {
  usePageMeta('Experience — Abdul Basit Memon', 'Education, training, and the work that shaped Abdul Basit Memon’s practice.');
  const entries = [
    { year: '2026', title: 'Applied AI Cohort', org: '100x Engineers', body: 'A six-month deep dive into diffusion models, LLM applications, RAG, tool calling, MCPs, and production-minded agent design. Completed June 2026.' },
    { year: '2025', title: 'B.E. Computer Systems Engineering', org: 'Sukkur IBA University', body: 'Graduated with a focus across full-stack development, database design, AI/ML fundamentals, embedded systems, and a capstone on intelligent carpooling.' },
    { year: '2025', title: 'Millennium Fellow', org: 'Millennium Campus Network', body: 'A formative leadership experience that sharpened how I think about access, community, and building for more than the obvious user.' },
    { year: '2024–', title: 'Founder & independent builder', org: 'Prologware Solutions · Trubblx · Think0 · Borlo Labs', body: 'Building community resources, learning tools, agency ideas, and small products around problems seen close to home.' },
  ];
  const certifications = ['Introduction to AI Agents', 'AI-Assisted Coding for Developers', 'Deploying AI into Production with FastAPI', 'AI Agents with Hugging Face smolagents', 'Introduction to Model Context Protocol (MCP)', 'Google for Startups: Startup School — Prompt to Prototype', '5-Day AI Agents Intensive Course — Google / Kaggle', 'McKinsey.org Forward Program'];
  return <div className="mx-auto max-w-[900px] px-5 py-20 md:px-8 md:py-28"><PageIntro kicker="Timeline / 05" title="Experience"><span>A loose timeline of the places, programs, and responsibilities that have shaped how I build.</span></PageIntro><div className="border-t border-[hsl(var(--border))]">{entries.map((entry) => <div key={entry.title} className="grid gap-4 border-b border-[hsl(var(--border))] py-8 sm:grid-cols-[100px_1fr] sm:gap-10"><div className="font-mono-ui text-[11px] text-[hsl(var(--accent))]">{entry.year}</div><div><h2 className="text-[20px] tracking-[-.02em]">{entry.title}</h2><p className="mt-1 text-[13px] text-[hsl(var(--muted-foreground))]">{entry.org}</p><p className="mt-4 max-w-[600px] text-[14px] leading-[1.75] text-[hsl(var(--muted-foreground))]">{entry.body}</p></div></div>)}</div><section className="mt-20 border-t border-[hsl(var(--border))] pt-8"><SectionLabel>Selected certifications</SectionLabel><div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">{certifications.map((item) => <div key={item} className="flex gap-3 text-[13px] leading-[1.5] text-[hsl(var(--muted-foreground))]"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[hsl(var(--accent))]" />{item}</div>)}</div></section></div>;
}

function Publications() {
  usePageMeta('Publications — Abdul Basit Memon', 'Research and academic work by Abdul Basit Memon.');
  return <div className="mx-auto max-w-[900px] px-5 py-20 md:px-8 md:py-28"><PageIntro kicker="Research / 06" title="Publications"><span>Research-minded work, kept in a simple bibliography rather than dressed up as a publication machine.</span></PageIntro><div className="border-t border-[hsl(var(--border))]"><div className="grid gap-4 border-b border-[hsl(var(--border))] py-8 sm:grid-cols-[100px_1fr] sm:gap-10"><div className="font-mono-ui text-[11px] text-[hsl(var(--accent))]">2025</div><div><h2 className="text-[20px]">Intelligent Carpooling: Route Matching and Overlap Feasibility</h2><p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Bachelor’s thesis · Computer Systems Engineering</p><p className="mt-5 max-w-[620px] text-[14px] leading-[1.75] text-[hsl(var(--muted-foreground))]">An evaluation of route matching and overlap feasibility for a shared-ride system, comparing A* with Dijkstra and standard greedy approaches to reduce resource utilization and compute overhead.</p><a data-testid="link-publication-repo" href="https://github.com/urooj-marvi/Carpooling_App" target="_blank" rel="noreferrer" className="focus-ring mt-5 inline-flex items-center gap-2 text-[13px] text-[hsl(var(--accent))]">Related project <ExternalLink size={13} /></a></div></div><div className="border-b border-[hsl(var(--border))] py-8 text-[14px] leading-[1.7] text-[hsl(var(--muted-foreground))]">More formal publications will appear here as the research finds its shape.</div></div></div>;
}

function Now() {
  usePageMeta('Now — Abdul Basit Memon', 'What Abdul Basit Memon is building, learning, and exploring now.');
  const items = [
    ['Building', 'A YouTube channel around AI tools, workflows, and practical learning; alongside open resource repositories for students and early founders.'],
    ['Learning', 'Diffusion workflows, LLM applications, RAG evaluation, tool calling, MCP servers, and agent guardrails.'],
    ['Thinking about', 'How to make access to knowledge and opportunity feel less dependent on where someone starts.'],
    ['Exploring', 'AI for education, privacy-respecting systems, local-first software, and the edge between a good interface and a good explanation.'],
  ];
  return <div className="mx-auto max-w-[900px] px-5 py-20 md:px-8 md:py-28"><PageIntro kicker="A living page / 07" title="Now"><span>A snapshot of what has my attention. This page will change as the work changes.</span></PageIntro><div className="border-t border-[hsl(var(--border))]">{items.map(([label, body]) => <div key={label} className="grid gap-4 border-b border-[hsl(var(--border))] py-8 sm:grid-cols-[150px_1fr] sm:gap-10"><div className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[hsl(var(--accent))]">{label}</div><p className="max-w-[600px] text-[16px] leading-[1.75]">{body}</p></div>)}</div></div>;
}

function Raw() {
  usePageMeta('Raw — Abdul Basit Memon', 'A developer-friendly map of Abdul Basit Memon’s personal site.');
  const files = ['README.md', 'about.md', 'projects.md', 'experience.md', 'publications.md', 'writings.md', 'notes.md', 'now.md', 'ideas.md', 'stack.md', 'beliefs.md'];
  const [selected, setSelected] = useState('README.md');
  const copy = selected === 'README.md' ? '# Abdul Basit Memon\n\nSoftware engineer, independent builder, AI explorer, researcher, and writer from Pakistan.\n\nThis is the plain-text edge of the site. It is intentionally easy to read, link to, and keep.' : `# ${selected.replace('.md', '').replace('-', ' ')}\n\nA readable representation of this section is being kept close to the source.\n\nSee the rendered page for the complete context.`;
  return <div className="mx-auto max-w-[1000px] px-5 py-20 md:px-8 md:py-28"><PageIntro kicker="Plain text / 08" title="Raw"><span>A developer-friendly representation of this corner of the internet. No clever rendering required.</span></PageIntro><div className="grid gap-8 md:grid-cols-[220px_1fr]"><aside className="border-t border-[hsl(var(--border))] pt-3"><div className="mb-3 font-mono-ui text-[10px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">Files</div>{files.map((file) => <button key={file} data-testid={`button-raw-${file.replace('.', '-')}`} onClick={() => setSelected(file)} className={`focus-ring block w-full border-b border-[hsl(var(--border)/.7)] py-3 text-left font-mono-ui text-[11px] transition-colors ${selected === file ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`}>{selected === file && <Check size={12} className="mr-2 inline" />}{file}</button>)}</aside><article className="min-h-[360px] border border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.36)] p-6 md:p-8"><div className="mb-6 flex items-center justify-between border-b border-[hsl(var(--border))] pb-4 font-mono-ui text-[10px] text-[hsl(var(--muted-foreground))]"><span>{selected}</span><span>markdown</span></div><pre className="whitespace-pre-wrap font-mono-ui text-[12px] leading-[1.9] text-[hsl(var(--foreground)/.8)]">{copy}</pre></article></div></div>;
}

function Contact() {
  usePageMeta('Contact — Abdul Basit Memon', 'Get in touch with Abdul Basit Memon about thoughtful technology, AI, and collaboration.');
  return <div className="mx-auto max-w-[1000px] px-5 py-20 md:px-8 md:py-28"><div className="grid gap-16 lg:grid-cols-[1.1fr_.9fr]"><div><SectionLabel>Open channel / 09</SectionLabel><h1 className="font-display text-[clamp(3.5rem,8vw,7.5rem)] leading-[.84] tracking-[-.06em]">Let’s talk<span className="text-[hsl(var(--accent))]">.</span></h1><p className="mt-8 max-w-[480px] text-[17px] leading-[1.75] text-[hsl(var(--muted-foreground))]">Have an interesting idea? Want to build something? Found a resource or question worth discussing? Email is the best place to begin.</p><a data-testid="link-contact-email" href="mailto:abm1119@ethz.ch" className="focus-ring mt-9 inline-flex items-center gap-3 border-b border-[hsl(var(--accent))] pb-2 text-[18px] text-[hsl(var(--accent))]">abm1119@ethz.ch <Mail size={16} /></a></div><div className="border-t border-[hsl(var(--border))] pt-5 lg:mt-10"><div className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">Elsewhere</div><div className="mt-5 flex flex-col gap-4 text-[15px]"><a data-testid="link-contact-github" href="https://github.com/abm1119" target="_blank" rel="noreferrer" className="focus-ring group flex items-center justify-between border-b border-[hsl(var(--border))] pb-4"><span className="flex items-center gap-3"><Github size={16} /> GitHub</span><ArrowUpRight size={14} className="text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--accent))]" /></a><a data-testid="link-contact-linkedin" href="https://pk.linkedin.com/in/abdul-basit-memon-614961166" target="_blank" rel="noreferrer" className="focus-ring group flex items-center justify-between border-b border-[hsl(var(--border))] pb-4"><span className="flex items-center gap-3"><Linkedin size={16} /> LinkedIn</span><ArrowUpRight size={14} className="text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--accent))]" /></a><a data-testid="link-contact-twitter" href="https://twitter.com/abm1119" target="_blank" rel="noreferrer" className="focus-ring group flex items-center justify-between border-b border-[hsl(var(--border))] pb-4"><span className="flex items-center gap-3"><ExternalLink size={16} /> Twitter / X</span><ArrowUpRight size={14} className="text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--accent))]" /></a></div></div></div></div>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Layout><Switch>
    <Route path="/" component={Home} />
    <Route path="/projects" component={Projects} />
    <Route path="/projects/:slug" component={ProjectDetail} />
    <Route path="/writings" component={Writings} />
    <Route path="/writings/:slug" component={WritingDetail} />
    <Route path="/notes" component={Notes} />
    <Route path="/notes/:slug" component={NoteDetail} />
    <Route path="/about" component={About} />
    <Route path="/experience" component={Experience} />
    <Route path="/publications" component={Publications} />
    <Route path="/now" component={Now} />
    <Route path="/raw" component={Raw} />
    <Route path="/contact" component={Contact} />
    <Route component={NotFound} />
  </Switch></Layout></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;