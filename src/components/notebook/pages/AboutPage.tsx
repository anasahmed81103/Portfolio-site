import NewspaperPage from '../NewspaperPage';
import NewspaperHeader from '../NewspaperHeader';
import Article from '../Article';
import MediaSlideshow from '../MediaSlideshow';
import HandAnnotation from '../HandAnnotation';

const ABOUT_SLIDES = [
  {
    alt: 'Portrait plate A',
    label: 'Portrait A',
    caption: 'At the desk — where most of the chronicle begins.',
  },
  {
    alt: 'Portrait plate B',
    label: 'Portrait B',
    caption: 'Between builds — coffee optional, curiosity required.',
  },
  {
    alt: 'Portrait plate C',
    label: 'Portrait C',
    caption: 'Out in the field — still looking up at the sky.',
  },
] as const;

/** PAGE 2 — About: photo essay + columned bio. */
function AboutPage() {
  return (
    <NewspaperPage className="np-about" folio="Page 2 — About">
      <NewspaperHeader variant="interior" sectionTitle="About the Author" />

      <div className="np-about-layout">
        <div className="np-about-media">
          <MediaSlideshow
            slides={ABOUT_SLIDES}
            aspect="portrait"
            intervalMs={3800}
          />
          <HandAnnotation className="np-about-note">
            replace with real plates soon
          </HandAnnotation>
        </div>

        <div className="np-about-copy">
          <Article
            dropCap
            headline="Who writes these pages"
            dek="A working portrait in ink — unfinished on purpose."
            byline="Biography · Column One"
          >
            <p>
              Anas Ahmed is a full-stack developer with a soft spot for systems
              that see — computer vision, thoughtful interfaces, and the
              infrastructure that keeps them honest.
            </p>
            <p>
              Placeholder copy for the fuller biography: education highlights,
              the path into software, and the themes that keep returning —
              craft, clarity, and a little wonder.
            </p>
          </Article>

          <Article
            className="np-about-side"
            headline="Notes from the margin"
            byline="Column Two"
          >
            <p>
              Interests beyond the job title will live here: debate, travel
              sketches, late-night prototypes, and whatever else belongs in a
              personal paper.
            </p>
            <ul className="np-bullet-list">
              <li>Based somewhere interesting — update location</li>
              <li>Open to thoughtful collaborations</li>
              <li>Always collecting reference images</li>
            </ul>
          </Article>
        </div>
      </div>
    </NewspaperPage>
  );
}

export default AboutPage;
