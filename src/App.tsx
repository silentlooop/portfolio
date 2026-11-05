"use client"

import { useEffect } from "react"

import { ProjectsGrid } from "./components/ui/Projects2"
import { About, NavBar } from "./pages/about"
import { SectionPrompt } from "./components/ui/terminal-effects"
import { Arrow, Note, Signature } from "./components/ui/annotations"
import { OPEN_TERMINAL_EVENT } from "./components/ui/command-terminal"
import { TerminalHint } from "./components/ui/terminal-hint"

function App() {
  useEffect(() => {
    const scrollToWorkFromHash = () => {
      if (window.location.hash !== "#work") return;

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
        const workSection = document.getElementById("work");
        if (workSection) {
          workSection.scrollIntoView({ behavior: "smooth", block: "start" });
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

    const activeTimer = scrollToWorkFromHash();
    window.addEventListener("hashchange", scrollToWorkFromHash);

    return () => {
      if (activeTimer) clearInterval(activeTimer);
      window.removeEventListener("hashchange", scrollToWorkFromHash);
    };
  }, []);


  return (
    <>
      <NavBar />
      <div className="flex flex-col bg-[#111111] text-gray-200 scale-100 relative">

        {/* About section */}
        <div className="z-15 mb-0">
          <About />
        </div>

        {/* Projects */}
        <div id="work" className="relative z-15 w-full">
          <div className="relative w-full px-5 mt-4 max-w-5xl mx-auto">
            <SectionPrompt command="cd ./selected-work" className="mb-6" />
            <div aria-hidden="true" className="pointer-events-none absolute -top-1 right-8 hidden items-start gap-1 md:flex">
              <Note rotate={4}>pick one. they're real.</Note>
              <Arrow variant="down" className="h-14 w-10" rotate={18} delay={0.5} />
            </div>
          </div>
          <ProjectsGrid />
        </div>

        {/* Sign-off */}
        <div aria-hidden="true" className="pointer-events-none mx-auto mt-14 hidden w-full max-w-5xl items-end justify-between px-5 md:flex">
          <Note rotate={-3} size="sm" ink="faint" className="max-w-[16rem]">please don't steal the code without credit…</Note>
          <div className="text-right">
            <Signature className="ml-auto h-14 w-40" />
            <Note rotate={-2} size="sm" ink="faint">
              {new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} (this is a self portrait).
            </Note>
          </div>
        </div>

        {/* Art */}

        {/* Footer */}
        <div className="z-15 mt-12">
          <footer className="flex flex-col items-center body bg-[#1C1C1C] dot-grid z-[1] w-full sticky bottom-0 text-zinc-100 font-sfmono">
            <section className="w-full max-w-8xl relative z-10 pb-6 pt-6 px-3" style={{ opacity: 1 }}>
              <div className="flex flex-col items-start gap-3 font-sfmono text-[14px] leading-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6">
                <span className="flex flex-wrap items-center gap-2">
                  <p className="self-center w-min px-2 pt-1 pb-[2px] font-sfmono lowercase text-zinc-400 border-zinc-400 border border-solid rounded-full">v5.0.0</p>
                  <p className="self-center px-2 pt-1 pb-[2px] font-sfmono uppercase text-zinc-500">updated 2026.08</p>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event(OPEN_TERMINAL_EVENT))}
                    className="relative self-center px-2 pt-1 pb-[2px] font-sfmono lowercase text-zinc-500 transition-colors hover:text-[#fde047]"
                  >
                    <kbd className="mr-1.5 rounded border border-zinc-700 px-1 text-[11px] text-zinc-400">/</kbd>open terminal
                    <TerminalHint text="$ help" placement="below" className="!top-auto bottom-full mb-2 !mt-0" />
                  </button>
                </span>
                <span className="flex items-center gap-2 text-left text-xs uppercase tracking-wider text-zinc-600 sm:ml-auto sm:text-right">
                  <span>built + designed by</span>
                  <span className="text-zinc-400">manthan</span>
                  <span className="text-[#fde047]">/ silentlooop</span>
                </span>
              </div>
            </section>
          </footer>
        </div>


      </div>
    </>
  )

}

export default App
