import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, ChevronDown, Command, ExternalLink, Github, Linkedin, Mail, Menu, Search, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, Route, Switch, Router as WouterRouter, useLocation, useParams } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { navItems, notes, projects, writings, type Project } from '@/lib/content';
import { startups, type Startup } from '@/lib/startups';
import { Markdown } from '@/lib/markdown';

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
    <header className="relative z-20 border-b border-[hsl(var(--border))]">
       <div className="mx-auto flex min-h-[68px] max-w-[1180px] items-center justify-between px-5 md:px-8">
        <Link href="/" onClick={() => sessionStorage.removeItem('portfolio-route')} data-testid="link-brand" className="focus-ring group flex items-center gap-3">
          <span className="wordmark">Abdul Basit Memon</span>
        </Link>
        <Link href="/projects" data-testid="link-nav-projects" className="edge-cta hidden focus-ring md:inline-flex">View work <ArrowRight size={14} /></Link>
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
  return <footer className="foot-stmt mx-auto mt-24 max-w-[1180px] px-5 md:px-8">
    <p className="foot-stmt__line">Build useful things.<br /><span>Keep asking why.</span></p>
    <div className="foot-stmt__meta">
      <span className="wordmark">Abdul Basit Memon</span>
      <div className="flex flex-wrap items-center gap-4">
        <a data-testid="link-footer-github" href="https://github.com/abm1119" target="_blank" rel="noreferrer" className="focus-ring hover:text-[hsl(var(--foreground))]">GitHub</a>
        <a data-testid="link-footer-linkedin" href="https://www.linkedin.com/in/engrabm" target="_blank" rel="noreferrer" className="focus-ring hover:text-[hsl(var(--foreground))]">LinkedIn</a>
        <a data-testid="link-footer-email" href="mailto:basitmemon67@gmail.com" className="focus-ring hover:text-[hsl(var(--foreground))]">Email</a>
        <span className="font-mono-ui text-[12px]">© {new Date().getFullYear()}</span>
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
  return <div className="mb-6 flex items-center gap-3 font-mono-ui text-[13px] uppercase tracking-[.18em] text-[hsl(var(--accent))]"><span className="h-1.5 w-1.5 animate-[pulse-dot_2.4s_ease-in-out_infinite] rounded-full bg-[hsl(var(--accent))]" />{children}</div>;
}

function PageIntro({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  return <div className="mb-20 max-w-[780px]">
    <div className="mb-4 font-mono-ui text-[11px] text-[hsl(var(--muted-foreground))]">{kicker.toLowerCase()}</div>
    <h1 className="text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight tracking-[-.05em]">{title}</h1>
    <div className="mt-5 max-w-[580px] text-[16px] leading-[1.7] text-[hsl(var(--muted-foreground))]">{children}</div>
  </div>;
}

function Home() {
  usePageMeta('Abdul Basit Memon | AI Educator & Builder', 'Abdul Basit Memon teaches and builds AI in Khairpur, Pakistan: agentic tools, learning software, and open resources for students.');
  const homeLinks = [
    { href: '/projects', label: 'Projects', description: 'AI systems, developer tools, apps, and hardware', mark: '01' },
    { href: '/startups', label: 'Startups', description: 'Ventures building from local problems outward', mark: '02' },
    { href: '/experience', label: 'Experience', description: 'Teaching, engineering, and academic work', mark: '03' },
    { href: '/writings', label: 'Writings', description: 'Essays on software, AI, and education', mark: '04' },
    { href: '/about', label: 'About', description: 'Background, interests, and current direction', mark: '05' },
    { href: '/publications', label: 'Publications', description: 'Research and academic work', mark: '06' },
    { href: '/notes', label: 'Notes', description: 'Short ideas on tools, learning, and AI', mark: '07' },
    { href: '/contact', label: 'Contact', description: 'Get in touch about ideas and projects', mark: '08' },
  ];
  return <div className="home-shell mx-auto max-w-[1180px] px-5 md:px-8">
    <section className="home-hero">
      <p className="home-hero__place">Khairpur, Pakistan · Computer Systems Engineering</p>
      <h1>I teach AI and build it into <span className="home-hero__highlight">useful systems.</span></h1>
      <div className="home-hero__body">
        <p>Abdul Basit Memon — engineer, educator, and independent builder. I turn rough ideas into practical agentic tools, learning software, and open resources.</p>
        <div className="home-hero__actions">
          <Link href="/projects" data-testid="link-home-primary" className="edge-cta">View selected work <ArrowRight size={15} /></Link>
          <Link href="/contact" data-testid="link-home-contact" className="text-link">Contact me <ArrowUpRight size={14} /></Link>
        </div>
      </div>
    </section>
    <section className="home-index" aria-labelledby="index-heading">
      <div className="home-index__head">
        <h2 id="index-heading">Explore the work</h2>
        <span>Selected index · 2026</span>
      </div>
      <div className="home-index__rows">
        {homeLinks.map((item) => <Link key={item.href} href={item.href} data-testid={`link-home-${item.label.toLowerCase()}`} className="home-index__row focus-ring">
          <span className="home-index__mark">{item.mark}</span>
          <span className="home-index__title">{item.label}</span>
          <span className="home-index__description">{item.description}</span>
          <ArrowUpRight size={17} className="home-index__arrow" />
        </Link>)}
      </div>
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
  const categories = ['All', ...Array.from(new Set(projects.map((project) => project.category))).sort((a, b) => a.localeCompare(b))];
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
  return <div className="mx-auto max-w-[820px] px-5 py-16 md:px-8 md:py-24"><ArrowLink href="/writings" className="mb-16 text-[12px] text-[hsl(var(--muted-foreground))]"><ArrowLeft size={14} />Back to writings</ArrowLink><SectionLabel>{writing.date} · field note</SectionLabel><h1 className="max-w-[720px] font-display text-[clamp(3rem,7vw,5.75rem)] leading-[.9] tracking-[-.05em]">{writing.title}</h1><p className="mt-7 max-w-[580px] text-[18px] leading-[1.65] text-[hsl(var(--muted-foreground))]">{writing.excerpt}</p><div className="mt-16 max-w-[650px]"><Markdown source={writing.body} /></div><div className="mt-16 flex gap-2 font-mono-ui text-[10px] text-[hsl(var(--muted-foreground))]">{writing.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></div>;
}

function Notes() {
  usePageMeta('Notes — Abdul Basit Memon', 'Short thoughts, fragments, and observations from Abdul Basit Memon’s technical notebook.');
  return <div className="mx-auto max-w-[820px] px-5 py-20 md:px-8 md:py-28"><PageIntro kicker="Loose ideas / 03" title="Notes"><span>Short thoughts, fragments, links, and technical observations. Not everything here has decided what it wants to become.</span></PageIntro><div className="border-t border-[hsl(var(--border))]">{notes.map((note) => <Link key={note.slug} href={`/notes/${note.slug}`} data-testid={`link-note-${note.slug}`} className="group block border-b border-[hsl(var(--border))] py-7 focus-ring"><div className="flex items-center justify-between"><span className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">{note.date}</span><ArrowUpRight size={15} className="text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--accent))]" /></div><h2 className="mt-4 max-w-[650px] font-display text-[clamp(1.8rem,3vw,2.5rem)] leading-[1] tracking-[-.025em] transition-colors group-hover:text-[hsl(var(--accent))]">{note.title}</h2><div className="mt-4 flex gap-2 font-mono-ui text-[10px] text-[hsl(var(--muted-foreground))]">{note.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></Link>)}</div></div>;
}

function NoteDetail() {
  const { slug } = useParams<{ slug: string }>();
  const note = notes.find((item) => item.slug === slug);
  if (!note) return <NotFound />;
  usePageMeta(`${note.title} — Notes — Abdul Basit Memon`, note.title);
  return <div className="mx-auto max-w-[720px] px-5 py-16 md:px-8 md:py-24"><ArrowLink href="/notes" className="mb-16 text-[12px] text-[hsl(var(--muted-foreground))]"><ArrowLeft size={14} />Back to notes</ArrowLink><div className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-[hsl(var(--accent))]">note / {note.date}</div><h1 className="mt-6 font-display text-[clamp(2.8rem,6vw,5.25rem)] leading-[.9] tracking-[-.05em]">{note.title}</h1><div className="mt-12 border-l-2 border-[hsl(var(--accent))] pl-6"><Markdown source={note.body} /></div><div className="mt-12 flex gap-2 font-mono-ui text-[10px] text-[hsl(var(--muted-foreground))]">{note.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></div>;
}

function About() {
  usePageMeta('About — Abdul Basit Memon', 'Abdul Basit Memon: systems engineer and creative technologist in Khairpur, Pakistan, working where computer architecture meets generative AI and real businesses.');
  const timeline = [
    { role: 'Developer & Teaching Assistant', org: 'BBS-UTECH', orgHref: 'https://bbsutsd.edu.pk/', period: 'Present', body: 'Focusing on Sovereign AI and Responsible AI. Guiding students through the architecture of self-reliant intelligent systems.' },
    { role: 'Trainer: Full-Stack & Generative AI', org: 'Borlo Labs', orgHref: 'https://borlolabs.com', period: 'Mar – Apr 2026 · Hybrid', body: 'Co-founded Borlo Labs to bridge the tech exposure gap, structured the workflows, and trained 20+ local students in web development and generative AI.' },
    { role: 'Python Web Development Trainer', org: 'BBS HR Research & Development Center', orgHref: null, period: 'Jan – May 2026', body: 'Led hands-on training programs in web development, database design, and backend Python.' },
    { role: 'Applied Generative AI Cohort', org: '100x Engineers', orgHref: 'https://www.100xengineers.com', period: 'Completed June 2026 · 6 months', body: 'A deep dive across diffusion pipelines (latent space, LoRAs, ControlNet, ComfyUI), LLM architecture, prompt optimization, vector databases, RAG, and multi-agent SPAOR loops.' },
    { role: 'Millennium Fellow', org: 'United Nations Academic Impact & MCN', orgHref: 'https://www.millenniumfellows.org/fellow/2024/iba-suk/abdul-basit-memon', period: 'Class of 2025', body: 'Selected for leadership, project design, and community-first development.' },
    { role: 'BE, Computer Systems Engineering', org: 'Sukkur IBA University', orgHref: 'https://www.iba-suk.edu.pk', period: 'Aug 2021 – Jun 2025', body: 'Digital logic design, microcontrollers, database systems, and full-stack engineering. Graduated with a CGPA of 3.02/4.0 and a PEC-registered engineer title.' },
  ];
  const researchInterests = [
    'Cognitive computing',
    'Responsible AI',
    'Continual learning in AI',
    'SLM-based agentic architectures for education',
    'Hybrid agentic AI and quantum computing',
    'Local-first and privacy-respecting AI systems',
  ];
  const stack = [
    ['Low-level & hardware.', 'C++, Java, Verilog, Arduino, ESP32, Nexys DDR4 FPGA, Xilinx Vivado, sensor integration, servo controls.'],
    ['Web & mobile.', 'React + Vite, Node.js, FastAPI, Python Flask + Waitress, .NET MAUI, Supabase, PostgreSQL, SQLite3, SQL Server.'],
    ['AI engineering.', 'LLMs, RAG (embeddings, chunking, vector search, cosine similarity), LangChain, RAGAS evaluation, agentic SPAOR loops, Model Context Protocol (FastMCP), Google ADK, prompt and context engineering.'],
    ['Models & APIs.', 'OpenAI API, Anthropic Claude API, Gemini API, Groq, OpenRouter, Hugging Face (smolagents, Spaces), ComfyUI (LoRA face/style training, ControlNet, SDXL and Flux video models).'],
    ['Cloud & deployment.', 'AWS, Docker, GCP, Hugging Face Spaces, PyPI and Chrome extension packaging.'],
    ['Creative & design.', 'Photoshop, Remotion, Processing (Java), AutoCAD 3D, UI/UX, AI-assisted graphic design, code-to-design workflows.'],
  ];
  const beyond = [
    ['Origami.', 'Folding paper since childhood. Now I study origami mathematics and how its geometric folding principles apply to deployable structures.'],
    ['Classical music.', 'I listen to compositions to find focus; the mathematical structure matches the precision of code.'],
    ['Quantum curiosities.', 'Currently reading up on quantum computing basics (Bloch spheres, superposition, Pauli gates), just to appreciate how far the definition of computing can stretch.'],
  ];
  return <div className="mx-auto max-w-[680px] px-5 py-20 md:py-28">
    <section>
      <div className="text-[16px] leading-[1.7] text-[hsl(var(--muted-foreground))]">/about</div>
      <h1 className="mt-6 text-[16px] font-bold leading-[1.7]">Abdul Basit Memon. Systems engineer & creative technologist.</h1>
      <p className="mt-5 text-[16px] leading-[1.7] text-[hsl(var(--muted-foreground))]">I build from what I know up close: computers at the circuit level, generative AI at the system level, and real-world operations learned behind the counter of a family bakery.</p>
    </section>
    <section className="border-t border-[hsl(var(--border))] py-10">
      <SectionLabel>/the-story</SectionLabel>
      <div className="space-y-5 text-[16px] leading-[1.75] text-[hsl(var(--muted-foreground))]">
        <p>Long before I wrote a line of code, I learned how systems behave on the floor of my family’s retail bakery, <strong>Khalid Bakers and Brothers</strong>, in Khairpur Mir’s. Handling daily cash flow, accounts, and ledgers behind the counter meant watching our salesmen serve thousands of local customers with paper records. It taught me a lesson no classroom could: technology matters only when it removes real-world friction. If a tool or AI system cannot help a neighborhood store run its ledger, it is not ready for the real world.</p>
        <p>That curiosity eventually led me to pursue <strong>Computer Systems Engineering</strong> at <a className="focus-ring text-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]" href="https://www.iba-suk.edu.pk" target="_blank" rel="noreferrer">Sukkur IBA University</a>. I started with the foundations: wiring breadboards, building Arduino sensor robots, and designing digital logic on FPGA boards. The work pulled me toward software and, from there, toward generative AI. Six months in the <strong>Applied AI Cohort at 100x Engineers</strong> taught me to turn those ideas into custom RAG architectures, multi-agent loops, and node-based diffusion pipelines.</p>
        <p>Seeing how little early technical exposure young people in my hometown had led me to build an integrated <strong>Learn-Build-Scale</strong> ecosystem. I founded <strong>Prologware Solutions</strong> and <strong>Trubblx</strong> to run <strong>Resources Heaven</strong>, an open-source directory of more than 1,000 curated technology tools, and to give local students and self-learners clear paths for building and shipping with AI.</p>
        <p>When I step away from code and screens, I am usually listening to classical music, tinkering with IoT sensors, or folding <strong>origami</strong>, a childhood hobby that keeps my curiosity open to ideas like origami computing and quantum mechanics. My goal is simple: build practical, sovereign technology for physical problems, and keep the door open for the builders coming up behind me.</p>
      </div>
    </section>
    <section className="border-t border-[hsl(var(--border))] py-10">
      <SectionLabel>/timeline</SectionLabel>
      <div className="border-t border-[hsl(var(--border))]">
        {timeline.map((entry) => <div key={entry.role} className="border-b border-[hsl(var(--border))] py-7">
          <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
            <h3 className="text-[16px] font-bold leading-[1.7]">{entry.role}{entry.org && <span className="font-normal text-[hsl(var(--muted-foreground))]"> · {entry.orgHref ? <a className="focus-ring text-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]" href={entry.orgHref} target="_blank" rel="noreferrer">{entry.org}</a> : entry.org}</span>}</h3>
            <span className="font-mono-ui text-[12px] text-[hsl(var(--accent))]">{entry.period}</span>
          </div>
          <p className="mt-2 text-[16px] leading-[1.7] text-[hsl(var(--muted-foreground))]">{entry.body}</p>
        </div>)}
      </div>
    </section>
    <section className="border-t border-[hsl(var(--border))] py-10">
      <SectionLabel>/stack</SectionLabel>
      <div className="space-y-4 text-[16px] leading-[1.75]">
        {stack.map(([label, items]) => <p key={label}><span className="font-bold">{label}</span> <span className="text-[hsl(var(--muted-foreground))]">{items}</span></p>)}
      </div>
    </section>
    <section className="border-t border-[hsl(var(--border))] py-10">
      <SectionLabel>/research</SectionLabel>
      <ul className="space-y-3 text-[16px] leading-[1.7] text-[hsl(var(--muted-foreground))]">
        {researchInterests.map((item) => <li key={item} className="flex gap-3"><span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[hsl(var(--accent))]" />{item}</li>)}
      </ul>
    </section>
    <section className="border-t border-[hsl(var(--border))] py-10">
      <SectionLabel>/projects</SectionLabel>
      <p className="max-w-[610px] text-[16px] leading-[1.75] text-[hsl(var(--muted-foreground))]">My builds range from local encrypted password managers and Windows focus widgets to autonomous recruitment agents and local OCR invoice trackers.</p>
      <ArrowLink href="/projects" className="mt-5 text-[16px] font-bold">Read the full technical archive</ArrowLink>
    </section>
    <section className="border-t border-[hsl(var(--border))] py-10">
      <SectionLabel>/beyond-code</SectionLabel>
      <ul className="space-y-3 text-[16px] leading-[1.75] text-[hsl(var(--muted-foreground))]">
        {beyond.map(([label, body]) => <li key={label} className="flex gap-3"><span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-[hsl(var(--accent))]" /><span><span className="font-bold text-[hsl(var(--foreground))]">{label}</span> {body}</span></li>)}
      </ul>
    </section>
    <section className="border-t border-[hsl(var(--border))] py-10">
      <SectionLabel>/connect</SectionLabel>
      <p className="max-w-[610px] text-[16px] leading-[1.75] text-[hsl(var(--muted-foreground))]">Whether you are looking to automate a physical business, discuss custom ComfyUI workflows, or talk about the engineering behind folding paper, let’s build.</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-[16px]">
        <ArrowLink href="/contact" className="font-bold">Send an inquiry</ArrowLink>
        <a data-testid="link-about-github" className="focus-ring group inline-flex items-center gap-2 text-[16px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]" href="https://github.com/abm1119" target="_blank" rel="noreferrer">GitHub</a>
        <a data-testid="link-about-linkedin" className="focus-ring group inline-flex items-center gap-2 text-[16px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]" href="https://www.linkedin.com/in/engrabm" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </section>
  </div>;
}

function Experience() {
  usePageMeta('Experience — Abdul Basit Memon', 'The working chronology of Abdul Basit Memon: teaching and trainer roles, the 100x Engineers cohort, a Millennium Fellowship, and a computer systems engineering degree.');
  const timeline = [
    { role: 'Developer & Teaching Assistant', org: 'BBS-UTECH', orgHref: 'https://bbsutsd.edu.pk/', period: 'Present', body: 'Focusing on Sovereign AI and Responsible AI. Guiding students through the architecture of self-reliant intelligent systems.' },
    { role: 'Trainer: Full-Stack & Generative AI', org: 'Borlo Labs', orgHref: 'https://borlolabs.com', period: 'Mar – Apr 2026 · Hybrid', body: 'Co-founded Borlo Labs to bridge the tech exposure gap, structured the workflows, and trained 20+ local students in web development and generative AI.' },
    { role: 'Python Web Development Trainer', org: 'BBS HR Research & Development Center', orgHref: null, period: 'Jan – May 2026', body: 'Led hands-on training programs in web development, database design, and backend Python.' },
    { role: 'Applied Generative AI Cohort', org: '100x Engineers', orgHref: 'https://www.100xengineers.com', period: 'Completed June 2026 · 6 months', body: 'A deep dive across diffusion pipelines (latent space, LoRAs, ControlNet, ComfyUI), LLM architecture, prompt optimization, vector databases, RAG, and multi-agent SPAOR loops.' },
    { role: 'Millennium Fellow', org: 'United Nations Academic Impact & MCN', orgHref: 'https://www.millenniumfellows.org/fellow/2024/iba-suk/abdul-basit-memon', period: 'Class of 2025', body: 'Selected for leadership, project design, and community-first development.' },
  ];
  const education = [
    { role: 'BE, Computer Systems Engineering', org: 'Sukkur IBA University', orgHref: 'https://www.iba-suk.edu.pk', period: 'Aug 2021 – Jun 2025', body: 'Digital logic design, microcontrollers, database systems, and full-stack engineering. Graduated with a CGPA of 3.02/4.0 and a PEC-registered engineer title.' },
  ];
  const certifications = [
    { name: 'Large Language Models (LLMs) Concepts', issuer: 'DataCamp', href: 'https://www.datacamp.com/completed/statement-of-accomplishment/course/564d252b9ff24ce51ab3bb7c4730b664fc62da63' },
    { name: 'Introduction to FastAPI', issuer: 'DataCamp', href: 'https://www.datacamp.com/completed/statement-of-accomplishment/course/e655e2f5489d2f9fd9c0aaf0950ba84e7a92f046' },
    { name: 'Introduction to LLMs in Python', issuer: 'DataCamp', href: 'https://www.datacamp.com/completed/statement-of-accomplishment/course/e28c1f753db0606c41fdb8db0c179b1062313aef' },
    { name: 'AI-Assisted Coding for Developers', issuer: 'DataCamp', href: 'https://www.datacamp.com/completed/statement-of-accomplishment/course/ed609f898e7b20c49cf9f05c710b700c8f3c7678' },
    { name: 'Introduction to Model Context Protocol (MCP)', issuer: 'DataCamp', href: 'https://www.datacamp.com/completed/statement-of-accomplishment/course/583c832e9523a5d505ca7fe4c73bf4862b777c3e' },
    { name: 'AI Agents with Hugging Face smolagents', issuer: 'DataCamp', href: 'https://www.datacamp.com/completed/statement-of-accomplishment/course/8f9784464a0e334f6f176374ec295a419004d4ca' },
    { name: 'Introduction to AI Agents', issuer: 'DataCamp', href: 'https://www.datacamp.com/completed/statement-of-accomplishment/course/c64eea4c4e23759c3a3a77ce0331305c52ba32b7' },
    { name: 'Deploying AI into Production with FastAPI', issuer: 'DataCamp', href: 'https://www.datacamp.com/completed/statement-of-accomplishment/course/a204be7472aeeaa8046976a658d469699c00acad' },
    { name: 'Google for Startups Startup School: Prompt to Prototype', issuer: 'Google', href: null },
    { name: 'McKinsey.org Forward Program', issuer: 'McKinsey.org', href: 'https://www.credly.com/badges/f7d0cfa9-1aee-47b9-98c9-732d8f7685c5' },
    { name: '5-Day AI Agents Intensive Course with Google', issuer: 'Kaggle', href: 'https://www.kaggle.com/certification/badges/abdulbasit1119/105' },
    { name: 'Generative AI: Introduction and Applications', issuer: 'IBM', href: 'https://www.coursera.org/account/accomplishments/verify/BZ4ZNKQVXW2N' },
    { name: 'Basic Elements of Design: Design Principles and Software Overview', issuer: 'Coursera', href: 'https://www.coursera.org/account/accomplishments/verify/QH2X33LX2CXD' },
    { name: 'Programming for Everybody (Getting Started with Python)', issuer: 'Coursera', href: 'https://www.coursera.org/account/accomplishments/verify/K9ZTVK24B2SR' },
    { name: 'Introduction to Programming Java', issuer: 'Great Learning', href: 'https://www.mygreatlearning.com/certificate/AMWWNOST' },
    { name: 'Programming in C++', issuer: 'Great Learning', href: 'https://www.mygreatlearning.com/certificate/CXDLFOBK' },
  ];
  const renderEntry = (entry: { role: string; org: string; orgHref: string | null; period: string; body: string }) => <div className="border-b border-[hsl(var(--border))] py-7">
    <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
      <h3 className="text-[16px] font-bold leading-[1.7]">{entry.role}{entry.org && <span className="font-normal text-[hsl(var(--muted-foreground))]"> · {entry.orgHref ? <a className="focus-ring text-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]" href={entry.orgHref} target="_blank" rel="noreferrer">{entry.org}</a> : entry.org}</span>}</h3>
      <span className="font-mono-ui text-[12px] text-[hsl(var(--accent))]">{entry.period}</span>
    </div>
    <p className="mt-2 text-[16px] leading-[1.7] text-[hsl(var(--muted-foreground))]">{entry.body}</p>
  </div>;
  return <div className="mx-auto max-w-[680px] px-5 py-20 md:py-28">
    <section>
      <div className="text-[16px] leading-[1.7] text-[hsl(var(--muted-foreground))]">/experience</div>
      <h1 className="mt-6 text-[16px] font-bold leading-[1.7]">Places, programs, and responsibilities that shaped how I build.</h1>
      <p className="mt-5 text-[16px] leading-[1.7] text-[hsl(var(--muted-foreground))]">A working chronology, newest first: lecture halls, training rooms, and one six-month generative AI sprint.</p>
    </section>
    <section className="border-t border-[hsl(var(--border))] py-10">
      <SectionLabel>/timeline</SectionLabel>
      <div className="border-t border-[hsl(var(--border))]">{timeline.map((entry) => renderEntry(entry))}</div>
    </section>
    <section className="border-t border-[hsl(var(--border))] py-10">
      <SectionLabel>/education</SectionLabel>
      <div className="border-t border-[hsl(var(--border))]">{education.map((entry) => renderEntry(entry))}</div>
    </section>
    <section className="border-t border-[hsl(var(--border))] py-10">
      <SectionLabel>/certifications</SectionLabel>
      <ul className="border-t border-[hsl(var(--border))]">
        {certifications.map((item) => <li key={item.name} className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 border-b border-[hsl(var(--border))] py-3.5 text-[16px] leading-[1.6]"><span>{item.href ? <a className="focus-ring text-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]" href={item.href} target="_blank" rel="noreferrer">{item.name}</a> : item.name}</span><span className="font-mono-ui text-[12px] text-[hsl(var(--muted-foreground))]">{item.issuer}</span></li>)}
      </ul>
    </section>
    <section className="border-t border-[hsl(var(--border))] py-10 text-[16px] text-[hsl(var(--muted-foreground))]">
      <span>elsewhere: </span><a className="focus-ring text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]" href="https://github.com/abm1119" target="_blank" rel="noreferrer">github</a><span> · </span><a className="focus-ring text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]" href="https://www.linkedin.com/in/engrabm" target="_blank" rel="noreferrer">linkedin</a><span> · </span><a className="focus-ring text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]" href="mailto:basitmemon67@gmail.com">email</a>
    </section>
  </div>;
}

function Publications() {
  usePageMeta('Publications — Abdul Basit Memon', 'Research and academic work by Abdul Basit Memon.');
  return <div className="mx-auto max-w-[900px] px-5 py-20 md:px-8 md:py-28"><PageIntro kicker="Research / 06" title="Publications"><span>Research-minded work, kept in a simple bibliography rather than dressed up as a publication machine.</span></PageIntro><div className="border-t border-[hsl(var(--border))]"><div className="grid gap-4 border-b border-[hsl(var(--border))] py-8 sm:grid-cols-[100px_1fr] sm:gap-10"><div className="font-mono-ui text-[11px] text-[hsl(var(--accent))]">2025</div><div><h2 className="text-[20px]">Intelligent Carpooling: Route Matching and Overlap Feasibility</h2><p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Bachelor’s thesis · Computer Systems Engineering</p><p className="mt-5 max-w-[620px] text-[14px] leading-[1.75] text-[hsl(var(--muted-foreground))]">An evaluation of route matching and overlap feasibility for a shared-ride system, comparing A* with Dijkstra and standard greedy approaches to reduce resource utilization and compute overhead.</p><a data-testid="link-publication-repo" href="https://github.com/urooj-marvi/Carpooling_App" target="_blank" rel="noreferrer" className="focus-ring mt-5 inline-flex items-center gap-2 text-[13px] text-[hsl(var(--accent))]">Related project <ExternalLink size={13} /></a></div></div><div className="border-b border-[hsl(var(--border))] py-8 text-[14px] leading-[1.7] text-[hsl(var(--muted-foreground))]">Research papers will land here soon. The route-matching thesis above is the first entry; the rest are in the pipeline.</div></div></div>;
}

function Startups() {
  usePageMeta('Startups — Abdul Basit Memon', 'The ventures Abdul Basit Memon is building: Prologware Solutions, Trubblx, Think0, and Borlo Labs.');
  const sorted = [...startups].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  return <div className="mx-auto max-w-[1000px] px-5 py-20 md:px-8 md:py-28"><PageIntro kicker="Ventures / 08" title="Startups"><span>The ventures I am building — each one an attempt to turn a problem seen close to home into something useful for other people.</span></PageIntro>
    <div className="border-t border-[hsl(var(--border))]">
      {sorted.map((startup) => <StartupEntry key={startup.slug} startup={startup} />)}
      {sorted.length === 0 && <div className="border border-dashed border-[hsl(var(--border))] py-16 text-center text-[14px] text-[hsl(var(--muted-foreground))]">No startups here yet. Add a markdown file to <span className="font-mono-ui">src/content/startups</span>.</div>}
    </div>
  </div>;
}

function StartupEntry({ startup }: { startup: Startup }) {
  return <article data-testid={`article-startup-${startup.slug}`} className="grid gap-8 border-b border-[hsl(var(--border))] py-12 lg:grid-cols-[280px_1fr] lg:gap-14">
    <aside>
      <h2 className="text-[24px] tracking-[-.025em]">{startup.name}</h2>
      <dl className="mt-5 space-y-2 font-mono-ui text-[11px] leading-[1.7] text-[hsl(var(--muted-foreground))]">
        {startup.role && <div><dt className="sr-only">Role</dt><dd><span className="text-[hsl(var(--accent))]">{startup.role}</span></dd></div>}
        {startup.year && <div><dt className="sr-only">Year</dt><dd>{startup.year}</dd></div>}
        {startup.status && <div><dt className="sr-only">Status</dt><dd>{startup.status}</dd></div>}
      </dl>
      {startup.url && <a data-testid={`link-startup-${startup.slug}`} href={startup.url} target="_blank" rel="noreferrer" className="focus-ring group mt-5 inline-flex items-center gap-2 text-[13px] text-[hsl(var(--accent))]">{startup.urlLabel || 'Visit'} <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>}
      {startup.tags.length > 0 && <div className="mt-5 flex flex-wrap gap-2 font-mono-ui text-[10px] text-[hsl(var(--muted-foreground))]">{startup.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>}
    </aside>
    <div>
      {startup.tagline && <p className="max-w-[600px] text-[18px] leading-[1.55] tracking-[-.01em]">{startup.tagline}</p>}
      <div className={`max-w-[620px] ${startup.tagline ? 'mt-6' : ''}`}><Markdown source={startup.body} /></div>
    </div>
  </article>;
}

function Contact() {
  usePageMeta('Contact — Abdul Basit Memon', 'Get in touch with Abdul Basit Memon about thoughtful technology, AI, and collaboration.');
  return <div className="mx-auto max-w-[1000px] px-5 py-20 md:px-8 md:py-28"><div className="grid gap-16 lg:grid-cols-[1.1fr_.9fr]"><div><SectionLabel>Open channel / 09</SectionLabel><h1 className="font-display text-[clamp(3.5rem,8vw,7.5rem)] leading-[.84] tracking-[-.06em]">Let’s talk<span className="text-[hsl(var(--accent))]">.</span></h1><p className="mt-8 max-w-[480px] text-[17px] leading-[1.75] text-[hsl(var(--muted-foreground))]">Have an interesting idea? Want to build something? Found a resource or question worth discussing? Email is the best place to begin.</p><a data-testid="link-contact-email" href="mailto:basitmemon67@gmail.com" className="focus-ring mt-9 inline-flex items-center gap-3 border-b border-[hsl(var(--accent))] pb-2 text-[18px] text-[hsl(var(--accent))]">basitmemon67@gmail.com <Mail size={16} /></a></div><div className="border-t border-[hsl(var(--border))] pt-5 lg:mt-10"><div className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">Elsewhere</div><div className="mt-5 flex flex-col gap-4 text-[15px]"><a data-testid="link-contact-github" href="https://github.com/abm1119" target="_blank" rel="noreferrer" className="focus-ring group flex items-center justify-between border-b border-[hsl(var(--border))] pb-4"><span className="flex items-center gap-3"><Github size={16} /> GitHub</span><ArrowUpRight size={14} className="text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--accent))]" /></a><a data-testid="link-contact-linkedin" href="https://www.linkedin.com/in/engrabm" target="_blank" rel="noreferrer" className="focus-ring group flex items-center justify-between border-b border-[hsl(var(--border))] pb-4"><span className="flex items-center gap-3"><Linkedin size={16} /> LinkedIn</span><ArrowUpRight size={14} className="text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--accent))]" /></a><a data-testid="link-contact-twitter" href="https://x.com/AbdAbdulbasit1" target="_blank" rel="noreferrer" className="focus-ring group flex items-center justify-between border-b border-[hsl(var(--border))] pb-4"><span className="flex items-center gap-3"><ExternalLink size={16} /> Twitter / X</span><ArrowUpRight size={14} className="text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--accent))]" /></a></div></div></div></div>;
}

function ScrollToTop() {
  const [location, setLocation] = useLocation();
  useEffect(() => {
    const restored = sessionStorage.getItem('portfolio-route');
    if (restored) {
      sessionStorage.removeItem('portfolio-route');
      setLocation(restored);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location, setLocation]);
  return null;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Layout><ScrollToTop /><Switch>
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
    <Route path="/startups" component={Startups} />
    <Route path="/contact" component={Contact} />
    <Route component={NotFound} />
  </Switch></Layout></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;