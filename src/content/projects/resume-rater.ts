import type { ProjectContent } from "./types";

export const resumeRater: ProjectContent = {
  slug: "resume-rater",
  title: "resume rater",
  category: "AI Model",
  description: "An AI agent that quantifies resume quality based on job descriptions.",
  intro:
    "An AI agent that quantifies resume quality based on job descriptions, built to make hiring screens more objective and consistent.",
  hero: { type: "image", src: "/aic2.png", width: 1080, height: 1080 },
  meta: {
    role: "AI Developer",
    timeline: "2025",
    team: ["Solo"],
    stack: ["BERT", "FastAPI", "React", "Python"],
    links: [],
  },
  metrics: [{ value: "40%", label: "faster screening" }],
  sections: [
    {
      heading: "The Problem",
      body: "Subjective hiring processes lead to bias and inefficiency. The goal was to build a system that could objectively parse and score technical resumes against specific job requirements.",
      layout: "inset",
      media: [{ type: "image", placeholder: "resume scoring UI screenshot" }],
    },
    {
      heading: "Pipeline & Model",
      body: "Utilized BERT-based transformer models for semantic matching between candidate skills and job descriptions. Built a parsing engine to extract entities (Education, Skills, Experience) regardless of PDF formatting.",
      layout: "full",
      media: [{ type: "image", placeholder: "pipeline diagram (parse -> embed -> match -> score)" }],
    },
    {
      heading: "Results",
      body: "Reduced initial screening time by 40% in mock trials, providing instant feedback scores and keyword optimization suggestions to users.",
      layout: "inset",
      media: [{ type: "image", placeholder: "score comparison table / chart" }],
    },
  ],
  nextProject: "instigpt",
};
