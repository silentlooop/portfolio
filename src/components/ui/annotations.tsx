import React from "react";
import { motion } from "framer-motion";

// Hand-annotated "print proof" layer: margin notes, arrows, measure lines, marks.
// Everything here is decorative: aria-hidden and pointer-events-none.

const inkClass = {
    pencil: "text-zinc-300/90",
    faint: "text-zinc-400/80",
    marker: "text-[#fde047]/80",
} as const;

type Ink = keyof typeof inkClass;

const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (delay: number) => ({
        pathLength: 1,
        opacity: 1,
        transition: { pathLength: { delay, duration: 0.9, ease: "easeInOut" as const }, opacity: { delay, duration: 0.01 } },
    }),
};

type DrawnSvgProps = {
    viewBox: string;
    paths: string[];
    className?: string;
    strokeWidth?: number;
    delay?: number;
    style?: React.CSSProperties;
};

function DrawnSvg({ viewBox, paths, className = "", strokeWidth = 1.5, delay = 0, style }: DrawnSvgProps) {
    return (
        <motion.svg
            viewBox={viewBox}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            style={style}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            aria-hidden="true"
        >
            {paths.map((d, i) => (
                <motion.path key={i} d={d} variants={draw} custom={delay + (i === 0 ? 0 : 0.85)} />
            ))}
        </motion.svg>
    );
}

const ARROWS = {
    swoop: { viewBox: "0 0 100 60", body: "M4 12 C 28 2, 58 6, 88 44", head: "M88 44 L76 41 M88 44 L86 31" },
    down: { viewBox: "0 0 60 70", body: "M30 4 C 18 22, 42 36, 30 62", head: "M30 62 L23 52 M30 62 L38 53" },
    loop: {
        viewBox: "0 0 110 60",
        body: "M4 44 C 18 14, 40 10, 40 28 C 40 44, 22 40, 30 26 C 40 10, 72 18, 100 30",
        head: "M100 30 L88 23 M100 30 L89 38",
    },
    hook: { viewBox: "0 0 70 70", body: "M60 6 C 20 6, 6 30, 22 60", head: "M22 60 L14 50 M22 60 L30 52" },
} as const;

type ArrowProps = {
    variant?: keyof typeof ARROWS;
    className?: string;
    ink?: Ink;
    flip?: boolean;
    rotate?: number;
    delay?: number;
};

export function Arrow({ variant = "swoop", className = "", ink = "pencil", flip = false, rotate = 0, delay = 0.2 }: ArrowProps) {
    const arrow = ARROWS[variant];
    return (
        <DrawnSvg
            viewBox={arrow.viewBox}
            paths={[arrow.body, arrow.head]}
            className={`${inkClass[ink]} ${className}`}
            style={{ transform: `${flip ? "scaleX(-1) " : ""}rotate(${rotate}deg)` }}
            delay={delay}
        />
    );
}

type NoteProps = {
    children: React.ReactNode;
    className?: string;
    ink?: Ink;
    rotate?: number;
    size?: "sm" | "md" | "lg";
};

const noteSize = { sm: "text-[21px]", md: "text-[25px]", lg: "text-[30px]" };

export function Note({ children, className = "", ink = "pencil", rotate = -4, size = "md" }: NoteProps) {
    return (
        <motion.p
            className={`font-hand leading-[1.05] ${noteSize[size]} ${inkClass[ink]} ${className}`}
            style={{ rotate }}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {children}
        </motion.p>
    );
}

/** Dimension line: |— — — [label] — — —| with optional trailing scribble. */
export function Measure({ label, note, className = "" }: { label: string; note?: string; className?: string }) {
    return (
        <div className={`flex items-center gap-2 font-sfmono text-[10px] text-zinc-600 ${className}`}>
            <span className="h-2.5 w-px bg-zinc-600" />
            <span className="h-px flex-1 border-t border-dashed border-zinc-700" />
            <span className="border border-zinc-600 px-1.5 py-0.5 tracking-wider text-zinc-500">{label}</span>
            {note && <span className="font-hand text-[16px] text-zinc-500">{note}</span>}
            <span className="h-px flex-1 border-t border-dashed border-zinc-700" />
            <span className="h-2.5 w-px bg-zinc-600" />
        </div>
    );
}

/** Vertical dimension line with a rotated label. */
export function MeasureVertical({ label, className = "" }: { label: string; className?: string }) {
    return (
        <div className={`flex flex-col items-center gap-2 font-sfmono text-[10px] text-zinc-600 ${className}`}>
            <span className="h-px w-2.5 bg-zinc-600" />
            <span className="w-px flex-1 border-l border-dashed border-zinc-700" />
            <span className="whitespace-nowrap border border-zinc-600 px-1.5 py-0.5 tracking-wider text-zinc-500 [writing-mode:vertical-rl]">
                {label}
            </span>
            <span className="w-px flex-1 border-l border-dashed border-zinc-700" />
            <span className="h-px w-2.5 bg-zinc-600" />
        </div>
    );
}

/** Printer's registration mark. */
export function RegMark({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 20 20" className={`h-4 w-4 text-zinc-600 ${className}`} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
            <path d="M10 0 V20 M0 10 H20" />
            <circle cx="10" cy="10" r="4.5" />
        </svg>
    );
}

/** Scrawled signature that draws itself in. */
export function Signature({ className = "", ink = "pencil", underline = true }: { className?: string; ink?: Ink; underline?: boolean }) {
    const paths = ["M6 40 C 10 12, 18 12, 20 38 C 22 14, 30 14, 32 38 C 34 16, 42 16, 44 36 C 48 46, 58 22, 68 26 C 78 30, 60 44, 86 30 C 104 20, 112 36, 126 26 C 134 20, 140 18, 150 22"];
    if (underline) paths.push("M10 50 C 50 45, 100 47, 152 40");

    return (
        <DrawnSvg
            viewBox="0 0 160 60"
            strokeWidth={1.6}
            className={`${inkClass[ink]} ${className}`}
            paths={paths}
        />
    );
}

/** Invisible box matching the max-w-5xl content column, so margin notes can sit outside it. */
export function MarginFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div aria-hidden="true" className={`pointer-events-none absolute inset-y-0 left-1/2 w-full max-w-5xl -translate-x-1/2 px-5 ${className}`}>
            <div className="relative h-full w-full">{children}</div>
        </div>
    );
}
