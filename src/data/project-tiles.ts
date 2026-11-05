/** One aspect ratio per project. Edit here to change a tile's shape. */
export type TileRatio = "tall" | "standard" | "wide";

export const RATIO_CLASS: Record<TileRatio, string> = {
  tall: "aspect-[4/5]",
  standard: "aspect-[4/3]",
  wide: "aspect-[16/10]",
};

export const PROJECT_TILE_RATIO: Record<string, TileRatio> = {
  "btsp": "tall",
  "probabilistic-graphic-model": "standard",
  "resume-rater": "wide",
  "wids-25": "tall",
  "instigpt": "standard",
  "karyogram": "wide",
};
