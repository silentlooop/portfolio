import { useEffect } from "react";
import { playClick } from "../../lib/sound";

/** Plays a click sound on every left click, site-wide. Mount once near the app root. */
export function GlobalClickSound() {
  useEffect(() => {
    // The native "click" event only fires for the primary (left) mouse button
    // and for Enter/Space activation on focusable elements — right-click opens
    // a contextmenu event instead, and middle-click fires auxclick.
    const onClick = () => {
      playClick();
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return null;
}
