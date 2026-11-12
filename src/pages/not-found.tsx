import { useLocation } from "react-router-dom";
import { NavBar } from "./about";
import { OPEN_TERMINAL_EVENT } from "../components/ui/command-terminal";
import { WindowDots } from "../components/ui/window-dots";

export default function NotFound() {
    const { pathname } = useLocation();

    return (
        <div className="min-h-screen bg-[#111111] text-ink-primary">
            <NavBar />
            <main className="flex min-h-screen items-center justify-center px-5">
                <div className="w-full max-w-xl overflow-hidden rounded-sm border border-edge bg-surface-raised font-sfmono shadow-2xl shadow-black/20">
                    <div className="flex items-center gap-2 border-b border-edge bg-[#111111] px-5 py-3">
                        <WindowDots />
                        <span className="ml-3 text-xs text-ink-muted">exit code 404</span>
                    </div>
                    <div className="space-y-3 px-5 py-6 text-sm leading-relaxed">
                        <p>
                            <span className="text-ink-faint">$ </span>
                            <span className="text-ink-primary break-all">cd .{pathname}</span>
                        </p>
                        <p className="text-red-400/80 break-all">cd: no such file or directory: .{pathname}</p>
                        <p className="text-ink-muted">this page wandered off. it happens to the best of us.</p>
                        <div className="flex flex-wrap gap-3 pt-3">
                            <a href="/" className="rounded-sm border border-edge px-3 py-1.5 text-xs text-ink-primary transition-colors hover:border-[#fde047]/60 hover:text-[#fde047]">
                                $ cd ~
                            </a>
                            <button
                                type="button"
                                onClick={() => window.dispatchEvent(new Event(OPEN_TERMINAL_EVENT))}
                                className="rounded-sm border border-edge px-3 py-1.5 text-xs text-ink-primary transition-colors hover:border-[#fde047]/60 hover:text-[#fde047]"
                            >
                                $ help
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
