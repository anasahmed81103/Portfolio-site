import { useEffect, useRef, useState, type RefObject } from 'react';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';

type NewspaperCursorProps = {
  rootRef: RefObject<HTMLDivElement | null>;
};

/**
 * Magnifying glass over the chronicle — one style throughout.
 * Fine pointers only — phones keep the native cursor.
 */
function NewspaperCursor({ rootRef }: NewspaperCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(FINE_POINTER);
    const sync = () => setEnabled(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const cursor = cursorRef.current;
    if (!enabled || !root || !cursor) return;

    root.classList.add('np-fine-pointer');

    const onMove = (event: PointerEvent) => {
      cursor.style.opacity = '1';
      cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    };

    const onLeave = () => {
      cursor.style.opacity = '0';
    };

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    return () => {
      root.classList.remove('np-fine-pointer');
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, rootRef]);

  if (!enabled) return null;

  return (
    <div ref={cursorRef} className="np-cursor" aria-hidden="true">
      <svg
        className="np-cursor-lens"
        viewBox="0 0 32 32"
        width="32"
        height="32"
      >
        <circle cx="11" cy="11" r="8" fill="rgba(255, 252, 245, 0.32)" />
        <circle
          cx="11"
          cy="11"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <line
          x1="17"
          y1="17"
          x2="28"
          y2="28"
          stroke="currentColor"
          strokeWidth="3.1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default NewspaperCursor;
