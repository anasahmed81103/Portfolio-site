import NewspaperPage from '../NewspaperPage';
import NewspaperHeader from '../NewspaperHeader';
import Article from '../Article';
import MediaSlideshow from '../MediaSlideshow';
import NewspaperPhoto from '../NewspaperPhoto';
import HandAnnotation from '../HandAnnotation';

const PROJECT_A_SLIDES = [
  {
    alt: 'Project A screenshot 1',
    label: 'Fig. A1',
    caption: 'Lead interface — placeholder plate.',
  },
  {
    alt: 'Project A screenshot 2',
    label: 'Fig. A2',
    caption: 'Detail view — placeholder plate.',
  },
  {
    alt: 'Project A video still',
    label: 'Fig. A3 · Motion',
    caption: 'Video still / preview frame — swap for real reel.',
  },
] as const;

/** PAGE 4 — Projects: densest visual page, featured stories. */
function ProjectsPage() {
  return (
    <NewspaperPage className="np-projects" folio="Page 4 — Projects">
      <NewspaperHeader variant="interior" sectionTitle="Featured Projects" />

      {/* Lead story */}
      <section className="np-project-lead">
        <div className="np-project-lead-copy">
          <p className="np-kicker">Lead Story · Project One</p>
          <h2 className="np-headline np-headline-xl">
            The system that learned to look
          </h2>
          <p className="np-dek">
            A flagship build — vision, interface, and infrastructure in one
            printed feature. Replace title and copy with the real project.
          </p>
          <p className="np-meta-line">
            <span>React</span>
            <span>Python</span>
            <span>Computer Vision</span>
            <span>Three.js</span>
          </p>
          <Article dropCap>
            <p>
              Opening paragraph for the hero project: problem, approach, and
              why it mattered. Keep it short enough to read beside the plates.
            </p>
            <p>
              Second paragraph for outcome — users reached, accuracy gained, or
              the craft lesson that stuck. Media on the right will carry the
              rest of the story.
            </p>
          </Article>
        </div>
        <div className="np-project-lead-media">
          <MediaSlideshow
            slides={PROJECT_A_SLIDES}
            aspect="wide"
            intervalMs={4500}
          />
          <HandAnnotation className="np-projects-note">
            best page for real screenshots
          </HandAnnotation>
        </div>
      </section>

      <div className="np-double-rule" aria-hidden="true" />

      {/* Secondary stories */}
      <div className="np-project-grid">
        <article className="np-project-card">
          <NewspaperPhoto
            alt="Project B media"
            aspect="landscape"
            caption="Project Two — interface study."
            credit="Fig. B"
            placeholderLabel="Project Two"
          />
          <h3 className="np-headline">Second feature: tools for makers</h3>
          <p className="np-meta-line">
            <span>TypeScript</span>
            <span>Node</span>
            <span>Design Systems</span>
          </p>
          <p>
            Short description of project two. One or two sentences, then a link
            or case-study note later.
          </p>
        </article>

        <article className="np-project-card">
          <NewspaperPhoto
            alt="Project C media"
            aspect="landscape"
            caption="Project Three — experiment in motion."
            credit="Fig. C"
            placeholderLabel="Project Three"
          />
          <h3 className="np-headline">Third feature: small, sharp, alive</h3>
          <p className="np-meta-line">
            <span>WebGL</span>
            <span>GSAP</span>
            <span>R3F</span>
          </p>
          <p>
            Short description of project three. Emphasize the visual or
            interactive hook that belongs in a newspaper feature.
          </p>
        </article>

        <article className="np-project-card np-project-card-wide">
          <div className="np-project-inline">
            <NewspaperPhoto
              alt="Project D media"
              aspect="square"
              caption="Side story."
              credit="Fig. D"
              placeholderLabel="Project Four"
            />
            <div>
              <p className="np-kicker">Brief</p>
              <h3 className="np-headline">Fourth notice: utility & craft</h3>
              <p className="np-meta-line">
                <span>SQL</span>
                <span>APIs</span>
                <span>DevOps</span>
              </p>
              <p>
                Compact write-up for a smaller project or open-source note —
                still framed as news, never as a modern card grid.
              </p>
            </div>
          </div>
        </article>
      </div>
    </NewspaperPage>
  );
}

export default ProjectsPage;
