import {
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ExperienceStage } from '../app/experience';
import OrbitalScene from './space/OrbitalScene';
import SpaceScrollHint from './space-hud/SpaceScrollHint';
import SpaceProgressButton from './space-hud/SpaceProgressButton';
import EarthSpinHint from './space-hud/EarthSpinHint';
import SpaceCursor from './space/SpaceCursor';
import {
  playLoop,
  playTransitionOnce,
  stopLoop,
} from '../audio/stageAudio';
import {
  scrollIntensityRef,
  scrollTargetRef,
} from '../hooks/useScrollAcceleration.ts';
import {
  ACCEL_HANDOFF_END,
  ACCEL_HANDOFF_START,
  diveProgressRef,
  diveTargetRef,
} from '../hooks/useDiveProgress';
import {
  APPROACH_END,
  earthSpinGateOpenRef,
} from './earth-dive/earthDivePhases';
import { planetYawDriveRef } from '../hooks/planetYawDrive';
import { prefersReducedGpu, useTouchLayout } from '../hooks/useTouchLayout';

/** Slower scrub while closing in from space — soft, cinematic approach. */
const APPROACH_WHEEL_SCALE = 0.00028;

/** Dive / flash scrub (after the hero HUD button opens the gate). */
const DIVE_WHEEL_SCALE = 0.00055;

/** Wheel burst while waiting in the hero spin window. */
const SPIN_WHEEL_BURST_SCALE = 2.4;

/** Touch pixels feel smaller than wheel ticks — boost swipe so phones keep pace. */
const TOUCH_DELTA_SCALE = 1.6;

/** Bind vertical swipe to a dedicated plane so HUD buttons keep their taps. */
function bindSwipeSurface(
  surface: HTMLElement,
  onDelta: (deltaY: number) => void,
): () => void {
  let lastY = 0;
  let tracking = false;
  let pointerId: number | null = null;

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') return;
    tracking = true;
    pointerId = event.pointerId;
    lastY = event.clientY;
    surface.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!tracking || event.pointerId !== pointerId) return;
    event.preventDefault();
    onDelta((lastY - event.clientY) * TOUCH_DELTA_SCALE);
    lastY = event.clientY;
  };

  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    tracking = false;
    pointerId = null;
  };

  surface.addEventListener('pointerdown', onPointerDown);
  surface.addEventListener('pointermove', onPointerMove, { passive: false });
  surface.addEventListener('pointerup', onPointerUp);
  surface.addEventListener('pointercancel', onPointerUp);
  return () => {
    surface.removeEventListener('pointerdown', onPointerDown);
    surface.removeEventListener('pointermove', onPointerMove);
    surface.removeEventListener('pointerup', onPointerUp);
    surface.removeEventListener('pointercancel', onPointerUp);
  };
}

function feedSpaceAcceleration(deltaY: number, burstScale = 1) {
  const burst =
    Math.min(0.32, Math.abs(deltaY) / 280) * burstScale;
  scrollTargetRef.current = Math.min(1, scrollTargetRef.current + burst);
}

function accelerationHandoffWeight(progress: number): number {
  if (progress <= ACCEL_HANDOFF_START) return 1;
  if (progress >= ACCEL_HANDOFF_END) return 0;
  const t =
    (progress - ACCEL_HANDOFF_START) /
    (ACCEL_HANDOFF_END - ACCEL_HANDOFF_START);
  return 1 - t * t * (3 - 2 * t);
}

type OrbitalExperienceProps = {
  stage: typeof ExperienceStage.Space | typeof ExperienceStage.EarthDive;
  onProgressToDive?: () => void;
  onBookHandoff?: () => void;
};

/**
 * DOM shell around the shared Space / Earth Dive WebGL Canvas.
 *
 * `<Canvas>` (React Three Fiber) creates a WebGL renderer and a default camera.
 * Everything inside it is a 3D object; HUD hints outside it are normal HTML.
 *
 * Wheel + vertical swipe listeners live here (DOM), not in Three.js:
 * - Space: scroll/swipe pokes scrollTargetRef (planet spin / reverse)
 * - Dive: the same input also advances diveTargetRef (camera path), with
 *   a spin-only hold at the hero shot until the visitor presses progress_forward
 *
 * The dark “vision veil” is a CSS overlay GSAP fades out as space appears.
 */
function OrbitalExperience({
  stage,
  onProgressToDive,
  onBookHandoff,
}: OrbitalExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const lockedRef = useRef(false);
  const [exiting, setExiting] = useState(false);
  const [atHeroShot, setAtHeroShot] = useState(false);
  const [diveAdvancing, setDiveAdvancing] = useState(false);

  const isDive = stage === ExperienceStage.EarthDive;
  const touchLayout = useTouchLayout();
  const canvasDpr = prefersReducedGpu() ? ([1, 1.5] as [number, number]) : undefined;

  const handleProgress = useCallback(() => {
    if (lockedRef.current || !onProgressToDive || isDive) return;
    lockedRef.current = true;
    setExiting(true);

    // HUD only — 3D view stays live; stage flip happens in the same Canvas.
    window.setTimeout(() => onProgressToDive(), 850);
  }, [onProgressToDive, isDive]);

  const handleDiveAdvance = useCallback(() => {
    if (diveAdvancing || earthSpinGateOpenRef.current) return;
    earthSpinGateOpenRef.current = true;
    setDiveAdvancing(true);
  }, [diveAdvancing]);

  // Hero-shot detector — the dive chip arms the moment the camera locks.
  useEffect(() => {
    if (!isDive) {
      setAtHeroShot(false);
      setDiveAdvancing(false);
      return;
    }

    let raf = 0;
    const tick = () => {
      const at = diveProgressRef.current >= APPROACH_END - 0.0001;
      setAtHeroShot((prev) => (prev === at ? prev : at));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isDive]);

  // Space entrance veil — Canvas stays mounted across Space → Dive.
  useLayoutEffect(() => {
    playTransitionOnce('space-reveal', 'spaceReveal', {
      volume: 0.7,
      fadeIn: 0.3,
      fadeOut: 1.8,
      maxDuration: 5,
    });

    const veil = veilRef.current;
    if (!veil) return;

    const core = veil.querySelector<HTMLElement>('.space-vision-veil-core');
    const soft = veil.querySelector<HTMLElement>('.space-vision-veil-soft');

    const ctx = gsap.context(() => {
      gsap.set(veil, { opacity: 1 });
      gsap.set(core, { opacity: 1 });
      gsap.set(soft, { opacity: 1 });

      const tl = gsap.timeline({ defaults: { ease: 'sine.inOut' } });

      tl.to(
        core,
        {
          opacity: 0.55,
          duration: 1.1,
          ease: 'power1.out',
        },
        0.05,
      );

      tl.to(
        soft,
        {
          opacity: 0.75,
          duration: 1.2,
          ease: 'power1.out',
        },
        0.15,
      );

      tl.to({}, { duration: 0.55 });

      tl.to(
        core,
        {
          opacity: 0,
          duration: 2.4,
          ease: 'power1.inOut',
        },
        '>-0.05',
      );

      tl.to(
        soft,
        {
          opacity: 0,
          duration: 2.8,
          ease: 'power1.inOut',
        },
        '<0.25',
      );

      tl.set(veil, { display: 'none' });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Space wheel / swipe — inactive once dive takes over.
  useEffect(() => {
    if (isDive) return;

    const root = containerRef.current;
    if (!root) return;

    const applySpaceDelta = (deltaY: number) => {
      if (lockedRef.current) return;
      const burst = Math.min(0.32, Math.abs(deltaY) / 280);
      const signedBurst = deltaY < 0 ? -burst : burst;
      scrollTargetRef.current = Math.max(
        -1,
        Math.min(1, scrollTargetRef.current + signedBurst),
      );
    };

    const onWheel = (event: WheelEvent) => {
      applySpaceDelta(event.deltaY);
    };

    root.addEventListener('wheel', onWheel, { passive: true });
    const swipe = swipeRef.current;
    const unbindSwipe = swipe ? bindSwipeSurface(swipe, applySpaceDelta) : undefined;
    return () => {
      root.removeEventListener('wheel', onWheel);
      unbindSwipe?.();
    };
  }, [isDive]);

  // Dive wheel + cleanup when leaving the orbital shell entirely.
  useEffect(() => {
    if (!isDive) return;

    const root = containerRef.current;
    if (!root) return;

    const applyDiveDelta = (deltaY: number, fromTouch = false) => {
      const target = diveTargetRef.current;
      const atHero = target >= APPROACH_END - 0.0001;
      const gateOpen = earthSpinGateOpenRef.current;

      if (!atHero) {
        diveTargetRef.current = Math.min(
          APPROACH_END,
          Math.max(0, target + deltaY * APPROACH_WHEEL_SCALE),
        );
        const weight = accelerationHandoffWeight(diveProgressRef.current);
        // Swipe covers the approach faster than a wheel, so the desktop
        // fade-out would kill spin almost immediately. Keep swipe-to-spin.
        const spinWeight = fromTouch ? Math.max(weight, 0.7) : weight;
        if (spinWeight > 0.001) {
          const burst = Math.min(0.32, Math.abs(deltaY) / 280) * spinWeight;
          scrollTargetRef.current = Math.min(
            1,
            scrollTargetRef.current + burst,
          );
        }
        return;
      }

      if (!gateOpen) {
        diveTargetRef.current = APPROACH_END;
        if (deltaY < 0) {
          diveTargetRef.current = Math.min(
            APPROACH_END,
            Math.max(0, target + deltaY * APPROACH_WHEEL_SCALE),
          );
          return;
        }
        feedSpaceAcceleration(deltaY, SPIN_WHEEL_BURST_SCALE);
        return;
      }

      feedSpaceAcceleration(deltaY, 1);
      diveTargetRef.current = Math.min(
        1,
        Math.max(APPROACH_END, target + deltaY * DIVE_WHEEL_SCALE),
      );
    };

    const onWheel = (event: WheelEvent) => {
      applyDiveDelta(event.deltaY);
    };

    root.addEventListener('wheel', onWheel, { passive: true });
    const swipe = swipeRef.current;
    const unbindSwipe = swipe
      ? bindSwipeSurface(swipe, (deltaY) => applyDiveDelta(deltaY, true))
      : undefined;
    return () => {
      root.removeEventListener('wheel', onWheel);
      unbindSwipe?.();
      diveTargetRef.current = 0;
      diveProgressRef.current = 0;
      earthSpinGateOpenRef.current = false;
      planetYawDriveRef.current = null;
      scrollTargetRef.current = 0;
      scrollIntensityRef.current = 0;
    };
  }, [isDive]);

  // Ambient space bed for Space + Earth Dive; fades out when leaving orbital.
  useEffect(() => {
    playLoop('space', 'space', { volume: 0.12, fadeIn: 1.1 });
    return () => {
      stopLoop('space', { fadeOut: 1.2 });
    };
  }, []);

  return (
    <div ref={containerRef} className="space-experience">
      <Canvas
        dpr={canvasDpr}
        camera={{ position: [0, 0, 12.5], fov: 38, near: 0.1, far: 400 }}
      >
        <color attach="background" args={['#000000']} />
        <OrbitalScene
          mode={isDive ? 'dive' : 'space'}
          onBookHandoff={onBookHandoff}
        />
      </Canvas>

      <div ref={veilRef} className="space-vision-veil" aria-hidden="true">
        <div className="space-vision-veil-core" />
        <div className="space-vision-veil-soft" />
      </div>

      <div ref={swipeRef} className="space-swipe-plane" aria-hidden="true" />

      <SpaceScrollHint
        label={
          isDive
            ? atHeroShot && !diveAdvancing
              ? touchLayout
                ? 'swipe'
                : 'scroll'
              : touchLayout
                ? 'swipe down'
                : 'scroll down'
            : touchLayout
              ? 'swipe'
              : 'scroll'
        }
        showArrow={isDive && (!atHeroShot || diveAdvancing)}
      />
      {isDive ? <EarthSpinHint touchCopy={touchLayout} /> : null}
      {!isDive && onProgressToDive ? (
        <SpaceProgressButton
          onProgress={handleProgress}
          exiting={exiting}
          delayMs={0}
        />
      ) : null}
      {isDive ? (
        <SpaceProgressButton
          onProgress={handleDiveAdvance}
          exiting={diveAdvancing}
          delayMs={0}
          armed={atHeroShot && !diveAdvancing}
          ariaLabel="Progress forward to enter Earth"
        />
      ) : null}
      <SpaceCursor rootRef={containerRef} />
    </div>
  );
}

export default OrbitalExperience;
