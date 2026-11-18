import { useEffect, useRef } from "react";
import { EFFECTS } from "../../lib/effects-config";

const FPS = 30;
// Scroll progress 0→1 is mapped onto a notional 10-minute "reel" so the readout moves meaningfully per scroll tick.
const REEL_SECONDS = 600;

function formatTimecode(totalFrames: number) {
  const frames = totalFrames % FPS;
  const totalSeconds = Math.floor(totalFrames / FPS);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}

/** Corner timecode that advances with scroll progress, like a film reel counter. Writes to the DOM directly (no re-renders). */
export function Timecode() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!EFFECTS.timecode) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (ref.current) ref.current.textContent = `TC ${formatTimecode(Math.round(progress * REEL_SECONDS * FPS))}`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!EFFECTS.timecode) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed bottom-3 right-3 z-[80] hidden select-none font-sfmono text-xs tabular-nums tracking-[0.08em] text-ink-faint md:block"
    >
      TC {formatTimecode(0)}
    </div>
  );
}
