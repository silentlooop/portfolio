import { TerminalHint } from "./terminal-hint";
import { projects } from "../../data/projects";
import { TILE_ORDER } from "../../data/project-tiles";

const orderedProjects = TILE_ORDER.map((slug) => projects.find((p) => p.slug === slug)).filter(
  (p): p is (typeof projects)[number] => !!p
);

function toTitleCase(text: string) {
  return text.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

type HomeRailProps = {
  activeSlug: string | null;
  onHoverIndex: (slug: string | null) => void;
  onSelectIndex: (slug: string) => void;
};

export function HomeRail({ activeSlug, onHoverIndex, onSelectIndex }: HomeRailProps) {
  return (
    <aside className="mb-10 lg:sticky lg:top-24 lg:mb-0 lg:h-fit lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
      <div className="space-y-6 font-sfmono">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">Manthan</h1>
          <p className="mt-1 text-base text-ink-secondary">ML engineer · IIT Bombay</p>
        </div>

        <p className="text-[15px] leading-relaxed text-ink-secondary">
          I build where math meets machinery — models that learn, pipelines that ship, and interfaces
          people actually enjoy using. Currently deep in diffusion models, watching structure emerge
          from noise.
        </p>

        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-[#fde047] animate-pulse" />
          <span>
            status: <span className="text-[#fde047]">online</span>
          </span>
        </div>

        <nav
          aria-label="Projects index"
          className="flex gap-4 overflow-x-auto border-t border-white/5 pt-5 text-base lg:flex-col lg:gap-1.5 lg:overflow-visible"
        >
          {orderedProjects.map((project, i) => {
            const isActive = activeSlug === project.slug;
            return (
              <button
                key={project.slug}
                type="button"
                onMouseEnter={() => onHoverIndex(project.slug)}
                onMouseLeave={() => onHoverIndex(null)}
                onClick={() => onSelectIndex(project.slug)}
                className={`shrink-0 whitespace-nowrap text-left transition-colors duration-250 ease-out lg:w-full lg:whitespace-normal ${
                  isActive ? "text-ink-primary" : "text-ink-muted hover:text-ink-secondary"
                }`}
              >
                <span className="font-sfmono text-sm">{String(i + 1).padStart(2, "0")}</span>{" "}
                {toTitleCase(project.title)}
              </button>
            );
          })}
        </nav>

        <div className="flex flex-col gap-2.5 border-t border-white/5 pt-5 text-sm text-ink-secondary">
          <a
            href="https://github.com/silentlooop"
            target="_blank"
            rel="noreferrer"
            className="group relative w-fit transition-colors hover:text-white"
          >
            github ↗
            <TerminalHint text="$ git log --since=3am" placement="below-start" />
          </a>
          <a
            href="https://www.linkedin.com/in/manthan-p-6457b3313"
            target="_blank"
            rel="noreferrer"
            className="group relative w-fit transition-colors hover:text-white"
          >
            linkedin ↗
            <TerminalHint text="$ open ./me --in-a-blazer" placement="below-start" />
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="group relative w-fit transition-colors hover:text-white"
          >
            resume ↗
            <TerminalHint text="$ cat resume.pdf" placement="below-start" />
          </a>
        </div>

        <div className="flex items-center gap-2 border-t border-white/5 pt-5 text-xs text-ink-muted">
          <span className="rounded-full border border-zinc-700 px-2 py-0.5 lowercase">v5.0.0</span>
          <span className="uppercase">updated 2026.08</span>
        </div>
      </div>
    </aside>
  );
}
