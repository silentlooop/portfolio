import { useEffect, useState } from "react";
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

/** Corner timecode that advances with scroll progress, like a film reel counter. */
export function Timecode() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!EFFECTS.timecode) return;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!EFFECTS.timecode) return null;

  const totalFrames = Math.round(progress * REEL_SECONDS * FPS);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-3 right-3 z-[80] hidden select-none font-sfmono text-xs tabular-nums tracking-[0.08em] text-ink-faint md:block"
    >
      TC {formatTimecode(totalFrames)}
    </div>
  );
}
