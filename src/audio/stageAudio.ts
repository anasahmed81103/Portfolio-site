/**
 * Site-wide audio helper (plain HTMLAudioElement — no extra library).
 *
 * Browsers block sound until a real gesture (click / key). pointermove does NOT
 * count — that was why intro-reveal worked after Restart Journey (a click) but
 * not on first load/refresh.
 */
import { SOUNDS, type SoundId } from './sounds';

const DEFAULT_FADE_IN = 0.2;
const DEFAULT_FADE_OUT = 0.6;
/** Hard cap so a long MP3 does not keep playing after the visual transition. */
const TRANSITION_MAX_SEC = 5;

type FadeHandle = {
  cancel: () => void;
};

type TransitionOptions = {
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
  maxDuration?: number;
  /** Seconds to wait before starting playback. */
  delay?: number;
  /** Slight rate shifts help layered cues feel distinct. */
  playbackRate?: number;
  /** Called after play() actually starts (not when merely scheduled). */
  onStarted?: () => void;
};

const loops = new Map<string, HTMLAudioElement>();
const loopFades = new Map<string, FadeHandle>();
/** Successfully started one-shots (cleared on restart). */
const playedOnce = new Set<string>();
/** Prevents Strict Mode from scheduling the same once-key twice. */
const scheduledOnce = new Set<string>();
const preloaded = new Map<SoundId, HTMLAudioElement>();

let unlocked = false;
/** Retries waiting for a real click/key unlock. */
const pending: Array<() => void> = [];

function flushPending() {
  const queued = pending.splice(0);
  for (const run of queued) run();
}

/**
 * Play a silent buffer inside the user-gesture call stack so the browser
 * grants sticky autoplay for later cues (including delayed intro-reveal).
 */
async function primeAudioFromGesture(): Promise<void> {
  try {
    const prime = cloneSound('introReveal');
    prime.volume = 0;
    prime.muted = true;
    await startPlayback(prime);
    prime.pause();
    prime.muted = false;
    prime.removeAttribute('src');
    prime.load();
  } catch {
    /* Still blocked — pending cues wait for a later gesture. */
  }
}

function queueUntilUnlocked(run: () => void) {
  pending.push(run);
  if (unlocked) {
    // Already gestured earlier this session — flush on next microtask so
    // callers can finish setting up audio elements first.
    queueMicrotask(flushPending);
  }
}

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

/** Install click/key unlock — call once from App. */
export function installAudioUnlock() {
  if (typeof window === 'undefined') return;
  preloadSounds();

  const onGesture = () => {
    void primeAudioFromGesture().then(() => {
      unlocked = true;
      flushPending();
    });
  };

  // pointerdown / keydown grant sticky activation. pointermove does not.
  window.addEventListener('pointerdown', onGesture, { capture: true });
  window.addEventListener('keydown', onGesture, { capture: true });
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
 * Play a short cue once: fade in, hold, fade out, then detach the src.
 * If autoplay is blocked, queues a fresh retry for the next click/key.
 */
export function playTransition(id: SoundId, options?: TransitionOptions) {
  const volume = options?.volume ?? 0.7;
  const fadeIn = options?.fadeIn ?? DEFAULT_FADE_IN;
  const fadeOut = options?.fadeOut ?? DEFAULT_FADE_OUT;
  const maxDuration = options?.maxDuration ?? TRANSITION_MAX_SEC;
  const delayMs = Math.max(0, (options?.delay ?? 0) * 1000);
  const playbackRate = options?.playbackRate ?? 1;
  const onStarted = options?.onStarted;

  const run = () => {
    const audio = cloneSound(id);
    audio.loop = false;
    audio.currentTime = 0;
    audio.playbackRate = playbackRate;
    audio.volume = 0;

    const beginFades = () => {
      onStarted?.();
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

    void startPlayback(audio)
      .then(beginFades)
      .catch(() => {
        // Need a real gesture — retry with a brand-new element after unlock.
        queueUntilUnlocked(run);
      });
  };

  if (delayMs > 0) {
    window.setTimeout(run, delayMs);
  } else {
    run();
  }
}

/**
 * Session-unique cue. Marks “played” only after audio actually starts, so a
 * blocked first-load attempt can still succeed on the first click.
 */
export function playTransitionOnce(
  onceKey: string,
  id: SoundId,
  options?: TransitionOptions,
) {
  if (playedOnce.has(onceKey) || scheduledOnce.has(onceKey)) return;
  scheduledOnce.add(onceKey);

  playTransition(id, {
    ...options,
    onStarted: () => {
      playedOnce.add(onceKey);
      options?.onStarted?.();
    },
  });
}

/** Start (or keep) a looping bed. */
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
        queueUntilUnlocked(ensure);
      });
  };

  ensure();
}

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

export function resetAudioSession(options?: { fadeOut?: number }) {
  stopAllLoops(options);
  playedOnce.clear();
  scheduledOnce.clear();
}
