/** Two light polaroid sketches — diary texture without crowding the page. */
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
        </svg>
        <figcaption>open mic mind</figcaption>
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
          <path
            d="M34 36 H50 M34 44 H66 M34 52 H58"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path d="M40 78 H98" stroke="currentColor" strokeWidth="2" />
        </svg>
        <figcaption>midnight drafts</figcaption>
      </figure>
    </div>
  );
}

export default IntroPolaroids;
