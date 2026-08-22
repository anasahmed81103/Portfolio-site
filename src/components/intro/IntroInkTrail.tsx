import { useEffect, useRef, type RefObject } from 'react';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, label, summary';
const INK = 'rgba(43, 36, 28, 0.55)';
const LIFE_MS = 1600;

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
 * Optional scribble layer on the diary (HTML canvas, not Three.js).
 *
 * Pointer-down/move records line segments; requestAnimationFrame redraws
 * them with fading opacity (LIFE_MS). Interactive elements (buttons) are
 * ignored so you can still click START JOURNEY.
 */
function IntroInkTrail({ rootRef, active = true }: IntroInkTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
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

    const pointFromEvent = (event: PointerEvent): Point => {
      const rect = root.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const isUi = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(INTERACTIVE));

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || isUi(event.target)) return;
      drawingRef.current = true;
      lastRef.current = pointFromEvent(event);
    };

    const onMove = (event: PointerEvent) => {
      if (!drawingRef.current || !lastRef.current) return;
      if (isUi(event.target)) return;

      const next = pointFromEvent(event);
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

    const onUp = () => {
      drawingRef.current = false;
      lastRef.current = null;
    };

    const tick = (now: number) => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      // Fully clear — never paint paper over the diary underneath.
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

    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      cancelAnimationFrame(rafRef.current);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      drawingRef.current = false;
      lastRef.current = null;
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
