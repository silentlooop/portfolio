import { useParams } from "react-router-dom";
import { projects } from "../content/projects";
import NotFound from "./not-found";
import { ProjectDetailLayout } from "../components/ui/project-detail-layout";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return <NotFound />;
  }

  return <ProjectDetailLayout project={project} />;
}
