type WindowDotsProps = {
  /** Red dot action. Alias of onRed, kept for existing call sites. */
  onClose?: () => void;
  onRed?: () => void;
  onYellow?: () => void;
  onGreen?: () => void;
  /** All dots render flat grey, like an unfocused macOS window. */
  unfocused?: boolean;
  /** 12px/8px-gap (default) or 8px/4px-gap for compact chrome like a notification popup. */
  size?: "md" | "sm";
  className?: string;
};

const DOTS = [
  { glyph: "×", label: "Close", from: "#FF6B5F", to: "#E0443A" },
  { glyph: "–", label: "Minimize", from: "#FFD045", to: "#E8A70C" },
  { glyph: "+", label: "Zoom", from: "#5FD86A", to: "#2FA83C" },
] as const;

const SIZE_CLASS = {
  md: { gap: "gap-2", dot: "h-3 w-3", glyph: "text-[8px]" },
  sm: { gap: "gap-1", dot: "h-2 w-2", glyph: "text-[6px]" },
} as const;

/** Shared glossy macOS/iOS-style window dots. Pure CSS, no images. */
export function WindowDots({ onClose, onRed, onYellow, onGreen, unfocused = false, size = "md", className = "" }: WindowDotsProps) {
  const actions = [onRed ?? onClose, onYellow, onGreen];
  const sizing = SIZE_CLASS[size];

  return (
    <div className={`group/dots flex items-center ${sizing.gap} ${className}`}>
      {DOTS.map((dot, i) => {
        const action = actions[i];
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
                className={`pointer-events-none absolute inset-0 hidden items-center justify-center ${sizing.glyph} font-bold leading-none text-black/55 group-hover/dots:flex`}
              >
                {dot.glyph}
              </span>
            )}
          </>
        );

        return action ? (
          <button
            key={dot.label}
            type="button"
            aria-label={dot.label}
            onClick={action}
            data-cursor="link"
            className={`relative block shrink-0 rounded-full ${sizing.dot}`}
            style={style}
          >
            {inner}
          </button>
        ) : (
          <span key={dot.label} aria-hidden="true" className={`relative block shrink-0 rounded-full ${sizing.dot}`} style={style}>
            {inner}
          </span>
        );
      })}
    </div>
  );
}
