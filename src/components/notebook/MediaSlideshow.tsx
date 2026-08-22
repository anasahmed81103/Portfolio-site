import { useCallback, useEffect, useState } from 'react';

export type SlideshowSlide = {
  src?: string;
  alt: string;
  caption?: string;
  credit?: string;
  label?: string;
};

type MediaSlideshowProps = {
  slides: readonly SlideshowSlide[];
  /** Auto-advance interval in ms; 0 disables */
  intervalMs?: number;
  aspect?: 'portrait' | 'landscape' | 'square' | 'wide';
  className?: string;
};

/** Newspaper photo gallery — auto-advances; prev/next as print controls. */
function MediaSlideshow({
  slides,
  intervalMs = 4200,
  aspect = 'landscape',
  className = '',
}: MediaSlideshowProps) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const slide = slides[index] ?? slides[0];

  const go = useCallback(
    (delta: number) => {
      if (count < 2) return;
      setIndex((current) => (current + delta + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (intervalMs <= 0 || count < 2) return;
    const id = window.setInterval(() => go(1), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, count, go]);

  if (!slide) return null;

  return (
    <div className={`np-slideshow ${className}`.trim()}>
      <div className={`np-photo np-photo-${aspect}`}>
        <div className="np-photo-frame">
          {slide.src ? (
            <img
              key={slide.src}
              className="np-photo-img np-slideshow-img"
              src={slide.src}
              alt={slide.alt}
            />
          ) : (
            <div
              className="np-photo-placeholder"
              role="img"
              aria-label={slide.alt}
            >
              <span className="np-photo-placeholder-mark" aria-hidden="true">
                ▣
              </span>
              <span className="np-photo-placeholder-label">
                {slide.label ?? `Fig. ${index + 1}`}
              </span>
            </div>
          )}
        </div>
        {(slide.caption || slide.credit || count > 1) && (
          <div className="np-photo-caption np-slideshow-caption">
            <span>{slide.caption ?? slide.alt}</span>
            {slide.credit || count > 1 ? (
              <span className="np-photo-credit">
                {[slide.credit, count > 1 ? `${index + 1} / ${count}` : null]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            ) : null}
          </div>
        )}
      </div>

      {count > 1 ? (
        <div className="np-slideshow-controls">
          <button
            type="button"
            className="np-slideshow-btn"
            onClick={() => go(-1)}
            aria-label="Previous photograph"
          >
            ‹ Prev
          </button>
          <div className="np-slideshow-dots" aria-hidden="true">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`np-slideshow-dot ${i === index ? 'is-active' : ''}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="np-slideshow-btn"
            onClick={() => go(1)}
            aria-label="Next photograph"
          >
            Next ›
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default MediaSlideshow;
