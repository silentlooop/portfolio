import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { projects } from "../../data/projects";
import { TerminalHint } from "./terminal-hint";
import { NavBar } from "../../pages/about";
import { WindowDots } from "./window-dots";
import { useEffect } from "react";

type Project = (typeof projects)[number];

function toTitleCase(text: string) {
  return text.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function TechChip({ text }: { text: string }) {
  return (
    <span className="px-2.5 py-1 text-[12px] text-ink-secondary border border-edge bg-white/[0.03]">{text}</span>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-sfmono text-[11px] uppercase tracking-wide text-[#6a9955]/80">{label}</p>
      <p className="mt-1 text-[14px] text-ink-primary">{value}</p>
    </div>
  );
}

function Section({ id, heading, text }: { id: string; heading: string; text: string }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-white/5 pt-10">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.9 }}
        variants={fadeInUp}
        className="text-[20px] font-semibold text-ink-primary"
      >
        <span className="mr-2 text-[#6a9955]/80">##</span>
        {heading}
      </motion.h2>
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.9 }}
        variants={fadeInUp}
        className="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-ink-secondary"
        data-cursor="text"
      >
        {text}
      </motion.p>
    </section>
  );
}

export function ProjectDetailLayout({ project }: { project: Project }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project.slug]);

  const title = toTitleCase(project.title);
  const links = [
    { label: "View Source", href: project.sourceLink, hint: "$ cat ./src judge-gently" },
    ...(("liveLink" in project && project.liveLink) ? [{ label: "Live", href: project.liveLink as string, hint: "$ open live" }] : []),
    ...(("paperLink" in project && project.paperLink) ? [{ label: "Paper", href: project.paperLink as string, hint: "$ cat ./paper.pdf" }] : []),
  ].filter((l) => l.href);

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sfmono selection:bg-white/20">
      <NavBar />
      <main className="w-full min-w-0 px-5 pb-24 pt-28 mx-auto max-w-[900px] md:px-8">
        {/* --- Window chrome --- */}
        <div className="overflow-hidden rounded-md border border-white/10 bg-[#111111]">
          <div className="flex items-end gap-3 border-b border-white/10 px-3 pt-2 md:px-5">
            <div className="flex shrink-0 items-center px-2 pb-3">
              <WindowDots />
            </div>
            <div className="-mb-px flex min-w-0 max-w-full items-center rounded-t-md border-x border-t border-white/10 bg-[#181818] px-4 py-2.5 md:px-5">
              <span className="truncate font-mono text-xs text-zinc-400">./projects/{project.slug}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-[#141414] px-4 py-2.5 font-sfmono text-[12px] text-ink-muted md:px-5">
            <Link to="/" className="hover:text-ink-secondary transition-colors">~</Link>
            <span>›</span>
            <Link to="/#work" className="hover:text-ink-secondary transition-colors">projects</Link>
            <span>›</span>
            <span className="text-ink-secondary">{project.slug}.md</span>
          </div>
        </div>

        {/* --- Cover media, right up top --- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative mt-6 aspect-video w-full overflow-hidden rounded-lg border border-edge bg-[#161616] p-6"
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

        {/* --- Category + title + intro --- */}
        <div className="mt-10">
          <p className="font-sfmono text-[12px] uppercase tracking-wide text-ink-muted">{project.type}</p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-2 break-words text-[40px] font-bold leading-[1.05] tracking-tight text-ink-primary sm:text-6xl"
          >
            {title}
          </motion.h1>
          <p className="mt-4 max-w-[65ch] text-[16px] leading-relaxed text-ink-secondary">{project.description}</p>
        </div>

        {/* --- Metadata --- */}
        <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/5 pt-6 sm:grid-cols-4">
          <MetaField label="Role" value={project.role} />
          <MetaField label="Year" value={project.year} />
          <MetaField label="Type" value={project.type} />
          <div>
            <p className="font-sfmono text-[11px] uppercase tracking-wide text-[#6a9955]/80">// Stack</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <TechChip key={tech} text={tech} />
              ))}
            </div>
          </div>
        </div>

        {links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="group relative flex items-center gap-1.5 rounded-md border border-edge px-3 py-1.5 font-sfmono text-[12px] uppercase tracking-wide text-ink-secondary transition-colors hover:border-[#fde047]/60 hover:text-[#fde047]"
              >
                {link.label}
                <span className="transition-transform group-hover:translate-x-0.5">↗</span>
                <TerminalHint text={link.hint} placement="below-start" />
              </a>
            ))}
          </div>
        )}

        {/* --- Body: single column, sections divided by a rule --- */}
        <div className="mt-16 space-y-16">
          <Section id="challenge" heading="The Challenge" text={project.challenge} />
          <Section id="solution" heading="The Solution" text={project.solution} />
          <Section id="impact" heading="Impact" text={project.impact} />
        </div>
      </main>
    </div>
  );
}
