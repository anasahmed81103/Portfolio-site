/**
 * Shared “where is Earth / the Sun?” numbers for the orbital scene.
 *
 * Three.js units are arbitrary. We picked EARTH_RADIUS = 1.65 so the planet
 * fills the frame nicely with the camera sitting around z = 12.5.
 *
 * Vector3 is Three.js’s 3D point/direction type (x, y, z).
 * MathUtils.degToRad converts degrees to radians (Three.js rotations are radians).
 */
import { MathUtils, Vector3 } from 'three';

export const EARTH_RADIUS = 1.65;

/**
 * Sun lives mostly behind Earth relative to a camera on +Z.
 * The visible face is therefore night-heavy with a thin day crescent,
 * so city lights stay readable.
 */
export const SUN_POSITION = new Vector3(5, 1.2, -7);

/** Parent-group tilt so Earth’s axis is obvious from space (~22° / −25°). */
export const EARTH_AXIAL_TILT_X = MathUtils.degToRad(22);
export const EARTH_AXIAL_TILT_Z = MathUtils.degToRad(-25);
