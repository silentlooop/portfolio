import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { projects, type ProjectContent } from "../../content/projects";
import { TerminalHint } from "./terminal-hint";
import { NavBar } from "../../pages/about";
import { WindowDots } from "./window-dots";
import { SectionMedia } from "./section-media";
import { navigateWithTransition } from "../../lib/view-transition-nav";

function toTitleCase(text: string) {
  return text.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function MetaField({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <p className="font-sfmono text-[11px] uppercase tracking-tight text-[#6a9955]/80">{label}</p>
      <div className="mt-2 space-y-1">
        {values.map((v) => (
          <p key={v} className="text-[15px] font-medium text-ink-primary">{v}</p>
        ))}
      </div>
    </div>
  );
}

export function ProjectDetailLayout({ project }: { project: ProjectContent }) {
  const navigate = useNavigate();
  const nextProject = projects.find((p) => p.slug === project.nextProject);
  const title = toTitleCase(project.title);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.slug]);

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sfmono selection:bg-white/20">
      <NavBar />
      <main className="w-full min-w-0 px-5 pb-24 pt-28 mx-auto max-w-[1200px] md:px-8">
        {/* --- back link + breadcrumb, with the dots kept alive --- */}
        <div className="flex flex-wrap items-center gap-3 font-sfmono text-[12px] text-ink-muted">
          <WindowDots />
          <Link to="/" className="transition-colors hover:text-ink-secondary">$ cd ..</Link>
          <span className="text-zinc-700">·</span>
          <Link to="/" className="transition-colors hover:text-ink-secondary">~</Link>
          <span className="text-zinc-700">›</span>
          <Link to="/#work" className="transition-colors hover:text-ink-secondary">projects</Link>
          <span className="text-zinc-700">›</span>
          <span className="text-ink-secondary">{project.slug}.md</span>
        </div>

        {/* --- Hero media --- */}
        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mt-6 aspect-video w-full overflow-hidden rounded-lg border border-edge bg-[#161616] p-6"
          style={{ viewTransitionName: `project-cover-${project.slug}` } as React.CSSProperties}
        >
          <div className="flex h-full w-full items-center justify-center">
            {project.hero.type === "video" ? (
              <video
                src={project.hero.src}
                poster={project.hero.poster}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-contain"
              />
            ) : (
              <img src={project.hero.src} alt={project.title} className="h-full w-full object-contain" />
            )}
          </div>
        </motion.div>

        {/* --- Title block --- */}
        <div className="mt-10">
          <p className="font-sfmono text-[12px] uppercase tracking-tight text-ink-muted">{project.category}</p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-2 break-words text-[40px] font-bold leading-[1.05] tracking-tight text-ink-primary sm:text-6xl"
          >
            {title}
          </motion.h1>
          <p className="mt-4 max-w-[65ch] text-[17px] leading-relaxed text-ink-secondary">{project.intro}</p>
        </div>

        {/* --- Meta details row --- */}
        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/5 pt-6 sm:grid-cols-4">
          <MetaField label="Role" values={[project.meta.role]} />
          <MetaField label="Collaborators" values={project.meta.team} />
          <MetaField label="Duration" values={[project.meta.timeline]} />
          <MetaField label="Tools" values={project.meta.stack} />
        </div>

        {project.meta.links.length > 0 && (
          <div className="mt-6">
            <p className="font-sfmono text-[11px] uppercase tracking-tight text-[#6a9955]/80">Links</p>
            <div className="mt-2 flex flex-wrap gap-4">
              {project.meta.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className="relative text-[15px] text-ink-secondary transition-colors hover:text-[#fde047]"
                >
                  {link.label} ↗
                  <TerminalHint text="$ cat ./src judge-gently" placement="below-start" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* --- Key results --- */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/5 pt-6">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <div className="text-[28px] font-bold leading-none text-ink-primary">{m.value}</div>
                <div className="mt-1.5 font-sfmono text-[11px] uppercase tracking-tight text-ink-muted">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* --- Sections --- */}
        <div className="mt-24 space-y-24">
          {project.sections.map((section) => (
            <section key={section.heading} className="border-t border-white/[0.08] pt-10">
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.9 }}
                variants={fadeInUp}
                className="text-[25px] font-semibold text-ink-primary sm:text-[29px]"
              >
                {section.heading}
              </motion.h2>
              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.9 }}
                variants={fadeInUp}
                className="mt-3 max-w-[680px] text-[16px] leading-relaxed text-ink-secondary"
                data-cursor="text"
              >
                {section.body}
              </motion.p>
              <SectionMedia media={section.media} layout={section.layout} />
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
                <p className="font-sfmono text-[12px] uppercase tracking-tight text-ink-muted">
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
