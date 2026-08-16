/**
 * When non-null, Earth + CloudLayer use this as rotation.y (Earth Dive spin phase).
 * Space leaves this null so normal auto-spin is unchanged.
 */
export const planetYawDriveRef: { current: number | null } = { current: null };

/** Latest Earth yaw — used to start the drive without a visible jump. */
export const earthYawReadRef = { current: 0 };
