import type { ProjectContent } from "./types";

export const instigpt: ProjectContent = {
  slug: "instigpt",
  title: "instigpt",
  category: "RAG / LLM",
  description: "A RAG-based chatbot specializing in IIT Bombay related inquiries.",
  intro:
    "A RAG-based chatbot specializing in IIT Bombay related inquiries, built to unify scattered institutional data behind one interface.",
  cover: { type: "video", src: "/instigpt copy.mp4" },
  hero: { type: "video", src: "/instigpt copy.mp4" },
  meta: {
    role: "NLP Engineer",
    timeline: "2025",
    team: ["AIC NLP Team"],
    stack: ["Llama-2", "LangChain", "FAISS", "Next.js"],
    links: [{ label: "github", href: "https://github.com/AiCommunityIITB/InstiGPT" }],
  },
  metrics: [
    { value: "500+", label: "students" },
    { value: "<5%", label: "hallucination" },
  ],
  sections: [
    {
      heading: "The Problem",
      body: "General LLMs lack specific institutional context about IIT Bombay (deadlines, course codes, hostel rules). Students needed a unified interface for scattered institutional data.",
      layout: "inset",
      media: [{ type: "image", placeholder: "problem framing / scattered data sources diagram" }],
    },
    {
      heading: "RAG Pipeline",
      body: "Built a Retrieval-Augmented Generation pipeline. We indexed institute wikis, rulebooks, and websites into a FAISS vector store, allowing the LLM to retrieve accurate, cited context before answering.",
      layout: "full",
      media: [{ type: "image", placeholder: "RAG architecture diagram" }],
    },
    {
      heading: "Deployment & Results",
      body: "Deployed to a test group of 500+ students, successfully handling queries about academic calendars and mess menus with a hallucination rate under 5%.",
      layout: "grid",
      media: [
        { type: "image", placeholder: "chat UI screenshot" },
        { type: "image", placeholder: "sample Q&A" },
        { type: "image", placeholder: "accuracy / hallucination-rate chart" },
      ],
    },
  ],
  nextProject: "wids-25",
};
