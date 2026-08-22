/**
 * Who is allowed to rotate Earth on the Y axis (yaw)?
 *
 * Space: planetYawDriveRef is null → Earth.tsx uses its own idle + scroll spin.
 * Earth Dive (after hero lock): EarthDivePlanetSpin writes a number here every
 * frame, and Earth + CloudLayer copy that number so they stay locked together.
 *
 * earthYawReadRef is the last yaw Earth actually had. The dive spin starts
 * from that value so the planet does not pop to a new angle at the handoff.
 */
export const planetYawDriveRef: { current: number | null } = { current: null };

export const earthYawReadRef = { current: 0 };
