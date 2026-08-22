import { useEffect, useRef, useState, type RefObject } from 'react';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const INTERACTIVE = 'a, button, [role="button"], input, textarea, label, summary';

type IntroCursorProps = {
  rootRef: RefObject<HTMLDivElement | null>;
};

/**
 * Quill feather over the diary page; inked tip on the start button.
 * Fine pointers only — phones keep the native cursor.
 */
function IntroCursor({ rootRef }: IntroCursorProps) {
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

    root.classList.add('intro-fine-pointer');

    const onMove = (event: PointerEvent) => {
      cursor.style.opacity = '1';
      cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;

      const overUi =
        event.target instanceof Element &&
        Boolean(event.target.closest(INTERACTIVE));
      cursor.dataset.mode = overUi ? 'ink' : 'feather';
    };

    const onLeave = () => {
      cursor.style.opacity = '0';
    };

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    return () => {
      root.classList.remove('intro-fine-pointer');
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, rootRef]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      className="intro-cursor"
      data-mode="feather"
      aria-hidden="true"
    >
      {/* Soft quill — tip near the hotspot */}
      <svg
        className="intro-cursor-feather"
        viewBox="0 0 36 36"
        width="36"
        height="36"
      >
        <path
          d="M4 32 C 8 28, 10 22, 14 16 C 18 10, 24 5, 31 3 C 28 10, 24 16, 18 22 C 12 28, 8 30, 4 32 Z"
          fill="rgba(250, 246, 238, 0.92)"
          stroke="#2b241c"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M8 28 C 14 22, 20 14, 28 7"
          fill="none"
          stroke="#2b241c"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M5 31 L2.5 33.5"
          stroke="#2b241c"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Same quill with a wet ink tip when hovering UI */}
      <svg
        className="intro-cursor-ink"
        viewBox="0 0 36 36"
        width="36"
        height="36"
      >
        <path
          d="M4 32 C 8 28, 10 22, 14 16 C 18 10, 24 5, 31 3 C 28 10, 24 16, 18 22 C 12 28, 8 30, 4 32 Z"
          fill="rgba(250, 246, 238, 0.92)"
          stroke="#2b241c"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M8 28 C 14 22, 20 14, 28 7"
          fill="none"
          stroke="#2b241c"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle cx="3.2" cy="32.8" r="2.4" fill="#2b241c" />
        <circle cx="3.2" cy="32.8" r="1.1" fill="#3a5f8a" opacity="0.85" />
      </svg>
    </div>
  );
}

export default IntroCursor;
