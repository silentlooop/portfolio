import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionReveal } from "./terminal-effects";
import { TerminalHint } from "./terminal-hint";
import { EFFECTS } from "../../lib/effects-config";
import { playReelClick } from "../../lib/sound";

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  href?: string;
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
  href,
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
  const Wrapper: React.ElementType = href ? "a" : "div";
  const projectSlug = href?.split("/").filter(Boolean).pop() ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

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
    <Wrapper
      href={href}
      id={`project-${projectSlug}`}
      data-project-slug={projectSlug}
      onMouseEnter={() => {
        playReelClick();
        onHover(projectSlug);
      }}
      onMouseLeave={() => onHover(null)}
      className="group/card block mb-4 scroll-mt-28 break-inside-avoid bg-[#111111] transition-opacity duration-500 ease-in-out opacity-100 hover:opacity-75 relative px-0.5 py-0.5"
      {...(href ? { target: "_self", rel: "noopener noreferrer" } : {})}
      style={{
        fontFamily:
          '"SF Mono", "Space Mono", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace',
      }}
    >
      <TerminalHint text={`$ open ./projects/${projectSlug}`} />
      <article
        className={`overflow-hidden rounded-sm border transition-colors duration-250 ease-out group-hover/card:border-edge-hover ${
          isHighlighted ? "border-edge-hover" : "border-edge"
        }`}
      >
        <div ref={parallaxRef}>
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
      <div className="pt-2 pb-3 px-3">
        <div className="font-semibold text-white text-base">{title}</div>
        <div className="text-zinc-500 text-xs mt-[2px]">{category}</div>
      </div>
    </Wrapper>
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
      href="/projects/btsp"
      title="BTSP"
      category="BIOX-WNCC PROJECT"
      imageSrc="/btsp.png"
      imageAlt="btsp"
      width={1920}
      height={1080}
      isHighlighted={highlightedSlug === "btsp"}
      onHover={onHoverProject}
    />,
    <ProjectCard
      key="pgm"
      href="/projects/probabilistic-graphic-model"
      title="PROBABILISTIC GRAPHIC MODEL"
      category="CONSUMER PRODUCT"
      imageSrc="/soc.jpeg"
      imageAlt="currency converter"
      width={736}
      height={736}
      isHighlighted={highlightedSlug === "probabilistic-graphic-model"}
      onHover={onHoverProject}
    />,
    <ProjectCard
      key="resume-rater"
      href="/projects/resume-rater"
      title="RESUME RATER"
      category="AI MODEL"
      imageSrc="/aic2.png"
      mediaType="image"
      imageAlt="resume rater"
      width={1080}
      height={1080}
      isHighlighted={highlightedSlug === "resume-rater"}
      onHover={onHoverProject}
    />,
    <ProjectCard
      key="wids"
      href="/projects/wids-25"
      title="WiDS'25"
      category="TRADING ALGORITHM"
      imageSrc="/dqn2.png"
      imageAlt="wids"
      width={2696}
      height={574}
      isHighlighted={highlightedSlug === "wids-25"}
      onHover={onHoverProject}
    />,
    <ProjectCard
      key="instigpt"
      href="/projects/instigpt"
      title="InstiGPT"
      category="AIC NLP PROJECT"
      imageSrc="/instigpt copy.mp4"
      imageAlt="instigpt"
      mediaType="video"
      isHighlighted={highlightedSlug === "instigpt"}
      onHover={onHoverProject}
    />,
    <ProjectCard
      key="karyogram"
      href="/projects/karyogram"
      title="Karyogram"
      category="MEDICAL IMAGING PROJECT"
      imageSrc="/karyo.png"
      imageAlt="karyogram"
      width={850}
      height={496}
      isHighlighted={highlightedSlug === "karyogram"}
      onHover={onHoverProject}
    />,
  ];

  return (
    <SectionReveal className="columns-1 sm:columns-2 md:columns-2 gap-4 group/grid" itemClassName="break-inside-avoid">
      {projectCards}
    </SectionReveal>
  );
};

export { ProjectsGrid };
