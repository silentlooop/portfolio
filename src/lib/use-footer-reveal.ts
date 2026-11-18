import { useEffect, type RefObject } from "react";

/**
 * Fades / lifts the fixed footer's content in as <main>'s scroll margin uncovers it.
 *
 * Driven by scroll + resize (rAF-throttled) and written straight to the DOM, so it costs nothing while idle and never
 * re-renders React. (It used to poll getBoundingClientRect every frame and set state at the app root.)
 */
export function useFooterReveal(
  mainRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  footerHeight: number,
  reducedMotion: boolean
) {
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    if (reducedMotion || footerHeight <= 0) {
      content.style.opacity = "1";
      content.style.transform = "none";
      return;
    }

    let raf = 0;
    let last = -1;
    const update = () => {
      raf = 0;
      const main = mainRef.current;
      if (!main) return;
      const revealed = window.innerHeight - main.getBoundingClientRect().bottom;
      const progress = Math.min(1, Math.max(0, revealed / footerHeight));
      if (Math.abs(progress - last) < 0.001) return;
      last = progress;
      content.style.opacity = String(0.4 + progress * 0.6);
      content.style.transform = `translate3d(0, ${(24 * (1 - progress)).toFixed(2)}px, 0)`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Route changes swap <main>'s height without a scroll event.
    const observer = new ResizeObserver(schedule);
    if (mainRef.current) observer.observe(mainRef.current);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [mainRef, contentRef, footerHeight, reducedMotion]);
}
