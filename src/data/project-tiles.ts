/** One aspect ratio per project, picked to match each source image's real shape
 *  so object-contain never has to letterbox hard inside the frame. Edit here to change. */
export type TileRatio = "tall" | "standard" | "wide";

export const RATIO_CLASS: Record<TileRatio, string> = {
  tall: "aspect-[4/5]",
  standard: "aspect-[4/3]",
  wide: "aspect-[16/10]",
};

export const PROJECT_TILE_RATIO: Record<string, TileRatio> = {
  "probabilistic-graphic-model": "tall", // soc.jpeg, 736x736 square — best fit for a portrait frame
  "btsp": "standard", // btsp.png, 1920x1080
  "wids-25": "wide", // dqn2.png, 2696x574 — extreme wide panorama, needs the widest frame available
  "resume-rater": "tall", // aic2.png, 1080x1080 square
  "instigpt": "standard", // video, ~16:9
  "karyogram": "wide", // karyo.png, 850x496
};

/** Grid display order — controls both the tile sequence and the rail's numbered index. */
export const TILE_ORDER = [
  "probabilistic-graphic-model",
  "btsp",
  "wids-25",
  "resume-rater",
  "instigpt",
  "karyogram",
];
