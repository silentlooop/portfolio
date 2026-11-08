import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { projects, type ProjectContent } from "../../content/projects";
import { TerminalHint } from "./terminal-hint";
import { ScrambleText } from "./scramble-text";
import { SectionMedia } from "./section-media";
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
      <p className="font-sfmono text-[12px] uppercase tracking-[0.12em] text-ink-muted">{label}</p>
      <div className="mt-2 space-y-1">
        {values.map((v) => (
          <p key={v} className="text-[16px] text-ink-primary">{v}</p>
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
      className="group relative flex items-center justify-between rounded-md bg-white/[0.04] px-6 py-6 transition-colors hover:bg-white/[0.08]"
    >
      <span className="font-sfmono text-[13px] uppercase tracking-[0.12em] text-ink-primary">{label}</span>
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
        {/* --- Hero media, full-bleed on a blurred backdrop --- */}
        <div
          className="relative mt-6 aspect-[16/7] w-full overflow-hidden"
          style={{ viewTransitionName: `project-cover-${project.slug}` } as React.CSSProperties}
        >
          {project.hero.heroBg ? (
            <div
              aria-hidden="true"
              className="absolute inset-0 scale-110 bg-cover bg-center blur-3xl saturate-150"
              style={{ backgroundImage: `url(${project.hero.heroBg})` }}
            />
          ) : (
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-[#161616] to-white/[0.02]" />
          )}
          <div className="relative flex h-full w-full items-center justify-center p-6 md:p-12">
            {project.hero.type === "video" ? (
              <video
                src={project.hero.src}
                poster={project.hero.poster}
                autoPlay
                loop
                muted
                playsInline
                className="max-h-full max-w-full object-contain drop-shadow-2xl"
              />
            ) : (
              <img src={project.hero.src} alt={project.title} className="max-h-full max-w-full object-contain drop-shadow-2xl" />
            )}
          </div>
        </div>

        {/* --- Title + intro + meta + links, all on one grid --- */}
        <div className="mt-16 grid grid-cols-1 gap-x-10 lg:grid-cols-3">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-[22px] font-semibold leading-tight text-ink-primary sm:text-[24px]"
            >
              {title}
            </motion.h1>
            <p className="mt-2 font-sfmono text-[12px] uppercase tracking-[0.12em] text-ink-muted">{project.category}</p>
          </div>

          <div className="mt-6 lg:col-span-2 lg:mt-0 lg:columns-2 lg:gap-x-6">
            <p className="text-[18px] leading-[1.5] text-ink-primary sm:text-[20px]">{project.intro}</p>
          </div>

          <div className="mt-4 lg:col-start-2 lg:col-span-2">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 lg:grid-cols-4">
              <MetaField label="Role" values={[project.meta.role]} />
              <MetaField label="Collaborators" values={project.meta.team} />
              <MetaField label="Duration" values={[project.meta.timeline]} />
              <MetaField label="Tools" values={project.meta.stack} />
            </div>

            {project.metrics && project.metrics.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/5 pt-6 lg:grid-cols-4">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-[32px] font-bold leading-none text-ink-primary">{m.value}</div>
                    <div className="mt-2 font-sfmono text-[12px] uppercase tracking-[0.12em] text-ink-muted">{m.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {project.meta.links.length > 0 && (
            <div className="mt-6 lg:col-start-2 lg:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {project.meta.links.map((link) => (
                  <LinkBlock key={link.label} label={link.label} href={link.href} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- Sections --- */}
        <div className="mt-12 space-y-12">
          {project.sections.map((section) => (
            <section key={section.heading} className="border-t border-white/[0.08] pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className={`lg:col-start-2 lg:col-span-2 ${section.layout === "full" ? "lg:col-span-3 lg:col-start-1" : ""}`}>
                  <motion.p
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.9 }}
                    variants={fadeInUp}
                    className={`max-w-[760px] text-[14px] leading-relaxed text-ink-secondary ${
                      section.body.length > 240 ? "lg:columns-2 lg:gap-x-6" : ""
                    }`}
                    data-cursor="text"
                  >
                    {section.body}
                  </motion.p>
                  <SectionMedia media={section.media} layout={section.layout} />
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* --- Next project --- */}
        {nextProject && (
          <div className="mt-24 border-t border-edge pt-10">
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
