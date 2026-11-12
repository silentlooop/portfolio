import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "../../content/projects";
import { TerminalHint } from "./terminal-hint";
import { WindowDots } from "./window-dots";

// Fire this from anywhere to open the terminal, e.g. a footer button.
export const OPEN_TERMINAL_EVENT = "open-command-terminal";

const LINKS = {
    github: "https://github.com/silentlooop",
    linkedin: "https://www.linkedin.com/in/manthan-p-6457b3313",
    x: "https://x.com/null_rejected",
    leetcode: "https://leetcode.com/u/silentlooop/",
    monkeytype: "https://monkeytype.com/profile/silentlooop",
};

type Line = { kind: "input" | "output" | "error"; text: string };

const HELP = [
    "quick navigation:",
    "  work               view selected projects",
    "  blogs              read my writing",
    "  me                 learn about me",
    "  contact            find me online",
    "",
    "projects:",
    "  projects           list all projects",
    "  open <project>     open a project",
    "",
    "  help               show this menu",
    "  clear              clear terminal",
    "  exit               close terminal",
];

// The tip notification only appears on the home page; every other page gets the launcher icon straight away.
function shouldShowTip() {
    return window.location.pathname === "/";
}

const WELCOME: Line[] = [
    { kind: "output", text: "welcome to silentlooop shell (zsh-ish 5.0.0)" },
    { kind: "output", text: "type 'help' to see what i can do." },
];

export function CommandTerminal() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [lines, setLines] = useState<Line[]>(WELCOME);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [showTip, setShowTip] = useState(false);
    // Persistent launcher appears once the tip has had its moment (immediately when the tip is skipped).
    const [launcherReady, setLauncherReady] = useState(() => !shouldShowTip());
    const isTouch = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

    const close = useCallback(() => setOpen(false), []);

    // Tip so people discover the terminal (see shouldShowTip).
    useEffect(() => {
        if (!shouldShowTip()) return;
        const showTimer = window.setTimeout(() => {
            setShowTip(true);
            setLauncherReady(true);
        }, 2500);
        const hideTimer = window.setTimeout(() => setShowTip(false), 8250);
        return () => {
            window.clearTimeout(showTimer);
            window.clearTimeout(hideTimer);
        };
    }, []);

    useEffect(() => {
        if (open) setShowTip(false);
    }, [open]);

    // Global shortcuts: "/" or Cmd/Ctrl+K opens, Esc closes.
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            const isTyping = !!target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setOpen((prev) => !prev);
            } else if (e.key === "/" && !isTyping && !open) {
                e.preventDefault();
                setOpen(true);
            } else if (e.key === "Escape" && open) {
                setOpen(false);
            }
        };
        const onOpenEvent = () => setOpen(true);

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener(OPEN_TERMINAL_EVENT, onOpenEvent);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener(OPEN_TERMINAL_EVENT, onOpenEvent);
        };
    }, [open]);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }, [lines]);

    const go = (path: string, message: string) => {
        setLines((prev) => [...prev, { kind: "output", text: message }]);
        window.setTimeout(() => {
            setOpen(false);
            if (path === "/#work" && window.location.pathname === "/") {
                document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
            } else {
                navigate(path);
            }
        }, 350);
    };

    const openExternal = (url: string, label: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
        return [`opening ${label}...`];
    };

    const run = (raw: string) => {
        const command = raw.trim();
        const [cmd = "", ...args] = command.split(/\s+/);
        const arg = args.join(" ").replace(/^\.\//, "").replace(/\/$/, "");
        const out = (text: string | string[], kind: Line["kind"] = "output") =>
            setLines((prev) => [...prev, ...(Array.isArray(text) ? text : [text]).map((t) => ({ kind, text: t }))]);

        setLines((prev) => [...prev, { kind: "input", text: command }]);
        if (!command) return;
        setHistory((prev) => [...prev, command]);

        switch (cmd.toLowerCase()) {
            case "help":
                return out(HELP);
            case "work":
                return go("/#work", "→ ./work");
            case "blogs":
                return go("/blogs", "→ ./blogs");
            case "me":
                return go("/shaped", "→ ~/me");
            case "contact":
                return out([`github    ${LINKS.github}`, `linkedin  ${LINKS.linkedin}`, `x         ${LINKS.x}`]);
            case "ls":
                if (arg === "projects") return out(projects.map((p) => `  ${p.slug.padEnd(30)} ${p.description}`));
                if (arg === "blogs") return go("/blogs", "→ ./blogs");
                return out("work/  blogs/  me/  projects/  contact.txt");
            case "cd":
                if (!arg || arg === "~" || arg === "/" || arg === "..") return go("/", "→ ~");
                if (arg === "work" || arg === "selected-work") return go("/#work", "→ ./work");
                if (arg === "blogs") return go("/blogs", "→ ./blogs");
                if (arg === "me" || arg === "~/me") return go("/shaped", "→ ~/me");
                if (arg.startsWith("projects/")) return run(`open ${arg.slice("projects/".length)}`);
                return out(`cd: no such file or directory: ${arg}`, "error");
            case "open": {
                const slug = arg.replace(/^projects\//, "");
                const project = projects.find((p) => p.slug === slug);
                if (project) return go(`/projects/${project.slug}`, `-> ./projects/${project.slug}`);
                if (slug in LINKS) return out(openExternal(LINKS[slug as keyof typeof LINKS], slug));
                return out([`open: ${slug || "?"}: not found`, "try 'ls projects'"], "error");
            }
            case "whoami":
                return out(["manthan / silentlooop", "builds ml things, designs things, breaks things.", "→ 'cd me' for the long version"]);
            case "cat":
                if (arg === "contact" || arg === "contact.txt")
                    return out([`github    ${LINKS.github}`, `linkedin  ${LINKS.linkedin}`, `x         ${LINKS.x}`]);
                return out(`cat: ${arg || "?"}: no such file`, "error");
            case "github":
            case "linkedin":
            case "x":
            case "leetcode":
            case "monkeytype":
                return out(openExternal(LINKS[cmd.toLowerCase() as keyof typeof LINKS], cmd.toLowerCase()));
            case "date":
                return out(new Date().toString());
            case "echo":
                return out(args.join(" "));
            case "history":
                return out([...history, command].map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`));
            case "clear":
                return setLines([]);
            case "exit":
                return close();
            case "sudo":
                if (/hire/i.test(arg)) return out(["[sudo] password for recruiter: ********", "permission granted. great choice.", ...openExternal(LINKS.linkedin, "linkedin")]);
                return out("nice try. this incident will be reported.", "error");
            case "rm":
                return out("rm: permission denied. the portfolio stays.", "error");
            case "vim":
            case "vi":
                return out("you'll never leave. try 'exit' instead.");
            default:
                return out(`zsh: command not found: ${cmd}. try 'help'`, "error");
        }
    };

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            run(input);
            setInput("");
            setHistoryIndex(null);
        } else if (e.key === "ArrowUp" && history.length) {
            e.preventDefault();
            const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
            setHistoryIndex(next);
            setInput(history[next]);
        } else if (e.key === "ArrowDown" && historyIndex !== null) {
            e.preventDefault();
            const next = historyIndex + 1;
            setHistoryIndex(next >= history.length ? null : next);
            setInput(next >= history.length ? "" : history[next]);
        } else if (e.key === "l" && e.ctrlKey) {
            e.preventDefault();
            setLines([]);
        }
    };

    return (
        <>
            <AnimatePresence>
                {showTip && !open && (
                    <motion.div
                        className="fixed bottom-5 right-5 z-[55] max-w-[calc(100vw-2.5rem)] font-sfmono"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                        <div className="group relative overflow-hidden rounded-sm border border-edge bg-[#141414]/95 shadow-2xl shadow-black/50 backdrop-blur-sm">
                            <div className="flex items-center gap-1.5 border-b border-edge bg-[#111111] px-3 py-2">
                                <WindowDots
                                    size="sm"
                                    onRed={() => setShowTip(false)}
                                    onYellow={() => setShowTip(false)}
                                    onGreen={() => setOpen(true)}
                                />
                                <span className="ml-2 text-xs uppercase tracking-[0.08em] text-ink-faint">tip</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="block w-full px-4 py-3 text-left text-xs leading-relaxed"
                            >
                                <span className="block text-ink-secondary">
                                    <span className="text-ink-faint">$ </span>psst. this site has a real terminal.
                                </span>
                                <span className="mt-1 block text-ink-muted transition-colors group-hover:text-ink-primary">
                                    {isTouch ? (
                                        "tap here to try it"
                                    ) : (
                                        <>
                                            press <kbd className="rounded-sm border border-edge-hover px-1 text-xs text-ink-primary">/</kbd> or{" "}
                                            <kbd className="rounded-sm border border-edge-hover px-1 text-xs text-ink-primary">⌘K</kbd> to try it
                                        </>
                                    )}
                                    <span className="terminal-cursor ml-1 text-ink-muted">_</span>
                                </span>
                            </button>
                            <motion.span
                                aria-hidden="true"
                                className="absolute bottom-0 left-0 h-px w-full origin-left bg-zinc-600"
                                initial={{ scaleX: 1 }}
                                animate={{ scaleX: 0 }}
                                transition={{ duration: 5.75, ease: "linear" }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {launcherReady && !showTip && !open && (
                    <motion.button
                        type="button"
                        onClick={() => setOpen(true)}
                        aria-label="Open terminal"
                        className="fixed right-0 top-1/2 z-[55] rounded-l-sm border border-r-0 border-edge bg-[#141414]/90 px-2 py-2.5 font-sfmono text-xs leading-none text-ink-muted shadow-lg shadow-black/40 backdrop-blur-sm transition-colors hover:bg-white/[0.04] hover:text-ink-primary"
                        initial={{ opacity: 0, x: 12, y: "-50%" }}
                        animate={{ opacity: 1, x: 0, y: "-50%" }}
                        exit={{ opacity: 0, x: 12, y: "-50%" }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        &gt;<span className="terminal-cursor">_</span>
                        <TerminalHint text="$ ./terminal open" placement="below-start" className="!left-auto right-full mr-2 !top-1/2 !mt-0 -translate-y-1/2" />
                    </motion.button>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onMouseDown={close}
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-label="Command terminal"
                            className="w-full max-w-2xl overflow-hidden rounded-sm border border-edge bg-surface-raised font-sfmono text-sm shadow-2xl shadow-black/50"
                            initial={{ opacity: 0, y: -12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => inputRef.current?.focus()}
                        >
                            <div className="flex items-center gap-2 border-b border-edge bg-[#111111] px-4 py-3">
                                <WindowDots onClose={close} />
                                <span className="ml-3 truncate text-xs text-ink-muted">manthan@portfolio: ~</span>
                                <span className="ml-auto hidden text-xs text-ink-faint sm:inline">esc to close</span>
                            </div>
                            <div ref={scrollRef} className="max-h-[50vh] overflow-y-auto px-4 py-3 leading-relaxed" aria-live="polite">
                                {lines.map((line, i) => (
                                    <div key={i} className="whitespace-pre-wrap break-words">
                                        {line.kind === "input" ? (
                                            <>
                                                <span className="text-ink-faint">$ </span>
                                                <span className="text-ink-primary">{line.text}</span>
                                            </>
                                        ) : (
                                            <span className={line.kind === "error" ? "text-red-400/80" : "text-ink-secondary"}>{line.text}</span>
                                        )}
                                    </div>
                                ))}
                                <div className="flex items-center gap-2">
                                    <span className="text-[#fde047]">$</span>
                                    <input
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={onInputKeyDown}
                                        aria-label="Terminal command"
                                        autoComplete="off"
                                        autoCapitalize="off"
                                        spellCheck={false}
                                        className="min-w-0 flex-1 bg-transparent text-ink-primary caret-[#fde047] outline-none placeholder:text-ink-faint"
                                        placeholder="try 'help'"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
