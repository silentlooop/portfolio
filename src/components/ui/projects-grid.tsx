import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionReveal } from "./terminal-effects";
import { TerminalHint } from "./terminal-hint";
import { EFFECTS } from "../../lib/effects-config";
import { navigateWithTransition } from "../../lib/view-transition-nav";
import { projects } from "../../content/projects";

function coverOf(slug: string) {
  return projects.find((p) => p.slug === slug)!.cover;
}

gsap.registerPlugin(ScrollTrigger);

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
  onHover?: (slug: string | null) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  slug,
  title,
  category,
  imageSrc,
  imageAlt,
  mediaType = "image",
  width,
  height,
  isHighlighted = false,
  onHover = () => {},
}) => {
  const navigate = useNavigate();

  // Determine media type from file extension if not explicitly provided
  const isVideo = mediaType === "video" ||
    imageSrc.endsWith('.mp4') ||
    imageSrc.endsWith('.webm') ||
    imageSrc.endsWith('.ogg') ||
    imageSrc.endsWith('.mov');

  const parallaxRef = useRef<HTMLDivElement>(null);
  const [centered, setCentered] = useState(false);

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

      ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => setCentered(self.isActive),
      });
    });

    return () => ctx.revert();
  }, []);

  const colorGraded = centered ? "grayscale-0 saturate-100" : "grayscale saturate-50";

  return (
    <Link
      to={`/projects/${slug}`}
      onClick={navigateWithTransition(navigate, `/projects/${slug}`)}
      id={`project-${slug}`}
      data-project-slug={slug}
      data-cursor="view"
      onMouseEnter={() => onHover(slug)}
      onMouseLeave={() => onHover(null)}
      className="group/card relative mb-4 block break-inside-avoid bg-[#111111] px-0.5 py-0.5 opacity-100 transition-opacity duration-500 ease-in-out hover:opacity-75"
    >
      <TerminalHint text={`$ open ./projects/${slug}`} />
      <article
        className={`overflow-hidden rounded-sm border transition-colors duration-250 ease-out group-hover/card:border-edge-hover ${
          isHighlighted ? "border-edge-hover" : "border-edge"
        }`}
      >
        <div ref={parallaxRef} style={{ viewTransitionName: `project-cover-${slug}` } as React.CSSProperties}>
          {isVideo ? (
            <video
              src={imageSrc}
              className={`w-full h-auto object-contain transition-[filter,transform] duration-400 ease-out group-hover/card:scale-[1.02] group-hover/card:grayscale-0 group-hover/card:saturate-100 ${colorGraded}`}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={imageSrc}
              alt={imageAlt}
              loading="lazy"
              width={width}
              height={height}
              className={`w-full h-auto object-contain transition-[filter,transform] duration-400 ease-out group-hover/card:scale-[1.02] group-hover/card:grayscale-0 group-hover/card:saturate-100 ${colorGraded}`}
            />
          )}
        </div>
      </article>
      <div className="px-3 pb-3 pt-2">
        <div className="text-base font-semibold uppercase text-white">{title}</div>
        <div className="mt-[2px] text-xs text-zinc-500">{category}</div>
      </div>
    </Link>
  );
};

type ProjectsGridProps = {
  highlightedSlug?: string | null;
  onHoverProject?: (slug: string | null) => void;
};

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ highlightedSlug = null, onHoverProject = () => {} }) => {
  const projectCards = [
    <ProjectCard
      key="btsp"
      slug="btsp"
      title="BTSP"
      category="BIOX-WNCC PROJECT"
      imageSrc={coverOf("btsp").src}
      imageAlt="btsp"
      width={coverOf("btsp").width}
      height={coverOf("btsp").height}
      isHighlighted={highlightedSlug === "btsp"}
      onHover={onHoverProject}
    />,
    <ProjectCard
      key="pgm"
      slug="probabilistic-graphic-model"
      title="PROBABILISTIC GRAPHIC MODEL"
      category="CONSUMER PRODUCT"
      imageSrc={coverOf("probabilistic-graphic-model").src}
      imageAlt="currency converter"
      width={coverOf("probabilistic-graphic-model").width}
      height={coverOf("probabilistic-graphic-model").height}
      isHighlighted={highlightedSlug === "probabilistic-graphic-model"}
      onHover={onHoverProject}
    />,
    <ProjectCard
      key="resume-rater"
      slug="resume-rater"
      title="RESUME RATER"
      category="AI MODEL"
      imageSrc={coverOf("resume-rater").src}
      mediaType="image"
      imageAlt="resume rater"
      width={coverOf("resume-rater").width}
      height={coverOf("resume-rater").height}
      isHighlighted={highlightedSlug === "resume-rater"}
      onHover={onHoverProject}
    />,
    <ProjectCard
      key="wids"
      slug="wids-25"
      title="WiDS'25"
      category="TRADING ALGORITHM"
      imageSrc={coverOf("wids-25").src}
      imageAlt="wids"
      width={coverOf("wids-25").width}
      height={coverOf("wids-25").height}
      isHighlighted={highlightedSlug === "wids-25"}
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
      onHover={onHoverProject}
    />,
    <ProjectCard
      key="karyogram"
      slug="karyogram"
      title="Karyogram"
      category="MEDICAL IMAGING PROJECT"
      imageSrc={coverOf("karyogram").src}
      imageAlt="karyogram"
      width={coverOf("karyogram").width}
      height={coverOf("karyogram").height}
      isHighlighted={highlightedSlug === "karyogram"}
      onHover={onHoverProject}
    />,
  ];

  return (
    <SectionReveal className="group/grid columns-1 gap-4 sm:columns-2 md:columns-2" itemClassName="break-inside-avoid">
      {projectCards}
    </SectionReveal>
  );
};

export { ProjectsGrid };
