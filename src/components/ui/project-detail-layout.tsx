import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { projects, type ProjectContent } from "../../content/projects";
import { TerminalHint } from "./terminal-hint";
import { ScrambleText } from "./scramble-text";
import { navigateWithTransition } from "../../lib/view-transition-nav";

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

/** Restores the home page's scroll position after closing a project, polling until the content has mounted. */
function restoreHomeScroll() {
  const y = sessionStorage.getItem("home-scroll-y");
  if (!y) return;
  sessionStorage.removeItem("home-scroll-y");

  let attempts = 0;
  const timer = setInterval(() => {
    if (document.body.scrollHeight > window.innerHeight || attempts >= 30) {
      window.scrollTo({ top: parseInt(y, 10), behavior: "instant" });
      clearInterval(timer);
      return;
    }
    attempts += 1;
  }, 40);
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function MetaField({ label, values, chips = false }: { label: string; values: string[]; chips?: boolean }) {
  return (
    <div>
      <p className="font-sfmono text-xs uppercase tracking-[0.08em] text-ink-muted">{label}</p>
      {chips ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map((v) => (
            <span
              key={v}
              className="rounded-none border border-[#fde047]/40 bg-[#fde047]/[0.06] px-3 py-1.5 font-sfmono text-sm text-[#fde047]"
            >
              {v}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-2 space-y-1">
          {values.map((v) => (
            <p key={v} className="text-base text-ink-primary">{v}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function LinkBlock({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      className="group relative flex items-center justify-between rounded-none bg-white/[0.04] px-5 py-3 transition-colors hover:bg-white/[0.08]"
    >
      <span className="font-sfmono text-sm uppercase tracking-[0.08em] text-ink-primary">{label}</span>
      <span className="text-ink-muted transition-transform group-hover:translate-x-1">›</span>
      <TerminalHint text={`$ open ${hostFromUrl(href)}`} placement="below-start" />
    </a>
  );
}

function ProjectHeader({ onClose }: { onClose: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 md:px-12 md:py-4 bg-[#111111]/80 backdrop-blur-md border-b border-edge">
      <Link to="/" className="relative z-50 text-ink-primary font-sfmono text-base md:text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
        <ScrambleText text="silentlooop" /><span className="terminal-cursor text-ink-muted">_</span>
      </Link>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close project"
        data-cursor="link"
        className="relative text-xl text-ink-secondary transition-colors hover:text-ink-primary"
      >
        ✕
        <TerminalHint text="$ cd .. [esc]" placement="below-start" />
      </button>
    </nav>
  );
}

export function ProjectDetailLayout({ project }: { project: ProjectContent }) {
  const navigate = useNavigate();
  const nextProject = projects.find((p) => p.slug === project.nextProject);
  const title = toTitleCase(project.title);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.slug]);

  const handleClose = () => {
    navigate("/");
    restoreHomeScroll();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#111111] text-ink-primary font-sfmono selection:bg-white/20">
      <ProjectHeader onClose={handleClose} />
      <main className="w-full px-5 pb-24 pt-24 md:px-12">
        {/* --- Hero media, full width --- */}
        <div
          className="relative mt-6 aspect-[21/9] w-full overflow-hidden rounded-none border border-edge bg-surface-raised"
          style={{ viewTransitionName: `project-cover-${project.slug}` } as React.CSSProperties}
        >
          <div className="flex h-full w-full items-center justify-center p-6">
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
          </div>
        </div>

        {/* --- Title (left) + intro/meta/links/sections (pushed right), joseph.cv-style split --- */}
        <div className="mt-8 grid grid-cols-1 gap-x-10 lg:grid-cols-3">
          <div>
            <p className="font-sfmono text-xs uppercase tracking-[0.08em] text-ink-muted">{project.category}</p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-1 text-[28px] font-semibold uppercase leading-tight text-ink-primary"
            >
              {title}
            </motion.h1>
          </div>

          <div className="mt-4 lg:col-start-2 lg:col-span-2 lg:mt-0">
            <p className="max-w-[640px] tracking-tight [word-spacing:-0.12em] text-base leading-[1.6] text-ink-primary">{project.intro}</p>

            <div className="mt-4 grid grid-cols-2 gap-x-10 gap-y-5 border-t border-edge pt-4 sm:grid-cols-4">
              <MetaField label="Role" values={[project.meta.role]} />
              <MetaField label="Collaborators" values={project.meta.team} />
              <MetaField label="Duration" values={[project.meta.timeline]} />
              <MetaField label="Tools" values={project.meta.stack} chips />
            </div>

            {project.meta.links.length > 0 && (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {project.meta.links.map((link) => (
                  <LinkBlock key={link.label} label={link.label} href={link.href} />
                ))}
              </div>
            )}

            <div className="mt-6 space-y-5">
              {project.sections.map((section) => (
                <motion.div
                  key={section.heading}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.9 }}
                  variants={fadeInUp}
                  className="max-w-[640px] border-t border-edge pt-5"
                  data-cursor="text"
                >
                  <h2 className="font-sfmono text-xs font-normal uppercase tracking-[0.08em] text-ink-muted">{section.heading}</h2>
                  <p className="mt-2 tracking-tight [word-spacing:-0.12em] text-base leading-relaxed text-ink-secondary">{section.body}</p>
                </motion.div>
              ))}
            </div>

            {project.metrics && project.metrics.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-5 border-t border-edge pt-5 sm:grid-cols-4">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-[28px] font-bold leading-none text-ink-primary">{m.value}</div>
                    <div className="mt-2 font-sfmono text-xs uppercase tracking-[0.08em] text-ink-muted">{m.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- Next project --- */}
        {nextProject && (
          <div className="mt-12 border-t border-edge pt-6">
            <Link
              to={`/projects/${nextProject.slug}`}
              onClick={navigateWithTransition(navigate, `/projects/${nextProject.slug}`)}
              data-cursor="view"
              className="group relative flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-sfmono text-xs uppercase tracking-[0.08em] text-ink-muted">
                  Next Project <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </p>
                <p className="mt-1 text-xl font-bold uppercase text-ink-primary sm:text-2xl">{toTitleCase(nextProject.title)}</p>
              </div>
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-sm border border-edge bg-surface-raised p-2">
                <img src={nextProject.hero.src} alt="" className="h-full w-full object-contain" />
              </div>
              <TerminalHint text="$ next one-more" placement="below-start" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
