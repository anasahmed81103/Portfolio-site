import { useEffect, useRef, type RefObject } from 'react';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, label, summary';
const INK = 'rgba(43, 36, 28, 0.55)';
const LIFE_MS = 1600;
/** iOS/Android fire a fake mouse click after every tap. Ignore it. */
const GHOST_MOUSE_MS = 2000;

type Point = { x: number; y: number };

type StrokeSegment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  born: number;
};

type IntroInkTrailProps = {
  rootRef: RefObject<HTMLDivElement | null>;
  /** Pause while handing off to Space */
  active?: boolean;
};

/**
 * Diary scribble (HTML canvas). The canvas never receives hits — listeners
 * live on the intro root so a phone tap cannot capture the page.
 *
 * Fingers use TouchEvents. Mouse is desktop-only. Compatibility mouse
 * events after a tap are ignored (they are what “stuck” the live site).
 */
function IntroInkTrail({ rootRef, active = true }: IntroInkTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const touchIdRef = useRef<number | null>(null);
  const lastTouchAtRef = useRef(0);
  const lastRef = useRef<Point | null>(null);
  const segmentsRef = useRef<StrokeSegment[]>([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth: w, clientHeight: h } = root;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [rootRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root || !active) {
      drawingRef.current = false;
      pointerIdRef.current = null;
      touchIdRef.current = null;
      lastRef.current = null;
      segmentsRef.current = [];
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pointFromClient = (clientX: number, clientY: number): Point => {
      const rect = root.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const isUi = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(INTERACTIVE));

    const endStroke = () => {
      drawingRef.current = false;
      pointerIdRef.current = null;
      touchIdRef.current = null;
      lastRef.current = null;
    };

    const startAt = (clientX: number, clientY: number) => {
      drawingRef.current = true;
      lastRef.current = pointFromClient(clientX, clientY);
    };

    const moveTo = (clientX: number, clientY: number) => {
      if (!drawingRef.current || !lastRef.current) return;
      const next = pointFromClient(clientX, clientY);
      const prev = lastRef.current;
      const dx = next.x - prev.x;
      const dy = next.y - prev.y;
      if (dx * dx + dy * dy < 1.5) return;

      segmentsRef.current.push({
        x1: prev.x,
        y1: prev.y,
        x2: next.x,
        y2: next.y,
        width: 1.6 + Math.min(2.2, Math.hypot(dx, dy) * 0.08),
        born: performance.now(),
      });
      lastRef.current = next;
    };

    const isGhostMouse = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return false;
      if (performance.now() - lastTouchAtRef.current < GHOST_MOUSE_MS) {
        return true;
      }
      return navigator.maxTouchPoints > 0 && event.pointerType === 'mouse';
    };

    const onTouchStart = (event: TouchEvent) => {
      lastTouchAtRef.current = performance.now();
      if (isUi(event.target)) return;
      if (touchIdRef.current !== null) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      touchIdRef.current = touch.identifier;
      startAt(touch.clientX, touch.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchIdRef.current === null) return;
      for (const touch of Array.from(event.changedTouches)) {
        if (touch.identifier === touchIdRef.current) {
          moveTo(touch.clientX, touch.clientY);
          return;
        }
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      lastTouchAtRef.current = performance.now();
      if (touchIdRef.current === null) {
        endStroke();
        return;
      }
      for (const touch of Array.from(event.changedTouches)) {
        if (touch.identifier === touchIdRef.current) {
          endStroke();
          return;
        }
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || event.pointerType === 'pen') {
        lastTouchAtRef.current = performance.now();
        return;
      }
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      if (isGhostMouse(event)) return;
      if (isUi(event.target)) return;
      pointerIdRef.current = event.pointerId;
      startAt(event.clientX, event.clientY);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      if (isGhostMouse(event)) {
        endStroke();
        return;
      }
      if (!drawingRef.current || event.pointerId !== pointerIdRef.current) {
        return;
      }
      if (event.buttons === 0) {
        endStroke();
        return;
      }
      moveTo(event.clientX, event.clientY);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      if (pointerIdRef.current !== null && event.pointerId !== pointerIdRef.current) {
        return;
      }
      endStroke();
    };

    const tick = (now: number) => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const live: StrokeSegment[] = [];
      for (const segment of segmentsRef.current) {
        const age = now - segment.born;
        if (age >= LIFE_MS) continue;
        live.push(segment);
        const opacity = (1 - age / LIFE_MS) * 0.55;
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = INK;
        ctx.lineWidth = segment.width;
        ctx.beginPath();
        ctx.moveTo(segment.x1, segment.y1);
        ctx.lineTo(segment.x2, segment.y2);
        ctx.stroke();
      }
      segmentsRef.current = live;
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    root.addEventListener('touchstart', onTouchStart, { passive: true });
    root.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    root.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('blur', endStroke);

    return () => {
      cancelAnimationFrame(rafRef.current);
      root.removeEventListener('touchstart', onTouchStart);
      root.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      root.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('blur', endStroke);
      endStroke();
      segmentsRef.current = [];
      ctx.clearRect(0, 0, root.clientWidth, root.clientHeight);
    };
  }, [rootRef, active]);

  return (
    <canvas
      ref={canvasRef}
      className="intro-ink-trail"
      aria-hidden="true"
    />
  );
}

export default IntroInkTrail;
