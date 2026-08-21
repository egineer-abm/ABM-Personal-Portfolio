import { ArrowLeft, SearchX } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return <div className="mx-auto flex min-h-[65dvh] max-w-[900px] flex-col justify-center px-5 py-20 md:px-8">
    <div className="flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.16em] text-[hsl(var(--accent))]"><SearchX size={14} /> 404 / missing page</div>
    <h1 className="mt-7 max-w-[680px] font-display text-[clamp(3.4rem,8vw,7rem)] leading-[.86] tracking-[-.055em]">That page wandered off.</h1>
    <p className="mt-7 max-w-[460px] text-[15px] leading-[1.7] text-[hsl(var(--muted-foreground))]">It may have moved, or it may still be an idea. Either way, the rest of the site is here.</p>
    <Link href="/" data-testid="link-not-found-home" className="focus-ring mt-8 inline-flex w-fit items-center gap-2 text-[13px] text-[hsl(var(--accent))]"><ArrowLeft size={14} /> Back home</Link>
  </div>;
}