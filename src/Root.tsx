import { lazy, Suspense, useRef, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// Secondary routes ship as their own chunks; they're prefetched on idle so opening one is still instant.
const loadProjectDetail = () => import("./pages/project-detail");
const loadShaped = () => import("./pages/shaped");
const ProjectDetail = lazy(loadProjectDetail);
const Shaped = lazy(loadShaped);
const NotFound = lazy(() => import("./pages/not-found"));
import { CommandTerminal } from "./components/ui/command-terminal";
import { FilmGrain } from "./components/ui/film-grain";
import { Timecode } from "./components/ui/timecode";
import { CustomCursor } from "./components/ui/custom-cursor";
import { Footer } from "./components/ui/footer";
import { ProjectTransitionProvider } from "./lib/project-transition";
import { useSmoothScroll } from "./lib/smooth-scroll";
import { useFooterHeight } from "./lib/use-footer-height";
import { useFooterReveal } from "./lib/use-footer-reveal";
import { usePrefersReducedMotion } from "./components/ui/use-terminal-effects";
import App from "./App";

export default function Root() {
  useSmoothScroll(true);
  const mainRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const footerContentRef = useRef<HTMLDivElement>(null);
  const footerHeight = useFooterHeight(footerRef);
  const prefersReducedMotion = usePrefersReducedMotion();
  useFooterReveal(mainRef, footerContentRef, footerHeight, prefersReducedMotion);

  useEffect(() => {
    const prefetch = () => {
      loadProjectDetail();
      loadShaped();
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(prefetch, 1500);
    return () => clearTimeout(id);
  }, []);

  // Easter egg: the tab title calls you back when you switch away.
  useEffect(() => {
    const originalTitle = document.title;
    const onVisibilityChange = () => {
      document.title = document.hidden ? "zsh: suspended — fg to resume" : originalTitle;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  return (
    <BrowserRouter>
      <ProjectTransitionProvider>
        <FilmGrain />
        <Timecode />
        <CustomCursor />
        <div className="cursor-default top-5">
          <main
            ref={mainRef}
            className="relative z-10 min-h-screen border-b border-edge bg-[#111111] shadow-[0_24px_48px_rgba(0,0,0,0.5)] md:mb-[var(--footer-h)]"
          >
            <Suspense fallback={<div className="min-h-screen bg-[#111111]" />}>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="/shaped" element={<Shaped />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer ref={footerRef} contentRef={footerContentRef} />
          <CommandTerminal />
        </div>
      </ProjectTransitionProvider>
    </BrowserRouter>
  );
}
