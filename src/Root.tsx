import { useRef, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProjectDetail from "./pages/project_details";
import Shaped from "./pages/shaped";
import Blogs from "./pages/blogs";
import NotFound from "./pages/not_found";
import { CommandTerminal } from "./components/ui/command-terminal";
import { Intro } from "./components/ui/intro";
import { FilmGrain } from "./components/ui/film-grain";
import { Timecode } from "./components/ui/timecode";
import { CustomCursor } from "./components/ui/custom-cursor";
import { Footer } from "./components/ui/footer";
import { useSmoothScroll } from "./lib/smooth-scroll";
import { useFooterHeight } from "./lib/use-footer-height";
import { useFooterReveal } from "./lib/use-footer-reveal";
import { usePrefersReducedMotion } from "./components/ui/use-terminal-effects";
import App from "./App";

export default function Root() {
  const [introDone, setIntroDone] = useState(false);
  useSmoothScroll(introDone);
  const mainRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const footerHeight = useFooterHeight(footerRef);
  const revealProgress = useFooterReveal(mainRef, footerHeight);
  const prefersReducedMotion = usePrefersReducedMotion();

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
    <>
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      {introDone && (
        <BrowserRouter>
          <FilmGrain />
          <Timecode />
          <CustomCursor />
          <div className="cursor-default top-5">
            <main
              ref={mainRef}
              className="relative z-10 min-h-screen border-b border-white/[0.08] bg-[#111111] shadow-[0_24px_48px_rgba(0,0,0,0.5)] md:mb-[var(--footer-h)]"
            >
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="/shaped" element={<Shaped />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer ref={footerRef} progress={revealProgress} reducedMotion={prefersReducedMotion} />
            <CommandTerminal />
          </div>
        </BrowserRouter>
      )}
    </>
  );
}
