import { EFFECTS } from "./effects-config";

const MUTE_KEY = "sound-muted";

type SoundName = "tick" | "reel" | "hum";

const SOURCES: Record<SoundName, string> = {
  tick: "/sounds/typewriter-tick.mp3",
  reel: "/sounds/reel-click.mp3",
  hum: "/sounds/crt-hum.mp3",
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
  const howl = new Howl({ src: [SOURCES[name]], volume: name === "hum" ? 0.15 : 0.25, preload: true });
  instances.set(name, howl);
  return howl;
}

/** Call this from a user gesture (keydown/click) to satisfy browser autoplay policies. */
export async function unlockAudio() {
  if (!EFFECTS.sound) return;
  const { Howler } = await getHowler();
  if (Howler.ctx && Howler.ctx.state === "suspended") {
    await Howler.ctx.resume().catch(() => {});
  }
}

export async function playTick() {
  if (!EFFECTS.sound || isMuted()) return;
  const now = performance.now();
  if (now - lastTickAt < TICK_THROTTLE_MS) return;
  lastTickAt = now;
  const sound = await getSound("tick");
  sound?.play();
}

export async function playReelClick() {
  if (!EFFECTS.sound || isMuted()) return;
  const sound = await getSound("reel");
  sound?.play();
}

let humId: number | undefined;

export async function startHum() {
  if (!EFFECTS.sound || isMuted()) return;
  const sound = await getSound("hum");
  if (!sound) return;
  sound.loop(true);
  humId = sound.play();
}

export async function stopHum() {
  const sound = await getSound("hum");
  if (sound && humId !== undefined) {
    sound.stop(humId);
    humId = undefined;
  }
}
