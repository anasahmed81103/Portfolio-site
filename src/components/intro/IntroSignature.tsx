import {
  SIGNATURE_FLOURISH_PATH,
  SIGNATURE_LETTER_PATHS,
  SIGNATURE_TEXT,
  SIGNATURE_UNDERLINE_PATH,
  SIGNATURE_VIEWBOX,
} from './signaturePaths';

/**
 * Professional script signature (Allura glyph outlines) with sketch draw-in.
 * Letterforms come from the font via scripts/generateSignaturePaths.mjs —
 * not from hand-authored letter approximations.
 */
function IntroSignature() {
  const { minX, minY, width, height } = SIGNATURE_VIEWBOX;

  return (
    <div className="intro-signature-wrap">
      <svg
        className="intro-signature"
        viewBox={`${minX} ${minY} ${width} ${height}`}
        role="img"
        aria-label={SIGNATURE_TEXT}
      >
        <title>{SIGNATURE_TEXT}</title>

        {/* Filled letterforms — fade in after the pen stroke reveals each glyph */}
        <g className="intro-signature-fills" aria-hidden="true">
          {SIGNATURE_LETTER_PATHS.map((d, index) => (
            <path
              key={`fill-${index}`}
              className="intro-signature-fill"
              d={d}
            />
          ))}
        </g>

        {/* Primary ink stroke — draws along real font outlines */}
        <g
          className="intro-signature-strokes"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {SIGNATURE_LETTER_PATHS.map((d, index) => (
            <path
              key={`stroke-${index}`}
              className="intro-signature-draw intro-signature-letter"
              d={d}
            />
          ))}
        </g>

        {/* Subtle second pen pass — slight offset, never distorts glyph shapes */}
        <g
          className="intro-signature-sketch-pass"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {SIGNATURE_LETTER_PATHS.map((d, index) => (
            <path
              key={`sketch-${index}`}
              className="intro-signature-draw intro-signature-sketch"
              d={d}
            />
          ))}
        </g>

        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            className="intro-signature-draw intro-signature-underline"
            d={SIGNATURE_UNDERLINE_PATH}
          />
          <path
            className="intro-signature-draw intro-signature-flourish"
            d={SIGNATURE_FLOURISH_PATH}
          />
        </g>
      </svg>

      <p className="intro-subtitle">
        Full-Stack Developer · AI / Computer Vision
      </p>
    </div>
  );
}

export default IntroSignature;
