import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Earth from './Earth';
import CloudLayer from './CloudLayer';
import Atmosphere from './Atmosphere';
import MilkyWay from './MilkyWay';
import Starfield from './Starfield';
import ScrollAccelerationTicker from './ScrollAccelerationTicker';
import SpaceVisionReveal from './SpaceVisionReveal';
import {
  EARTH_AXIAL_TILT_X,
  EARTH_AXIAL_TILT_Z,
} from './earthConfig';
import EarthDiveScrollAccelerationTicker from '../earth-dive/EarthDiveScrollAccelerationTicker';
import EarthDiveProgressTicker from '../earth-dive/EarthDiveProgressTicker';
import EarthDiveController from '../earth-dive/EarthDiveController';
import EarthDivePlanetSpin from '../earth-dive/EarthDivePlanetSpin';
import SunHorizonEffect from '../earth-dive/SunHorizonEffect';
import CloudFlight from '../earth-dive/CloudFlight';
import SolarFlash from '../earth-dive/SolarFlash';
import { diveProgressRef } from '../../hooks/useDiveProgress';
import {
  APPROACH_END,
  FLASH_START,
  isBookHandoffReady,
} from '../earth-dive/earthDivePhases';
import {
  playTransitionOnce,
  setLoopVolume,
  stopLoop,
} from '../../audio/stageAudio';

/**
 * Everything that lives *inside* the WebGL Canvas for Space + Earth Dive.
 *
 * `mode` flips extra systems on (camera controller, flash, cloud flight)
 * without unmounting Earth / stars / lights.
 *
 * Several child components return `null` — they only run `useFrame` logic
 * (audio volume, handoff, progress smoothing). That is a common R3F pattern.
 *
 * `Suspense` waits for useTexture() loads (Milky Way, Earth maps) so we do
 * not render a missing-texture flash.
 */
export type OrbitalMode = 'space' | 'dive';

type OrbitalSceneProps = {
  mode: OrbitalMode;
  onBookHandoff?: () => void;
};

const SPACE_VOL = 0.12;
const NEAR_EARTH_VOL = 0.3;
const DIVE_VOL = 0.48;
const FLASH_PEAK_VOL = 0.62;

/** Map dive progress to the space-bed volume (quiet orbit → loud flare). */
function spaceVolumeForProgress(mode: OrbitalMode, progress: number): number {
  if (mode !== 'dive') return SPACE_VOL;

  if (progress <= APPROACH_END) {
    const t = progress / APPROACH_END;
    return SPACE_VOL + t * (NEAR_EARTH_VOL - SPACE_VOL);
  }

  if (progress <= FLASH_START) {
    const t =
      (progress - APPROACH_END) / (FLASH_START - APPROACH_END);
    return NEAR_EARTH_VOL + t * (DIVE_VOL - NEAR_EARTH_VOL);
  }

  const t = (progress - FLASH_START) / (1 - FLASH_START);
  return DIVE_VOL + t * (FLASH_PEAK_VOL - DIVE_VOL);
}

/** Watch the flash; fire onBookHandoff once when the screen is fully white. */
function BookHandoffBridge({ onBookHandoff }: { onBookHandoff?: () => void }) {
  const firedRef = useRef(false);

  useFrame(() => {
    if (firedRef.current || !onBookHandoff) return;
    if (isBookHandoffReady()) {
      firedRef.current = true;
      onBookHandoff();
    }
  });

  return null;
}

/**
 * Space bed rides dive distance: quiet in orbit → louder near Earth →
 * peaks into the flare, then NotebookRevealAudioBridge fades it out.
 */
function SpaceDiveVolumeBridge({ mode }: { mode: OrbitalMode }) {
  const smoothedRef = useRef(SPACE_VOL);
  const stoppedRef = useRef(false);

  useFrame((_, delta) => {
    if (stoppedRef.current) return;

    // Hand off to notebook-reveal fade — stop riding the fader.
    if (
      mode === 'dive' &&
      diveProgressRef.current >= FLASH_START + 0.04
    ) {
      stoppedRef.current = true;
      return;
    }

    const target = spaceVolumeForProgress(mode, diveProgressRef.current);
    const blend = 1 - Math.exp(-delta * 3.2);
    smoothedRef.current += (target - smoothedRef.current) * blend;
    setLoopVolume('space', smoothedRef.current);
  });

  return null;
}

/** Flash underway → newspaper cue; space bed fades away underneath. */
function NotebookRevealAudioBridge() {
  const firedRef = useRef(false);

  useFrame(() => {
    if (firedRef.current) return;
    // Let the flare build a bit before the reveal bed enters.
    if (diveProgressRef.current < FLASH_START + 0.04) return;
    firedRef.current = true;
    playTransitionOnce('notebook-reveal', 'notebookReveal', {
      volume: 0.28,
      fadeIn: 0.35,
      fadeOut: 1.5,
      maxDuration: 6,
    });
    stopLoop('space', { fadeOut: 1.6 });
  });

  return null;
}

/**
 * Shared Space ↔ Earth Dive scene.
 * Earth / stars / lights stay mounted across the mode switch so the Canvas
 * never remounts and the handoff stays visually continuous.
 */
function OrbitalScene({
  mode,
  onBookHandoff,
}: OrbitalSceneProps) {
  const isDive = mode === 'dive';

  return (
    <>
      {isDive ? (
        <EarthDiveScrollAccelerationTicker />
      ) : (
        <ScrollAccelerationTicker />
      )}

      <SpaceVisionReveal />
      <SpaceDiveVolumeBridge mode={mode} />

      {isDive ? (
        <>
          <EarthDiveProgressTicker />
          <BookHandoffBridge onBookHandoff={onBookHandoff} />
          <NotebookRevealAudioBridge />
          <EarthDivePlanetSpin />
          <EarthDiveController />
        </>
      ) : null}

      <Starfield />

      <Suspense fallback={null}>
        <MilkyWay />

        <group rotation={[EARTH_AXIAL_TILT_X, 0, EARTH_AXIAL_TILT_Z]}>
          <Earth />
          <CloudLayer />
          <Atmosphere />
        </group>

        {isDive ? (
          <>
            <SunHorizonEffect />
            <CloudFlight />
            <SolarFlash />
          </>
        ) : null}
      </Suspense>
    </>
  );
}

export default OrbitalScene;
