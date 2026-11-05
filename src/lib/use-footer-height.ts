import { useEffect, useState, type RefObject } from "react";

/** Observes the footer's rendered height and mirrors it to --footer-h on :root, no hardcoded px. */
export function useFooterHeight(footerRef: RefObject<HTMLElement | null>) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect.height ?? 0;
      setHeight(h);
      document.documentElement.style.setProperty("--footer-h", `${h}px`);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [footerRef]);

  return height;
}
