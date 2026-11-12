import type { ProjectContent } from "./types";

export const karyogram: ProjectContent = {
  slug: "karyogram",
  title: "karyogram",
  category: "Computer Vision",
  description: "Automated segmentation and classification of chromosome pairs.",
  intro:
    "Automated segmentation and classification of chromosome pairs, built to speed up a tedious, error-prone manual process for geneticists.",
  cover: { type: "image", src: "/karyo.webp", width: 850, height: 496 },
  hero: { type: "image", src: "/karyo.webp", width: 850, height: 496 },
  meta: {
    role: "CV Engineer",
    timeline: "2025",
    team: ["Solo"],
    stack: ["OpenCV", "Scikit-Image", "CNN", "Python"],
    links: [],
  },
  metrics: [{ value: "92%", label: "accuracy" }],
  sections: [
    {
      heading: "The Problem",
      body: "Manual karyotyping (pairing chromosomes) is tedious and error-prone for geneticists. Overlapping chromosomes in microscopy images make segmentation difficult.",
      layout: "split",
      media: [
        { type: "image", placeholder: "raw microscopy image" },
        { type: "image", placeholder: "overlapping-chromosome close-up" },
      ],
    },
    {
      heading: "Segmentation Algorithm",
      body: "Created a geometric separation algorithm using concave points to split touching chromosomes. Trained a CNN to classify isolated chromosomes into their respective pairs (1-22 + XY).",
      layout: "full",
      media: [{ type: "image", placeholder: "concave-point split diagram" }],
    },
    {
      heading: "Results",
      body: "Automated the sorting process with 92% accuracy, significantly reducing the time required for genetic disorder screening.",
      layout: "inset",
      media: [{ type: "image", placeholder: "accuracy breakdown / confusion matrix" }],
    },
  ],
  nextProject: "btsp",
};
