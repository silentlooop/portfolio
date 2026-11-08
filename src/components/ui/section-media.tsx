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
  // Only render real media - placeholders stay invisible since no media will be added.
  const real = media.filter((m) => !m.placeholder && m.src);
  if (real.length === 0) return null;

  if (layout === "split") {
    return (
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {real.map((m, i) => (
          <Item key={i} item={m} />
        ))}
      </div>
    );
  }

  if (layout === "grid") {
    return (
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {real.map((m, i) => (
          <Item key={i} item={m} aspect="aspect-square" />
        ))}
      </div>
    );
  }

  if (layout === "inset") {
    return (
      <div className="mt-4 max-w-[680px] space-y-4">
        {real.map((m, i) => (
          <Item key={i} item={m} />
        ))}
      </div>
    );
  }

  // "full"
  return (
    <div className="mt-4 space-y-4">
      {real.map((m, i) => (
        <Item key={i} item={m} />
      ))}
    </div>
  );
}
