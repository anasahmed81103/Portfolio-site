import NewspaperPage from '../NewspaperPage';
import NewspaperHeader from '../NewspaperHeader';
import Article from '../Article';
import NewspaperPhoto from '../NewspaperPhoto';
import HandAnnotation from '../HandAnnotation';
import { notebookPhotos, STAND_IN_CREDIT } from '../notebookPhotos';

const ROLES = [
  {
    company: 'Traxccel',
    role: 'Full Stack Engineer',
    dates: 'April 2026 – Present',
    place: 'Karachi, Pakistan',
    dek: 'Enterprise web systems, internal platforms, and the quiet discipline of shipping them well.',
    points: [
      {
        title: 'Architecting enterprise systems',
        text: 'Engineering cross-platform, responsive enterprise web applications, internal CRMs, and management platforms in React.js against a modular .NET Core backend.',
      },
      {
        title: 'UI / UX performance',
        text: 'Designing high-performance, fluid interfaces with Bootstrap CSS, eliminating client-side component load anomalies that once slowed the product.',
      },
      {
        title: 'Data integration',
        text: 'Working in agile cadence to map complex relational models onto live dashboards through high-throughput RESTful APIs — securely, and at speed.',
      },
    ],
  },
  {
    company: 'ShahKings',
    role: 'Full-Stack & Mobile Game Developer',
    dates: 'January 2024 – April 2026',
    place: 'Remote',
    dek: 'Hybrid apps, payment rails, and Unity titles — one studio, several platforms.',
    points: [
      {
        title: 'Cross-platform architecture',
        text: 'Co-engineered Wallez, an offline-first hybrid mobile application (React + Capacitor), with local database synchronization tuned for zero-latency use.',
      },
      {
        title: 'Secure infrastructure',
        text: 'Implemented end-to-end encryption and API tracking to integrate the HBL Payment Gateway for the Khas Foundation platform.',
      },
      {
        title: 'Game development',
        text: 'Led Unity-based mobile game work: gameplay systems, structural optimisation, and features that held up in play.',
      },
    ],
  },
  {
    company: 'Techmile Solutions',
    role: 'Full Stack Developer Intern',
    dates: 'June 2025 – August 2025',
    place: 'Karachi, Pakistan',
    dek: 'Automation in the test bay; structure in the data; modules that reached production.',
    points: [
      {
        title: 'QA automation',
        text: 'Removed manual quality-assurance bottlenecks by scripting automated suites with Playwright and Trigger.dev pipelines.',
      },
      {
        title: 'Data aggregation',
        text: 'Built Python scrapers for structured extraction and contributed scalable modules to production React Native builds.',
      },
    ],
  },
  {
    company: 'FAST-NUCES',
    role: 'Student Lab Assistant',
    dates: 'September 2025 – January 2026',
    place: 'Karachi, Pakistan',
    dek: 'Fifty students, one lab, and the fundamentals that still decide everything.',
    points: [
      {
        title: 'Instruction & craft',
        text: 'Mentored 50+ undergraduates in core algorithms, structural debugging, dynamic memory allocation in C, and Git workflows.',
      },
    ],
  },
] as const;

/** PAGE 2 — Experience: dense newspaper dispatches. */
function ExperiencePage() {
  return (
    <NewspaperPage className="np-experience" folio="Page 2 — Experience">
      <NewspaperHeader variant="interior" sectionTitle="Experience" />

      <p className="np-page-intro">
        Professional roles, set in columns. What follows is the working record
        — what was built, and where.
      </p>

      <div className="np-experience-layout">
        <div className="np-experience-list">
          {ROLES.map((job, index) => (
            <Article
              key={job.company}
              className="np-experience-item"
              dropCap={index === 0}
              headline={job.role}
              dek={`${job.company} · ${job.dates} · ${job.place}`}
              byline={`Field note ${index + 1}`}
            >
              <p className="np-experience-lead">{job.dek}</p>
              <ul className="np-job-points">
                {job.points.map((point) => (
                  <li key={point.title}>
                    <strong>{point.title}</strong>
                    {point.text}
                  </li>
                ))}
              </ul>
            </Article>
          ))}
        </div>

        <aside className="np-experience-rail">
          <NewspaperPhoto
            src={notebookPhotos.officeDesk}
            alt="An office desk — stand-in workplace photograph"
            aspect="square"
            caption="Wherever the build happens — Karachi, remote, or the FAST lab."
            credit={STAND_IN_CREDIT}
          />
          <HandAnnotation>four posts. one record.</HandAnnotation>
          <div className="np-sidebar-box">
            <h3 className="np-sidebar-title">In brief</h3>
            <p>
              Current post at Traxccel. Prior tenure at ShahKings through April
              2026. Industrial AI delivery for K-Electric appears on the next
              page — Featured Projects.
            </p>
          </div>
          <div className="np-sidebar-box">
            <h3 className="np-sidebar-title">Tools of the trade</h3>
            <p>
              React.js · .NET Core · Bootstrap · REST · Capacitor · Unity ·
              Playwright · Python · React Native · C · Git
            </p>
          </div>
        </aside>
      </div>
    </NewspaperPage>
  );
}

export default ExperiencePage;
