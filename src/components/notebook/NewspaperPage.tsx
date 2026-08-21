import type { ReactNode } from 'react';

type NewspaperPageProps = {
  children: ReactNode;
  className?: string;
  /** Shown in the corner folio, e.g. "Page 1" */
  folio?: string;
};

/** Physical newspaper sheet — paper texture, rules, imperfect print feel. */
function NewspaperPage({ children, className = '', folio }: NewspaperPageProps) {
  return (
    <article className={`np-page ${className}`.trim()}>
      <div className="np-page-texture" aria-hidden="true" />
      <div className="np-page-grain" aria-hidden="true" />
      <div className="np-page-inner">{children}</div>
      {folio ? (
        <p className="np-folio" aria-hidden="true">
          {folio}
        </p>
      ) : null}
    </article>
  );
}

export default NewspaperPage;
