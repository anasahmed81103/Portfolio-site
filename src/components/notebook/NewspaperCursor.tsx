import { useEffect, useRef, useState, type RefObject } from 'react';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const INTERACTIVE = 'a, button, [role="button"], input, textarea, label, summary';

type NewspaperCursorProps = {
  rootRef: RefObject<HTMLDivElement | null>;
};

/**
 * Reading glass over the page; fountain pen on links and buttons.
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

      const overUi =
        event.target instanceof Element &&
        Boolean(event.target.closest(INTERACTIVE));
      cursor.dataset.mode = overUi ? 'write' : 'read';
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
    <div
      ref={cursorRef}
      className="np-cursor"
      data-mode="read"
      aria-hidden="true"
    >
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

      <svg
        className="np-cursor-pen"
        viewBox="0 0 32 32"
        width="32"
        height="32"
      >
        <path
          d="M30 30 L25 30.8 L6 11.8 L10.8 7 Z"
          fill="currentColor"
        />
        <path d="M30 30 L24.5 25.8 L26.2 24.2 L30.8 28.8 Z" fill="#8f3d36" />
        <path d="M10.8 7 L6 11.8 L1.5 1.5 L10.8 7 Z" fill="currentColor" />
      </svg>
    </div>
  );
}

export default NewspaperCursor;
