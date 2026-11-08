/** Master on/off switches for the interaction layer. Flip any of these to disable an effect. */
export const EFFECTS = {
  intro: true,
  grain: false,
  timecode: true,
  customCursor: false,
  smoothScroll: true,
  scrollReveal: true,
  titleScramble: true,
  imageParallax: true,
  sound: true,
} as const;

export type EffectKey = keyof typeof EFFECTS;
