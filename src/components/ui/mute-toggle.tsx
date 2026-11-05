import { useEffect, useState } from "react";
import { isMuted, setMuted } from "../../lib/sound";

export function MuteToggle({ className = "" }: { className?: string }) {
  const [muted, setMutedState] = useState(true);

  useEffect(() => {
    setMutedState(isMuted());
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={!muted}
      className={`cursor-pointer transition-colors hover:text-white ${className}`}
    >
      $ {muted ? "unmute" : "mute"}
    </button>
  );
}
