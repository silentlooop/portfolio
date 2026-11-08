import { NavBar } from "./about";
import { SectionPrompt, SectionReveal } from "../components/ui/terminal-effects";
import { TerminalHint } from "../components/ui/terminal-hint";
import { Note, Signature } from "../components/ui/annotations";
import { WindowDots } from "../components/ui/window-dots";

interface BlogPost {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    readTime: string;
    url: string;
    /** Optional cover thumbnail, standard frame. */
    thumbnail?: string;
}

const BLOGS: BlogPost[] = [
    {
        slug: "the-boy-who-wouldnt-shut-up",
        title: "The Boy Who Wouldn't Shut Up",
        date: "2025-09-24",
        excerpt: "A short, unfiltered reflection on being the kid who never stopped talking — and what that turned into.",
        tags: ["life"],
        readTime: "4 min read",
        url: "https://medium.com/@pattedamanthan/the-boy-who-wouldnt-shut-up-15f1eb4406f5"
    }
];

function BlogRow({ blog }: { blog: BlogPost }) {
    return (
        <a
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="view"
            className="group relative flex items-center gap-4 rounded px-3 py-3 transition-colors duration-250 ease-out hover:bg-white/[0.03]"
            style={{ textDecoration: "none" }}
        >
            <TerminalHint text={`$ cat ./blogs/${blog.slug}.md`} placement="below-start" />
            <div className="min-w-0 flex-1">
                <h3 className="text-[18px] font-semibold leading-snug text-ink-primary underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-250 ease-out group-hover:decoration-ink-primary">
                    {blog.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-ink-secondary">{blog.excerpt}</p>
                <p className="mt-2 font-sfmono text-[12px] uppercase tracking-wide text-ink-muted">
                    {blog.date} · {blog.readTime}
                    {blog.tags.length > 0 && <> · {blog.tags.map((t) => `#${t}`).join(" ")}</>}
                </p>
            </div>
            {blog.thumbnail && (
                <div className="hidden h-16 w-24 shrink-0 overflow-hidden rounded-md border border-edge bg-[#161616] p-2 sm:block">
                    <img src={blog.thumbnail} alt="" className="h-full w-full object-contain" />
                </div>
            )}
            <span className="shrink-0 text-ink-muted transition-transform duration-150 ease-out group-hover:translate-x-1">↗</span>
        </a>
    );
}

const Blogs = () => {
    const sortedBlogs = [...BLOGS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const years = Array.from(new Set(sortedBlogs.map((b) => new Date(b.date).getFullYear())));
    const showYearLabels = years.length > 1;

    return (
        <>
            <NavBar />
            <div className="relative min-h-screen bg-[#111111] text-white font-sfmono pt-24 pb-20">
                <div className="relative w-full px-5 max-w-content mx-auto">
                    <SectionPrompt command="cat ./blogs" className="mb-6" />
                    <div className="relative bg-[#111111] rounded-md p-6 border border-white/10 shadow-sm shadow-white/5">
                        <div className="mb-6 flex items-center gap-2">
                            <WindowDots />
                            <span className="ml-3 text-gray-400 text-xs">manthan@portfolio:~/blogs$</span>
                        </div>

                        {sortedBlogs.length > 0 ? (
                            <SectionReveal className="space-y-1">
                                {years.map((year) => (
                                    <div key={year}>
                                        {showYearLabels && (
                                            <p className="mb-2 mt-4 font-sfmono text-[11px] uppercase tracking-wide text-ink-muted first:mt-0">{year}</p>
                                        )}
                                        {sortedBlogs
                                            .filter((b) => new Date(b.date).getFullYear() === year)
                                            .map((blog) => (
                                                <BlogRow key={blog.slug} blog={blog} />
                                            ))}
                                    </div>
                                ))}
                            </SectionReveal>
                        ) : (
                            <p className="px-3 py-2 text-sm text-ink-muted">looking for one...</p>
                        )}

                        <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-4 text-sm text-gray-500">
                            <span>manthan@portfolio:~/blogs$</span>
                            <span className="terminal-cursor inline-block">▍</span>
                        </div>
                    </div>

                    <div aria-hidden="true" className="pointer-events-none mt-6 hidden justify-end md:flex">
                        <div className="text-right">
                            <Signature className="ml-auto h-12 w-36" />
                            <Note rotate={-2} size="sm" ink="faint">
                                still writing these as I go.
                            </Note>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Blogs;
