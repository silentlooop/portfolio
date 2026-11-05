import { EFFECTS } from "../../lib/effects-config";
import { usePrefersReducedMotion } from "./use-terminal-effects";

const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/** Animated film-grain overlay. Pure CSS transform jitter on a tiled noise texture — no canvas, no JS loop. */
export function FilmGrain() {
  const prefersReducedMotion = usePrefersReducedMotion();
  if (!EFFECTS.grain || prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] opacity-[0.03] [animation:grain-shift_1.1s_steps(10)_infinite] will-change-transform"
      style={{
        backgroundImage: `url("${NOISE_SVG}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "120px 120px",
      }}
    />
  );
}
