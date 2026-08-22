import { CHRONICLE_NAME, EDITION_META } from './newspaperData';
import useNewspaperClock from './useNewspaperClock';

type NewspaperHeaderProps = {
  /** Compact header for interior pages */
  variant?: 'masthead' | 'interior';
  sectionTitle?: string;
};

function NewspaperHeader({
  variant = 'masthead',
  sectionTitle,
}: NewspaperHeaderProps) {
  const clock = useNewspaperClock();

  if (variant === 'interior') {
    return (
      <header className="np-header np-header-interior">
        <div className="np-header-top">
          <span>{EDITION_META.volume}</span>
          <span className="np-header-name">{CHRONICLE_NAME}</span>
          <span>
            {clock.date} · {clock.time}
          </span>
        </div>
        {sectionTitle ? (
          <h1 className="np-section-banner">{sectionTitle}</h1>
        ) : null}
        <div className="np-double-rule" aria-hidden="true" />
      </header>
    );
  }

  return (
    <header className="np-header np-header-masthead">
      <div className="np-header-top">
        <span>
          {EDITION_META.volume} · {EDITION_META.issue}
        </span>
        <span>{EDITION_META.location}</span>
        <span>{EDITION_META.price}</span>
      </div>

      <div className="np-masthead-row">
        <div className="np-masthead-ornament" aria-hidden="true">
          <svg viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <circle cx="32" cy="32" r="8" fill="currentColor" opacity="0.85" />
            <path
              d="M32 6 L34 22 L32 28 L30 22 Z M32 58 L34 42 L32 36 L30 42 Z M6 32 L22 34 L28 32 L22 30 Z M58 32 L42 34 L36 32 L42 30 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="np-masthead-center">
          <p className="np-masthead-kicker">
            Karachi · an illustrated paper of software and AI
          </p>
          <h1 className="np-masthead-title">{CHRONICLE_NAME}</h1>
          <p className="np-masthead-date">{clock.masthead}</p>
        </div>

        <div className="np-masthead-ornament" aria-hidden="true">
          <svg viewBox="0 0 64 64">
            <rect
              x="10"
              y="10"
              width="44"
              height="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M18 40 C 24 22, 40 22, 46 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="32" cy="28" r="5" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className="np-double-rule" aria-hidden="true" />
    </header>
  );
}

export default NewspaperHeader;
