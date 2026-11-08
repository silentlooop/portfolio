"use client"

import { useEffect, useState } from "react"

import { ProjectsGrid } from "./components/ui/Projects2"
import { HomeRail } from "./components/ui/home-rail"
import { NavBar, TerminalExperience } from "./pages/about"
import { SectionPrompt } from "./components/ui/terminal-effects"
import { Note, Signature } from "./components/ui/annotations"
import { projects } from "./data/projects"

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

  const scrollToProject = (slug: string) => {
    document.getElementById(`project-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col bg-[#111111] text-gray-200 scale-100 relative">

        {/* Rail + projects */}
        <div id="work" className="relative z-15 mx-auto w-full max-w-[1440px] px-5 pt-28 md:px-10">
          <SectionPrompt command="cd ./selected-work" className="mb-6 lg:hidden" />
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
            <HomeRail activeSlug={highlightedSlug} onHoverIndex={setHoveredSlug} onSelectIndex={scrollToProject} />
            <ProjectsGrid highlightedSlug={highlightedSlug} onHoverProject={setHoveredSlug} />
          </div>
        </div>

        {/* Experience */}
        <div id="experience" className="relative z-15 mx-auto mt-24 w-full max-w-[1440px] px-5 md:px-10">
          <SectionPrompt command="cd ./deep-dive/experience" className="mb-8" startOnMount />
          <TerminalExperience />
        </div>

        {/* Sign-off */}
        <div aria-hidden="true" className="pointer-events-none mx-auto mt-14 hidden w-full max-w-[1440px] items-end justify-end px-5 pb-16 md:flex md:px-10 md:pb-20">
          <div className="text-right">
            <Signature className="ml-auto h-14 w-40" />
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
