import type { NavigateFunction } from "react-router-dom";

/** Wraps a Link's onClick so navigation uses the View Transitions API when available, else falls back to a plain SPA nav. */
export function navigateWithTransition(navigate: NavigateFunction, to: string) {
  return (e: React.MouseEvent) => {
    if (window.location.pathname === "/") {
      sessionStorage.setItem("home-scroll-y", String(window.scrollY));
    }

    const canTransition = typeof document !== "undefined" && "startViewTransition" in document;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canTransition || prefersReducedMotion) return;
    e.preventDefault();
    document.startViewTransition(() => navigate(to));
  };
}
