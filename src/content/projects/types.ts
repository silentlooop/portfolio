export type MediaItem = {
  type: "image" | "video";
  /** Omit + set `placeholder` when the real asset doesn't exist yet. */
  src?: string;
  poster?: string;
  caption?: string;
  placeholder?: string;
};

export type ProjectSection = {
  heading: string;
  body: string;
  layout: "full" | "split" | "grid" | "inset";
  media: MediaItem[];
};

export type ProjectLink = { label: string; href: string };

export type ProjectContent = {
  slug: string;
  title: string;
  category: string;
  /** Short one-liner, used on the grid card. */
  description: string;
  /** 3-4 line intro paragraph on the detail page. */
  intro: string;
  /** Thumbnail shown on the projects grid card. */
  cover: { type: "image" | "video"; src: string; width?: number; height?: number };
  /** Large media shown on the project detail page. */
  hero: { type: "image" | "video"; src: string; poster?: string; width?: number; height?: number; heroBg?: string };
  meta: {
    role: string;
    timeline: string;
    team: string[];
    stack: string[];
    links: ProjectLink[];
  };
  metrics?: { value: string; label: string }[];
  sections: ProjectSection[];
  nextProject: string;
};
