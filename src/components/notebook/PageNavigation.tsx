import { NEWSPAPER_PAGES, type NewspaperPageId } from './newspaperData';

type PageNavigationProps = {
  currentId: NewspaperPageId;
  onPrev: () => void;
  onNext: () => void;
  onJump: (id: NewspaperPageId) => void;
  canPrev: boolean;
  canNext: boolean;
};

/**
 * Prev / next / jump bar at the bottom of the newspaper.
 * Looks like an index, not a website navbar. Wired from NotebookExperience.
 */
function PageNavigation({
  currentId,
  onPrev,
  onNext,
  onJump,
  canPrev,
  canNext,
}: PageNavigationProps) {
  const index = NEWSPAPER_PAGES.findIndex((p) => p.id === currentId);

  return (
    <nav
      className="np-nav"
      aria-label="Chronicle pages"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="np-nav-turn">
        <button
          type="button"
          className="np-nav-btn"
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="Previous page"
        >
          ‹ <span className="np-nav-btn-full">Prev page</span>
          <span className="np-nav-btn-short">Prev</span>
        </button>
        <p className="np-nav-status">
          Page {index + 1} of {NEWSPAPER_PAGES.length}
        </p>
        <button
          type="button"
          className="np-nav-btn"
          onClick={onNext}
          disabled={!canNext}
          aria-label="Next page"
        >
          <span className="np-nav-btn-full">Next page</span>
          <span className="np-nav-btn-short">Next</span> ›
        </button>
      </div>

      <ul className="np-nav-index">
        {NEWSPAPER_PAGES.map((page, i) => (
          <li key={page.id}>
            <button
              type="button"
              className={`np-nav-index-btn ${page.id === currentId ? 'is-active' : ''}`}
              onClick={() => onJump(page.id)}
              aria-current={page.id === currentId ? 'page' : undefined}
            >
              <span className="np-nav-index-label">{page.shortLabel}</span>
              <span className="np-nav-index-num">{i + 1}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default PageNavigation;
