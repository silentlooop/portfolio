import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { projects } from "../content/projects";
import { EFFECTS } from "./effects-config";

/**
 * Page-transition engine for opening / closing projects.
 *
 * Every transition has two halves: `cover` (overlay takes over the screen) and `reveal` (overlay gets out of the way of
 * the freshly-mounted page). Navigation happens in between, while the screen is fully covered, so the route swap is never
 * visible. Opening a project or the ~/me page uses the "shutter"; going back home uses the rising curtain.
 */

const ACCENT = "#fde047";
const BG = "#111111";
const HOME_SCROLL_KEY = "home-scroll-y";

type ContextValue = {
  openProject: (slug: string) => void;
  /** Shutter into the ~/me page. */
  openMe: () => void;
  /** Curtain back home; with `section` ("work" | "experience") it lands on that section instead of the saved scroll. */
  closeToHome: (section?: string) => void;
  /** False while a project page is mounted underneath the overlay; pages gate their entrance animations on it. */
  revealed: boolean;
};

const TransitionContext = createContext<ContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components -- hook is co-located with its provider
export function useProjectTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useProjectTransition must be used inside <ProjectTransitionProvider>");
  return ctx;
}

// ─── helpers ────────────────────────────────────────────────────────────────

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

function play(tl: gsap.core.Timeline) {
  return new Promise<void>((resolve) => {
    tl.eventCallback("onComplete", () => resolve());
    tl.play(0);
  });
}

async function waitForElement(selector: string, maxFrames = 240) {
  for (let i = 0; i < maxFrames; i++) {
    const el = document.querySelector<HTMLElement>(selector);
    if (el) {
      await nextFrame(); // let the page's own mount effects (scroll reset etc.) run
      return el;
    }
    await nextFrame();
  }
  return null;
}

function preloadImage(src: string, timeoutMs: number) {
  const load = new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
  return Promise.race([load, wait(timeoutMs)]);
}

function make<K extends keyof HTMLElementTagNameMap>(
  parent: HTMLElement,
  style: Partial<CSSStyleDeclaration>,
  tag: K = "div" as K,
  className = ""
) {
  const node = document.createElement(tag);
  Object.assign(node.style, style);
  if (className) node.className = className;
  parent.appendChild(node);
  return node;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function saveHomeScroll() {
  if (window.location.pathname === "/") sessionStorage.setItem(HOME_SCROLL_KEY, String(window.scrollY));
}

/** Scrolls home back to where the visitor left it, once the page is tall enough to get there. */
async function restoreHomeScroll() {
  const raw = sessionStorage.getItem(HOME_SCROLL_KEY);
  if (!raw) return;
  sessionStorage.removeItem(HOME_SCROLL_KEY);
  const y = parseInt(raw, 10);
  for (let i = 0; i < 30; i++) {
    if (document.documentElement.scrollHeight >= y + window.innerHeight) break;
    await nextFrame();
  }
  window.scrollTo({ top: y, behavior: "instant" });
}

/** Jumps (no smooth scroll — the curtain hides it) to a home section, offset for the fixed nav. */
async function scrollToSection(id: string) {
  const el = await waitForElement(`#${id}`);
  if (!el) return;
  const headerOffset = window.matchMedia("(min-width: 768px)").matches ? 72 : 64;
  window.history.replaceState(null, "", `/#${id}`);
  window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset), behavior: "instant" });
}

// ─── animations ───────────────────────────────────────────────────────────────

type Scene = {
  command: string;
  title: string;
  vw: number;
};

type Built = {
  cover: gsap.core.Timeline;
  reveal: () => gsap.core.Timeline;
};

/** Typed-out command line, e.g. `$ open ./projects/btsp█`. */
function typedLine(parent: HTMLElement, text: string, className: string) {
  const line = make(parent, { opacity: "0" }, "div", className);
  const textEl = make(line, {}, "span");
  make(line, {}, "span", "terminal-cursor ml-1 text-[#fde047]").textContent = "█";
  const state = { n: 0 };
  const type = (tl: gsap.core.Timeline, at: number, duration: number) =>
    tl
      .set(line, { opacity: 1 }, at)
      .to(state, {
        n: text.length,
        duration,
        ease: "none",
        onUpdate: () => {
          textEl.textContent = text.slice(0, Math.round(state.n));
        },
      }, at);
  return { line, type };
}

/** Vertical blinds drop in, a command types itself out, then the blinds lift away from the centre. */
function buildShutter(layer: HTMLElement, s: Scene): Built {
  const count = s.vw < 640 ? 5 : 8;
  const bars = Array.from({ length: count }, (_, i) =>
    make(layer, {
      position: "absolute",
      top: "0",
      bottom: "0",
      left: `${(i / count) * 100}%`,
      width: `calc(${100 / count}% + 1px)`,
      background: BG,
      borderRight: i < count - 1 ? "1px solid rgba(253,224,71,0.12)" : "none",
    })
  );
  gsap.set(bars, { scaleY: 0, transformOrigin: "top" });

  const center = make(layer, {
    position: "absolute",
    inset: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    padding: "0 20px",
    textAlign: "center",
  });
  const cmd = typedLine(center, s.command, "font-sfmono text-xs text-ink-muted md:text-sm");
  const title = make(center, {}, "div", "font-sfmono text-3xl font-bold uppercase tracking-[-0.04em] text-ink-primary md:text-6xl");
  title.textContent = s.title;
  gsap.set(title, { opacity: 0, y: 18 });

  const cover = gsap.timeline({ paused: true }).to(bars, { scaleY: 1, duration: 0.55, ease: "power4.inOut", stagger: 0.05 }, 0);
  cmd.type(cover, 0.45, 0.35);
  cover.to(title, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.65).to({}, { duration: 0.15 });

  const reveal = () =>
    gsap
      .timeline({ paused: true })
      .to(center, { opacity: 0, y: -14, duration: 0.25, ease: "power2.in" }, 0)
      .set(bars, { transformOrigin: "bottom" }, 0.2)
      .to(bars, { scaleY: 0, duration: 0.6, ease: "power4.inOut", stagger: { each: 0.05, from: "center" } }, 0.2);

  return { cover, reveal };
}

/** Going back home: an accent-lipped curtain rises over the page and carries on upward. */
function buildClose(layer: HTMLElement): Built {
  const lip = make(layer, { position: "absolute", inset: "0", background: ACCENT });
  const panel = make(layer, { position: "absolute", inset: "0", background: BG, display: "flex", alignItems: "flex-end", padding: "24px" });
  const cmd = typedLine(panel, "$ cd ~", "font-sfmono text-xs text-ink-muted md:text-sm");
  gsap.set([lip, panel], { yPercent: 100 });

  const cover = gsap
    .timeline({ paused: true })
    .to(lip, { yPercent: 0, duration: 0.55, ease: "expo.inOut" }, 0)
    .to(panel, { yPercent: 0, duration: 0.55, ease: "expo.inOut" }, 0.06);
  cmd.type(cover, 0.4, 0.15);

  const reveal = () =>
    gsap
      .timeline({ paused: true })
      .to(panel, { yPercent: -100, duration: 0.6, ease: "expo.inOut" }, 0)
      .to(lip, { yPercent: -100, duration: 0.6, ease: "expo.inOut" }, 0.06);

  return { cover, reveal };
}

// ─── provider ───────────────────────────────────────────────────────────────

export function ProjectTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const layerRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const [revealed, setRevealed] = useState(true);

  const run = useCallback(
    async (
      to: string,
      targetSelector: string,
      build: (layer: HTMLElement) => Built,
      hooks: { onCovered?: () => void; beforeReveal?: () => Promise<void>; preload?: Promise<void> } = {}
    ) => {
      const layer = layerRef.current;
      if (!layer || busy.current) return;
      busy.current = true;
      layer.style.pointerEvents = "auto";
      let navigated = false;
      try {
        const built = build(layer);
        await Promise.all([play(built.cover), hooks.preload]);
        hooks.onCovered?.();
        navigate(to);
        navigated = true;
        await waitForElement(targetSelector);
        await hooks.beforeReveal?.();
        await nextFrame();
        setRevealed(true);
        await play(built.reveal());
      } catch (err) {
        console.error("[project-transition]", err);
        if (!navigated) navigate(to);
      } finally {
        layer.replaceChildren();
        layer.style.pointerEvents = "none";
        busy.current = false;
        setRevealed(true);
      }
    },
    [navigate]
  );

  const openProject = useCallback(
    (slug: string) => {
      const project = projects.find((p) => p.slug === slug);
      const to = `/projects/${slug}`;
      saveHomeScroll();
      if (!project || !EFFECTS.projectTransitions || prefersReducedMotion()) {
        navigate(to);
        return;
      }

      const scene: Scene = { command: `$ open ./projects/${slug}`, title: project.title, vw: window.innerWidth };

      run(to, `[data-project-page="${slug}"]`, (layer) => buildShutter(layer, scene), {
        onCovered: () => setRevealed(false),
        preload: project.hero.type === "image" ? preloadImage(project.hero.src, 700) : undefined,
      });
    },
    [navigate, run]
  );

  const openMe = useCallback(() => {
    const to = "/shaped";
    saveHomeScroll();
    if (!EFFECTS.projectTransitions || prefersReducedMotion()) {
      navigate(to);
      return;
    }
    const scene: Scene = { command: "$ cd ~/me", title: "things that shaped me", vw: window.innerWidth };
    run(to, '[data-page="shaped"]', (layer) => buildShutter(layer, scene));
  }, [navigate, run]);

  const closeToHome = useCallback(
    (section?: string) => {
      const land = section ? () => scrollToSection(section) : restoreHomeScroll;
      if (section) sessionStorage.removeItem(HOME_SCROLL_KEY);
      if (!EFFECTS.projectTransitions || prefersReducedMotion()) {
        navigate("/");
        land();
        return;
      }
      run("/", "#work", buildClose, { beforeReveal: land });
    },
    [navigate, run]
  );

  const value = useMemo(() => ({ openProject, openMe, closeToHome, revealed }), [openProject, openMe, closeToHome, revealed]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div ref={layerRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[250] overflow-hidden" />
    </TransitionContext.Provider>
  );
}
