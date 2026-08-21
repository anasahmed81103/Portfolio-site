type HandAnnotationProps = {
  children: string;
  className?: string;
};

/** Caveat ink note — sparse diary scrap on the printed page. */
function HandAnnotation({ children, className = '' }: HandAnnotationProps) {
  return (
    <p className={`np-annotation ${className}`.trim()} aria-hidden="true">
      {children}
    </p>
  );
}

export default HandAnnotation;
