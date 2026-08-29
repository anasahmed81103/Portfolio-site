/**
 * Session boot preload — fetch every heavy file before Intro/audio start.
 *
 * Why this exists: Space and the newspaper used to mount first, then
 * `useTexture` / `<img>` / MP3s raced the network. On a slow connection the
 * intro-reveal (or space bed) could play while Earth was still a blank sphere
 * and photos popped in later.
 *
 * Strategy:
 * 1. Decode newspaper JPEGs into the browser image cache (`<img>` will hit it).
 * 2. Load Earth maps with THREE.TextureLoader + `useTexture.preload` so React
 *    Three Fiber’s Suspense cache is warm when the Canvas mounts.
 * 3. Buffer every MP3 until `canplaythrough` (the old `audio.load()` did not wait).
 * 4. Wait for the handwritten / newspaper fonts so the first paint is not fallback.
 *
 * Failures time out instead of blocking the site forever.
 */
import { useTexture } from '@react-three/drei';
import { Cache, TextureLoader } from 'three';
import { SOUNDS } from '../audio/sounds';
import { preloadSounds, waitForSoundBuffered } from '../audio/stageAudio';
import { notebookPhotos } from '../components/notebook/notebookPhotos';

export const EARTH_TEXTURES = {
  day: '/textures/earth/earth-day.jpg',
  night: '/textures/earth/earth-night.jpg',
  clouds: '/textures/earth/earth-clouds.jpg',
  milkyWay: '/textures/earth/milky-way.jpg',
} as const;

const NOTEBOOK_IMAGE_URLS = Object.values(notebookPhotos);
const EARTH_TEXTURE_URLS = Object.values(EARTH_TEXTURES);
const FONT_SPECS = [
  '700 48px Caveat',
  '500 28px Caveat',
  '400 18px "Libre Baskerville"',
  '700 18px "Libre Baskerville"',
  'italic 16px "Libre Baskerville"',
  '400 14px "Share Tech Mono"',
];

const POOL = 4;
const ASSET_TIMEOUT_MS = 25000;
const FONT_TIMEOUT_MS = 8000;

type ProgressListener = (ratio: number) => void;

type AssetTask = {
  weight: number;
  run: () => Promise<void>;
};

let preloadPromise: Promise<void> | null = null;
let lastRatio = 0;
const listeners = new Set<ProgressListener>();

function notify(ratio: number) {
  lastRatio = Math.max(lastRatio, Math.min(1, ratio));
  for (const listener of listeners) listener(lastRatio);
}

function withTimeout(promise: Promise<unknown>, ms: number): Promise<void> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(resolve, ms);
    promise
      .catch(() => undefined)
      .finally(() => {
        window.clearTimeout(timer);
        resolve();
      });
  });
}

async function preloadDomImage(url: string): Promise<void> {
  const image = new Image();
  image.decoding = 'async';
  image.src = url;
  try {
    if (typeof image.decode === 'function') {
      await image.decode();
    } else {
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject();
      });
    }
  } catch {
    /* Broken file — do not trap the visitor on the boot screen. */
  }
}

async function preloadGpuTexture(url: string): Promise<void> {
  Cache.enabled = true;
  try {
    await new TextureLoader().loadAsync(url);
  } catch {
    return;
  }
  // Image is in THREE.Cache now — this fills R3F's Suspense cache without a
  // second network trip.
  useTexture.preload(url);
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

async function preloadFonts(): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;
  await Promise.all(FONT_SPECS.map((spec) => document.fonts.load(spec)));
}

async function runPool(tasks: AssetTask[], onUnit: (weight: number) => void) {
  let cursor = 0;
  const workerCount = Math.min(POOL, tasks.length);
  const workers = Array.from({ length: workerCount }, async () => {
    while (cursor < tasks.length) {
      const task = tasks[cursor];
      cursor += 1;
      if (!task) continue;
      await withTimeout(task.run(), ASSET_TIMEOUT_MS);
      onUnit(task.weight);
    }
  });
  await Promise.all(workers);
}

async function runAll(): Promise<void> {
  Cache.enabled = true;
  preloadSounds();

  const soundIds = Object.keys(SOUNDS) as Array<keyof typeof SOUNDS>;
  const tasks: AssetTask[] = [
    ...EARTH_TEXTURE_URLS.map((url) => ({
      weight: 2,
      run: () => preloadGpuTexture(url),
    })),
    ...soundIds.map((id) => ({
      // The looping space bed is ~6MB — give it more of the bar so it
      // does not look “stuck at 90%” while that one file finishes.
      weight: id === 'space' ? 4 : 1,
      run: () => waitForSoundBuffered(id),
    })),
    ...NOTEBOOK_IMAGE_URLS.map((url) => ({
      weight: 1,
      run: () => preloadDomImage(url),
    })),
    {
      weight: 1,
      run: () => withTimeout(preloadFonts(), FONT_TIMEOUT_MS),
    },
  ];

  const total = tasks.reduce((sum, task) => sum + task.weight, 0);
  let done = 0;
  notify(0);

  await runPool(tasks, (weight) => {
    done += weight;
    notify(done / total);
  });

  notify(1);
}

/**
 * Start (or join) the one-time session preload. Safe to call twice in Strict Mode.
 * `onProgress` receives 0–1 and is removed when this caller’s promise settles.
 */
export function preloadSessionAssets(
  onProgress: ProgressListener,
): Promise<void> {
  onProgress(lastRatio);
  listeners.add(onProgress);

  if (!preloadPromise) {
    preloadPromise = runAll().catch(() => {
      notify(1);
    });
  }

  return preloadPromise.then(
    () => {
      listeners.delete(onProgress);
    },
    () => {
      listeners.delete(onProgress);
    },
  );
}
