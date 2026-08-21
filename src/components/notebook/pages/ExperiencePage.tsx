import NewspaperPage from '../NewspaperPage';
import NewspaperHeader from '../NewspaperHeader';
import Article from '../Article';
import NewspaperPhoto from '../NewspaperPhoto';
import HandAnnotation from '../HandAnnotation';

const ROLES = [
  {
    company: 'Company One',
    role: 'Full-Stack Engineer',
    dates: '2023 — Present',
    dek: 'Shipping product across the stack while mentoring quieter bugs into silence.',
    body: 'Placeholder dispatch: responsibilities, impact metrics, and a sentence about the team. Replace with real experience.',
  },
  {
    company: 'Company Two',
    role: 'Software Developer',
    dates: '2021 — 2023',
    dek: 'Interfaces, APIs, and the glue that made them feel inevitable.',
    body: 'Placeholder dispatch: key projects, technologies, and a memorable win. Replace with real experience.',
  },
  {
    company: 'Studio / Lab',
    role: 'Research Intern — Vision',
    dates: '2020 — 2021',
    dek: 'Models that looked carefully — and notebooks that looked even more carefully.',
    body: 'Placeholder dispatch: research focus, papers or demos, and what transferred into product work.',
  },
] as const;

/** PAGE 3 — Experience as stacked newspaper dispatches. */
function ExperiencePage() {
  return (
    <NewspaperPage className="np-experience" folio="Page 3 — Experience">
      <NewspaperHeader variant="interior" sectionTitle="Field Experience" />

      <p className="np-page-intro">
        Professional posts, reported as articles from the working desk. Dates
        and names below are stand-ins until the final copy is set.
      </p>

      <div className="np-experience-layout">
        <div className="np-experience-list">
          {ROLES.map((job, index) => (
            <Article
              key={job.company}
              className="np-experience-item"
              headline={job.role}
              dek={`${job.company} · ${job.dates}`}
              byline={`Dispatch ${index + 1}`}
            >
              <p className="np-experience-lead">{job.dek}</p>
              <p>{job.body}</p>
            </Article>
          ))}
        </div>

        <aside className="np-experience-rail">
          <NewspaperPhoto
            alt="Workplace atmosphere placeholder"
            aspect="square"
            caption="The workshop — wherever the build happens."
            credit="File photo"
            placeholderLabel="Desk Plate"
          />
          <HandAnnotation>timeline still being inked</HandAnnotation>
          <div className="np-sidebar-box">
            <h3 className="np-sidebar-title">In brief</h3>
            <p>
              Years building · Teams shipped with · Domains explored — fill with
              real numbers when ready.
            </p>
          </div>
        </aside>
      </div>
    </NewspaperPage>
  );
}

export default ExperiencePage;
