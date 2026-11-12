"use client";

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import type { Variants } from "framer-motion";
import { SectionPrompt, SectionReveal } from "../components/ui/terminal-effects";
import { TerminalHint } from "../components/ui/terminal-hint";
import { Arrow, Measure, Note, Signature } from "../components/ui/annotations";
import { ScrambleText } from "../components/ui/scramble-text";
import { useInViewOnce, usePrefersReducedMotion } from "../components/ui/use-terminal-effects";
import { FaLinkedin, FaXTwitter, FaGithub } from "react-icons/fa6";
import { SiLeetcode, SiMonkeytype } from "react-icons/si";
import { WindowDots } from "../components/ui/window-dots";

// --- HELPERS ---

// Experience section: company tabs in the rail column, details in the content column,
// on the same 280px + 1fr grid as the projects section above it.
function TerminalExperience() {
    const experiences = [
        {
            company: "AICommunity IITB",
            period: "2025 – 2026",
            role: "Junior Developer",
            points: [
                "Working with a small team of 8 members to build AI products for insti and freelance projects.",
                "Focusing on NLP pipelines and generative models.",
            ],
        },
        {
            company: "Techfest",
            period: "2025 – 2026",
            role: "Graphic Designer",
            points: [
                "Supported the design team with social media graphics, print materials, and visual identity systems for Asia's largest Science and Technology festival.",
            ],
        },
    ];
    const [active, setActive] = useState(0);
    const current = experiences[active];

    return (
        <div className="font-sfmono lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
            <div className="mb-8 lg:mb-0">
                <SectionPrompt command="cd ./deep-dive/experience" startOnMount />
                <div
                    role="tablist"
                    aria-label="Experience"
                    className="mt-5 flex gap-3 overflow-x-auto border-t border-edge pt-4 text-xs lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pt-5 lg:text-sm"
                >
                    {experiences.map((exp, i) => (
                        <button
                            key={exp.company}
                            type="button"
                            role="tab"
                            id={`experience-tab-${i}`}
                            aria-selected={i === active}
                            aria-controls="experience-panel"
                            onClick={() => setActive(i)}
                            className={`shrink-0 whitespace-nowrap text-left transition-colors lg:w-full ${i === active ? "text-ink-primary" : "text-ink-muted hover:text-ink-secondary"}`}
                        >
                            <span className="text-sm">{String(i + 1).padStart(2, "0")}</span>{" "}
                            <span className="uppercase">{exp.company}</span>
                        </button>
                    ))}
                </div>
            </div>

            <motion.div
                key={current.company}
                role="tabpanel"
                id="experience-panel"
                aria-labelledby={`experience-tab-${active}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="min-h-[200px] max-w-[68ch]"
            >
                <p className="text-xs uppercase tracking-[0.08em] text-ink-faint">{current.period}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-ink-primary sm:text-2xl">
                    {current.role} <span className="text-ink-muted">@</span>{" "}
                    <span className="text-[#fde047]">{current.company}</span>
                </h3>
                <ul className="mt-5 space-y-3 text-sm leading-[1.75] text-ink-secondary sm:text-base">
                    {current.points.map((point) => (
                        <li key={point} className="flex gap-3">
                            <span aria-hidden="true" className="select-none text-ink-faint">›</span>
                            <span>{point}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>
        </div>
    );
}

function ContactTerminal() {
    return (
        <div className="px-3 pb-6 pt-5 sm:px-5 sm:pb-8 sm:pt-7 md:px-12 md:pb-12 md:pt-10">
            <div className="max-w-4xl space-y-5 font-sfmono">
                <div className="flex min-w-0 items-center gap-2 text-xs text-ink-muted sm:text-sm">
                    <span className="text-ink-faint">manthan@portfolio:~$</span>
                    <span className="text-ink-primary truncate">cat contact.txt</span>
                </div>
                <div className="space-y-3 text-sm leading-6 text-ink-secondary sm:text-base">
                    <p className="text-lg font-bold tracking-tight text-ink-primary sm:text-xl md:text-2xl break-words">Let's connect.</p>
                    <p className="break-words sm:text-base">Open channels for thoughtful work, curious conversations, and ambitious ideas.</p>
                </div>
                <div className="grid gap-2 border-t border-edge pt-4 sm:gap-3 sm:border-t sm:pt-6 sm:grid-cols-2">
                    <a
                        href="https://www.linkedin.com/in/manthan-p-6457b3313"
                        target="_blank"
                        rel="noreferrer"
                        className="group relative flex items-center gap-3 rounded-sm border border-edge bg-[#111111] px-3 py-2.5 transition-colors hover:border-edge-hover hover:bg-white/[0.04] sm:px-4 sm:py-3"
                    >
                        <TerminalHint text="$ open ./me in-a-blazer" placement="below-start" />
                        <FaLinkedin className="h-5 w-5 shrink-0 text-ink-faint transition-all duration-250 ease-out group-hover:scale-110 group-hover:text-[#0A66C2]" />
                        <span className="min-w-0">
                            <span className="block text-xs text-[#6a9955]/80">network</span>
                            <span className="mt-0.5 block text-xs text-ink-primary group-hover:text-ink-primary sm:text-sm">linkedin <span className="text-ink-faint">↗</span></span>
                        </span>
                    </a>
                    <a
                        href="https://x.com/null_rejected"
                        target="_blank"
                        rel="noreferrer"
                        className="group relative flex items-center gap-3 rounded-sm border border-edge bg-[#111111] px-3 py-2.5 transition-colors hover:border-edge-hover hover:bg-white/[0.04] sm:px-4 sm:py-3"
                    >
                        <TerminalHint text="$ tail -f ./unfiltered-thoughts" placement="below-start" />
                        <FaXTwitter className="h-5 w-5 shrink-0 text-ink-faint transition-all duration-250 ease-out group-hover:scale-110 group-hover:text-ink-primary" />
                        <span className="min-w-0">
                            <span className="block text-xs text-[#6a9955]/80">signal</span>
                            <span className="mt-0.5 block text-xs text-ink-primary group-hover:text-ink-primary sm:text-sm">twitter <span className="text-ink-faint">↗</span></span>
                        </span>
                    </a>
                </div>
                <div className="border-t border-edge pt-4 sm:pt-6">
                    <p className="mb-2 text-xs uppercase tracking-[0.08em] text-ink-faint">development</p>
                    <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
                        <a
                            href="https://github.com/silentlooop"
                            target="_blank"
                            rel="noreferrer"
                            className="group relative flex items-center gap-3 rounded-sm border border-edge bg-[#111111] px-3 py-2.5 transition-colors hover:border-edge-hover hover:bg-white/[0.04] sm:px-4 sm:py-3"
                        >
                            <TerminalHint text="$ git log since=3am" placement="below-start" />
                            <FaGithub className="h-5 w-5 shrink-0 text-ink-faint transition-all duration-250 ease-out group-hover:scale-110 group-hover:text-ink-primary" />
                            <span className="min-w-0">
                                <span className="block text-xs text-[#6a9955]/80">source</span>
                                <span className="mt-0.5 block text-xs text-ink-primary group-hover:text-ink-primary sm:text-sm">github <span className="text-ink-faint">↗</span></span>
                            </span>
                        </a>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-edge pt-4 text-xs text-ink-faint">
                    <span className="truncate">process: contact_ready</span>
                </div>
            </div>
        </div>
    );
}

function TechLabTerminal() {
    return (
        <div className="px-5 pb-8 pt-7 sm:px-8 sm:pb-10 sm:pt-8 md:px-12 md:pb-12 md:pt-10">
            <div className="max-w-4xl space-y-7 font-sfmono">
                <div className="flex items-center gap-2 text-sm text-ink-muted">
                    <span className="text-ink-faint">manthan@portfolio:~$</span>
                    <span className="text-ink-primary">cat tech-lab.txt</span>
                </div>
                <div className="space-y-3 text-base leading-7 text-ink-secondary">
                    <p className="text-xl font-bold tracking-tight text-ink-primary sm:text-2xl md:text-3xl break-words">The tech lab.</p>
                    <p className="break-words sm:text-base">Places where I practice, experiment, and keep the feedback loop moving.</p>
                </div>
                <div className="grid gap-3 border-t border-edge pt-6 sm:grid-cols-2">
                    <a
                        href="https://leetcode.com/u/silentlooop/"
                        target="_blank"
                        rel="noreferrer"
                        className="group relative flex items-center gap-3 rounded-sm border border-edge bg-[#111111] px-4 py-3 transition-colors hover:border-edge-hover hover:bg-white/[0.04]"
                    >
                        <TerminalHint text="$ sudo solve daily-humility" placement="below-start" />
                        <SiLeetcode className="h-5 w-5 shrink-0 text-ink-faint transition-all duration-250 ease-out group-hover:scale-110 group-hover:text-[#FFA116]" />
                        <span className="min-w-0">
                            <span className="block text-xs text-[#6a9955]/80">problem solving</span>
                            <span className="mt-1 block text-sm text-ink-primary group-hover:text-ink-primary">leetcode <span className="text-ink-faint">↗</span></span>
                        </span>
                    </a>
                    <a
                        href="https://monkeytype.com/profile/silentlooop"
                        target="_blank"
                        rel="noreferrer"
                        className="group relative flex items-center gap-3 rounded-sm border border-edge bg-[#111111] px-4 py-3 transition-colors hover:border-edge-hover hover:bg-white/[0.04]"
                    >
                        <TerminalHint text="$ wpm check again" placement="below-start" />
                        <SiMonkeytype className="h-5 w-5 shrink-0 text-ink-faint transition-all duration-250 ease-out group-hover:scale-110 group-hover:text-[#E2B714]" />
                        <span className="min-w-0">
                            <span className="block text-xs text-[#6a9955]/80">typing practice</span>
                            <span className="mt-1 block text-sm text-ink-primary group-hover:text-ink-primary">monkeytype <span className="text-ink-faint">↗</span></span>
                        </span>
                    </a>
                </div>
                <div className="flex items-center justify-end gap-2 border-t border-edge pt-5 text-xs text-ink-faint">
                    <span>process: lab_ready</span>
                </div>
            </div>
        </div>
    );
}

// --- ANIMATION VARIANTS ---

const menuVariants: Variants = {
    closed: { opacity: 0, y: -100 },
    open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeInOut" } }
};

const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.1, duration: 0.4 } })
};

// --- NAVIGATION COMPONENT ---
function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const { scrollYProgress } = useScroll();
    const scrollProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
    const location = useLocation();

    const isActive = (path: string) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    // Which home section is on screen, so the nav highlights projects vs experience correctly.
    const [homeSection, setHomeSection] = useState<"work" | "experience">("work");
    useEffect(() => {
        if (location.pathname !== "/") return;
        const onScroll = () => {
            const experience = document.getElementById("experience");
            if (!experience) return;
            setHomeSection(experience.getBoundingClientRect().top < window.innerHeight * 0.5 ? "experience" : "work");
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [location.pathname]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        setIsOpen(false); // Close menu on click
        // If we are already on the page, just scroll
        const element = document.getElementById(id);
        if (element) {
            e.preventDefault();
            const headerOffset = window.matchMedia("(min-width: 768px)").matches ? 72 : 64;
            const targetTop = element.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.history.replaceState(null, "", `/#${id}`);
            window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
        }
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-edge bg-[#111111]/85 px-4 py-3 backdrop-blur-md transition-all duration-250 sm:px-5 md:px-8 md:py-4">
                {/* Logo */}
                <a href="/" className="text-ink-primary font-sfmono text-base md:text-lg font-bold tracking-tight hover:opacity-80 transition-opacity z-50 relative">
                    <ScrambleText text="silentlooop" /><span className="terminal-cursor text-ink-muted">_</span>
                    <TerminalHint text="$ cd ~/home-sweet-home" placement="below" />
                </a>

                {/* Desktop Links */}
                <div className="hidden items-center gap-7 text-sm font-sfmono text-ink-secondary md:flex">
                    <a href="/#work" onClick={(e) => scrollToSection(e, 'work')} className={`relative transition-colors cursor-pointer ${isActive("/") && homeSection === "work" ? "text-[#fde047]" : "hover:text-ink-primary"}`}>projects<TerminalHint text="$ ls ./proof-i-dont-just-talk" placement="below" /></a>
                    <a href="/#experience" onClick={(e) => scrollToSection(e, 'experience')} className={`relative transition-colors cursor-pointer ${isActive("/") && homeSection === "experience" ? "text-[#fde047]" : "hover:text-ink-primary"}`}>experience<TerminalHint text="$ cat ./where-ive-worked" placement="below" /></a>
                    <a href="/shaped" className={`relative transition-colors cursor-pointer ${isActive("/shaped") ? "text-[#fde047]" : "hover:text-ink-primary"}`}>~/me<TerminalHint text="$ whoami the-human-behind-it" placement="below" /></a>
                </div>

                {/* Mobile Menu Toggle (Hamburger / Close) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                    className="md:hidden text-ink-primary text-xl z-50 relative focus:outline-none"
                >
                    {isOpen ? "✕" : "≡"}
                </button>

                {/* Scroll progress */}
                <motion.div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-px origin-left bg-zinc-500/60" style={{ scaleX: scrollProgress }} />
            </nav>

            {/* FULL SCREEN MOBILE MENU OVERLAY */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 bg-[#111111] z-40 flex flex-col justify-start pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-5">
                            <motion.a
                                custom={0}
                                variants={linkVariants}
                                href="/#work"
                                onClick={(e) => scrollToSection(e, 'work')}
                                className="text-xl font-semibold text-ink-muted tracking-tight font-sfmono"
                            >
                                projects
                            </motion.a>
                            <motion.a
                                custom={1}
                                variants={linkVariants}
                                href="/#experience"
                                onClick={(e) => scrollToSection(e, 'experience')}
                                className="text-xl font-semibold text-ink-muted tracking-tight font-sfmono"
                            >
                                experience
                            </motion.a>
                            <motion.a
                                custom={2}
                                variants={linkVariants}
                                href="/shaped"
                                className="text-xl font-semibold text-ink-muted tracking-tight font-sfmono"
                            >
                                ~/me
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// --- MAIN COMPONENT ---

type TypeChunk = {
    text: string;
    className?: string;
};

type TypeSegment = {
    className: string;
    chunks: TypeChunk[];
};

function typedLength(chunks: TypeChunk[]) {
    return chunks.reduce((sum, chunk) => sum + chunk.text.length, 0);
}

function renderTypedChunks(chunks: TypeChunk[], visibleChars: number) {
    let remaining = visibleChars;

    return chunks.map((chunk, idx) => {
        const count = Math.max(0, Math.min(remaining, chunk.text.length));
        const value = chunk.text.slice(0, count);
        remaining -= count;

        return (
            <span key={`${chunk.text.slice(0, 10)}-${idx}`} className={chunk.className}>
                {value}
            </span>
        );
    });
}

function About() {
    const command = "./boot_trajectory.sh";
    const [activeTab, setActiveTab] = useState<"trajectory" | "contact" | "tech-lab">("trajectory");
    const [panelRef, panelInView] = useInViewOnce(0.2);
    const prefersReducedMotionHero = usePrefersReducedMotion();

    const trajectorySegments: TypeSegment[] = [
        {
            className: "text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-ink-primary",
            chunks: [{ text: "The Trajectory" }]
        },
        {
            className: "text-sm md:text-base text-ink-secondary leading-relaxed break-words",
            chunks: [
                { text: "I build where " },
                { text: "math meets machinery", className: "text-ink-primary" },
                { text: ": models that learn, pipelines that ship, and interfaces people actually enjoy using." }
            ]
        },
        {
            className: "text-sm md:text-base text-ink-secondary leading-relaxed break-words",
            chunks: [
                { text: "The path has wandered from soldering irons to transformers, but the loop never changes: " },
                { text: "break it, understand it, rebuild it better", className: "text-ink-primary" },
                { text: "." }
            ]
        },
        {
            className: "text-sm md:text-base text-ink-secondary leading-relaxed break-words",
            chunks: [
                { text: "My current obsession? " },
                { text: "Teaching machines to imagine.", className: "text-ink-primary" },
                { text: " I'm deep in diffusion models, watching structure emerge from pure noise, one denoising step at a time. Honestly, not a bad metaphor for figuring life out either." }
            ]
        },
    ];

    const segmentLengths = trajectorySegments.map((segment) => typedLength(segment.chunks));
    const pauseUnits = 10;
    const totalUnits = command.length + segmentLengths.reduce((sum, len) => sum + len, 0) + pauseUnits * trajectorySegments.length;
    const [typedUnits, setTypedUnits] = useState(0);

    useEffect(() => {
        setTypedUnits(0);

        const timer = setInterval(() => {
            setTypedUnits((prev) => {
                if (prev >= totalUnits) {
                    clearInterval(timer);
                    return prev;
                }
                return prev + 1;
            });
        }, 18);

        return () => clearInterval(timer);
    }, [totalUnits]);

    const commandVisible = Math.max(0, Math.min(typedUnits, command.length));

    const getVisibleCharsForSegment = (segmentIndex: number) => {
        let offset = command.length;

        for (let i = 0; i < segmentIndex; i += 1) {
            offset += segmentLengths[i] + pauseUnits;
        }

        const visible = typedUnits - offset;
        return Math.max(0, Math.min(visible, segmentLengths[segmentIndex]));
    };

    return (
        <div id="about" className="bg-[#111111]">

            <main className="flex flex-col items-center bg-[#111111] text-ink-primary font-sfmono relative z-10 animate-in fade-in duration-1000">

                <div className="w-full px-5 max-w-5xl mx-auto">
                    {/* Trajectory Section */}
                    <section className="relative min-h-[100dvh] flex flex-col justify-center py-24 md:py-28">
                        <div className="relative">
                        {/* Annotations: proof marks + margin notes */}
                        <div aria-hidden="true" className="pointer-events-none absolute -top-9 inset-x-0 hidden items-center gap-3 md:flex">
                            <span className="font-sfmono text-xs text-ink-faint">01</span>
                            <Measure className="flex-1" label="984 × 640" note="fig. 01 — the trajectory" />
                        </div>
                        <div aria-hidden="true" className="pointer-events-none absolute bottom-10 left-full ml-4 hidden overflow-hidden lg:block lg:w-[clamp(0rem,calc(50vw-33rem),11rem)]">
                            <Arrow variant="hook" flip className="h-14 w-14" rotate={-20} />
                            <Note rotate={5} size="sm" className="mt-1">still figuring it out… and probably always will.</Note>
                        </div>

                        <div className="relative z-10 grid gap-4 md:grid-cols-[13rem_1fr]">
                            {/* File-tree sidebar, replaces the old top tab bar */}
                            <nav aria-label="Portfolio views" className="overflow-hidden rounded-sm border border-edge bg-surface-raised shadow-2xl shadow-black/20 md:self-start">
                                <div className="flex items-center gap-2 border-b border-edge bg-[#111111] px-4 py-3">
                                    <WindowDots />
                                    <span className="ml-2 truncate text-xs text-ink-faint">~/manthan</span>
                                </div>
                                <div className="px-3 pt-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-ink-faint">Explorer</div>
                                <div role="tablist" aria-label="Portfolio views" className="flex gap-1 overflow-x-auto p-2 md:flex-col md:overflow-visible">
                                    {([
                                        { key: "trajectory" as const, label: "trajectory.md", hint: "$ cat ./how-i-got-here.log" },
                                        { key: "contact" as const, label: "contact.txt", hint: "$ ping manthan say-hi" },
                                        { key: "tech-lab" as const, label: "tech-lab.txt", hint: "$ ./break-things on-purpose" },
                                    ]).map((tab) => (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            role="tab"
                                            aria-selected={activeTab === tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`relative flex w-full shrink-0 items-center gap-2 rounded-sm px-3 py-2.5 text-left text-xs font-sfmono transition-colors md:text-xs ${activeTab === tab.key ? "bg-white/5 text-ink-primary" : "text-ink-faint hover:bg-white/[0.03] hover:text-ink-secondary"}`}
                                        >
                                            {activeTab === tab.key && (
                                                <motion.span layoutId="sidebar-active" className="absolute inset-y-1 left-0 hidden w-0.5 rounded-full bg-zinc-300 md:block" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                                            )}
                                            <span className="truncate">{tab.label}</span>
                                            <TerminalHint text={tab.hint} placement="below-start" />
                                        </button>
                                    ))}
                                </div>
                            </nav>

                            {/* Content column: panel + detached status/CTA boxes */}
                            <div className="flex min-w-0 flex-col gap-4">
                            <div ref={panelRef} className="relative overflow-hidden rounded-sm border border-edge bg-surface-raised shadow-2xl shadow-black/20">
                            <div className="flex items-center gap-1.5 border-b border-edge bg-[#111111] px-4 py-2 font-sfmono text-xs text-ink-faint">
                                <span>~</span>
                                <span className="text-ink-faint">›</span>
                                <span>manthan</span>
                                <span className="text-ink-faint">›</span>
                                <span className="text-ink-secondary">
                                    {activeTab === "trajectory" ? "trajectory.md" : activeTab === "contact" ? "contact.txt" : "tech-lab.txt"}
                                </span>
                            </div>
                            {panelInView && !prefersReducedMotionHero && (
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-x-0 z-20 h-16 bg-gradient-to-b from-transparent via-white/[0.07] to-transparent [animation:scanline-sweep_1.3s_ease-out_1_forwards]"
                                />
                            )}

                            {activeTab === "trajectory" ? <SectionReveal className="px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-10" itemClassName="">
                                <div className="grid w-full min-w-0">
                                    <div className="invisible col-start-1 row-start-1 w-full min-w-0" aria-hidden="true">
                                        <div className="flex flex-wrap items-center gap-2 font-sfmono text-sm break-all" aria-hidden="true">
                                            <span>manthan@portfolio:~$</span>
                                            <span>{command}</span>
                                            <span>█</span>
                                        </div>
                                        <div className="mt-7 grid grid-cols-[1.5rem_1fr] gap-x-3 gap-y-7 sm:grid-cols-[1.75rem_1fr]">
                                            {trajectorySegments.map((segment, idx) => (
                                                <React.Fragment key={idx}>
                                                    <span className="pt-[2px] text-right font-sfmono text-xs text-ink-faint">{String(idx + 1).padStart(2, "0")}</span>
                                                    <p className={`${segment.className} break-words`}>
                                                        <span className="mr-2 select-none text-[#6a9955]/80">{idx === 0 ? "#" : "//"}</span>
                                                        {segment.chunks.map((chunk) => chunk.text).join("")}
                                                    </p>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-start-1 row-start-1 w-full min-w-0" aria-live="polite">
                                        <div className="flex flex-wrap items-center gap-2 font-sfmono text-sm text-ink-muted break-all">
                                            <span className="text-ink-faint">manthan@portfolio:~$</span>
                                            <span className="text-ink-secondary">{command.slice(0, commandVisible)}</span>
                                            <span className="terminal-cursor ml-1 text-ink-muted">█</span>
                                        </div>
                                        <div className="mt-7 grid grid-cols-[1.5rem_1fr] gap-x-3 gap-y-7 sm:grid-cols-[1.75rem_1fr]">
                                            {trajectorySegments.map((segment, idx) => {
                                                const visibleChars = getVisibleCharsForSegment(idx);
                                                const started = visibleChars > 0;
                                                return (
                                                    <React.Fragment key={idx}>
                                                        <span className={`pt-[2px] text-right font-sfmono text-xs text-ink-faint transition-opacity duration-250 ${started ? "opacity-100" : "opacity-0"}`}>
                                                            {String(idx + 1).padStart(2, "0")}
                                                        </span>
                                                        <p className={`${segment.className} break-words`}>
                                                            {started && <span className="mr-2 select-none text-[#6a9955]/80">{idx === 0 ? "#" : "//"}</span>}
                                                            {renderTypedChunks(segment.chunks, visibleChars)}
                                                        </p>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Hand-signed sign-off; space is reserved so nothing jumps when it draws in */}
                                <div aria-hidden="true" className="mt-8 flex h-24 items-end justify-end">
                                    {typedUnits >= totalUnits && (
                                        <div className="text-right">
                                            <Signature className="ml-auto h-12 w-36" />
                                            <Note rotate={-2} size="sm" ink="faint">
                                                — manthan, {new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}. still compiling.
                                            </Note>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-edge pt-5 font-sfmono text-xs text-ink-faint">
                                    <span>process: trajectory_initialized</span>
                                </div>
                            </SectionReveal> : activeTab === "contact" ? <ContactTerminal /> : <TechLabTerminal />}
                            </div>
                            </div>
                        </div>
                        </div>
                    </section>

                    {/* Terminal-style Experience Section */}
                    <div className="relative mt-2 mb-6">
                        <SectionPrompt command="cd ./deep-dive/experience" className="mb-8" startOnMount />
                        <TerminalExperience />
                    </div>
                </div>


            </main>
        </div>
    )
}

export { About, NavBar, TerminalExperience }