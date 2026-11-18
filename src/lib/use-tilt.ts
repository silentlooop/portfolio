import { useEffect, useRef } from "react";
import { EFFECTS } from "./effects-config";

const PERSPECTIVE = "perspective(1000px)";

/**
 * Pointer-driven 3D tilt with a small press-in. Writes `transform` straight onto the element (no CSS variables, so no
 * style invalidation of the subtree) and only holds a compositor layer (`will-change`) while it is actually moving.
 * Desktop pointers only; no-op under reduced motion.
 */
export function useTilt<T extends HTMLElement>(maxDeg = 4) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !EFFECTS.cardTilt) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { rx: 0, ry: 0, s: 1 };
    const cur = { rx: 0, ry: 0, s: 1 };
    let rect: DOMRect | null = null;
    let active = false;
    let raf = 0;

    const loop = () => {
      cur.rx += (target.rx - cur.rx) * 0.14;
      cur.ry += (target.ry - cur.ry) * 0.14;
      cur.s += (target.s - cur.s) * 0.25;
      const settled =
        Math.abs(target.rx - cur.rx) < 0.01 && Math.abs(target.ry - cur.ry) < 0.01 && Math.abs(target.s - cur.s) < 0.001;

      if (settled && !active) {
        // Back at rest: drop the transform and the layer entirely.
        el.style.transform = "";
        el.style.willChange = "";
        raf = 0;
        return;
      }
      el.style.transform = `${PERSPECTIVE} rotateX(${cur.rx.toFixed(3)}deg) rotateY(${cur.ry.toFixed(3)}deg) scale(${cur.s.toFixed(4)})`;
      raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) {
        el.style.willChange = "transform";
        raf = requestAnimationFrame(loop);
      }
    };

    const onEnter = () => {
      rect = el.getBoundingClientRect();
      active = true;
      kick();
    };
    const onMove = (e: PointerEvent) => {
      rect ??= el.getBoundingClientRect();
      target.ry = ((e.clientX - rect.left) / rect.width - 0.5) * 2 * maxDeg;
      target.rx = -((e.clientY - rect.top) / rect.height - 0.5) * 2 * maxDeg;
      kick();
    };
    const onLeave = () => {
      active = false;
      rect = null;
      target.rx = 0;
      target.ry = 0;
      target.s = 1;
      kick();
    };
    const onDown = () => {
      target.s = 0.975;
      kick();
    };
    const onUp = () => {
      target.s = 1;
      kick();
    };
    const onScroll = () => {
      rect = null;
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      el.style.transform = "";
      el.style.willChange = "";
    };
  }, [maxDeg]);

  return ref;
}
