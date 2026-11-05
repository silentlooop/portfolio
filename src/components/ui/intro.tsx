import { useCallback, useEffect, useRef, useState } from "react";
import { EFFECTS } from "../../lib/effects-config";
import { startHum, stopHum, unlockAudio, playTick } from "../../lib/sound";

const SESSION_KEY = "intro-seen";

const BOOT_LINES = [
  "> mounting ./projects ... ok",
  "> loading trajectory ... ok",
  "> process: experience_loaded",
];

type Phase = "waiting" | "booting" | "transition" | "done";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function Intro({ onDone }: { onDone: () => void }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("waiting");
  const [lineIndex, setLineIndex] = useState(0);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
    stopHum();
    setPhase("done");
    onDone();
  }, [onDone]);

  // Skip entirely when the effect is disabled, reduced motion is requested, or we've already shown it this session.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // ignore
    }
    if (!EFFECTS.intro || prefersReducedMotion || seen) {
      finish();
    }
  }, [prefersReducedMotion, finish]);

  const start = useCallback(() => {
    if (phase !== "waiting") return;
    unlockAudio();
    startHum();
    setPhase("booting");
  }, [phase]);

  useEffect(() => {
    if (phase !== "waiting") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        finish();
        return;
      }
      start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, start, finish]);

  useEffect(() => {
    if (phase !== "booting") return;
    if (lineIndex >= BOOT_LINES.length) {
      const t = setTimeout(() => setPhase("transition"), 150);
      return () => clearTimeout(t);
    }
    playTick();
    const t = setTimeout(() => setLineIndex((i) => i + 1), 220);
    return () => clearTimeout(t);
  }, [phase, lineIndex]);

  useEffect(() => {
    if (phase !== "transition") return;
    const t = setTimeout(finish, 420);
    return () => clearTimeout(t);
  }, [phase, finish]);

  useEffect(() => {
    if (phase === "waiting" || phase === "done") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finish]);

  if (phase === "done") return null;

  return (
    <div
      className="dot-grid fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] font-sfmono text-zinc-300"
      role="button"
      tabIndex={0}
      aria-label="Skip intro"
      onClick={start}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        className="absolute right-5 top-5 rounded border border-white/10 px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:border-white/20 hover:text-zinc-300"
      >
        skip [esc]
      </button>

      <div className="w-[88vw] max-w-md overflow-hidden rounded-md border border-white/10 bg-[#141414] shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#111111] px-4 py-3">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#FFBD2E]" />
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#28C840]" />
          <span className="ml-2 truncate text-xs text-gray-500">manthan@portfolio:~$ boot</span>
        </div>

        <div className="min-h-[9rem] px-5 py-8 text-sm sm:px-8 sm:py-10">
          {phase === "waiting" && (
            <div aria-live="polite">
              <p className="mb-5 text-lg font-bold tracking-tight text-white sm:text-xl">
                silentlooop<span className="terminal-cursor text-zinc-500">_</span>
              </p>
              <p className="text-zinc-500">
                <span className="text-zinc-600">$</span> press any key to start{" "}
                <span className="terminal-cursor inline-block">▍</span>
              </p>
            </div>
          )}

          {phase === "booting" && (
            <div className="space-y-2" aria-live="polite">
              {BOOT_LINES.slice(0, lineIndex + 1).map((line, i) => {
                const [body, status] = line.split(/(?=ok$|experience_loaded$)/);
                return (
                  <p key={line} className="text-zinc-500">
                    <span className="text-zinc-400">{body}</span>
                    {status && <span className="text-[#fde047]">{status}</span>}
                    {i === lineIndex && <span className="terminal-cursor ml-1 inline-block">▍</span>}
                  </p>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-[11px] text-zinc-600">
          <span>
            status: <span className="text-[#fde047]">{phase === "waiting" ? "standby" : "booting"}</span>
          </span>
          <span>v5.0.0</span>
        </div>
      </div>

      {phase === "transition" && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center bg-[#0a0a0a]">
          <div className="h-px w-full origin-center bg-white [animation:crt-expand_380ms_ease-out_forwards]" />
        </div>
      )}
    </div>
  );
}
