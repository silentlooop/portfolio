"use client";

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import type { Variants } from "framer-motion";
import { SectionPrompt, SectionReveal } from "../components/ui/terminal-effects";
import { TerminalHint } from "../components/ui/terminal-hint";
import { Arrow, Measure, Note, Signature } from "../components/ui/annotations";
import { MuteToggle } from "../components/ui/mute-toggle";
import { ScrambleText } from "../components/ui/scramble-text";
import { useInViewOnce, usePrefersReducedMotion } from "../components/ui/use-terminal-effects";
import { FaLinkedin, FaXTwitter, FaGithub } from "react-icons/fa6";
import { SiLeetcode, SiMonkeytype } from "react-icons/si";
import { WindowDots } from "../components/ui/window-dots";

// --- HELPERS ---

// Terminal-style Experience Section
function TerminalExperience() {
    const experiences = [
        {
            company: "AICommunity IITB",
            period: "2025 – 2026",
            role: "Junior Developer",
            desc: "Working with a small team of 8 members to build AI products for insti and freelance projects. Focusing on NLP pipelines and generative models."
        },
        {
            company: "Techfest",
            period: "2025 – 2026",
            role: "Graphic Designer",
            desc: "Supported the design team with social media graphics, print materials, and visual identity systems for Asia's largest Science and Technology festival."
        }
    ];

    return (
        <div className="w-full max-w-content mx-auto font-mono text-[15px] text-ink-secondary">
            <div>
                {experiences.length > 0 ? experiences.map((exp, idx) => (
                    <div key={exp.company} className="flex gap-4 sm:gap-6">
                        <p className="w-14 shrink-0 pt-0.5 text-right text-[10px] uppercase leading-snug tracking-[0.1em] text-zinc-600 sm:w-24 sm:text-xs sm:tracking-[0.15em]">
                            {exp.period}
                        </p>

                        <div className="relative flex w-3 shrink-0 flex-col items-center">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-zinc-500" />
                            {idx !== experiences.length - 1 && (
                                <span className="mt-2 w-px flex-1 bg-white/10" />
                            )}
                        </div>

                        <div className={`min-w-0 flex-1 ${idx !== experiences.length - 1 ? "pb-20 sm:pb-24" : ""}`}>
                            <h3 className="text-2xl font-bold tracking-tight text-ink-primary sm:text-[28px]">
                                {exp.company}
                            </h3>
                            <p className="mt-1 text-[17px] text-zinc-400">{exp.role}</p>
                            <p className="mt-4 max-w-[60ch] whitespace-pre-line break-words text-base leading-relaxed text-ink-secondary">
                                {exp.desc}
                            </p>
                        </div>
                    </div>
                )) : (
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <span>looking for one...</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function ContactTerminal() {
    return (
        <div className="px-3 pb-6 pt-5 sm:px-5 sm:pb-8 sm:pt-7 md:px-12 md:pb-12 md:pt-10">
            <div className="max-w-4xl space-y-5 font-mono">
                <div className="flex min-w-0 items-center gap-2 text-xs text-zinc-500 sm:text-sm">
                    <span className="text-zinc-600">manthan@portfolio:~$</span>
                    <span className="text-zinc-300 truncate">cat contact.txt</span>
                </div>
                <div className="space-y-3 text-[13px] leading-6 text-gray-400 sm:text-[15px] md:text-base">
                    <p className="text-lg font-bold tracking-tight text-white sm:text-xl md:text-2xl break-words">Let's connect.</p>
                    <p className="break-words sm:text-base">Open channels for thoughtful work, curious conversations, and ambitious ideas.</p>
                </div>
                <div className="grid gap-2 border-t border-white/5 pt-4 sm:gap-3 sm:border-t sm:pt-6 sm:grid-cols-2">
                    <a
                        href="https://www.linkedin.com/in/manthan-p-6457b3313"
                        target="_blank"
                        rel="noreferrer"
                        className="group relative flex items-center gap-3 rounded-md border border-white/5 bg-[#111111] px-3 py-2.5 transition-colors hover:border-white/20 hover:bg-[#181818] sm:px-4 sm:py-3"
                    >
                        <TerminalHint text="$ open ./me in-a-blazer" placement="below-start" />
                        <FaLinkedin className="h-5 w-5 shrink-0 text-zinc-600 transition-all duration-250 ease-out group-hover:scale-110 group-hover:text-[#0A66C2]" />
                        <span className="min-w-0">
                            <span className="block text-[10px] text-[#6a9955]/80 sm:text-xs">network</span>
                            <span className="mt-0.5 block text-xs text-gray-300 group-hover:text-white sm:text-sm">linkedin <span className="text-zinc-600">↗</span></span>
                        </span>
                    </a>
                    <a
                        href="https://x.com/null_rejected"
                        target="_blank"
                        rel="noreferrer"
                        className="group relative flex items-center gap-3 rounded-md border border-white/5 bg-[#111111] px-3 py-2.5 transition-colors hover:border-white/20 hover:bg-[#181818] sm:px-4 sm:py-3"
                    >
                        <TerminalHint text="$ tail -f ./unfiltered-thoughts" placement="below-start" />
                        <FaXTwitter className="h-5 w-5 shrink-0 text-zinc-600 transition-all duration-250 ease-out group-hover:scale-110 group-hover:text-white" />
                        <span className="min-w-0">
                            <span className="block text-[10px] text-[#6a9955]/80 sm:text-xs">signal</span>
                            <span className="mt-0.5 block text-xs text-gray-300 group-hover:text-white sm:text-sm">twitter <span className="text-zinc-600">↗</span></span>
                        </span>
                    </a>
                </div>
                <div className="border-t border-white/5 pt-4 sm:pt-6">
                    <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-600 sm:text-xs">development</p>
                    <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
                        <a
                            href="https://github.com/silentlooop"
                            target="_blank"
                            rel="noreferrer"
                            className="group relative flex items-center gap-3 rounded-md border border-white/5 bg-[#111111] px-3 py-2.5 transition-colors hover:border-white/20 hover:bg-[#181818] sm:px-4 sm:py-3"
                        >
                            <TerminalHint text="$ git log since=3am" placement="below-start" />
                            <FaGithub className="h-5 w-5 shrink-0 text-zinc-600 transition-all duration-250 ease-out group-hover:scale-110 group-hover:text-white" />
                            <span className="min-w-0">
                                <span className="block text-[10px] text-[#6a9955]/80 sm:text-xs">source</span>
                                <span className="mt-0.5 block text-xs text-gray-300 group-hover:text-white sm:text-sm">github <span className="text-zinc-600">↗</span></span>
                            </span>
                        </a>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-white/5 pt-4 text-[10px] text-zinc-600 sm:text-xs">
                    <span className="truncate">process: contact_ready</span>
                </div>
            </div>
        </div>
    );
}

function TechLabTerminal() {
    return (
        <div className="px-5 pb-8 pt-7 sm:px-8 sm:pb-10 sm:pt-8 md:px-12 md:pb-12 md:pt-10">
            <div className="max-w-4xl space-y-7 font-mono">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <span className="text-zinc-600">manthan@portfolio:~$</span>
                    <span className="text-zinc-300">cat tech-lab.txt</span>
                </div>
                <div className="space-y-3 text-[15px] leading-7 text-gray-400 md:text-base">
                    <p className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl break-words">The tech lab.</p>
                    <p className="break-words sm:text-base">Places where I practice, experiment, and keep the feedback loop moving.</p>
                </div>
                <div className="grid gap-3 border-t border-white/5 pt-6 sm:grid-cols-2">
                    <a
                        href="https://leetcode.com/u/silentlooop/"
                        target="_blank"
                        rel="noreferrer"
                        className="group relative flex items-center gap-3 rounded-md border border-white/5 bg-[#111111] px-4 py-3 transition-colors hover:border-white/20 hover:bg-[#181818]"
                    >
                        <TerminalHint text="$ sudo solve daily-humility" placement="below-start" />
                        <SiLeetcode className="h-5 w-5 shrink-0 text-zinc-600 transition-all duration-250 ease-out group-hover:scale-110 group-hover:text-[#FFA116]" />
                        <span className="min-w-0">
                            <span className="block text-xs text-[#6a9955]/80">problem solving</span>
                            <span className="mt-1 block text-sm text-gray-300 group-hover:text-white">leetcode <span className="text-zinc-600">↗</span></span>
                        </span>
                    </a>
                    <a
                        href="https://monkeytype.com/profile/silentlooop"
                        target="_blank"
                        rel="noreferrer"
                        className="group relative flex items-center gap-3 rounded-md border border-white/5 bg-[#111111] px-4 py-3 transition-colors hover:border-white/20 hover:bg-[#181818]"
                    >
                        <TerminalHint text="$ wpm check again" placement="below-start" />
                        <SiMonkeytype className="h-5 w-5 shrink-0 text-zinc-600 transition-all duration-250 ease-out group-hover:scale-110 group-hover:text-[#E2B714]" />
                        <span className="min-w-0">
                            <span className="block text-xs text-[#6a9955]/80">typing practice</span>
                            <span className="mt-1 block text-sm text-gray-300 group-hover:text-white">monkeytype <span className="text-zinc-600">↗</span></span>
                        </span>
                    </a>
                </div>
                <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-5 text-xs text-zinc-600">
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
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3 md:px-6 md:py-4 bg-[#111111]/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
                {/* Logo */}
                <a href="/" className="text-white font-sfmono text-base md:text-lg font-bold tracking-tight hover:opacity-80 transition-opacity z-50 relative">
                    <ScrambleText text="silentlooop" /><span className="terminal-cursor text-zinc-500">_</span>
                    <TerminalHint text="$ cd ~/home-sweet-home" placement="below" />
                </a>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-sfmono text-gray-400">
                    <a href="/#work" onClick={(e) => scrollToSection(e, 'work')} className={`relative transition-colors cursor-pointer ${isActive("/") ? "text-[#fde047]" : "hover:text-white"}`}>projects<TerminalHint text="$ ls ./proof-i-dont-just-talk" placement="below" /></a>
                    <a href="/#experience" onClick={(e) => scrollToSection(e, 'experience')} className="relative transition-colors cursor-pointer hover:text-white">experience<TerminalHint text="$ cat ./where-ive-worked" placement="below" /></a>
                    <a href="/blogs" className={`relative transition-colors cursor-pointer ${isActive("/blogs") ? "text-[#fde047]" : "hover:text-white"}`}>blogs<TerminalHint text="$ cat ./thoughts uncompiled" placement="below" /></a>
                    <a href="/shaped" className={`relative transition-colors cursor-pointer ${isActive("/shaped") ? "text-[#fde047]" : "hover:text-white"}`}>~/me<TerminalHint text="$ whoami the-human-behind-it" placement="below" /></a>
                    <MuteToggle className="relative text-gray-400" />
                </div>

                {/* Mobile Menu Toggle (Hamburger / Close) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-white text-xl z-50 relative focus:outline-none"
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
                                className="text-xl font-semibold text-gray-500 tracking-tight font-sfmono"
                            >
                                projects
                            </motion.a>
                            <motion.a
                                custom={1}
                                variants={linkVariants}
                                href="/#experience"
                                onClick={(e) => scrollToSection(e, 'experience')}
                                className="text-xl font-semibold text-gray-500 tracking-tight font-sfmono"
                            >
                                experience
                            </motion.a>
                            <motion.a
                                custom={2}
                                variants={linkVariants}
                                href="/blogs"
                                className="text-xl font-semibold text-gray-500 tracking-tight font-sfmono"
                            >
                                blogs
                            </motion.a>
                            <motion.a
                                custom={3}
                                variants={linkVariants}
                                href="/shaped"
                                className="text-xl font-semibold text-gray-500 tracking-tight font-sfmono"
                            >
                                ~/me
                            </motion.a>
                            <motion.div custom={4} variants={linkVariants}>
                                <MuteToggle className="text-xl font-semibold text-gray-500 tracking-tight font-sfmono" />
                            </motion.div>
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
            className: "text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-white",
            chunks: [{ text: "The Trajectory" }]
        },
        {
            className: "text-[13px] sm:text-[14px] md:text-[15px] text-gray-400 leading-relaxed break-words",
            chunks: [
                { text: "I build where " },
                { text: "math meets machinery", className: "text-white" },
                { text: ": models that learn, pipelines that ship, and interfaces people actually enjoy using." }
            ]
        },
        {
            className: "text-[13px] sm:text-[14px] md:text-[15px] text-gray-400 leading-relaxed break-words",
            chunks: [
                { text: "The path has wandered from soldering irons to transformers, but the loop never changes: " },
                { text: "break it, understand it, rebuild it better", className: "text-white" },
                { text: "." }
            ]
        },
        {
            className: "text-[13px] sm:text-[14px] md:text-[15px] text-gray-400 leading-relaxed break-words",
            chunks: [
                { text: "My current obsession? " },
                { text: "Teaching machines to imagine.", className: "text-white" },
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

            <main className="flex flex-col items-center bg-[#111111] text-white font-sfmono relative z-10 animate-in fade-in duration-1000">

                <div className="w-full px-5 max-w-5xl mx-auto">
                    {/* Trajectory Section */}
                    <section className="relative min-h-[100dvh] flex flex-col justify-center py-24 md:py-28">
                        <div className="relative">
                        {/* Annotations: proof marks + margin notes */}
                        <div aria-hidden="true" className="pointer-events-none absolute -top-9 inset-x-0 hidden items-center gap-3 md:flex">
                            <span className="font-sfmono text-[10px] text-zinc-600">01</span>
                            <Measure className="flex-1" label="984 × 640" note="fig. 01 — the trajectory" />
                        </div>
                        <div aria-hidden="true" className="pointer-events-none absolute bottom-10 left-full ml-4 hidden overflow-hidden lg:block lg:w-[clamp(0rem,calc(50vw-33rem),11rem)]">
                            <Arrow variant="hook" flip className="h-14 w-14" rotate={-20} />
                            <Note rotate={5} size="sm" className="mt-1">still figuring it out… and probably always will.</Note>
                        </div>

                        <div className="relative z-10 grid gap-4 md:grid-cols-[13rem_1fr]">
                            {/* File-tree sidebar, replaces the old top tab bar */}
                            <nav aria-label="Portfolio views" className="overflow-hidden rounded-md border border-white/10 bg-[#141414] shadow-2xl shadow-black/20 md:self-start">
                                <div className="flex items-center gap-2 border-b border-white/10 bg-[#111111] px-4 py-3">
                                    <WindowDots />
                                    <span className="ml-2 truncate text-[11px] text-zinc-600">~/manthan</span>
                                </div>
                                <div className="px-3 pt-2.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">Explorer</div>
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
                                            className={`relative flex w-full shrink-0 items-center gap-2 rounded px-3 py-2.5 text-left text-[11px] font-sfmono transition-colors md:text-xs ${activeTab === tab.key ? "bg-white/5 text-zinc-200" : "text-zinc-600 hover:bg-white/[0.03] hover:text-zinc-400"}`}
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
                            <div ref={panelRef} className="relative overflow-hidden rounded-md border border-white/10 bg-[#141414] shadow-2xl shadow-black/20">
                            <div className="flex items-center gap-1.5 border-b border-white/5 bg-[#111111] px-4 py-2 font-sfmono text-[10px] text-zinc-600">
                                <span>~</span>
                                <span className="text-zinc-700">›</span>
                                <span>manthan</span>
                                <span className="text-zinc-700">›</span>
                                <span className="text-zinc-400">
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
                                        <div className="flex flex-wrap items-center gap-2 font-mono text-sm break-all" aria-hidden="true">
                                            <span>manthan@portfolio:~$</span>
                                            <span>{command}</span>
                                            <span>█</span>
                                        </div>
                                        <div className="mt-7 grid grid-cols-[1.5rem_1fr] gap-x-3 gap-y-7 sm:grid-cols-[1.75rem_1fr]">
                                            {trajectorySegments.map((segment, idx) => (
                                                <React.Fragment key={idx}>
                                                    <span className="pt-[2px] text-right font-sfmono text-[11px] text-zinc-700">{String(idx + 1).padStart(2, "0")}</span>
                                                    <p className={`${segment.className} break-words`}>
                                                        <span className="mr-2 select-none text-[#6a9955]/80">{idx === 0 ? "#" : "//"}</span>
                                                        {segment.chunks.map((chunk) => chunk.text).join("")}
                                                    </p>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-start-1 row-start-1 w-full min-w-0" aria-live="polite">
                                        <div className="flex flex-wrap items-center gap-2 font-mono text-sm text-zinc-500 break-all">
                                            <span className="text-zinc-600">manthan@portfolio:~$</span>
                                            <span className="text-zinc-400">{command.slice(0, commandVisible)}</span>
                                            <span className="terminal-cursor ml-1 text-zinc-500">█</span>
                                        </div>
                                        <div className="mt-7 grid grid-cols-[1.5rem_1fr] gap-x-3 gap-y-7 sm:grid-cols-[1.75rem_1fr]">
                                            {trajectorySegments.map((segment, idx) => {
                                                const visibleChars = getVisibleCharsForSegment(idx);
                                                const started = visibleChars > 0;
                                                return (
                                                    <React.Fragment key={idx}>
                                                        <span className={`pt-[2px] text-right font-sfmono text-[11px] text-zinc-700 transition-opacity duration-300 ${started ? "opacity-100" : "opacity-0"}`}>
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

                                <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-white/5 pt-5 font-mono text-xs text-zinc-600">
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