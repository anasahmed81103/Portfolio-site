import NewspaperPage from '../NewspaperPage';
import NewspaperHeader from '../NewspaperHeader';
import Article from '../Article';
import HandAnnotation from '../HandAnnotation';

/** PAGE 6 — Closing edition: resume + contact. */
function ResumeContactPage() {
  return (
    <NewspaperPage className="np-closing" folio="Page 6 — Final Edition">
      <NewspaperHeader variant="interior" sectionTitle="Final Edition" />

      <div className="np-closing-hero">
        <h2 className="np-display-headline np-display-headline-sm">
          The record & the letterbox
        </h2>
        <p className="np-display-sub">
          Resume access, correspondence, and a last line in the margin.
        </p>
      </div>

      <div className="np-closing-grid">
        <Article
          className="np-closing-resume"
          headline="The formal record"
          dek="Download or view the résumé when the final PDF is linked."
          byline="Résumé desk"
        >
          <p>
            Placeholder for resume actions. A printed-style button will open the
            PDF or a printable page once the file is ready.
          </p>
          <p className="np-closing-actions">
            <a className="np-print-btn" href="#resume">
              View résumé
            </a>
            <a className="np-print-btn np-print-btn-ghost" href="#resume-pdf">
              Download PDF
            </a>
          </p>
        </Article>

        <Article
          className="np-closing-contact"
          headline="Write to the editor"
          dek="Correspondence welcomed — especially the thoughtful kind."
          byline="Contact desk"
        >
          <ul className="np-contact-list">
            <li>
              <span className="np-contact-label">Email</span>
              <a href="mailto:hello@example.com">hello@example.com</a>
            </li>
            <li>
              <span className="np-contact-label">GitHub</span>
              <a href="https://github.com/" target="_blank" rel="noreferrer">
                github.com/your-handle
              </a>
            </li>
            <li>
              <span className="np-contact-label">LinkedIn</span>
              <a href="https://linkedin.com/" target="_blank" rel="noreferrer">
                linkedin.com/in/your-handle
              </a>
            </li>
          </ul>
        </Article>
      </div>

      <footer className="np-closing-footer">
        <div className="np-double-rule" aria-hidden="true" />
        <p className="np-closing-message">
          Thank you for reading The Anas Ahmed Chronicle. The presses are never
          fully quiet — another edition is always being set.
        </p>
        <HandAnnotation className="np-closing-note">
          until the next sky →
        </HandAnnotation>
        <p className="np-closing-colophon">
          End of Vol. I · Printed on imaginary presses · All rights reserved to
          their author
        </p>
      </footer>
    </NewspaperPage>
  );
}

export default ResumeContactPage;
