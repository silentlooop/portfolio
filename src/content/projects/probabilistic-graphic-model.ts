import type { ProjectContent } from "./types";

export const probabilisticGraphicModel: ProjectContent = {
  slug: "probabilistic-graphic-model",
  title: "probabilistic graphic model",
  category: "Consumer Product",
  description: "A focused consumer-facing interface built to make probabilistic ideas easier to explore.",
  intro:
    "A focused consumer-facing interface built to make probabilistic ideas easier to explore, without hiding the reasoning behind technical notation.",
  cover: { type: "image", src: "/soc.jpeg", width: 736, height: 736 },
  hero: { type: "image", src: "/soc.jpeg", width: 736, height: 736 },
  meta: {
    role: "Developer",
    timeline: "2025",
    team: ["Solo"],
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    links: [],
  },
  sections: [
    {
      heading: "The Problem",
      body: "Probabilistic models can be difficult to understand when their inputs and outcomes remain hidden behind technical notation.",
      layout: "split",
      media: [
        { type: "image", placeholder: "UI screenshot — input panel" },
        { type: "image", placeholder: "UI screenshot — output panel" },
      ],
    },
    {
      heading: "Interface & Interaction",
      body: "Designed an interactive visual interface that presents model inputs, relationships, and outcomes in a clear, approachable workflow.",
      layout: "full",
      media: [{ type: "video", placeholder: "short demo GIF/clip of the interaction" }],
    },
    {
      heading: "Outcome",
      body: "Created a practical way for users to explore probabilistic thinking through a responsive product experience.",
      layout: "inset",
      media: [{ type: "image", placeholder: "before/after or summary visual" }],
    },
  ],
  nextProject: "resume-rater",
};
