import { btsp } from "./btsp";
import { probabilisticGraphicModel } from "./probabilistic-graphic-model";
import { resumeRater } from "./resume-rater";
import { instigpt } from "./instigpt";
import { wids25 } from "./wids-25";
import { karyogram } from "./karyogram";

export type { ProjectContent, ProjectSection, MediaItem, ProjectLink } from "./types";

export const projects = [btsp, probabilisticGraphicModel, resumeRater, instigpt, wids25, karyogram];
