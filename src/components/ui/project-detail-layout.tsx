import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import { projects, type ProjectContent } from "../../content/projects";
import { TerminalHint } from "./terminal-hint";
import { ScrambleText } from "./scramble-text";
import { useProjectTransition } from "../../lib/project-transition";

function toTitleCase(text: string) {
  return text.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

function hostFromUrl(href: string) {
  try {
    return new URL(href).host;
  } catch {
    return href;
  }
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
};

const stagger = (each: number, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: each, delayChildren: delay } },
});

const lineGrow: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
};

/** Title whose letters rise out of a mask one by one. */
function SplitTitle({ text, play }: { text: string; play: boolean }) {
  const words = text.split(" ");
  const letter: Variants = {
    hidden: { y: "110%" },
    visible: { y: "0%", transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
  };

  return (
    <motion.h1
      aria-label={text}
      initial="hidden"
      animate={play ? "visible" : "hidden"}
      variants={stagger(0.025, 0.05)}
      className="mt-1 text-[28px] font-semibold uppercase leading-tight text-ink-primary"
    >
      {words.map((word, wi) => (
        <span key={wi} aria-hidden="true">
          <span className="inline-block whitespace-nowrap">
            {[...word].map((ch, ci) => (
              <span key={ci} className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom">
                <motion.span className="inline-block" variants={letter}>
                  {ch}
                </motion.span>
              </span>
            ))}
          </span>
          {wi < words.length - 1 && " "}
        </span>
      ))}
    </motion.h1>
  );
}

/** Counts a metric up from zero the first time it scrolls into view, keeping any prefix/suffix ("<2s", "92%"). */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const decimals = match ? (match[2].split(".")[1] ?? "").length : 0;
  const animated = !!match && !reduce;

  useEffect(() => {
    if (!animated || !inView || !match) return;
    const controls = animate(0, parseFloat(match[2]), {
      duration: 1.4,
      ease: EASE_OUT_EXPO,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${match[1]}${v.toFixed(decimals)}${match[3]}`;
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated, inView]);

  return <span ref={ref}>{animated && match ? `${match[1]}${(0).toFixed(decimals)}${match[3]}` : value}</span>;
}

function MetaField({ label, values, chips = false }: { label: string; values: string[]; chips?: boolean }) {
  return (
    <motion.div variants={fadeInUp}>
      <p className="font-sfmono text-xs uppercase tracking-[0.08em] text-ink-muted">{label}</p>
      {chips ? (
        <motion.div variants={stagger(0.05, 0.1)} className="mt-2 flex flex-wrap gap-2">
          {values.map((v) => (
            <motion.span
              key={v}
              variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE_OUT_EXPO } } }}
              whileHover={{ y: -2 }}
              className="rounded-none border border-[#fde047]/40 bg-[#fde047]/[0.06] px-3 py-1.5 font-sfmono text-sm text-[#fde047] transition-colors hover:bg-[#fde047]/[0.12]"
            >
              {v}
            </motion.span>
          ))}
        </motion.div>
      ) : (
        <div className="mt-2 space-y-1">
          {values.map((v) => (
            <p key={v} className="text-base text-ink-primary">{v}</p>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function LinkBlock({ label, href }: { label: string; href: string }) {
  return (
    <motion.a
      variants={fadeInUp}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      className="group relative flex items-center justify-between rounded-none bg-white/[0.04] px-5 py-3 transition-colors hover:bg-white/[0.08]"
    >
      <span className="font-sfmono text-sm uppercase tracking-[0.08em] text-ink-primary">{label}</span>
      <span className="text-ink-muted transition-transform group-hover:translate-x-1">›</span>
      <TerminalHint text={`$ open ${hostFromUrl(href)}`} placement="below-start" />
    </motion.a>
  );
}

function ProjectHeader({ onClose }: { onClose: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 md:px-12 md:py-4 bg-[#111111]/80 backdrop-blur-md border-b border-edge">
      <Link
        to="/"
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          onClose();
        }}
        className="relative z-50 text-ink-primary font-sfmono text-base md:text-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
      >
        <ScrambleText text="silentlooop" /><span className="terminal-cursor text-ink-muted">_</span>
      </Link>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close project"
        data-cursor="link"
        className="group relative text-xl text-ink-secondary transition-colors hover:text-ink-primary"
      >
        <span className="inline-block transition-transform duration-400 ease-out group-hover:rotate-90">✕</span>
        <TerminalHint text="$ cd .. [esc]" placement="below-start" />
      </button>
    </nav>
  );
}

export function ProjectDetailLayout({ project }: { project: ProjectContent }) {
  const { openProject, closeToHome, revealed } = useProjectTransition();
  const reduce = useReducedMotion();
  const nextProject = projects.find((p) => p.slug === project.nextProject);
  const title = toTitleCase(project.title);

  // Hero gently recedes as you scroll past it.
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 700], [1, reduce ? 1 : 0.94]);
  const heroMediaY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 50]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if ((e.target as HTMLElement | null)?.closest("input, textarea, select")) return;
      closeToHome();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeToHome]);

  const entrance = revealed ? "visible" : "hidden";

  return (
    <div data-project-page={project.slug} className="min-h-screen bg-[#111111] text-ink-primary font-sfmono selection:bg-white/20">
      <ProjectHeader onClose={closeToHome} />
      <main className="w-full px-5 pb-24 pt-24 md:px-12">
        {/* --- Hero media, full width (the "expand" transition lands on this box) --- */}
        <motion.div
          data-project-hero
          style={{ scale: heroScale }}
          className="relative mt-6 aspect-[21/9] w-full origin-top overflow-hidden rounded-none border border-edge bg-surface-raised"
        >
          <motion.div style={{ y: heroMediaY }} className="flex h-full w-full items-center justify-center p-6">
            {project.hero.type === "video" ? (
              <video
                src={project.hero.src}
                poster={project.hero.poster}
                autoPlay
                loop
                muted
                playsInline
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <img src={project.hero.src} alt={project.title} className="max-h-full max-w-full object-contain" />
            )}
          </motion.div>
        </motion.div>

        {/* --- Title (left) + intro/meta/links/sections (pushed right), joseph.cv-style split --- */}
        <div className="mt-8 grid grid-cols-1 gap-x-10 lg:grid-cols-3">
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <motion.p
              initial="hidden"
              animate={entrance}
              variants={fadeInUp}
              className="font-sfmono text-xs uppercase tracking-[0.08em] text-ink-muted"
            >
              {project.category}
            </motion.p>
            <SplitTitle text={title} play={revealed} />
          </div>

          <motion.div
            initial="hidden"
            animate={entrance}
            variants={stagger(0.07, 0.15)}
            className="mt-4 lg:col-start-2 lg:col-span-2 lg:mt-0"
          >
            <motion.p variants={fadeInUp} className="max-w-[640px] tracking-tight [word-spacing:-0.12em] text-base leading-[1.6] text-ink-primary">
              {project.intro}
            </motion.p>

            <motion.div variants={stagger(0.06)} className="relative mt-4 grid grid-cols-2 gap-x-10 gap-y-5 pt-4 sm:grid-cols-4">
              <motion.span variants={lineGrow} aria-hidden="true" className="absolute left-0 right-0 top-0 h-px origin-left bg-edge" />
              <MetaField label="Role" values={[project.meta.role]} />
              <MetaField label="Collaborators" values={project.meta.team} />
              <MetaField label="Duration" values={[project.meta.timeline]} />
              <MetaField label="Tools" values={project.meta.stack} chips />
            </motion.div>

            {project.meta.links.length > 0 && (
              <motion.div variants={stagger(0.06)} className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {project.meta.links.map((link) => (
                  <LinkBlock key={link.label} label={link.label} href={link.href} />
                ))}
              </motion.div>
            )}

            <div className="mt-6 space-y-5">
              {project.sections.map((section, i) => (
                <motion.div
                  key={section.heading}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={stagger(0.08)}
                  className="relative max-w-[640px] pt-5"
                  data-cursor="text"
                >
                  <motion.span variants={lineGrow} aria-hidden="true" className="absolute left-0 right-0 top-0 h-px origin-left bg-edge" />
                  <motion.h2 variants={fadeInUp} className="font-sfmono text-xs font-normal uppercase tracking-[0.08em] text-ink-muted">
                    <span className="mr-2 text-[#fde047]/70">{String(i + 1).padStart(2, "0")}</span>
                    {section.heading}
                  </motion.h2>
                  <motion.p variants={fadeInUp} className="mt-2 tracking-tight [word-spacing:-0.12em] text-base leading-relaxed text-ink-secondary">
                    {section.body}
                  </motion.p>
                </motion.div>
              ))}
            </div>

            {project.metrics && project.metrics.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={stagger(0.08)}
                className="relative mt-6 grid grid-cols-2 gap-x-10 gap-y-5 pt-5 sm:grid-cols-4"
              >
                <motion.span variants={lineGrow} aria-hidden="true" className="absolute left-0 right-0 top-0 h-px origin-left bg-edge" />
                {project.metrics.map((m) => (
                  <motion.div key={m.label} variants={fadeInUp}>
                    <div className="text-[28px] font-bold leading-none tabular-nums text-ink-primary">
                      <CountUp value={m.value} />
                    </div>
                    <div className="mt-2 font-sfmono text-xs uppercase tracking-[0.08em] text-ink-muted">{m.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* --- Next project --- */}
        {nextProject && (
          <div className="mt-12 border-t border-edge pt-6">
            <Link
              to={`/projects/${nextProject.slug}`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                openProject(nextProject.slug);
              }}
              data-cursor="view"
              className="group relative flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-sfmono text-xs uppercase tracking-[0.08em] text-ink-muted">
                  Next Project <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </p>
                <p className="mt-1 text-xl font-bold uppercase text-ink-primary transition-[transform,color] duration-400 ease-out group-hover:translate-x-2 group-hover:text-[#fde047] sm:text-2xl">
                  {toTitleCase(nextProject.title)}
                </p>
              </div>
              <div
                className="h-14 w-20 shrink-0 overflow-hidden rounded-sm border border-edge bg-surface-raised p-2 transition-[width,height,border-color] duration-400 ease-out group-hover:h-20 group-hover:w-32 group-hover:border-edge-hover"
              >
                <img src={nextProject.hero.src} alt="" className="h-full w-full object-contain grayscale transition-[filter] duration-400 group-hover:grayscale-0" />
              </div>
              <TerminalHint text="$ next one-more" placement="below-start" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
