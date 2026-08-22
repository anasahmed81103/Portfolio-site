import { useEffect, useRef, useState, type RefObject } from 'react';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const INTERACTIVE = 'a, button, [role="button"], input, textarea, label, summary';

type SpaceCursorProps = {
  rootRef: RefObject<HTMLDivElement | null>;
};

/**
 * Custom cursor for Space / Earth Dive (moon in empty space, star on buttons).
 * `matchMedia('(hover: hover) and (pointer: fine)')` skips phones / trackpads
 * that are not precise — those keep the OS cursor.
 * The CSS class `space-fine-pointer` hides the native cursor (app.css).
 */
function SpaceCursor({ rootRef }: SpaceCursorProps) {
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

    root.classList.add('space-fine-pointer');

    const onMove = (event: PointerEvent) => {
      cursor.style.opacity = '1';
      cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;

      const overUi =
        event.target instanceof Element &&
        Boolean(event.target.closest(INTERACTIVE));
      cursor.dataset.mode = overUi ? 'star' : 'moon';
    };

    const onLeave = () => {
      cursor.style.opacity = '0';
    };

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    return () => {
      root.classList.remove('space-fine-pointer');
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, rootRef]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      className="space-cursor"
      data-mode="moon"
      aria-hidden="true"
    >
      <svg
        className="space-cursor-moon"
        viewBox="0 0 32 32"
        width="30"
        height="30"
      >
        <defs>
          <mask id="space-moon-mask">
            <rect width="32" height="32" fill="white" />
            <circle cx="20" cy="12" r="10" fill="black" />
          </mask>
        </defs>
        <circle
          cx="14"
          cy="16"
          r="11"
          fill="#f4efe2"
          mask="url(#space-moon-mask)"
        />
        <circle
          cx="14"
          cy="16"
          r="11"
          fill="none"
          stroke="rgba(244, 239, 226, 0.55)"
          strokeWidth="1.2"
          mask="url(#space-moon-mask)"
        />
        <circle cx="10" cy="13" r="1.2" fill="rgba(40, 50, 70, 0.35)" />
        <circle cx="12.5" cy="19" r="0.9" fill="rgba(40, 50, 70, 0.28)" />
      </svg>

      <svg
        className="space-cursor-star"
        viewBox="0 0 32 32"
        width="28"
        height="28"
      >
        <path
          d="M16 3 L18.2 12.2 L28 14 L18.2 15.8 L16 25 L13.8 15.8 L4 14 L13.8 12.2 Z"
          fill="#fff6d8"
        />
        <path
          d="M16 8 L16.9 13.1 L22 14 L16.9 14.9 L16 20 L15.1 14.9 L10 14 L15.1 13.1 Z"
          fill="#ffffff"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

export default SpaceCursor;
