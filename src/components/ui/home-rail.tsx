import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { TerminalHint } from "./terminal-hint";
import { EFFECTS } from "../../lib/effects-config";
import { projects } from "../../content/projects";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa6";
import { SiLeetcode, SiMonkeytype } from "react-icons/si";

function toTitleCase(text: string) {
  return text.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

/** Cover thumbnail that trails the pointer while hovering the projects index, leaning into the direction of travel. */
function RailPreview({ slug }: { slug: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);
  const active = enabled && slug !== null;

  useEffect(() => {
    if (!EFFECTS.cursorPreview) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(mq.matches && !reduced);
    const onMove = (e: MouseEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (!active) return;
    // Park the card just right of the rail so it never covers the index entries; it only tracks the pointer vertically.
    const rail = document.querySelector('nav[aria-label="Projects index"]')?.getBoundingClientRect();
    const anchorX = rail ? rail.right + 32 : pointer.current.x + 28;
    const cur = { y: pointer.current.y };
    let raf = 0;
    const tick = () => {
      const dy = pointer.current.y - cur.y;
      cur.y += dy * 0.18;
      const tilt = Math.max(-8, Math.min(8, dy * 0.25));
      if (ref.current) ref.current.style.transform = `translate3d(${anchorX}px, ${cur.y - 90}px, 0) rotate(${tilt.toFixed(2)}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  if (!enabled) return null;
  const project = projects.find((p) => p.slug === slug);

  // Portalled to <body>: the sticky rail is its own stacking context and would trap the card beneath the grid.
  return createPortal(
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[60]">
      <AnimatePresence>
        {active && project && (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, scale: 0.85, clipPath: "inset(50% 0% 50% 0%)" }}
            animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-0 w-[260px] overflow-hidden rounded-sm border border-edge-hover bg-[#141414] shadow-2xl shadow-black/60"
          >
            {project.cover.type === "video" ? (
              <video src={project.cover.src} autoPlay loop muted playsInline className="block h-auto w-full" />
            ) : (
              <img src={project.cover.src} alt="" className="block h-auto w-full" />
            )}
            <div className="truncate border-t border-edge px-2.5 py-1.5 font-sfmono text-2xs text-ink-muted">./projects/{project.slug}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}

type HomeRailProps = {
  activeSlug: string | null;
  onHoverIndex: (slug: string | null) => void;
  onSelectIndex: (slug: string) => void;
};

export function HomeRail({ activeSlug, onHoverIndex, onSelectIndex }: HomeRailProps) {
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);

  return (
    <aside className="mb-10 lg:sticky lg:top-28 lg:mb-0 lg:h-fit">
      <div className="space-y-6 font-sfmono lg:space-y-8">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.08em] text-[#fde047]">$ whoami</p>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-ink-primary lg:text-5xl">manthan</h1>
          <p className="mt-2 text-sm text-ink-secondary lg:text-base">ML engineer · IIT Bombay</p>
        </div>

        <p className="max-w-[42ch] text-sm leading-[1.7] text-ink-secondary lg:text-base">
          I build where math meets machinery: models that learn, pipelines that ship, and interfaces
          people actually enjoy using. Currently deep in diffusion models, watching structure emerge
          from noise.
        </p>

        <a
          href="mailto:24b2511@iitb.ac.in"
          data-cursor="link"
          className="group relative inline-flex w-fit items-center gap-2.5 rounded-sm border border-edge-hover px-3.5 py-2 text-sm text-ink-primary transition-colors hover:border-[#fde047]/60 hover:text-[#fde047]"
        >
          <FaEnvelope className="h-3.5 w-3.5 shrink-0 text-ink-muted transition-colors group-hover:text-[#fde047]" />
          24b2511@iitb.ac.in
          <span aria-hidden="true">↗</span>
          <TerminalHint text="$ mail -s hey manthan" placement="below-start" />
        </a>

        <nav
          aria-label="Projects index"
          className="flex gap-3 overflow-x-auto border-t border-edge pt-4 text-xs text-ink-muted lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pt-5 lg:text-sm"
        >
          {projects.map((project, i) => {
            const isActive = activeSlug === project.slug;
            return (
              <button
                key={project.slug}
                type="button"
                onMouseEnter={() => {
                  onHoverIndex(project.slug);
                  setPreviewSlug(project.slug);
                }}
                onMouseLeave={() => {
                  onHoverIndex(null);
                  setPreviewSlug(null);
                }}
                onClick={() => onSelectIndex(project.slug)}
                className={`group/idx shrink-0 whitespace-nowrap text-left transition-colors duration-250 ease-out lg:w-full lg:whitespace-normal ${isActive ? "text-ink-primary" : "text-ink-muted hover:text-ink-secondary"
                  }`}
              >
                <span className="font-sfmono text-sm">{String(i + 1).padStart(2, "0")}</span>{" "}
                <span
                  className={`inline-block uppercase transition-transform duration-250 ease-out ${isActive ? "lg:translate-x-1.5" : "lg:group-hover/idx:translate-x-1"}`}
                >
                  {toTitleCase(project.title)}
                </span>
              </button>
            );
          })}
        </nav>
        <RailPreview slug={previewSlug} />

        {EFFECTS.keyboardNav && (
          <p aria-hidden="true" className="-mt-3 hidden text-2xs text-ink-faint lg:block">
            <kbd className="rounded-sm border border-edge px-1">j</kbd> <kbd className="rounded-sm border border-edge px-1">k</kbd> browse
            {" · "}
            <kbd className="rounded-sm border border-edge px-1">↵</kbd> open
            {" · "}
            <kbd className="rounded-sm border border-edge px-1">/</kbd> terminal
          </p>
        )}

        <div className="flex flex-col gap-2.5 border-t border-edge pt-5 text-sm text-ink-secondary">
          <a
            href="https://github.com/silentlooop"
            target="_blank"
            rel="noreferrer"
            className="group relative flex w-fit items-center gap-2 transition-colors hover:text-ink-primary"
          >
            <FaGithub className="h-4 w-4 shrink-0 text-ink-muted transition-colors group-hover:text-ink-primary" />
            github ↗
            <TerminalHint text="$ git log since=3am" placement="below-start" />
          </a>
          <a
            href="https://www.linkedin.com/in/manthan-p-6457b3313"
            target="_blank"
            rel="noreferrer"
            className="group relative flex w-fit items-center gap-2 transition-colors hover:text-ink-primary"
          >
            <FaLinkedin className="h-4 w-4 shrink-0 text-ink-muted transition-colors group-hover:text-[#0A66C2]" />
            linkedin ↗
            <TerminalHint text="$ open ./me in-a-blazer" placement="below-start" />
          </a>
          <a
            href="https://leetcode.com/u/silentlooop/"
            target="_blank"
            rel="noreferrer"
            className="group relative flex w-fit items-center gap-2 transition-colors hover:text-ink-primary"
          >
            <SiLeetcode className="h-4 w-4 shrink-0 text-ink-muted transition-colors group-hover:text-[#FFA116]" />
            leetcode ↗
            <TerminalHint text="$ sudo solve daily-humility" placement="below-start" />
          </a>
          <a
            href="https://monkeytype.com/profile/silentlooop"
            target="_blank"
            rel="noreferrer"
            className="group relative flex w-fit items-center gap-2 transition-colors hover:text-ink-primary"
          >
            <SiMonkeytype className="h-4 w-4 shrink-0 text-ink-muted transition-colors group-hover:text-[#E2B714]" />
            monkeytype ↗
            <TerminalHint text="$ wpm check again" placement="below-start" />
          </a>
        </div>
      </div>
    </aside>
  );
}
