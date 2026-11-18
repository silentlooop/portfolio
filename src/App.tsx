"use client"

import { memo, useEffect, useRef, useState } from "react"

import { ProjectsGrid } from "./components/ui/projects-grid"
import { HomeRail } from "./components/ui/home-rail"
import { NavBar, TerminalExperience } from "./pages/about"
import { SectionPrompt } from "./components/ui/terminal-effects"
import { Note, Signature } from "./components/ui/annotations"
import { projects } from "./content/projects"
import { EFFECTS } from "./lib/effects-config"

// Static content: skip re-rendering it whenever a card hover / scroll-spy updates App state.
const Experience = memo(TerminalExperience)

function App() {
  const [activeSlug, setActiveSlug] = useState<string | null>(projects[0]?.slug ?? null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const highlightedSlug = hoveredSlug ?? activeSlug;

  useEffect(() => {
    const scrollToSectionFromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (id !== "work" && id !== "experience") return;

      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const isReload = navEntry?.type === "reload";

      if (isReload) {
        const cleanUrl = `${window.location.pathname}${window.location.search}`;
        window.history.replaceState(null, "", cleanUrl);
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }

      let attempts = 0;
      const maxAttempts = 30;

      const timer = setInterval(() => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
          clearInterval(timer);
          return;
        }

        attempts += 1;
        if (attempts >= maxAttempts) {
          clearInterval(timer);
        }
      }, 80);

      return timer;
    };

    const activeTimer = scrollToSectionFromHash();
    window.addEventListener("hashchange", scrollToSectionFromHash);

    return () => {
      if (activeTimer) clearInterval(activeTimer);
      window.removeEventListener("hashchange", scrollToSectionFromHash);
    };
  }, []);

  // Tracks which project tile is currently in view, to highlight the matching rail index item.
  useEffect(() => {
    const elements = projects
      .map((p) => document.getElementById(`project-${p.slug}`))
      .filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const slug = mostVisible?.target.getAttribute("data-project-slug");
        if (slug) setActiveSlug(slug);
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Keyboard browsing: j / k step through projects, 1–9 jump straight to one, Enter opens the focused card.
  const activeSlugRef = useRef(activeSlug);
  activeSlugRef.current = activeSlug;
  useEffect(() => {
    if (!EFFECTS.keyboardNav) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;

      const focusedSlug = (document.activeElement as HTMLElement | null)?.getAttribute("data-project-slug");
      const fromIndex = projects.findIndex((p) => p.slug === (focusedSlug ?? activeSlugRef.current));
      let nextIndex: number | null = null;

      if (e.key === "j" || e.key === "k") {
        const step = e.key === "j" ? 1 : -1;
        // First press focuses the card already in view; later presses move.
        nextIndex = focusedSlug ? fromIndex + step : Math.max(fromIndex, 0);
      } else if (/^[1-9]$/.test(e.key)) {
        nextIndex = Number(e.key) - 1;
      }
      if (nextIndex === null || nextIndex < 0 || nextIndex >= projects.length) return;

      e.preventDefault();
      const slug = projects[nextIndex].slug;
      const el = document.getElementById(`project-${slug}`);
      if (!el) return;
      el.focus({ preventScroll: true });
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setActiveSlug(slug);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const scrollToProject = (slug: string) => {
    document.getElementById(`project-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col bg-[#111111] text-ink-primary scale-100 relative">

        {/* Rail + projects */}
        <div id="work" className="relative z-15 mx-auto w-full max-w-[1440px] px-4 pt-24 md:px-10 md:pt-28">
          <h2 className="sr-only">Projects</h2>
          <SectionPrompt command="cd ./selected-work" className="mb-6 lg:hidden" />
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
            <HomeRail activeSlug={highlightedSlug} onHoverIndex={setHoveredSlug} onSelectIndex={scrollToProject} />
            <ProjectsGrid highlightedSlug={highlightedSlug} hoveredSlug={hoveredSlug} onHoverProject={setHoveredSlug} />
          </div>
        </div>

        {/* Experience */}
        <div id="experience" className="relative z-15 mx-auto mt-16 w-full max-w-[1440px] px-4 pb-16 md:mt-24 md:px-10 md:pb-0">
          <h2 className="sr-only">Experience</h2>
          <div className="border-t border-edge pt-10 md:pt-12">
            <Experience />
          </div>
        </div>

        {/* Sign-off */}
        <div aria-hidden="true" className="pointer-events-none mx-auto mt-10 flex w-full max-w-[1440px] items-end justify-end px-4 pb-12 md:mt-14 md:px-10 md:pb-20">
          <div className="text-right">
            <Signature className="ml-auto h-11 w-32 md:h-14 md:w-40" />
            <Note rotate={-2} size="sm" ink="faint">
              {new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} (this is a self portrait).
            </Note>
          </div>
        </div>

      </div>
    </>
  )

}

export default App
