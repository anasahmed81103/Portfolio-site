import { useEffect, useState } from 'react';

/**
 * True on phones / most tablets (coarse pointer or no hover).
 * Narrow desktop windows with a mouse stay false so HUD copy stays “scroll”.
 */
const TOUCH_QUERY = '(pointer: coarse), (hover: none)';

export function readTouchLayout(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(TOUCH_QUERY).matches;
}

/** Lower star counts / pixel ratio on small or touch screens. */
export function prefersReducedGpu(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    readTouchLayout() ||
    window.matchMedia('(max-width: 900px)').matches
  );
}

/** Narrow viewport or phone/tablet emulation — used to dock the intro CTA. */
const DOCK_QUERY = '(max-width: 900px), (pointer: coarse), (hover: none)';

export function useIntroDock(): boolean {
  const [dock, setDock] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DOCK_QUERY).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(DOCK_QUERY);
    const sync = () => setDock(media.matches);
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return dock;
}

export function useTouchLayout(): boolean {
  const [touchLayout, setTouchLayout] = useState(readTouchLayout);

  useEffect(() => {
    const media = window.matchMedia(TOUCH_QUERY);
    const sync = () => setTouchLayout(media.matches);
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return touchLayout;
}
