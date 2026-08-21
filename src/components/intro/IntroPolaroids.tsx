/** Polaroid-style sketch pictures on the notebook page. */
function IntroPolaroids() {
  return (
    <div className="intro-polaroids" aria-hidden="true">
      <figure className="intro-polaroid intro-polaroid-left">
        <svg viewBox="0 0 140 110" className="intro-polaroid-art">
          <rect
            x="8"
            y="8"
            width="124"
            height="78"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="46" cy="36" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
          <path
            d="M18 72 L42 48 L58 60 L78 40 L122 72"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M96 28 C100 20, 112 20, 116 28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
        <figcaption>weekend hike</figcaption>
      </figure>

      <figure className="intro-polaroid intro-polaroid-right">
        <svg viewBox="0 0 140 110" className="intro-polaroid-art">
          <rect
            x="18"
            y="18"
            width="86"
            height="58"
            rx="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="24"
            y="24"
            width="74"
            height="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M40 78 H98" stroke="currentColor" strokeWidth="2" />
          <path
            d="M34 36 H50 M34 44 H66 M34 52 H58"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="96" cy="30" r="3" fill="currentColor" opacity="0.4" />
        </svg>
        <figcaption>late-night build</figcaption>
      </figure>

      <figure className="intro-polaroid intro-polaroid-bottom">
        <svg viewBox="0 0 140 110" className="intro-polaroid-art">
          <path
            d="M70 14 C78 28, 92 40, 92 56 C92 72 82 82 70 82 C58 82 48 72 48 56 C48 40 62 28 70 14 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          <ellipse
            cx="70"
            cy="56"
            rx="34"
            ry="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            transform="rotate(-16 70 56)"
          />
          <circle cx="62" cy="50" r="2.5" fill="currentColor" opacity="0.35" />
          <path
            d="M28 24 L32 18 M108 30 L114 24 M24 70 L18 74"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <figcaption>into the stars</figcaption>
      </figure>
    </div>
  );
}

export default IntroPolaroids;
