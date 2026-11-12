import { forwardRef, useEffect, useState } from "react";
import { TerminalHint } from "./terminal-hint";
import { OPEN_TERMINAL_EVENT } from "./command-terminal";

type FooterProps = {
  progress: number;
  reducedMotion: boolean;
};

function FooterTimecode() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <span className="font-sfmono text-xs text-ink-faint">
      {pad(time.getHours())}:{pad(time.getMinutes())}:{pad(time.getSeconds())}
    </span>
  );
}

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer({ progress, reducedMotion }, ref) {
  const opacity = reducedMotion ? 1 : 0.4 + progress * 0.6;
  const translateY = reducedMotion ? 0 : 24 * (1 - progress);

  return (
    <footer
      ref={ref}
      className="relative z-0 w-full bg-[#1A1A1A] text-ink-primary font-sfmono md:fixed md:inset-x-0 md:bottom-0"
    >
      <div
        className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-5 sm:py-10 md:px-10"
        style={{ opacity, transform: `translateY(${translateY}px)` }}
      >
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
          {/* left */}
          <div className="space-y-2">
            <span className="inline-block rounded-sm border border-edge-hover px-2 py-0.5 text-sm lowercase text-ink-secondary">
              v5.0.0
            </span>
            <p className="font-sfmono text-xs uppercase tracking-[0.08em] text-ink-faint">last updated {__BUILD_DATE__}</p>
          </div>

          {/* middle */}
          <div className="flex flex-col items-start gap-2 text-xs text-ink-secondary sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2 sm:text-base">
            <a
              href="https://github.com/silentlooop"
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              className="group relative w-fit transition-colors hover:text-ink-primary"
            >
              github ↗
              <TerminalHint text="$ git log since=3am" placement="below-start" />
            </a>
            <a
              href="https://www.linkedin.com/in/manthan-p-6457b3313"
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              className="group relative w-fit transition-colors hover:text-ink-primary"
            >
              linkedin ↗
              <TerminalHint text="$ open ./me in-a-blazer" placement="below-start" />
            </a>
          </div>

          {/* right */}
          <div className="space-y-2 sm:text-right">
            <a
              href="mailto:24b2511@iitb.ac.in"
              data-cursor="link"
              className="relative inline-block w-fit text-base text-ink-secondary transition-colors hover:text-ink-primary"
            >
              24b2511@iitb.ac.in ↗
              <TerminalHint text="$ mail -s hey manthan" placement="below-start" />
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start gap-4 border-t border-edge pt-4 text-xs uppercase tracking-[0.08em] text-ink-faint md:mt-8 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-3 md:pt-5 md:text-sm">
          <span className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <span>built + designed by</span>
            <span className="flex items-center gap-2">
              <span className="text-ink-secondary">manthan</span>
              <span className="text-ink-secondary">/ silentlooop</span>
            </span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(OPEN_TERMINAL_EVENT))}
              data-cursor="link"
              className="relative ml-0 self-start text-left normal-case text-ink-muted transition-colors hover:text-[#fde047]"
            >
              <kbd className="mr-1.5 rounded-sm border border-edge-hover px-1 text-xs text-ink-secondary lowercase">/</kbd>
              open terminal
              <TerminalHint text="$ help" placement="below" className="!top-auto bottom-full mb-2 !mt-0" />
            </button>
          </span>
          <FooterTimecode />
        </div>
      </div>
    </footer>
  );
});
