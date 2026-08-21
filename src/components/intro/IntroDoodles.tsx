/** Floating sketch doodles around the notebook page. */
function IntroDoodles() {
  return (
    <div className="intro-doodles" aria-hidden="true">
      <svg className="intro-doodle intro-doodle-star" viewBox="0 0 64 64">
        <path
          d="M32 6 L38 24 L58 24 L42 36 L48 54 L32 42 L16 54 L22 36 L6 24 L26 24 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>

      <svg className="intro-doodle intro-doodle-star-sm" viewBox="0 0 48 48">
        <path
          d="M24 5 L27 18 L40 18 L29 26 L33 39 L24 31 L15 39 L19 26 L8 18 L21 18 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>

      <svg className="intro-doodle intro-doodle-rocket" viewBox="0 0 80 80">
        <path
          d="M40 8 C48 22, 52 36, 50 52 L30 52 C28 36, 32 22, 40 8 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <circle cx="40" cy="34" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M30 48 L18 58 L28 54 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M50 48 L62 58 L52 54 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M34 56 C34 66, 40 72, 40 72 C40 72, 46 66, 46 56"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>

      <svg className="intro-doodle intro-doodle-planet" viewBox="0 0 90 70">
        <ellipse
          cx="45"
          cy="35"
          rx="22"
          ry="21"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <ellipse
          cx="45"
          cy="35"
          rx="38"
          ry="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(-18 45 35)"
        />
        <circle cx="38" cy="30" r="3" fill="currentColor" opacity="0.35" />
        <circle cx="52" cy="40" r="2.5" fill="currentColor" opacity="0.35" />
      </svg>

      <svg className="intro-doodle intro-doodle-coffee" viewBox="0 0 70 70">
        <path
          d="M18 24 H46 V46 C46 54 40 58 32 58 C24 58 18 54 18 46 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path
          d="M46 30 H54 C58 30 60 34 60 38 C60 42 58 46 54 46 H46"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path d="M24 16 C26 12, 28 12, 30 16" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M34 16 C36 12, 38 12, 40 16" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>

      <svg className="intro-doodle intro-doodle-code" viewBox="0 0 80 56">
        <path
          d="M28 10 L12 28 L28 46"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M52 10 L68 28 L52 46"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M44 8 L36 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>

      <svg className="intro-doodle intro-doodle-plane" viewBox="0 0 90 50">
        <path
          d="M6 28 L70 22 L84 16 L76 28 L84 36 L70 32 L6 34 L12 28 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path d="M34 24 L42 8 L48 24" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M38 32 L46 44 L52 32" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>

      <svg className="intro-doodle intro-doodle-heart" viewBox="0 0 56 52">
        <path
          d="M28 46 C28 46, 8 32, 8 18 C8 10, 14 6, 20 6 C24 6, 27 8, 28 12 C29 8, 32 6, 36 6 C42 6, 48 10, 48 18 C48 32, 28 46, 28 46 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
      </svg>

      <svg className="intro-doodle intro-doodle-arrow" viewBox="0 0 100 40">
        <path
          d="M8 28 C 30 8, 55 8, 78 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M68 12 L82 24 L66 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <svg className="intro-doodle intro-doodle-squiggle" viewBox="0 0 120 36">
        <path
          d="M6 20 C 18 6, 28 34, 40 18 S 62 6, 74 22 S 98 34, 114 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>

      <svg className="intro-doodle intro-doodle-bulb" viewBox="0 0 56 72">
        <circle cx="28" cy="26" r="16" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path
          d="M20 40 L20 48 H36 V40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path d="M22 52 H34" stroke="currentColor" strokeWidth="2" />
        <path d="M24 56 H32" stroke="currentColor" strokeWidth="2" />
        <path d="M28 6 V2" stroke="currentColor" strokeWidth="2" />
        <path d="M42 12 L46 8" stroke="currentColor" strokeWidth="2" />
        <path d="M14 12 L10 8" stroke="currentColor" strokeWidth="2" />
      </svg>

      <svg className="intro-doodle intro-doodle-smiley" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="24" cy="26" r="2.5" fill="currentColor" />
        <circle cx="40" cy="26" r="2.5" fill="currentColor" />
        <path
          d="M22 38 C26 46, 38 46, 42 38"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default IntroDoodles;
