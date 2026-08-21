import NewspaperPage from '../NewspaperPage';
import NewspaperHeader from '../NewspaperHeader';
import Article from '../Article';
import NewspaperPhoto from '../NewspaperPhoto';
import HandAnnotation from '../HandAnnotation';

/** PAGE 1 — Front page: masthead, hero headline, portrait, teasers. */
function FrontPage() {
  return (
    <NewspaperPage className="np-front" folio="Page 1 — Front">
      <NewspaperHeader variant="masthead" />

      <div className="np-front-hero">
        <h2 className="np-display-headline">Anas Ahmed</h2>
        <p className="np-display-sub">
          Full-Stack Developer · AI / Computer Vision · Builder of curious systems
        </p>
      </div>

      <div className="np-front-grid">
        <div className="np-front-main">
          <NewspaperPhoto
            alt="Portrait of Anas Ahmed"
            aspect="portrait"
            caption="Anas Ahmed — developer, visual thinker, and chronicler of unfinished adventures."
            credit="Staff portrait · Plate I"
            placeholderLabel="Lead Portrait"
            className="np-front-portrait"
          />
          <HandAnnotation className="np-front-note">
            the journey continues →
          </HandAnnotation>
        </div>

        <Article
          className="np-front-lead"
          dropCap
          headline="From sketchbook skies to living systems"
          dek="A personal chronicle of code, vision, and the quiet craft between them."
          byline="By the Editor · Special Report"
        >
          <p>
            This edition gathers the work of Anas Ahmed into one illustrated
            newspaper — not a résumé website, but a printed record of projects,
            roles, studies, and the odd constellation of skills that make them
            possible.
          </p>
          <p>
            Turn the pages to read the fuller story: the people and products
            built along the way, the experiments that refused to stay small, and
            the ways to reach the author when curiosity strikes.
          </p>
          <p className="np-continued">Continued throughout this edition →</p>
        </Article>
      </div>

      <div className="np-double-rule" aria-hidden="true" />

      <section className="np-teasers" aria-label="Inside this edition">
        <h3 className="np-teasers-label">Also in this chronicle</h3>
        <div className="np-teaser-grid">
          <article className="np-teaser">
            <p className="np-teaser-kicker">Page 2</p>
            <h4 className="np-teaser-title">About the Author</h4>
            <p className="np-teaser-text">
              Photographs, notes, and a short biography in columns.
            </p>
          </article>
          <article className="np-teaser">
            <p className="np-teaser-kicker">Page 3</p>
            <h4 className="np-teaser-title">Field Experience</h4>
            <p className="np-teaser-text">
              Roles and companies reported as dispatches from the desk.
            </p>
          </article>
          <article className="np-teaser">
            <p className="np-teaser-kicker">Page 4</p>
            <h4 className="np-teaser-title">Featured Projects</h4>
            <p className="np-teaser-text">
              Screens, stories, and the tools behind each headline.
            </p>
          </article>
          <article className="np-teaser">
            <p className="np-teaser-kicker">Pages 5–6</p>
            <h4 className="np-teaser-title">Studies, Skills & Contact</h4>
            <p className="np-teaser-text">
              Education, craft lists, résumé access, and how to write in.
            </p>
          </article>
        </div>
      </section>
    </NewspaperPage>
  );
}

export default FrontPage;
