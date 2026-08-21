import IntroPlaneSvg from './IntroPlaneSvg';

/**
 * Tasteful journal doodles — tech marks + transition plane.
 * Airplane uses `intro-transition-plane` for the Space handoff cue.
 */
function IntroDoodles() {
  return (
    <div className="intro-doodles" aria-hidden="true">
      {/* Python — sketched logo mark */}
      <svg
        className="intro-doodle intro-doodle-python"
        viewBox="0 0 64 64"
      >
        <path
          className="intro-doodle-stroke"
          d="M32 8 C20 8 18 14 18 20 L18 28 L34 28 L34 30 L14 30 C8 30 6 36 6 42 C6 48 8 54 18 54 L24 54 L24 46 C24 40 28 38 32 38 C36 38 46 38 46 38 L46 22 C46 14 42 8 32 8 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinejoin="round"
        />
        <path
          className="intro-doodle-stroke"
          d="M32 56 C44 56 46 50 46 44 L46 36 L30 36 L30 34 L50 34 C56 34 58 28 58 22 C58 16 56 10 46 10 L40 10 L40 18 C40 24 36 26 32 26 C28 26 18 26 18 26 L18 42 C18 50 22 56 32 56 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinejoin="round"
        />
        <circle cx="26" cy="18" r="2.2" fill="currentColor" />
        <circle cx="38" cy="46" r="2.2" fill="currentColor" />
      </svg>

      {/* React — sketched atom logo */}
      <svg className="intro-doodle intro-doodle-react" viewBox="0 0 72 72">
        <ellipse
          className="intro-doodle-stroke"
          cx="36"
          cy="36"
          rx="28"
          ry="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(0 36 36)"
        />
        <ellipse
          className="intro-doodle-stroke"
          cx="36"
          cy="36"
          rx="28"
          ry="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(60 36 36)"
        />
        <ellipse
          className="intro-doodle-stroke"
          cx="36"
          cy="36"
          rx="28"
          ry="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(120 36 36)"
        />
        <circle cx="36" cy="36" r="4.5" fill="currentColor" opacity="0.55" />
        <circle
          className="intro-doodle-stroke"
          cx="36"
          cy="36"
          r="4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>

      {/* Tiny graduation cap — honors CS nod */}
      <svg className="intro-doodle intro-doodle-cap" viewBox="0 0 72 56">
        <path
          className="intro-doodle-stroke"
          d="M8 22 L36 10 L64 22 L36 34 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinejoin="round"
        />
        <path
          className="intro-doodle-stroke"
          d="M20 26 L20 36 C20 42 28 46 36 46 C44 46 52 42 52 36 L52 26"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          className="intro-doodle-stroke"
          d="M64 22 L64 34"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="64" cy="36" r="2.5" fill="currentColor" opacity="0.45" />
      </svg>

      {/*
        Transition cue airplane — top-view airliner, parked upper-right,
        nose toward the page edge for a later intro→space fly-off.
      */}
      <IntroPlaneSvg
        className="intro-doodle intro-doodle-plane intro-transition-plane"
        strokeClassName="intro-doodle-stroke"
        title="Airplane"
      />
    </div>
  );
}

export default IntroDoodles;
