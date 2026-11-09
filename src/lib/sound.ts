import { EFFECTS } from "./effects-config";

const MUTE_KEY = "sound-muted";

type SoundName = "tick" | "click";

const SOURCES: Record<SoundName, string> = {
  tick: "/sounds/tick.wav",
  click: "/sounds/click.wav",
};

let howlerModule: typeof import("howler") | null = null;
const instances = new Map<SoundName, import("howler").Howl>();
let lastTickAt = 0;
const TICK_THROTTLE_MS = 45;

export function isMuted(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(MUTE_KEY) !== "false";
  } catch {
    return true;
  }
}

export function setMuted(muted: boolean) {
  try {
    window.localStorage.setItem(MUTE_KEY, String(muted));
  } catch {
    // ignore (private browsing / storage disabled)
  }
}

async function getHowler() {
  if (!howlerModule) {
    howlerModule = await import("howler");
  }
  return howlerModule;
}

async function getSound(name: SoundName) {
  if (!EFFECTS.sound) return null;
  if (instances.has(name)) return instances.get(name)!;

  const { Howl } = await getHowler();
  const howl = new Howl({ src: [SOURCES[name]], volume: 0.25, preload: true });
  instances.set(name, howl);
  return howl;
}

/** Plays a single key-tap sound; call once per character as text types/is typed. Throttled so rapid keystrokes don't pile up overlapping playback. */
export async function playTick() {
  if (!EFFECTS.sound || isMuted()) return;
  const now = performance.now();
  if (now - lastTickAt < TICK_THROTTLE_MS) return;
  lastTickAt = now;
  const sound = await getSound("tick");
  sound?.play();
}

export async function playClick() {
  if (!EFFECTS.sound || isMuted()) return;
  const sound = await getSound("click");
  sound?.play();
}
