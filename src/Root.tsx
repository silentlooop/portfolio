import { useState, useEffect } from "react";
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
import { useSmoothScroll } from "./lib/smooth-scroll";
import App from "./App";

export default function Root() {
  const [introDone, setIntroDone] = useState(false);
  useSmoothScroll(introDone);

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
            <main>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="/shaped" element={<Shaped />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <CommandTerminal />
          </div>
        </BrowserRouter>
      )}
    </>
  );
}
