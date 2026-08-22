/**
 * Site-wide audio helper (plain HTMLAudioElement — no extra library).
 *
 * Why this file exists:
 * 1. Browsers refuse to play sound until the user has gestured (click, key, move).
 * 2. We need short “one-shot” cues (page flip, rocket) AND looping beds (space).
 * 3. React Strict Mode remounts effects twice in dev — we must not double-play reveals.
 *
 * Mental model:
 * - playTransition()  → play once, fade in, fade out, then dispose
 * - playTransitionOnce() → same, but remember a string key so it cannot fire twice
 * - playLoop() / stopLoop() → named looping beds (key = 'space')
 * - setLoopVolume() → change volume of a running loop without restarting it
 * - resetAudioSession() → Restart Journey: stop loops + allow reveals again
 */
import { SOUNDS, type SoundId } from './sounds';

const DEFAULT_FADE_IN = 0.2;
const DEFAULT_FADE_OUT = 0.6;
/** Hard cap so a long MP3 does not keep playing after the visual transition. */
const TRANSITION_MAX_SEC = 5;

/** Handle returned by fadeVolume so a newer fade can cancel an older one. */
type FadeHandle = {
  cancel: () => void;
};

/** Active looping beds, keyed by a name we choose (usually 'space'). */
const loops = new Map<string, HTMLAudioElement>();
/** In-flight volume fades for those loops. */
const loopFades = new Map<string, FadeHandle>();
/** Keys already used by playTransitionOnce (cleared on restart). */
const playedOnce = new Set<string>();
/** Cached Audio elements so the first play does not wait on disk/network. */
const preloaded = new Map<SoundId, HTMLAudioElement>();

let unlocked = false;
/** Play attempts that arrived before the first user gesture. */
const pending: Array<() => void> = [];

function tryUnlock() {
  if (unlocked) return;
  unlocked = true;
  const queued = pending.splice(0);
  for (const run of queued) run();
}

/** Run now if unlocked; otherwise wait for the first gesture. */
function whenUnlocked(run: () => void) {
  if (unlocked) {
    run();
    return;
  }
  pending.push(run);
}

/** Create Audio() objects and call load() so cues start instantly later. */
export function preloadSounds() {
  if (typeof window === 'undefined') return;
  for (const id of Object.keys(SOUNDS) as SoundId[]) {
    if (preloaded.has(id)) continue;
    const audio = new Audio(SOUNDS[id]);
    audio.preload = 'auto';
    audio.load();
    preloaded.set(id, audio);
  }
}

/** One-time listeners on the window. Safe to call from App on mount. */
export function installAudioUnlock() {
  if (typeof window === 'undefined') return;
  preloadSounds();

  const unlock = () => tryUnlock();
  window.addEventListener('pointerdown', unlock, { capture: true });
  window.addEventListener('keydown', unlock, { capture: true });
  window.addEventListener('pointermove', unlock, { once: true, capture: true });
}

function cancelFade(handle: FadeHandle | undefined) {
  handle?.cancel();
}

/**
 * Animate audio.volume from current → `to` over `durationSec` seconds.
 *
 * Uses requestAnimationFrame (the browser’s paint loop), not GSAP, so audio
 * stays independent of visual timelines.
 *
 * The curve `t * t * (3 - 2 * t)` is a smoothstep ease — slow at the ends,
 * faster in the middle. That sounds more natural than a linear fade.
 */
function fadeVolume(
  audio: HTMLAudioElement,
  to: number,
  durationSec: number,
  onDone?: () => void,
): FadeHandle {
  const from = audio.volume;
  const start = performance.now();
  const durationMs = Math.max(16, durationSec * 1000);
  let raf = 0;
  let cancelled = false;

  const step = (now: number) => {
    if (cancelled) return;
    const t = Math.min(1, (now - start) / durationMs);
    const eased = t * t * (3 - 2 * t);
    audio.volume = from + (to - from) * eased;
    if (t < 1) {
      raf = requestAnimationFrame(step);
    } else {
      onDone?.();
    }
  };

  raf = requestAnimationFrame(step);
  return {
    cancel: () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    },
  };
}

/**
 * Fresh Audio element for this play.
 * We clone the preloaded node so two cues can overlap (rocket + space reveal).
 */
function cloneSound(id: SoundId): HTMLAudioElement {
  const cached = preloaded.get(id);
  if (cached) {
    const copy = cached.cloneNode(true) as HTMLAudioElement;
    copy.preload = 'auto';
    return copy;
  }
  const audio = new Audio(SOUNDS[id]);
  audio.preload = 'auto';
  return audio;
}

function startPlayback(audio: HTMLAudioElement): Promise<void> {
  const result = audio.play();
  if (result) return result;
  return Promise.resolve();
}

/**
 * Play a short cue once: fade in, hold, fade out, then detach the src.
 *
 * If autoplay is blocked, we queue a retry for the next user gesture.
 */
export function playTransition(
  id: SoundId,
  options?: {
    volume?: number;
    fadeIn?: number;
    fadeOut?: number;
    maxDuration?: number;
    /** Seconds to wait before starting playback. */
    delay?: number;
    /** Slight rate shifts help layered cues feel distinct. */
    playbackRate?: number;
  },
) {
  const volume = options?.volume ?? 0.7;
  const fadeIn = options?.fadeIn ?? DEFAULT_FADE_IN;
  const fadeOut = options?.fadeOut ?? DEFAULT_FADE_OUT;
  const maxDuration = options?.maxDuration ?? TRANSITION_MAX_SEC;
  const delayMs = Math.max(0, (options?.delay ?? 0) * 1000);
  const playbackRate = options?.playbackRate ?? 1;

  const run = () => {
    const audio = cloneSound(id);
    audio.loop = false;
    audio.currentTime = 0;
    audio.playbackRate = playbackRate;
    audio.volume = 0;

    const beginFades = () => {
      if (fadeIn <= 0.001) {
        audio.volume = volume;
      } else {
        fadeVolume(audio, volume, fadeIn);
      }
      // Start fading out so the fade finishes around maxDuration.
      const fadeOutAt =
        Math.max(fadeIn + 0.05, maxDuration - fadeOut) * 1000;
      window.setTimeout(() => {
        fadeVolume(audio, 0, fadeOut, () => {
          audio.pause();
          audio.removeAttribute('src');
          audio.load();
        });
      }, fadeOutAt);
    };

    const attempt = () => {
      void startPlayback(audio)
        .then(beginFades)
        .catch(() => {
          whenUnlocked(() => {
            audio.currentTime = 0;
            audio.volume = 0;
            audio.playbackRate = playbackRate;
            void startPlayback(audio)
              .then(beginFades)
              .catch(() => {
                /* Browser still blocked audio — fail quietly. */
              });
          });
        });
    };

    attempt();
  };

  if (delayMs > 0) {
    window.setTimeout(run, delayMs);
  } else {
    run();
  }
}

/**
 * Like playTransition, but `onceKey` is remembered for the whole session
 * (until resetAudioSession). Prevents double-fires from Strict Mode remounts.
 */
export function playTransitionOnce(
  onceKey: string,
  id: SoundId,
  options?: Parameters<typeof playTransition>[1],
) {
  if (playedOnce.has(onceKey)) return;
  playedOnce.add(onceKey);
  playTransition(id, options);
}

/**
 * Start (or keep) a looping bed.
 * If that key is already playing, we only retarget the volume — no restart click.
 */
export function playLoop(
  key: string,
  id: SoundId,
  options?: { volume?: number; fadeIn?: number },
) {
  const volume = options?.volume ?? 0.45;
  const fadeIn = options?.fadeIn ?? 0.65;

  const ensure = () => {
    let audio = loops.get(key);
    if (audio && !audio.paused) {
      cancelFade(loopFades.get(key));
      const handle = fadeVolume(audio, volume, Math.min(0.35, fadeIn));
      loopFades.set(key, handle);
      return;
    }

    audio = cloneSound(id);
    audio.loop = true;
    audio.volume = 0;
    loops.set(key, audio);

    void startPlayback(audio)
      .then(() => {
        cancelFade(loopFades.get(key));
        const handle = fadeVolume(audio!, volume, fadeIn);
        loopFades.set(key, handle);
      })
      .catch(() => {
        whenUnlocked(() => {
          void startPlayback(audio!).then(() => {
            cancelFade(loopFades.get(key));
            const handle = fadeVolume(audio!, volume, fadeIn);
            loopFades.set(key, handle);
          });
        });
      });
  };

  ensure();
}

/** Fade a loop to silence and drop it from the maps. */
export function stopLoop(
  key: string,
  options?: { fadeOut?: number },
) {
  const fadeOut = options?.fadeOut ?? 0.85;
  const audio = loops.get(key);
  if (!audio) return;

  cancelFade(loopFades.get(key));
  const handle = fadeVolume(audio, 0, fadeOut, () => {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    loops.delete(key);
    loopFades.delete(key);
  });
  loopFades.set(key, handle);
}

/**
 * Instant volume write on a running loop.
 * Earth Dive uses this every frame so the space bed swells as you near Earth.
 */
export function setLoopVolume(key: string, volume: number) {
  const audio = loops.get(key);
  if (!audio || audio.paused) return;
  cancelFade(loopFades.get(key));
  loopFades.delete(key);
  audio.volume = Math.max(0, Math.min(1, volume));
}

export function stopAllLoops(options?: { fadeOut?: number }) {
  for (const key of [...loops.keys()]) {
    stopLoop(key, options);
  }
}

/** Restart Journey: silence beds and allow intro/space/notebook reveals again. */
export function resetAudioSession(options?: { fadeOut?: number }) {
  stopAllLoops(options);
  playedOnce.clear();
}
