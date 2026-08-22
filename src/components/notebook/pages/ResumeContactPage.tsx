import NewspaperPage from '../NewspaperPage';
import NewspaperHeader from '../NewspaperHeader';
import Article from '../Article';
import HandAnnotation from '../HandAnnotation';
import { CHRONICLE_NAME, PROFILE } from '../newspaperData';

/** PAGE 5 — Closing edition: résumé + correspondence. */
function ResumeContactPage() {
  return (
    <NewspaperPage className="np-closing" folio="Page 5 — Resume & Contact">
      <NewspaperHeader variant="interior" sectionTitle="Resume & Contact" />

      <div className="np-closing-hero">
        <h2 className="np-display-headline np-display-headline-sm">
          Get in touch
        </h2>
        <p className="np-display-sub">
          The résumé, plus email, GitHub, and LinkedIn.
        </p>
      </div>

      <div className="np-closing-grid">
        <Article
          className="np-closing-resume"
          dropCap
          headline="Résumé"
          dek="The same facts as this paper, set for a hiring desk."
          byline="Karachi"
        >
          <p>
            {PROFILE.fullName}, {PROFILE.title}, {PROFILE.location}. The
            preceding pages are the illustrated edition; the PDF is the same
            record, ready to download.
          </p>
          <p className="np-closing-actions">
            <a
              className="np-print-btn"
              href={PROFILE.resumeHref}
              target="_blank"
              rel="noreferrer"
            >
              View résumé
            </a>
            <a
              className="np-print-btn np-print-btn-ghost"
              href={PROFILE.resumeHref}
              download={PROFILE.resumeDownloadName}
            >
              Download PDF
            </a>
          </p>
        </Article>

        <Article
          className="np-closing-contact"
          headline="Correspondence"
          dek="Email, GitHub, and LinkedIn."
          byline="Karachi"
        >
          <ul className="np-contact-list">
            <li>
              <span className="np-contact-label">Email</span>
              <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            </li>
            <li>
              <span className="np-contact-label">GitHub</span>
              <a href={PROFILE.github} target="_blank" rel="noreferrer">
                {PROFILE.githubLabel}
              </a>
            </li>
            <li>
              <span className="np-contact-label">LinkedIn</span>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                {PROFILE.linkedinLabel}
              </a>
            </li>
          </ul>
        </Article>
      </div>

      <footer className="np-closing-footer">
        <div className="np-double-rule" aria-hidden="true" />
        <p className="np-closing-message">
          Thank you for reading {CHRONICLE_NAME}. The next edition is already
          being set.
        </p>
        <HandAnnotation className="np-closing-note">
          glad you read this far →
        </HandAnnotation>
        <p className="np-closing-colophon">
          End of Vol. I · Karachi Edition · Set in type for the screen · All
          rights reserved to their author
        </p>
      </footer>
    </NewspaperPage>
  );
}

export default ResumeContactPage;
