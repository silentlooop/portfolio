import React, { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionReveal } from "./terminal-effects";
import { TerminalHint } from "./terminal-hint";
import { EFFECTS } from "../../lib/effects-config";
import { useProjectTransition } from "../../lib/project-transition";
import { useTilt } from "../../lib/use-tilt";
import { projects } from "../../content/projects";

function coverOf(slug: string) {
  return projects.find((p) => p.slug === slug)!.cover;
}

function metaOf(slug: string) {
  return projects.find((p) => p.slug === slug)!.meta;
}

gsap.registerPlugin(ScrollTrigger);

// Touch screens have no hover, so there the card crossing the viewport centre gets colour instead.
const CAN_HOVER = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

interface ProjectCardProps {
  slug: string;
  title: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
  mediaType?: "image" | "video";
  /** Intrinsic pixel dimensions, used to reserve layout space and avoid CLS. */
  width?: number;
  height?: number;
  isHighlighted?: boolean;
  /** Another card is being hovered / focused, so this one steps back. */
  isDimmed?: boolean;
  /** Above-the-fold card: load its image eagerly at high priority (it's the LCP element). */
  priority?: boolean;
  onHover?: (slug: string | null) => void;
}

const ProjectCard = memo(function ProjectCard({
  slug,
  title,
  category,
  imageSrc,
  imageAlt,
  mediaType = "image",
  width,
  height,
  isHighlighted = false,
  isDimmed = false,
  priority = false,
  onHover = () => {},
}: ProjectCardProps) {
  const { openProject } = useProjectTransition();
  const tiltRef = useTilt<HTMLElement>(3.5);

  // Determine media type from file extension if not explicitly provided
  const isVideo = mediaType === "video" ||
    imageSrc.endsWith('.mp4') ||
    imageSrc.endsWith('.webm') ||
    imageSrc.endsWith('.ogg') ||
    imageSrc.endsWith('.mov');

  const parallaxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [centered, setCentered] = useState(false);

  // Only decode/play the video while it's actually on screen.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!EFFECTS.imageParallax) return;
    const el = parallaxRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        }
      );

      if (!CAN_HOVER) {
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => setCentered(self.isActive),
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Grey at rest, colour on hover (or when centred, on touch).
  const colorGraded =
    !CAN_HOVER && centered ? "grayscale-0 saturate-100 brightness-100" : "grayscale saturate-50 brightness-90";
  const meta = metaOf(slug);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let cmd/ctrl/shift/middle-click open a new tab as usual.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    openProject(slug);
  };

  return (
    <Link
      to={`/projects/${slug}`}
      onClick={handleClick}
      id={`project-${slug}`}
      data-project-slug={slug}
      data-cursor="view"
      onMouseEnter={() => onHover(slug)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(slug)}
      onBlur={() => onHover(null)}
      className={`group/card relative mb-4 block break-inside-avoid bg-[#111111] px-0.5 py-0.5 transition-[opacity,filter] duration-400 ease-in-out ${
        isDimmed ? "opacity-40 blur-[1px]" : "opacity-100"
      }`}
    >
      <TerminalHint text={`$ open ./projects/${slug}`} />
      <article
        ref={tiltRef}
        className={`relative overflow-hidden rounded-sm border transition-colors duration-250 ease-out group-hover/card:border-edge-hover ${
          isHighlighted ? "border-edge-hover" : "border-edge"
        }`}
      >
        <div ref={parallaxRef}>
          {isVideo ? (
            <video
              ref={videoRef}
              src={imageSrc}
              className={`w-full h-auto object-contain transition-[filter,transform] duration-400 ease-out group-hover/card:scale-[1.02] group-hover/card:grayscale-0 group-hover/card:saturate-100 group-hover/card:brightness-100 ${colorGraded}`}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={imageSrc}
              alt={imageAlt}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
              width={width}
              height={height}
              className={`w-full h-auto object-contain transition-[filter,transform] duration-400 ease-out group-hover/card:scale-[1.02] group-hover/card:grayscale-0 group-hover/card:saturate-100 group-hover/card:brightness-100 ${colorGraded}`}
            />
          )}
        </div>
      </article>
      <div className="px-3 pb-3 pt-2">
        <div className="flex items-baseline justify-between gap-3">
          <div className="font-sfmono text-base font-semibold uppercase text-ink-primary">{title}</div>
          <span className="shrink-0 font-sfmono text-xs tabular-nums text-ink-muted">{meta.timeline}</span>
        </div>
        <div className="mt-[2px] font-sfmono text-xs text-ink-muted">{category}</div>
        <div className="mt-1 font-sfmono text-xs uppercase tracking-[0.08em] text-ink-faint">{meta.stack.slice(0, 3).join(" / ")}</div>
      </div>
    </Link>
  );
});

type ProjectsGridProps = {
  highlightedSlug?: string | null;
  /** Card (or rail entry) currently hovered/focused; every other card dims. */
  hoveredSlug?: string | null;
  onHoverProject?: (slug: string | null) => void;
};

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ highlightedSlug = null, hoveredSlug = null, onHoverProject = () => {} }) => {
  const projectCards = [
    <ProjectCard
      key="btsp"
      slug="btsp"
      priority
      title="BTSP"
      category="BIOX-WNCC PROJECT"
      imageSrc={coverOf("btsp").src}
      imageAlt="MRI scans with segmented tumor regions"
      width={coverOf("btsp").width}
      height={coverOf("btsp").height}
      isHighlighted={highlightedSlug === "btsp"}
      isDimmed={!!hoveredSlug && hoveredSlug !== "btsp"}
      onHover={onHoverProject}
    />,
    <ProjectCard
      key="pgm"
      slug="probabilistic-graphic-model"
      title="PROBABILISTIC GRAPHICAL MODEL"
      category="CONSUMER PRODUCT"
      imageSrc={coverOf("probabilistic-graphic-model").src}
      imageAlt="Bayesian deep reinforcement learning network diagram"
      width={coverOf("probabilistic-graphic-model").width}
      height={coverOf("probabilistic-graphic-model").height}
      isHighlighted={highlightedSlug === "probabilistic-graphic-model"}
      isDimmed={!!hoveredSlug && hoveredSlug !== "probabilistic-graphic-model"}
      onHover={onHoverProject}
    />,
    <ProjectCard
      key="instigpt"
      slug="instigpt"
      title="InstiGPT"
      category="AIC NLP PROJECT"
      imageSrc={coverOf("instigpt").src}
      imageAlt="instigpt"
      mediaType="video"
      isHighlighted={highlightedSlug === "instigpt"}
      isDimmed={!!hoveredSlug && hoveredSlug !== "instigpt"}
      onHover={onHoverProject}
    />,
    <ProjectCard
      key="wids"
      slug="wids-25"
      title="WiDS '25"
      category="TRADING ALGORITHM"
      imageSrc={coverOf("wids-25").src}
      imageAlt="DQN agent training code"
      width={coverOf("wids-25").width}
      height={coverOf("wids-25").height}
      isHighlighted={highlightedSlug === "wids-25"}
      isDimmed={!!hoveredSlug && hoveredSlug !== "wids-25"}
      onHover={onHoverProject}
    />,
    <ProjectCard
      key="karyogram"
      slug="karyogram"
      title="Karyogram"
      category="MEDICAL IMAGING PROJECT"
      imageSrc={coverOf("karyogram").src}
      imageAlt="Chromosome spread for karyotyping"
      width={coverOf("karyogram").width}
      height={coverOf("karyogram").height}
      isHighlighted={highlightedSlug === "karyogram"}
      isDimmed={!!hoveredSlug && hoveredSlug !== "karyogram"}
      onHover={onHoverProject}
    />,
  ];

  return (
    <SectionReveal className="group/grid columns-1 gap-4 sm:columns-2 md:columns-2" itemClassName="break-inside-avoid" threshold={0.05}>
      {projectCards}
    </SectionReveal>
  );
};

export { ProjectsGrid };
