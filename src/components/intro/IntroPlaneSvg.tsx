type IntroPlaneSvgProps = {
  className?: string;
  /** Extra class on stroked outline paths (e.g. intro-doodle-stroke). */
  strokeClassName?: string;
  title?: string;
};

/**
 * Simple 2D top-view airliner — shared by the diary doodle and space handoff.
 * Nose points to +X (right).
 */
function IntroPlaneSvg({ className, strokeClassName, title }: IntroPlaneSvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 100"
      overflow="visible"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}

      {/* Soft body fill */}
      <g fill="currentColor" opacity="0.12" stroke="none">
        <path d={FUSELAGE} />
        <path d={WING_TOP} />
        <path d={WING_BOTTOM} />
        <path d={TAIL_TOP} />
        <path d={TAIL_BOTTOM} />
        <path d={ENGINE_TOP} />
        <path d={ENGINE_BOTTOM} />
      </g>

      {/* Ink outline */}
      <path
        className={strokeClassName}
        d={FUSELAGE}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        className={strokeClassName}
        d={WING_TOP}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        className={strokeClassName}
        d={WING_BOTTOM}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        className={strokeClassName}
        d={TAIL_TOP}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        className={strokeClassName}
        d={TAIL_BOTTOM}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        className={strokeClassName}
        d={ENGINE_TOP}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        className={strokeClassName}
        d={ENGINE_BOTTOM}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        className={strokeClassName}
        d="M198 46 C204 46, 210 48, 214 50 C210 52, 204 54, 198 54"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const FUSELAGE =
  'M28 50 C28 43 40 38 58 38 L178 38 C198 38 214 44 228 50 C214 56 198 62 178 62 L58 62 C40 62 28 57 28 50 Z';

const WING_TOP = 'M108 40 L68 10 L52 10 L48 16 L88 42 Z';

const WING_BOTTOM = 'M108 60 L68 90 L52 90 L48 84 L88 58 Z';

const TAIL_TOP = 'M48 40 L30 22 L20 22 L18 28 L40 46 Z';

const TAIL_BOTTOM = 'M48 60 L30 78 L20 78 L18 72 L40 54 Z';

const ENGINE_TOP =
  'M92 28 C92 24 100 22 110 24 C110 28 102 32 92 30 Z';

const ENGINE_BOTTOM =
  'M92 72 C92 76 100 78 110 76 C110 72 102 68 92 70 Z';

export default IntroPlaneSvg;
