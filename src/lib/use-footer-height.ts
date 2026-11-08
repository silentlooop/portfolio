import { useLayoutEffect, useState, type RefObject } from "react";

/** Observes the footer's rendered height and mirrors it to --footer-h on :root, no hardcoded px. */
export function useFooterHeight(footerRef: RefObject<HTMLElement | null>) {
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const apply = (h: number) => {
      setHeight(h);
      document.documentElement.style.setProperty("--footer-h", `${h}px`);
    };

    // Measure synchronously before first paint so the main margin is correct
    // from frame one, instead of waiting on the ResizeObserver's first callback.
    apply(el.getBoundingClientRect().height);

    const observer = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect.height ?? 0;
      apply(h);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [footerRef]);

  return height;
}
