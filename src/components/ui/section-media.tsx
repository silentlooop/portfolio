import { MediaFrame } from "./media-frame";
import type { MediaItem, ProjectSection } from "../../content/projects/types";

function Item({ item, aspect }: { item: MediaItem; aspect?: string }) {
  return (
    <div>
      <MediaFrame item={item} aspect={aspect} />
      {item.caption && <p className="mt-2 text-center font-sfmono text-[12px] text-ink-muted">{item.caption}</p>}
    </div>
  );
}

export function SectionMedia({ media, layout }: { media: MediaItem[]; layout: ProjectSection["layout"] }) {
  // In production, only render real media - placeholders stay invisible until an actual src is added.
  // In dev, show placeholders too so it's obvious what's still missing.
  const real = import.meta.env.DEV ? media : media.filter((m) => !m.placeholder && m.src);
  if (real.length === 0) return null;

  if (layout === "split") {
    return (
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {real.map((m, i) => (
          <Item key={i} item={m} />
        ))}
      </div>
    );
  }

  if (layout === "grid") {
    return (
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {real.map((m, i) => (
          <Item key={i} item={m} aspect="aspect-square" />
        ))}
      </div>
    );
  }

  if (layout === "inset") {
    return (
      <div className="mx-auto mt-6 max-w-[680px] space-y-4">
        {real.map((m, i) => (
          <Item key={i} item={m} />
        ))}
      </div>
    );
  }

  // "full"
  return (
    <div className="mt-6 space-y-4">
      {real.map((m, i) => (
        <Item key={i} item={m} />
      ))}
    </div>
  );
}
