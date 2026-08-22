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
  heroSpinElapsedRef,
} from './earth-dive/earthDivePhases';
import { planetYawDriveRef } from '../hooks/planetYawDrive';

/** Slower scrub while closing in from space — soft, cinematic approach. */
const APPROACH_WHEEL_SCALE = 0.00028;

/** Dive / flash scrub (after hero lock timer). */
const DIVE_WHEEL_SCALE = 0.00055;

/** Wheel burst while waiting in the hero spin window. */
const SPIN_WHEEL_BURST_SCALE = 2.4;

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
 * Single Canvas for Space and Earth Dive.
 * Stage changes only flip in-scene systems — no WebGL remount / black flash.
 */
function OrbitalExperience({
  stage,
  onProgressToDive,
  onBookHandoff,
}: OrbitalExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const lockedRef = useRef(false);
  const [exiting, setExiting] = useState(false);

  const isDive = stage === ExperienceStage.EarthDive;
  // Capture mount-time stage once — Space→Dive must not remount the vision veil.
  const [skipVisionReveal] = useState(isDive);

  const handleProgress = useCallback(() => {
    if (lockedRef.current || !onProgressToDive || isDive) return;
    lockedRef.current = true;
    setExiting(true);

    // HUD only — 3D view stays live; stage flip happens in the same Canvas.
    window.setTimeout(() => onProgressToDive(), 850);
  }, [onProgressToDive, isDive]);

  // Space entrance veil — only when starting in Space, not on dive-first mount.
  useLayoutEffect(() => {
    if (skipVisionReveal) return;

    // Fallback when jumping straight to Space (intro handoff already played this).
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
  }, [skipVisionReveal]);

  // Space wheel — inactive once dive takes over.
  useEffect(() => {
    if (isDive) return;

    const root = containerRef.current;
    if (!root) return;

    const onWheel = (event: WheelEvent) => {
      if (lockedRef.current) return;
      const burst = Math.min(0.32, Math.abs(event.deltaY) / 280);
      const signedBurst = event.deltaY < 0 ? -burst : burst;
      scrollTargetRef.current = Math.max(
        -1,
        Math.min(1, scrollTargetRef.current + signedBurst),
      );
    };

    root.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      root.removeEventListener('wheel', onWheel);
    };
  }, [isDive]);

  // Dive wheel + cleanup when leaving the orbital shell entirely.
  useEffect(() => {
    if (!isDive) return;

    const root = containerRef.current;
    if (!root) return;

    const onWheel = (event: WheelEvent) => {
      const target = diveTargetRef.current;
      const atHero = target >= APPROACH_END - 0.0001;
      const gateOpen = earthSpinGateOpenRef.current;

      if (!atHero) {
        diveTargetRef.current = Math.min(
          APPROACH_END,
          Math.max(0, target + event.deltaY * APPROACH_WHEEL_SCALE),
        );
        const weight = accelerationHandoffWeight(diveProgressRef.current);
        if (weight > 0.001) {
          const burst =
            Math.min(0.32, Math.abs(event.deltaY) / 280) * weight;
          scrollTargetRef.current = Math.min(
            1,
            scrollTargetRef.current + burst,
          );
        }
        return;
      }

      if (!gateOpen) {
        diveTargetRef.current = APPROACH_END;
        if (event.deltaY < 0) {
          diveTargetRef.current = Math.min(
            APPROACH_END,
            Math.max(0, target + event.deltaY * APPROACH_WHEEL_SCALE),
          );
          return;
        }
        feedSpaceAcceleration(event.deltaY, SPIN_WHEEL_BURST_SCALE);
        return;
      }

      feedSpaceAcceleration(event.deltaY, 1);
      diveTargetRef.current = Math.min(
        1,
        Math.max(APPROACH_END, target + event.deltaY * DIVE_WHEEL_SCALE),
      );
    };

    root.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      root.removeEventListener('wheel', onWheel);
      diveTargetRef.current = 0;
      diveProgressRef.current = 0;
      heroSpinElapsedRef.current = 0;
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
        camera={{ position: [0, 0, 12.5], fov: 38, near: 0.1, far: 400 }}
      >
        <color attach="background" args={['#000000']} />
        <OrbitalScene
          mode={isDive ? 'dive' : 'space'}
          skipVisionReveal={skipVisionReveal}
          onBookHandoff={onBookHandoff}
        />
      </Canvas>

      {!skipVisionReveal ? (
        <div ref={veilRef} className="space-vision-veil" aria-hidden="true">
          <div className="space-vision-veil-core" />
          <div className="space-vision-veil-soft" />
        </div>
      ) : null}

      <SpaceScrollHint
        label={isDive ? 'scroll down' : 'scroll'}
        showArrow={isDive}
      />
      {isDive ? <EarthSpinHint /> : null}
      {!isDive && onProgressToDive ? (
        <SpaceProgressButton onProgress={handleProgress} exiting={exiting} />
      ) : null}
      <SpaceCursor rootRef={containerRef} />
    </div>
  );
}

export default OrbitalExperience;
