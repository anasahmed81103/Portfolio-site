import { SOUNDS, type SoundId } from './sounds';

const DEFAULT_FADE_IN = 0.2;
const DEFAULT_FADE_OUT = 0.6;
/** Transition one-shots (reveal / rocket / flip accents) — hard cap. */
const TRANSITION_MAX_SEC = 5;

type FadeHandle = {
  cancel: () => void;
};

const loops = new Map<string, HTMLAudioElement>();
const loopFades = new Map<string, FadeHandle>();
const playedOnce = new Set<string>();
const preloaded = new Map<SoundId, HTMLAudioElement>();

let unlocked = false;
const pending: Array<() => void> = [];

function tryUnlock() {
  if (unlocked) return;
  unlocked = true;
  const queued = pending.splice(0);
  for (const run of queued) run();
}

function whenUnlocked(run: () => void) {
  if (unlocked) {
    run();
    return;
  }
  pending.push(run);
}

/** Warm the audio element cache so cues start without a load hitch. */
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

/** Call once from the app shell so the first gesture unlocks autoplay. */
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
 * One-shot cue with fade in/out, capped at ~3s for transition sounds.
 * Tries immediately; if the browser blocks autoplay, retries on first gesture.
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
    /** Playback speed — use slight shifts so layered cues feel distinct. */
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
                /* give up silently */
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

/** Stage reveals that should not double-fire on React Strict Mode remounts. */
export function playTransitionOnce(
  onceKey: string,
  id: SoundId,
  options?: Parameters<typeof playTransition>[1],
) {
  if (playedOnce.has(onceKey)) return;
  playedOnce.add(onceKey);
  playTransition(id, options);
}

/** Start (or keep) a named looping bed with fade-in. */
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

/** Fade out and release a looping bed. */
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
 * Instant (or soft) volume change on an active loop — used to ride
 * dive progress without restarting the bed.
 */
export function setLoopVolume(key: string, volume: number) {
  const audio = loops.get(key);
  if (!audio || audio.paused) return;
  cancelFade(loopFades.get(key));
  loopFades.delete(key);
  audio.volume = Math.max(0, Math.min(1, volume));
}

/** Convenience: stop every active loop (e.g. Restart Journey). */
export function stopAllLoops(options?: { fadeOut?: number }) {
  for (const key of [...loops.keys()]) {
    stopLoop(key, options);
  }
}

/** Full reset when returning to Intro — loops off, reveals can play again. */
export function resetAudioSession(options?: { fadeOut?: number }) {
  stopAllLoops(options);
  playedOnce.clear();
}
