import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "../../content/projects/types";

export function MediaFrame({ item, aspect = "aspect-video" }: { item: MediaItem; aspect?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (item.type !== "video" || !item.src) return;
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          el.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [item.type, item.src]);

  if (item.placeholder || !item.src) {
    return (
      <div
        className={`relative ${aspect} flex w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-edge bg-[#161616]`}
      >
        <span className="px-4 text-center font-sfmono text-[12px] text-ink-muted">
          [media: {item.placeholder ?? "untitled"}]
        </span>
      </div>
    );
  }

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div className={`relative ${aspect} w-full overflow-hidden rounded-lg border border-edge bg-[#161616] p-4`}>
      <div
        aria-hidden="true"
        className={`absolute inset-4 rounded bg-white/[0.03] transition-opacity duration-300 ${
          loaded ? "opacity-0" : "animate-pulse opacity-100"
        }`}
      />
      <div className="relative flex h-full w-full items-center justify-center">
        {item.type === "video" ? (
          <div className="relative h-full w-full cursor-pointer" data-cursor="view" onClick={togglePlay}>
            <video
              ref={videoRef}
              src={item.src}
              poster={item.poster}
              muted
              loop
              playsInline
              onLoadedData={() => setLoaded(true)}
              className="h-full w-full object-contain"
            />
            {!playing && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white">▶</span>
              </span>
            )}
          </div>
        ) : (
          <img
            src={item.src}
            alt={item.caption ?? ""}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className="h-full w-full object-contain"
          />
        )}
      </div>
    </div>
  );
}
