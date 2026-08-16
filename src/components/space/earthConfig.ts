import { MathUtils, Vector3 } from 'three';

export const EARTH_RADIUS = 1.65;

/**
 * Sun sits mostly behind Earth relative to the camera at +Z, so the visible
 * face is night-dominant with a curved day crescent — city lights stay readable.
 * Used by the Earth shader and the scene directional light.
 */
export const SUN_POSITION = new Vector3(5, 1.2, -7);

/** Static parent tilt (radians) — ~25° so the axis reads clearly from space. */
export const EARTH_AXIAL_TILT_X = MathUtils.degToRad(22);
export const EARTH_AXIAL_TILT_Z = MathUtils.degToRad(-25);
