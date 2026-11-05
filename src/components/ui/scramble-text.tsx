import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EFFECTS } from "../../lib/effects-config";

gsap.registerPlugin(ScrollTrigger);

const CHARS = "!<>-_\\/[]{}=+*^?#";

/** Scrambles into its final text once, when scrolled into view. Decorative only — screen readers get the plain text. */
export function ScrambleText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!EFFECTS.titleScramble || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = text;
      return;
    }

    el.textContent = text;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        const length = text.length;
        const state = { progress: 0 };
        gsap.to(state, {
          progress: 1,
          duration: 0.6,
          ease: "power1.out",
          onUpdate: () => {
            const revealCount = Math.floor(state.progress * length);
            let out = "";
            for (let i = 0; i < length; i += 1) {
              out += i < revealCount || text[i] === " " ? text[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
            }
            el.textContent = out;
          },
          onComplete: () => {
            el.textContent = text;
          },
        });
      },
    });

    return () => trigger.kill();
  }, [text]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">{text}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
