import { useEffect } from "react";
import { NavBar } from "./about";
import { SectionPrompt, SectionReveal } from "../components/ui/terminal-effects";
import { Arrow, Measure, Note, RegMark, Signature } from "../components/ui/annotations";
import { TerminalHint } from "../components/ui/terminal-hint";
import { useInViewOnce, usePrefersReducedMotion } from "../components/ui/use-terminal-effects";

// --- TYPES ---

interface ShapedItem {
    title: string;
    type: string;
    description: string;
    /** URL to an image or video. Leave undefined for text-only cards. */
    media?: string;
    /** "image" (default) or "video" — auto-detected from extension if omitted. */
    mediaType?: "image" | "video";
}

// --- DATA ---
const shapedItems: ShapedItem[] = [
    {
        title: "Overthinking",
        type: "[obsession]",
        description:
            "My most exhausting trait. Also the one I'm most grateful and hate myself for.",
    },
    {
        title: "Don't believe everything you think",
        type: "[book]",
        description: "A reminder that my mind is a noisy place, and that's okay.",
    },
    {
        title: "アニメ (Anime)",
        type: "[film]",
        description: "From the emotional depth of 'A Silent Voice' to the mind-bending narrative of 'Hyouka', anime made me reconsider my beliefs.",
    },
    {
        title: "3am debugging sessions",
        type: "[habit]",
        description: "When the world is quiet, the code finally makes sense.",
    },
    {
        title: "Realization",
        type: "[moment]",
        description: "Realized alone times are the best ones.",
    },
    {
        title: "Present",
        type: "[life]",
        description:
            "I'm just trying, and most of the time failing. Just figuring things out as I go.",
    },
];

// Bento spans for the 6-column grid: 3/3, 4/2, 2/4 — same rhythm, equal row height.
const BENTO_SPANS = ["md:col-span-3", "md:col-span-3", "md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-4"];

// --- HELPERS ---

function isVideoUrl(url: string, mediaType?: "image" | "video"): boolean {
    if (mediaType) return mediaType === "video";
    return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

function CardMedia({ media, mediaType, title }: { media: string; mediaType?: "image" | "video"; title: string }) {
    if (isVideoUrl(media, mediaType)) {
        return (
            <video
                src={media}
                className="w-full h-auto max-h-48 object-cover rounded-sm mb-3"
                autoPlay
                loop
                muted
                playsInline
            />
        );
    }
    return (
        <img
            src={media}
            alt={title}
            className="w-full h-auto max-h-48 object-cover rounded-sm mb-3"
            loading="lazy"
        />
    );
}

// --- ShapedCard Component ---

function ShapedCard({ item, spanClass }: { item: ShapedItem; spanClass: string }) {
    const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const [ref, isInView] = useInViewOnce();
    const prefersReducedMotion = usePrefersReducedMotion();
    const revealed = isInView || prefersReducedMotion;

    return (
        <div
            ref={ref}
            className={`${spanClass} transition-[opacity,transform] duration-500 ease-out`}
            style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(12px)",
            }}
        >
            <div className="group/shaped relative h-full overflow-hidden rounded-md border border-edge bg-[#141414] shadow-2xl shadow-black/20 transition-[color,background-color,border-color,transform] duration-250 ease-out hover:-translate-y-1 hover:border-edge-hover">
                <TerminalHint text={`$ cat ./me/${slug}`} />
                <div className="p-5 md:p-6">
                    {item.media && <CardMedia media={item.media} mediaType={item.mediaType} title={item.title} />}
                    <span className="text-[11px] font-sfmono uppercase tracking-wider text-gray-500">{item.type}</span>
                    <h3 className="text-xl font-bold leading-snug tracking-tight text-white md:text-2xl">
                        {item.title}
                    </h3>
                    <p className="mt-2.5 font-sfmono text-[15px] leading-relaxed text-gray-400">{item.description}</p>
                </div>
            </div>
        </div>
    );
}

// --- COMPONENT ---

export default function Shaped() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="relative min-h-screen bg-[#111111]">
            <NavBar />

            <main className="pt-24 pb-20 px-5 max-w-content mx-auto relative text-white font-sfmono">

                {/* ── Background decorative layer ── */}
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
                    {/* Large ghost text */}

                    <p className="absolute top-[32%] right-[2%] text-3xl md:text-5xl font-sfmono text-white opacity-[0.03] whitespace-nowrap rotate-[-3deg]">
                        &gt; compiling personality...
                    </p>
                    <p className="absolute bottom-[22%] left-[8%] text-4xl md:text-6xl font-sfmono text-white opacity-[0.02] whitespace-nowrap rotate-[1deg]">
                        &gt; parsing experiences...
                    </p>
                    {/* Vertical pipe decorations */}
                    <div className="absolute top-[12%] left-[48%] font-sfmono text-white opacity-[0.035] text-xs leading-tight whitespace-pre">
                        {`│
│
├──
│
│
└──`}
                    </div>
                    <div className="absolute bottom-[15%] right-[30%] font-sfmono text-white opacity-[0.03] text-xs leading-tight whitespace-pre">
                        {`┌───────┐
│ ░░░░░ │
│ ░░░░░ │
└───────┘`}
                    </div>
                </div>

                {/* ── Terminal Window Bar ── */}
                <SectionPrompt command="cat ./me/about" className="relative z-[1] mb-6" />
                <div aria-hidden="true" className="pointer-events-none relative z-[1] mb-4 hidden items-center gap-3 md:flex">
                    <span className="font-sfmono text-[10px] text-zinc-600">02</span>
                    <Measure className="flex-1" label={`${shapedItems.length} entries`} note="fig. 02 — the person" />
                </div>

                <RegMark className="pointer-events-none absolute left-0 top-[8.5rem] hidden -translate-x-7 md:block" />
                <div aria-hidden="true" className="pointer-events-none absolute right-full top-64 mr-2 hidden overflow-hidden lg:block lg:w-[clamp(0rem,calc(50vw-32.5rem),10rem)]">
                    <Note rotate={-8}>the unfiltered version.</Note>
                    <Arrow variant="swoop" className="ml-12 mt-1 h-12 w-24" rotate={8} delay={0.4} />
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute left-full top-[32rem] ml-2 hidden overflow-hidden lg:block lg:w-[clamp(0rem,calc(50vw-32.5rem),11rem)]">
                    <Arrow variant="hook" flip className="h-14 w-14" rotate={-20} />
                    <Note rotate={5} size="sm" className="mt-1">yes, all of these are true.</Note>
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute left-full top-[58rem] ml-2 hidden overflow-hidden lg:block lg:w-[clamp(0rem,calc(50vw-32.5rem),11rem)]">
                    <Note rotate={-4} size="sm">rewatched hyouka 3 times. zero regrets.</Note>
                    <Arrow variant="swoop" flip className="mt-1 h-12 w-24" rotate={14} delay={0.4} />
                </div>

                <SectionReveal className="relative z-[1] mb-10 overflow-hidden rounded-md border border-white/10 bg-[#141414] shadow-2xl shadow-black/20">
                    <div className="flex items-center gap-2 border-b border-white/10 bg-[#111111] px-5 py-4">
                        <span className="w-3 h-3 rounded-full bg-[#FF5F57] shrink-0" />
                        <span className="w-3 h-3 rounded-full bg-[#FFBD2E] shrink-0" />
                        <span className="w-3 h-3 rounded-full bg-[#28C840] shrink-0" />
                        <span className="ml-3 text-sm text-gray-400 font-sfmono truncate">
                            manthan@life ~ % things-that-shaped-me
                        </span>
                    </div>
                    <div className="px-5 py-6 font-sfmono text-sm sm:px-7 sm:py-7 md:px-10 md:py-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                            <div className="group/avatar h-20 w-20 shrink-0 overflow-hidden rounded-md border border-edge bg-[#161616] p-1">
                                <img
                                    src="/pfp.PNG"
                                    alt="Manthan"
                                    className="h-full w-full rounded object-cover grayscale transition-all duration-400 ease-out group-hover/avatar:grayscale-0"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-2 text-gray-500">
                                    <span className="text-gray-600">$</span> cat manifest.txt
                                </p>
                                <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-gray-400 sm:text-[15px]">
                                    a running log of things that left a mark — some serious, some not, all true.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-zinc-600">
                            <span>status: <span className="text-[#fde047]">online</span></span>
                            <span>process: profile_loaded</span>
                        </div>
                    </div>
                </SectionReveal>

                {/* ══════════ BENTO CARD GRID ══════════ */}
                <div className="relative z-[1] grid grid-cols-1 gap-6 md:grid-cols-6">
                    {shapedItems.map((item, i) => (
                        <ShapedCard key={item.title} item={item} spanClass={BENTO_SPANS[i]} />
                    ))}
                </div>

                {/* ── Anime Terminal Log ── */}
                <SectionPrompt command="cat ./me/anime" className="relative z-[1] mt-12 mb-6" />

                <div className="relative z-[1] mb-4 rounded-md border border-white/10 bg-[#141414] p-5 font-sfmono text-xs text-gray-300 shadow-2xl shadow-black/20 md:p-6 md:text-sm">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-12">
                        <div>
                            <span className="text-ink-muted">$</span> <span className="text-ink-muted">Anime Series (Top 10)</span>
                            <ol className="mt-2 space-y-1">
                                {[
                                    "Black Clover", "Hyouka", "Frieren", "Tokyo Ghoul", "Naruto",
                                    "One Piece", "Bleach", "Demon Slayer", "Bungo Stray Dogs", "AOT",
                                ].map((name, i) => (
                                    <li key={name} className="text-ink-primary">
                                        <span className="text-ink-muted">{String(i + 1).padStart(2, "0")}</span> {name}
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <div>
                            <span className="text-ink-muted">$</span> <span className="text-ink-muted">Anime Movies</span>
                            <ol className="mt-2 space-y-1">
                                {[
                                    "The Light of Firefly Forest", "Your Name", "Suzume", "A Silent Voice",
                                    "5cm Per Second", "Garden of Words", "Naruto Movies", "Spy Family: Code White",
                                ].map((name, i) => (
                                    <li key={name} className="text-ink-primary">
                                        <span className="text-ink-muted">{String(i + 1).padStart(2, "0")}</span> {name}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>

                {/* ── Sign-off ── */}
                <div aria-hidden="true" className="pointer-events-none relative z-[1] mt-16 hidden justify-end md:flex">
                    <div className="text-right">
                        <Signature className="ml-auto h-12 w-36" />
                        <Note rotate={-2} size="sm" ink="faint">— manthan, {new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}. still figuring it out.</Note>
                    </div>
                </div>

                {/* ── Terminal status bar / footer ── */}
                <div className="relative z-[1] mt-20 border-t border-[#1e1e1e] pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
                    <p className="font-sfmono text-sm text-gray-500 select-none">
                        [exit] ← type anything or press any key
                    </p>
                    <p className="font-sfmono text-sm text-gray-500 select-none">
                        manthan@life: ~/things-that-shaped-me

                    </p>
                </div>
            </main>
        </div>
    );
}
