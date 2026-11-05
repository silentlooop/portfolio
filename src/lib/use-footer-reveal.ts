import { useEffect, useRef, useState, type RefObject } from "react";

/** 0-1 progress of how much of the fixed footer has been uncovered by <main>'s scroll margin. */
export function useFooterReveal(mainRef: RefObject<HTMLElement | null>, footerHeight: number) {
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (footerHeight <= 0) {
      setProgress(0);
      return;
    }

    const update = () => {
      const main = mainRef.current;
      if (main) {
        const rect = main.getBoundingClientRect();
        const revealed = window.innerHeight - rect.bottom;
        setProgress(Math.min(1, Math.max(0, revealed / footerHeight)));
      }
      frame.current = requestAnimationFrame(update);
    };

    frame.current = requestAnimationFrame(update);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [mainRef, footerHeight]);

  return progress;
}
