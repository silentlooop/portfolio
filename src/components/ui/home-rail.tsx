import { TerminalHint } from "./terminal-hint";
import { projects } from "../../data/projects";
import { FaLinkedin, FaGithub } from "react-icons/fa6";
import { SiLeetcode, SiMonkeytype } from "react-icons/si";

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
    <aside className="mb-10 lg:sticky lg:top-24 lg:mb-0 lg:h-fit">
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

        <nav
          aria-label="Projects index"
          className="flex gap-4 overflow-x-auto border-t border-white/5 pt-5 text-base lg:flex-col lg:gap-1.5 lg:overflow-visible"
        >
          {projects.map((project, i) => {
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
            className="group relative flex w-fit items-center gap-2 transition-colors hover:text-white"
          >
            <FaGithub className="h-4 w-4 shrink-0 text-ink-muted transition-colors group-hover:text-white" />
            github ↗
            <TerminalHint text="$ git log since=3am" placement="below-start" />
          </a>
          <a
            href="https://www.linkedin.com/in/manthan-p-6457b3313"
            target="_blank"
            rel="noreferrer"
            className="group relative flex w-fit items-center gap-2 transition-colors hover:text-white"
          >
            <FaLinkedin className="h-4 w-4 shrink-0 text-ink-muted transition-colors group-hover:text-[#0A66C2]" />
            linkedin ↗
            <TerminalHint text="$ open ./me in-a-blazer" placement="below-start" />
          </a>
          <a
            href="https://leetcode.com/u/silentlooop/"
            target="_blank"
            rel="noreferrer"
            className="group relative flex w-fit items-center gap-2 transition-colors hover:text-white"
          >
            <SiLeetcode className="h-4 w-4 shrink-0 text-ink-muted transition-colors group-hover:text-[#FFA116]" />
            leetcode ↗
            <TerminalHint text="$ sudo solve daily-humility" placement="below-start" />
          </a>
          <a
            href="https://monkeytype.com/account"
            target="_blank"
            rel="noreferrer"
            className="group relative flex w-fit items-center gap-2 transition-colors hover:text-white"
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
