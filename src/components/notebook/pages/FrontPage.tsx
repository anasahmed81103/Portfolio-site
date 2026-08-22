import NewspaperPage from '../NewspaperPage';
import NewspaperHeader from '../NewspaperHeader';
import Article from '../Article';
import MediaSlideshow from '../MediaSlideshow';
import HandAnnotation from '../HandAnnotation';
import { PROFILE } from '../newspaperData';

const FRONT_PLATES = [
  {
    alt: 'Working portrait of Anas Ahmed at the desk',
    label: 'Fig. I · Desk',
    caption: 'The working portrait — where enterprise systems and models share a desk.',
  },
  {
    alt: 'Transformer Health Indexing portal recognizing equipment',
    label: 'Fig. II · THI-Portal',
    caption: 'THI-Portal — industrial vision, identifying a transformer in real time.',
  },
  {
    alt: 'Interface still from an AI engineering build',
    label: 'Fig. III · Motion',
    caption: 'A still from the work: code, inference, and the interface between them.',
  },
] as const;

/** PAGE 1 — Front page: masthead, hero headline, profile, teasers. */
function FrontPage() {
  return (
    <NewspaperPage className="np-front" folio="Page 1 — Front">
      <NewspaperHeader variant="masthead" />

      <div className="np-front-hero">
        <p className="np-kicker">Special Report · Full-Stack & Artificial Intelligence</p>
        <h2 className="np-display-headline">
          A New Era of Full-Stack Engineering &amp; AI
        </h2>
        <p className="np-display-sub">
          Top 0.2% national talent brings industrial-grade AI and enterprise
          architecture to the global market
        </p>
      </div>

      <div className="np-front-grid">
        <div className="np-front-main">
          <MediaSlideshow
            slides={FRONT_PLATES}
            aspect="portrait"
            intervalMs={4200}
          />
          <HandAnnotation className="np-front-note">
            the work, in motion
          </HandAnnotation>
        </div>

        <Article
          className="np-front-lead"
          dropCap
          headline="At a Glance"
          dek="A short profile, printed for the record."
          byline={`${PROFILE.location} · Staff Report`}
        >
          <p>
            <strong>{PROFILE.fullName}</strong> is a full-stack software
            engineer and AI specialist based in Karachi. Ranked in the{' '}
            <strong>99.8th percentile</strong> nationwide on the HEC &amp; P@SHA
            Skill Competency Test, he connects complex machine-learning systems
            to high-performance enterprise web applications — turning serious
            models into software people can actually use.
          </p>
          <p>
            With a <strong>3.73 CGPA</strong> from FAST-NUCES and a record of
            industrial delivery — including the Transformer Health Indexing
            System for <strong>K-Electric</strong> — Anas treats models,
            interfaces, and infrastructure as one architecture. The future, in
            this paper, is not announced. It is engineered.
          </p>
          <p className="np-continued">
            Full stories continue on pages 2 through 4 →
          </p>
        </Article>
      </div>

      <div className="np-double-rule" aria-hidden="true" />

      <section className="np-teasers" aria-label="Inside this edition">
        <h3 className="np-teasers-label">In this issue</h3>
        <div className="np-teaser-grid">
          <article className="np-teaser">
            <p className="np-teaser-kicker">Page 2</p>
            <h4 className="np-teaser-title">Experience</h4>
            <p className="np-teaser-text">
              Roles at Traxccel, ShahKings, Techmile, and FAST-NUCES — reported
              as field notes from the work.
            </p>
          </article>
          <article className="np-teaser">
            <p className="np-teaser-kicker">Page 3</p>
            <h4 className="np-teaser-title">Featured Projects</h4>
            <p className="np-teaser-text">
              Industrial vision for K-Electric, aerial scene synthesis, gaze
              systems, and a full booking engine.
            </p>
          </article>
          <article className="np-teaser">
            <p className="np-teaser-kicker">Page 4</p>
            <h4 className="np-teaser-title">Honors &amp; Certifications</h4>
            <p className="np-teaser-text">
              FAST-NUCES standing, Dean’s List, UTeM summer school, and
              official certifications.
            </p>
          </article>
          <article className="np-teaser">
            <p className="np-teaser-kicker">Page 5</p>
            <h4 className="np-teaser-title">Resume &amp; Contact</h4>
            <p className="np-teaser-text">
              The résumé, plus email, GitHub, and LinkedIn.
            </p>
          </article>
        </div>
      </section>
    </NewspaperPage>
  );
}

export default FrontPage;
