// Thin re-export so existing imports (`from "../data/projects"`) keep working.
// The real content now lives one-file-per-project in src/content/projects/.
export { projects } from "../content/projects";
export type { ProjectContent, ProjectSection, MediaItem, ProjectLink } from "../content/projects";
