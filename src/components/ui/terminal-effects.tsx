import React, { useEffect, useState } from "react";
import { useInViewOnce, usePrefersReducedMotion } from "./use-terminal-effects";

type TypewriterLineProps = {
    text: string;
    prompt?: string;
    start: boolean;
    className?: string;
    cursor?: boolean;
    speedMs?: number;
};

export function TypewriterLine({
    text,
    prompt = "$",
    start,
    className = "",
    cursor = true,
    speedMs = 18,
}: TypewriterLineProps) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [visibleChars, setVisibleChars] = useState(0);

    useEffect(() => {
        if (!start) {
            setVisibleChars(0);
            return;
        }

        if (prefersReducedMotion) {
            setVisibleChars(text.length);
            return;
        }

        setVisibleChars(0);

        const timer = window.setInterval(() => {
            setVisibleChars((previous) => {
                if (previous >= text.length) {
                    window.clearInterval(timer);
                    return previous;
                }

                return previous + 1;
            });
        }, speedMs);

        return () => {
            window.clearInterval(timer);
        };
    }, [prefersReducedMotion, speedMs, start, text]);

    return (
        <div className={`font-sfmono text-sm text-ink-muted flex items-center gap-2 ${className}`} aria-live="polite">
            <span className="text-ink-faint">{prompt}</span>
            <span className="text-ink-secondary">{text.slice(0, visibleChars)}</span>
            {cursor && start && (
                <span className="terminal-cursor ml-1 inline-block align-middle text-ink-secondary">█</span>
            )}
        </div>
    );
}

type SectionPromptProps = {
    command: string;
    className?: string;
    startOnMount?: boolean;
};

export function SectionPrompt({ command, className = "", startOnMount = false }: SectionPromptProps) {
    const [ref, isInView] = useInViewOnce();

    return (
        <div ref={ref} className={className}>
            <TypewriterLine start={startOnMount || isInView} prompt="$" text={command} cursor />
        </div>
    );
}

type SectionRevealProps = {
    children: React.ReactNode;
    className?: string;
    itemClassName?: string;
    staggerMs?: number;
    threshold?: number;
    rootMargin?: string;
    asGridItem?: boolean;
};

export function SectionReveal({
    children,
    className = "",
    itemClassName = "",
    staggerMs = 80,
    threshold = 0.2,
    rootMargin = "0px 0px -10% 0px",
    asGridItem = false,
}: SectionRevealProps) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [ref, isInView] = useInViewOnce(threshold, rootMargin);
    const items = React.Children.toArray(children);

    if (asGridItem) {
        return (
            <div ref={ref} className={className}>
                {items.map((child, index) => {
                    const delay = prefersReducedMotion ? 0 : index * staggerMs;

                    return (
                        <div
                            key={index}
                            className={`transition-[opacity,transform] duration-400 ease-out ${itemClassName}`}
                            style={{
                                opacity: isInView || prefersReducedMotion ? 1 : 0,
                                transform: isInView || prefersReducedMotion ? "translateY(0)" : "translateY(12px)",
                                transitionDelay: isInView ? `${delay}ms` : "0ms",
                            }}
                        >
                            {child}
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div ref={ref} className={className}>
            {items.map((child, index) => {
                const delay = prefersReducedMotion ? 0 : index * staggerMs;

                return (
                    <div
                        key={index}
                        className={`transition-[opacity,transform] duration-400 ease-out ${itemClassName}`}
                        style={{
                            opacity: isInView || prefersReducedMotion ? 1 : 0,
                            transform: isInView || prefersReducedMotion ? "translateY(0)" : "translateY(12px)",
                            transitionDelay: isInView ? `${delay}ms` : "0ms",
                        }}
                    >
                        {child}
                    </div>
                );
            })}
        </div>
    );
}

type SectionHeaderProps = {
    children: React.ReactNode;
    className?: string;
};

export function SectionHeader({ children, className = "" }: SectionHeaderProps) {
    return (
        <h2 className={`block text-base font-sfmono text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap mb-10 leading-none md:mb-12 ${className}`}>
            {children}
            <span className="terminal-cursor ml-2 inline-block align-middle text-ink-muted">█</span>
        </h2>
    );
}
