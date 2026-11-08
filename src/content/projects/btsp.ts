import type { ProjectContent } from "./types";

export const btsp: ProjectContent = {
  slug: "btsp",
  title: "btsp",
  category: "Medical Imaging",
  description: "Accurately segmenting tumor regions from MRI scans to assist in automated diagnosis.",
  intro:
    "Accurately segmenting tumor regions from MRI scans to assist in automated diagnosis, built for the BioX-WNCC Competition.",
  hero: { type: "image", src: "/btsp.png", width: 1920, height: 1080 },
  meta: {
    role: "ML Engineer",
    timeline: "2025",
    team: ["BioX-WNCC Team"],
    stack: ["PyTorch", "U-Net", "OpenCV", "Python"],
    links: [{ label: "github", href: "https://github.com/silentlooop/Brain_Tumor_Segmentation_BCP" }],
  },
  metrics: [
    { value: "0.85", label: "dice coeff" },
    { value: "<2s", label: "per scan" },
  ],
  sections: [
    {
      heading: "Data & Preprocessing",
      body: "Medical image segmentation is notoriously difficult due to low contrast and noise in MRI scans. Distinguishing between edema, enhancing tumor, and non-enhancing tumor regions required high pixel-level accuracy.",
      layout: "split",
      media: [
        { type: "image", placeholder: "raw MRI slice" },
        { type: "image", placeholder: "ground-truth mask", caption: "Fig. 1 — input scan vs. ground-truth mask" },
      ],
    },
    {
      heading: "Model",
      body: "Implemented a modified U-Net architecture with attention gates to focus on relevant spatial features. The pipeline included skull stripping, normalization, and a Dice Loss function to handle class imbalance.",
      layout: "full",
      media: [{ type: "image", placeholder: "architecture diagram (attention U-Net)" }],
    },
    {
      heading: "Results & Failure Cases",
      body: "Achieved a Dice Coefficient of 0.85 on the validation set, successfully segmenting core tumor regions in under 2 seconds per scan.",
      layout: "grid",
      media: [
        { type: "image", placeholder: "sample output 1" },
        { type: "image", placeholder: "sample output 2" },
        { type: "image", placeholder: "a failure case" },
      ],
    },
  ],
  nextProject: "resume-rater",
};
