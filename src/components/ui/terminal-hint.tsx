type TerminalHintPlacement = "corner" | "below" | "below-start";

const placementClasses: Record<TerminalHintPlacement, string> = {
    corner: "right-3 top-3",
    below: "left-1/2 top-full mt-2 -translate-x-1/2",
    "below-start": "left-0 top-full mt-2",
};

type TerminalHintProps = {
    text: string;
    placement?: TerminalHintPlacement;
    className?: string;
};

// Must be a direct child of a `relative` interactive element; shown on its :hover / :focus-visible (see .terminal-hint in index.css).
export function TerminalHint({ text, placement = "corner", className = "" }: TerminalHintProps) {
    return (
        <span
            aria-hidden="true"
            className={`terminal-hint pointer-events-none absolute z-10 ${placementClasses[placement]} ${className}`}
        >
            <span className={`inline-flex max-w-[min(28rem,calc(100vw-2rem))] whitespace-nowrap rounded-sm border border-edge ${placement === "corner" ? "bg-black/70" : "bg-zinc-800/80"} px-2 py-1 text-left font-sfmono text-xs font-normal normal-case leading-normal tracking-normal text-ink-primary shadow-lg backdrop-blur-sm`}>
                <span className="min-w-0 truncate">{text}</span>
            </span>
        </span>
    );
}
