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

function MetaField({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <p className="font-sfmono text-[11px] uppercase tracking-[0.12em] text-ink-muted">{label}</p>
      <div className="mt-2 space-y-1">
        {values.map((v) => (
          <p key={v} className="text-[15px] text-ink-primary">{v}</p>
        ))}
      </div>
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
      className="group relative flex items-center justify-between rounded-md bg-white/[0.04] px-5 py-4 transition-colors hover:bg-white/[0.08]"
    >
      <span className="font-sfmono text-[12px] uppercase tracking-[0.12em] text-ink-primary">{label}</span>
      <span className="text-ink-muted transition-transform group-hover:translate-x-1">›</span>
      <TerminalHint text={`$ open ${hostFromUrl(href)}`} placement="below-start" />
    </a>
  );
}

function ProjectHeader({ onClose }: { onClose: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 md:px-12 md:py-4 bg-[#111111]/80 backdrop-blur-md border-b border-white/5">
      <Link to="/" className="relative z-50 text-white font-sfmono text-base md:text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
        <ScrambleText text="silentlooop" /><span className="terminal-cursor text-zinc-500">_</span>
      </Link>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close project"
        data-cursor="link"
        className="relative text-xl text-gray-400 transition-colors hover:text-white"
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
    <div className="min-h-screen bg-[#111111] text-white font-sfmono selection:bg-white/20">
      <ProjectHeader onClose={handleClose} />
      <main className="w-full px-5 pb-24 pt-24 md:px-12">
        {/* --- Hero media, full width --- */}
        <div
          className="relative mt-6 aspect-[21/9] w-full overflow-hidden rounded-xl border border-edge bg-[#161616]"
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

        {/* --- Title + intro --- */}
        <div className="mt-10">
          <p className="font-sfmono text-[12px] uppercase tracking-[0.12em] text-ink-muted">{project.category}</p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-2 text-[28px] font-semibold leading-tight text-ink-primary sm:text-[32px]"
          >
            {title}
          </motion.h1>
          <p className="mt-4 max-w-[640px] text-[16px] leading-[1.6] text-ink-primary">{project.intro}</p>
        </div>

        {/* --- Meta --- */}
        <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-6 border-t border-white/5 pt-8 sm:grid-cols-4 lg:max-w-[900px]">
          <MetaField label="Role" values={[project.meta.role]} />
          <MetaField label="Collaborators" values={project.meta.team} />
          <MetaField label="Duration" values={[project.meta.timeline]} />
          <MetaField label="Tools" values={project.meta.stack} />
        </div>

        {/* --- Metrics --- */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-6 border-t border-white/5 pt-6 sm:grid-cols-4 lg:max-w-[900px]">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <div className="text-[28px] font-bold leading-none text-ink-primary">{m.value}</div>
                <div className="mt-2 font-sfmono text-[11px] uppercase tracking-[0.12em] text-ink-muted">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* --- Links --- */}
        {project.meta.links.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-[600px]">
            {project.meta.links.map((link) => (
              <LinkBlock key={link.label} label={link.label} href={link.href} />
            ))}
          </div>
        )}

        {/* --- Sections --- */}
        <div className="mt-10 space-y-8">
          {project.sections.map((section) => (
            <motion.p
              key={section.heading}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.9 }}
              variants={fadeInUp}
              className="max-w-[640px] border-t border-white/5 pt-8 text-[15px] leading-relaxed text-ink-secondary"
              data-cursor="text"
            >
              {section.body}
            </motion.p>
          ))}
        </div>

        {/* --- Next project --- */}
        {nextProject && (
          <div className="mt-16 border-t border-edge pt-8">
            <Link
              to={`/projects/${nextProject.slug}`}
              onClick={navigateWithTransition(navigate, `/projects/${nextProject.slug}`)}
              data-cursor="view"
              className="group relative flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-sfmono text-[12px] uppercase tracking-[0.12em] text-ink-muted">
                  Next Project <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </p>
                <p className="mt-1 text-xl font-bold text-white sm:text-2xl">{toTitleCase(nextProject.title)}</p>
              </div>
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-edge bg-[#161616] p-2">
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
