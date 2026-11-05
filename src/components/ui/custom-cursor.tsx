import { useEffect, useRef, useState } from "react";
import { EFFECTS } from "../../lib/effects-config";
import { usePrefersReducedMotion } from "./use-terminal-effects";

type CursorVariant = "default" | "link" | "view" | "text";

const SIZE: Record<CursorVariant, number> = {
  default: 20,
  link: 48,
  view: 88,
  text: 24, // height; width is fixed at 4px for this variant
};

const LERP = 0.18;

/** Inverting (mix-blend-difference) circle cursor that grows over interactive elements. Desktop only. */
export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!EFFECTS.customCursor) return;
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor-active");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let raf = 0;

    const applyTransform = () => {
      const el = outerRef.current;
      if (!el) return;
      el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
    };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (prefersReducedMotion) {
        current.x = e.clientX;
        current.y = e.clientY;
        applyTransform();
      }
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select")) {
        setVisible(false);
        return;
      }
      setVisible(true);
      if (el.closest('[data-cursor="view"]')) setVariant("view");
      else if (el.closest('[data-cursor="text"]')) setVariant("text");
      else if (el.closest('a, button, [role="button"], [data-cursor="link"]')) setVariant("link");
      else setVariant("default");
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    const tick = () => {
      if (!prefersReducedMotion) {
        current.x += (target.x - current.x) * LERP;
        current.y += (target.y - current.y) * LERP;
        applyTransform();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, [enabled, prefersReducedMotion]);

  if (!enabled) return null;

  const isText = variant === "text";
  const size = SIZE[variant];

  return (
    <div ref={outerRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[300]">
      <div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white mix-blend-difference transition-[width,height,opacity,transform] ease-out ${
          prefersReducedMotion ? "duration-0" : "duration-250"
        } ${pressed ? "scale-[0.85]" : "scale-100"} ${visible ? "opacity-100" : "opacity-0"}`}
        style={{ width: isText ? "4px" : `${size}px`, height: isText ? `${size}px` : `${size}px` }}
      >
        {variant === "view" && (
          <span className="font-sfmono text-[12px] font-medium text-black">see more</span>
        )}
      </div>
    </div>
  );
}
