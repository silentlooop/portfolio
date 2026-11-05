import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EFFECTS } from "./effects-config";

gsap.registerPlugin(ScrollTrigger);

/** Lenis smooth scroll synced to GSAP's ticker + ScrollTrigger. No-op if disabled or reduced-motion. */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !EFFECTS.smoothScroll) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    const onTick = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [enabled]);
}
