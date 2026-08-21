/**
 * Sparse handwritten diary notes — unique scraps, not repeated résumé spam.
 */
function IntroAnnotations() {
  return (
    <div className="intro-annotations" aria-hidden="true">
      <div className="intro-note intro-note-debater">
        <span className="intro-note-text">Debater?</span>
        <svg className="intro-note-arrow" viewBox="0 0 70 28">
          <path
            className="intro-annotation-stroke"
            d="M4 10 C 22 22, 44 22, 64 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            className="intro-annotation-stroke"
            d="M54 6 L66 12 L56 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="intro-note intro-note-yis">
        <svg className="intro-note-arrow" viewBox="0 0 80 36">
          <path
            className="intro-annotation-stroke"
            d="M8 28 C 28 8, 52 8, 72 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            className="intro-annotation-stroke"
            d="M60 10 L74 18 L62 26"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="intro-note-text">
          Youth Intelligentsia Society Leadership!..
        </span>
      </div>

      <div className="intro-note intro-note-honors">
        <span className="intro-note-text">
          Cum Laude ~ With Honors CS Graduate
        </span>
      </div>

      <div className="intro-note intro-note-gpa">
        <span className="intro-note-text">3.73 CGPA / 4.0</span>
      </div>

      <div className="intro-note intro-note-journey">
        <span className="intro-note-text">
          in search of the next great journey →
        </span>
      </div>
    </div>
  );
}

export default IntroAnnotations;
