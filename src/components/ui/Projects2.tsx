import React, { useEffect, useRef } from "react";
import { SectionReveal } from "./terminal-effects";
import { TerminalHint } from "./terminal-hint";
import { playReelClick } from "../../lib/sound";
import { projects } from "../../data/projects";
import { PROJECT_TILE_RATIO, RATIO_CLASS } from "../../data/project-tiles";

function toTitleCase(text: string) {
  return text.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

type Project = (typeof projects)[number];

function ProjectCard({
  project,
  isHighlighted,
  onHover,
}: {
  project: Project;
  isHighlighted: boolean;
  onHover: (slug: string | null) => void;
}) {
  const ratio = PROJECT_TILE_RATIO[project.slug] ?? "standard";
  const media = ("video" in project && project.video) || project.image;
  const isVideo = ("video" in project && !!project.video) || isVideoUrl(media);
  const title = toTitleCase(project.title);
  const meta = `${project.year} · ${project.role} · ${project.stack[0]}`;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isVideo) return;
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVideo]);

  return (
    <a
      href={`/projects/${project.slug}`}
      id={`project-${project.slug}`}
      data-project-slug={project.slug}
      onMouseEnter={() => {
        playReelClick();
        onHover(project.slug);
      }}
      onMouseLeave={() => onHover(null)}
      className="group/card mb-6 block scroll-mt-28 break-inside-avoid"
    >
      <TerminalHint text={`$ open ./projects/${project.slug}`} />
      <div
        className={`relative overflow-hidden rounded-lg border bg-[#161616] p-6 transition-colors duration-250 ease-out group-hover/card:border-edge-hover ${RATIO_CLASS[ratio]} ${
          isHighlighted ? "border-edge-hover" : "border-edge"
        }`}
      >
        <span className="absolute left-3 top-3 z-10 font-sfmono text-[11px] text-ink-muted">
          {String(projects.findIndex((p) => p.slug === project.slug) + 1).padStart(2, "0")}
        </span>
        <div className="flex h-full w-full items-center justify-center">
          {isVideo ? (
            <video
              ref={videoRef}
              src={media}
              className="h-full w-full object-contain transition-transform duration-400 ease-out group-hover/card:scale-[1.02]"
              loop
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={media}
              alt={project.title}
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-400 ease-out group-hover/card:scale-[1.02]"
            />
          )}
        </div>
      </div>
      <div className="pt-3">
        <h3 className="text-[18px] font-semibold leading-snug text-ink-primary">{title}</h3>
        <p className="mt-1 line-clamp-1 text-[14px] leading-relaxed text-ink-secondary">{project.description}</p>
        <p className="mt-1.5 font-sfmono text-[12px] uppercase tracking-wide text-ink-muted">{meta}</p>
      </div>
    </a>
  );
}

type ProjectsGridProps = {
  highlightedSlug?: string | null;
  onHoverProject?: (slug: string | null) => void;
};

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ highlightedSlug = null, onHoverProject = () => {} }) => {
  return (
    <SectionReveal className="columns-1 gap-6 lg:columns-2 min-[1600px]:columns-3" itemClassName="break-inside-avoid">
      {projects.map((project) => (
        <ProjectCard
          key={project.slug}
          project={project}
          isHighlighted={highlightedSlug === project.slug}
          onHover={onHoverProject}
        />
      ))}
    </SectionReveal>
  );
};

export { ProjectsGrid };
