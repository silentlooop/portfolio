import { useEffect, useState } from "react";
import { FaVolumeXmark, FaVolumeHigh } from "react-icons/fa6";
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
      aria-label={muted ? "Unmute" : "Mute"}
      className={`cursor-pointer transition-colors hover:text-white ${className}`}
    >
      {muted ? <FaVolumeXmark className="h-4 w-4" /> : <FaVolumeHigh className="h-4 w-4" />}
    </button>
  );
}
