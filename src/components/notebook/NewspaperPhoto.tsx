type NewspaperPhotoProps = {
  src?: string;
  alt: string;
  caption?: string;
  credit?: string;
  /** Aspect hint for placeholders */
  aspect?: 'portrait' | 'landscape' | 'square' | 'wide';
  className?: string;
  placeholderLabel?: string;
};

/**
 * Printed photograph treatment — frame, caption, ink wash placeholder when no src.
 */
function NewspaperPhoto({
  src,
  alt,
  caption,
  credit,
  aspect = 'landscape',
  className = '',
  placeholderLabel = 'Photograph',
}: NewspaperPhotoProps) {
  return (
    <figure className={`np-photo np-photo-${aspect} ${className}`.trim()}>
      <div className="np-photo-frame">
        {src ? (
          <img className="np-photo-img" src={src} alt={alt} />
        ) : (
          <div className="np-photo-placeholder" role="img" aria-label={alt}>
            <span className="np-photo-placeholder-mark" aria-hidden="true">
              ▣
            </span>
            <span className="np-photo-placeholder-label">{placeholderLabel}</span>
          </div>
        )}
      </div>
      {(caption || credit) && (
        <figcaption className="np-photo-caption">
          {caption ? <span>{caption}</span> : null}
          {credit ? <span className="np-photo-credit">{credit}</span> : null}
        </figcaption>
      )}
    </figure>
  );
}

export default NewspaperPhoto;
