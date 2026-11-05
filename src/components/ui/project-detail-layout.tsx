import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { projects } from "../../data/projects";
import { TerminalHint } from "./terminal-hint";
import { NavBar } from "../../pages/about";

type Project = (typeof projects)[number];

const monoFont = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontWeight: 400,
  letterSpacing: "-0.02em",
};

const displayFont = {
  fontFamily: '"Neue Haas Unica", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, sans-serif',
  fontWeight: 700,
};

function toTitleCase(text: string) {
  return text.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const SECTIONS = [
  { id: "challenge", label: "Challenge" },
  { id: "solution", label: "Solution" },
  { id: "impact", label: "Impact" },
] as const;

function findPrevProject(project: Project): Project | undefined {
  return projects.find((p) => p.nextProject === project.slug);
}

function navigateWithTransition(navigate: ReturnType<typeof useNavigate>, to: string) {
  return (e: React.MouseEvent) => {
    const canTransition = typeof document !== "undefined" && "startViewTransition" in document;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canTransition || prefersReducedMotion) return; // let the default Link click proceed
    e.preventDefault();
    document.startViewTransition(() => navigate(to));
  };
}

function TechChip({ text }: { text: string }) {
  return (
    <span className="px-2.5 py-1 text-[12px] text-ink-secondary border border-edge bg-white/[0.03]" style={monoFont}>
      {text}
    </span>
  );
}

export function ProjectDetailLayout({ project }: { project: Project }) {
  const navigate = useNavigate();
  const prevProject = findPrevProject(project);
  const nextProject = projects.find((p) => p.slug === project.nextProject);
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.slug]);

  useEffect(() => {
    const elements = SECTIONS.map((s) => sectionRefs.current[s.id]).filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible?.target.id) setActiveSection(mostVisible.target.id);
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [project.slug]);

  const title = toTitleCase(project.title);
  const links = [
    { label: "View Source", href: project.sourceLink, hint: "$ cat ./src --judge-gently" },
    ...(("liveLink" in project && project.liveLink) ? [{ label: "Live", href: project.liveLink as string, hint: "$ open --live" }] : []),
    ...(("paperLink" in project && project.paperLink) ? [{ label: "Paper", href: project.paperLink as string, hint: "$ cat ./paper.pdf" }] : []),
  ].filter((l) => l.href);

  const metrics = "metrics" in project ? project.metrics : undefined;

  return (
    <div className="min-h-screen bg-[#111111] text-white selection:bg-white/20">
      <NavBar />
      <main className="w-full min-w-0 px-5 pb-24 pt-28 mx-auto max-w-[1280px] md:px-8">
        {/* --- Window chrome --- */}
        <div className="flex items-end gap-3 overflow-hidden rounded-t-md border border-b-0 border-white/10 bg-[#111111] px-3 pt-2 md:px-5">
          <div className="flex shrink-0 items-center gap-2 px-2 pb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          </div>
          <div className="-mb-px flex min-w-0 max-w-full items-center rounded-t-md border-x border-t border-white/10 bg-[#181818] px-4 py-2.5 md:px-5">
            <span className="truncate font-mono text-xs text-zinc-400">./projects/{project.slug}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-b-md border border-t-0 border-white/10 bg-[#141414] px-4 py-2.5 font-sfmono text-[12px] text-ink-muted md:px-5">
          <Link to="/" className="hover:text-ink-secondary transition-colors">~</Link>
          <span>›</span>
          <Link to="/#work" className="hover:text-ink-secondary transition-colors">projects</Link>
          <span>›</span>
          <span className="text-ink-secondary">{project.slug}.md</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-4 break-words text-[56px] font-bold leading-[0.95] tracking-tighter text-ink-primary sm:text-7xl"
          style={displayFont}
        >
          {title}
        </motion.h1>

        <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-secondary" style={monoFont}>
          {project.subtitle} · {project.category}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-sfmono text-[12px] uppercase tracking-wide text-ink-muted">
          <span>{project.role}</span>
          <span>{project.year}</span>
          <span>{project.type}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <TechChip key={tech} text={tech} />
          ))}
        </div>

        {metrics && metrics.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/5 pt-6 sm:gap-x-14">
            {metrics.map((m) => (
              <div key={m.label}>
                <div className="text-[28px] font-bold leading-none text-ink-primary" style={displayFont}>{m.value}</div>
                <div className="mt-1.5 font-sfmono text-[11px] uppercase tracking-wide text-ink-muted">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* --- COVER MEDIA --- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative mt-10 aspect-video w-full overflow-hidden rounded-lg border border-edge bg-[#161616] p-6"
          style={{ viewTransitionName: `project-cover-${project.slug}` } as React.CSSProperties}
        >
          <div className="flex h-full w-full items-center justify-center">
            {project.video ? (
              <video src={project.video} autoPlay loop muted playsInline className="h-full w-full object-contain" />
            ) : (
              <img src={project.image} alt={project.title} className="h-full w-full object-contain" />
            )}
          </div>
        </motion.div>

        {/* --- BODY: rail + reading column --- */}
        <div className="mt-16 grid min-w-0 grid-cols-1 gap-10 lg:grid-cols-[240px_680px]">
          {/* Rail */}
          <div className="min-w-0 lg:sticky lg:top-24 lg:h-fit">
            <div className="space-y-6">
              <Link to="/" className="relative inline-block font-sfmono text-sm text-ink-muted transition-colors hover:text-white">
                $ cd ..
                <TerminalHint text="$ back to ~/" placement="below-start" />
              </Link>

              <p className="text-[14px] leading-relaxed text-ink-secondary" style={monoFont}>
                {project.description}
              </p>

              {links.length > 0 && (
                <div className="flex flex-col gap-2 border-t border-white/5 pt-5">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex w-fit items-center gap-1.5 font-sfmono text-[13px] uppercase tracking-wide text-ink-muted transition-colors hover:text-white"
                    >
                      {link.label}
                      <span className="transition-transform group-hover:translate-x-0.5">↗</span>
                      <TerminalHint text={link.hint} placement="below-start" />
                    </a>
                  ))}
                </div>
              )}

              <nav aria-label="On this page" className="flex gap-4 overflow-x-auto border-t border-white/5 pt-5 font-sfmono text-[13px] lg:flex-col lg:gap-2 lg:overflow-visible">
                <span className="hidden text-[11px] uppercase tracking-wide text-ink-muted lg:block">On this page</span>
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`shrink-0 whitespace-nowrap transition-colors duration-250 ease-out ${
                      activeSection === s.id ? "text-[#fde047]" : "text-ink-muted hover:text-ink-secondary"
                    }`}
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Reading column */}
          <div className="min-w-0 space-y-14">
            <section
              id="challenge"
              ref={(el) => { sectionRefs.current.challenge = el; }}
              className="scroll-mt-28"
            >
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.9 }} variants={fadeInUp} className="text-[20px] font-semibold text-ink-primary" style={monoFont}>
                <span className="mr-2 text-ink-muted">##</span>The Challenge
              </motion.h2>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.9 }} variants={fadeInUp} className="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-ink-secondary">
                {project.challenge}
              </motion.p>
            </section>

            <section
              id="solution"
              ref={(el) => { sectionRefs.current.solution = el; }}
              className="scroll-mt-28"
            >
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.9 }} variants={fadeInUp} className="text-[20px] font-semibold text-ink-primary" style={monoFont}>
                <span className="mr-2 text-ink-muted">##</span>The Solution
              </motion.h2>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.9 }} variants={fadeInUp} className="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-ink-secondary">
                {project.solution}
              </motion.p>
            </section>

            <section
              id="impact"
              ref={(el) => { sectionRefs.current.impact = el; }}
              className="scroll-mt-28"
            >
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.9 }} variants={fadeInUp} className="text-[20px] font-semibold text-ink-primary" style={monoFont}>
                <span className="mr-2 text-ink-muted">##</span>Impact
              </motion.h2>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.9 }} variants={fadeInUp} className="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-ink-secondary">
                {project.impact}
              </motion.p>
            </section>
          </div>
        </div>

        {/* --- FOOTER NAV --- */}
        <div className="mt-24 flex items-end justify-between gap-6 border-t border-edge pt-10">
          {prevProject ? (
            <Link
              to={`/projects/${prevProject.slug}`}
              onClick={navigateWithTransition(navigate, `/projects/${prevProject.slug}`)}
              className="group relative"
            >
              <p className="font-sfmono text-[12px] uppercase tracking-wide text-ink-muted">
                <span className="inline-block transition-transform group-hover:-translate-x-1">←</span> Previous
              </p>
              <p className="mt-1 text-lg font-bold text-ink-secondary transition-colors group-hover:text-white" style={displayFont}>
                {toTitleCase(prevProject.title)}
              </p>
            </Link>
          ) : <div />}

          {nextProject && (
            <Link
              to={`/projects/${nextProject.slug}`}
              onClick={navigateWithTransition(navigate, `/projects/${nextProject.slug}`)}
              className="group relative flex items-center gap-4 text-right"
            >
              <div>
                <p className="font-sfmono text-[12px] uppercase tracking-wide text-ink-muted">
                  Next Project <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </p>
                <p className="mt-1 text-xl font-bold text-white sm:text-2xl" style={displayFont}>
                  {toTitleCase(nextProject.title)}
                </p>
              </div>
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-edge bg-[#161616] p-2">
                <img src={nextProject.image || undefined} alt="" className="h-full w-full object-contain" />
              </div>
              <TerminalHint text="$ next --one-more" placement="below-start" />
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
