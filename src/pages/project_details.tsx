import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { projects } from "../data/projects";
import type { Variants } from "framer-motion";
import { NavBar } from "./about";
import NotFound from "./not_found";
import { TerminalHint } from "../components/ui/terminal-hint";

// --- FONT STYLES ---
const monoFont = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontWeight: 400,
  letterSpacing: '-0.02em'
};

const displayFont = {
  fontFamily: '"Neue Haas Unica", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, sans-serif',
  fontWeight: 700,
};

// --- HELPERS ---
function ProjectMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <h3 className="text-[13px] md:text-[14px] text-[#6a9955]/80 uppercase tracking-[0.05em] select-none" style={monoFont}>
        {label}
      </h3>
      <p className="text-[#EBEBF5] text-[15px] md:text-[16px] leading-snug" style={monoFont}>
        {value}
      </p>
    </div>
  );
}

// --- ANIMATION VARIANTS ---

const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: "blur(10px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: "easeOut"
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

function TechBadge({ text }: { text: string }) {
  return (
    <span className="px-3 py-1 text-[12px] text-ink-secondary border border-edge bg-white/[0.03]" style={monoFont}>
      {text}
    </span>
  );
}


// --- MAIN COMPONENT ---
export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white selection:bg-white/20">

      <NavBar />

      <main className="w-full min-w-0 px-5 pb-20 pt-24 mx-auto max-w-[1600px] md:px-8">
        <div className="w-full min-w-0 overflow-hidden rounded-md border border-white/10 bg-[#141414] shadow-2xl shadow-black/20">
          <div className="flex items-end gap-3 border-b border-white/10 bg-[#111111] px-3 pt-2 md:px-5">
            <div className="flex shrink-0 items-center gap-2 px-2 pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            </div>
            <div className="-mb-px flex min-w-0 max-w-full items-center rounded-t-md border-x border-t border-white/10 bg-[#181818] px-4 py-2.5 md:px-5">
              <span className="truncate font-mono text-xs text-zinc-400">./projects/{project.slug}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 border-b border-white/5 bg-[#111111] px-4 py-2 font-sfmono text-[10px] text-zinc-600 md:px-5">
            <span>~</span>
            <span className="text-zinc-700">›</span>
            <span>projects</span>
            <span className="text-zinc-700">›</span>
            <span className="text-zinc-400">{project.slug}.md</span>
          </div>

          <div className="mx-auto w-full min-w-0 max-w-6xl px-5 sm:px-8 md:px-10">
        {/* --- HERO SECTION --- */}
        <div className="grid min-w-0 grid-cols-1 items-end gap-12 mb-24 mt-12 md:grid-cols-12">

          <div className="min-w-0 space-y-6 md:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="break-words text-6xl font-bold leading-none tracking-tighter text-[#EBEBF5] sm:text-7xl md:text-8xl"
              style={displayFont}
            >
              {project.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-2xl break-words text-[16px] leading-relaxed text-[#999] md:text-[18px]"
              style={monoFont}
            >
              {project.subtitle} <br />
              <span className="text-[#666]">{project.category}</span>
            </motion.p>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-8 border-l border-[#333] pl-8 md:col-span-4 md:pl-12">
            <ProjectMeta label="Role" value={project.role} />
            <ProjectMeta label="Year" value={project.year} />
            <ProjectMeta label="Type" value={project.type} />

            <div className="space-y-2 col-span-2">
              <h3 className="text-[13px] md:text-[14px] text-[#6a9955]/80 uppercase tracking-[0.05em] select-none" style={monoFont}>// Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <TechBadge key={tech} text={tech} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN MEDIA (VIDEO OR IMAGE) --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="relative mb-24 aspect-video w-full min-w-0 overflow-hidden border border-white/5 bg-neutral-900 md:h-[70vh]"
        >
          {/* LOGIC: Check if video exists, otherwise show image */}
          {project.video ? (
            <video
              src={project.video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover opacity-90"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-40"></div>
        </motion.div>

        {/* --- DEEP DIVE CONTENT --- */}
        <div className="grid min-w-0 grid-cols-1 gap-16 md:grid-cols-12 md:gap-24">

          {/* Left: Sticky Sidebar */}
          <div className="min-w-0 space-y-12 md:col-span-4">
            <div className="sticky top-32 space-y-8">

              {/* BUTTON CODE */}
              {project.sourceLink && (
                <a
                  href={project.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block w-full py-4 border-t border-b border-[#333] hover:border-[#fde047] transition-colors"
                >
                  <TerminalHint text="$ cat ./src --judge-gently" placement="below-start" />
                  <div className="flex items-center justify-between" style={monoFont}>
                    <span className="text-[13px] uppercase tracking-widest text-[#7a7770] group-hover:text-[#fde047]">
                      View Source
                    </span>
                    <span className="text-lg group-hover:translate-x-1 transition-transform group-hover:text-[#fde047]">
                      ↗
                    </span>
                  </div>
                </a>
              )}

              <p className="text-[14px] md:text-[15px] text-[#888] leading-relaxed" style={monoFont}>
                {project.description}
              </p>
            </div>
          </div>

          {/* Narrative */}
          <div className="min-w-0 space-y-16 md:col-span-8">
            <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
              <motion.h2 variants={fadeInUp} className="text-[22px] font-bold text-[#EBEBF5]" style={monoFont}><span className="mr-2 text-[#6a9955]/80">##</span>The Challenge</motion.h2>
              <motion.p variants={fadeInUp} className="break-words text-[16px] leading-relaxed text-[#999] md:text-[17px]" style={monoFont}>{project.challenge}</motion.p>
            </motion.section>

            <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
              <motion.h2 variants={fadeInUp} className="text-[22px] font-bold text-[#EBEBF5]" style={monoFont}><span className="mr-2 text-[#6a9955]/80">##</span>The Solution</motion.h2>
              <motion.p variants={fadeInUp} className="break-words text-[16px] leading-relaxed text-[#999] md:text-[17px]" style={monoFont}>{project.solution}</motion.p>
            </motion.section>

            <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
              <motion.h2 variants={fadeInUp} className="text-[22px] font-bold text-[#EBEBF5]" style={monoFont}><span className="mr-2 text-[#6a9955]/80">##</span>Impact</motion.h2>
              <motion.p variants={fadeInUp} className="break-words text-[16px] leading-relaxed text-[#999] md:text-[17px]" style={monoFont}>{project.impact}</motion.p>
            </motion.section>
          </div>
        </div>

        {/* --- NEXT PROJECT --- */}
        <div className="mt-40 border-t border-[#333] pt-12 pb-16 flex justify-between items-end group cursor-pointer">
          <div>
            <p className="text-[13px] text-[#7a7770] uppercase mb-2" style={monoFont}>Next Project</p>
            <Link to={`/projects/${project.nextProject}`} className="relative text-3xl md:text-5xl font-bold text-white group-hover:text-[#fde047] transition-colors tracking-tight" style={displayFont}>
              {project.nextProjectTitle}
              <TerminalHint text="$ next --one-more" placement="below-start" />
            </Link>
          </div>
          <span className="text-2xl text-[#666] group-hover:translate-x-2 transition-transform duration-300">→</span>
        </div>

          </div>
        </div>
      </main>
    </div>
  );
}