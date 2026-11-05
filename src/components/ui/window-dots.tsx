type WindowDotsProps = {
  /** When provided, the red dot becomes a real close button. */
  onClose?: () => void;
  /** All dots render flat grey, like an unfocused macOS window. */
  unfocused?: boolean;
  className?: string;
};

const DOTS = [
  { glyph: "×", label: "Close", from: "#FF6B5F", to: "#E0443A" },
  { glyph: "–", label: "Minimize", from: "#FFD045", to: "#E8A70C" },
  { glyph: "+", label: "Zoom", from: "#5FD86A", to: "#2FA83C" },
] as const;

/** Shared glossy macOS/iOS-style window dots. Pure CSS, no images. */
export function WindowDots({ onClose, unfocused = false, className = "" }: WindowDotsProps) {
  return (
    <div className={`group/dots flex items-center gap-2 ${className}`}>
      {DOTS.map((dot, i) => {
        const style: React.CSSProperties = unfocused
          ? { background: "#4A4A4A" }
          : {
              background: `radial-gradient(circle at 35% 25%, ${dot.from}, ${dot.to})`,
              boxShadow: "inset 0 -0.5px 0.5px rgba(0,0,0,0.25), 0 1px 1px rgba(0,0,0,0.4)",
            };

        const inner = (
          <>
            {!unfocused && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[1px] top-[1px] h-1/2 rounded-t-full"
                style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0))" }}
              />
            )}
            {!unfocused && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hidden items-center justify-center text-[8px] font-bold leading-none text-black/55 group-hover/dots:flex"
              >
                {dot.glyph}
              </span>
            )}
          </>
        );

        return i === 0 && onClose ? (
          <button
            key={dot.label}
            type="button"
            aria-label={dot.label}
            onClick={onClose}
            data-cursor="link"
            className="relative block h-3 w-3 shrink-0 rounded-full"
            style={style}
          >
            {inner}
          </button>
        ) : (
          <span key={dot.label} aria-hidden="true" className="relative block h-3 w-3 shrink-0 rounded-full" style={style}>
            {inner}
          </span>
        );
      })}
    </div>
  );
}
