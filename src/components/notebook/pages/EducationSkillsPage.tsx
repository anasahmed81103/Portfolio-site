import NewspaperPage from '../NewspaperPage';
import NewspaperHeader from '../NewspaperHeader';
import Article from '../Article';
import NewspaperPhoto from '../NewspaperPhoto';
import HandAnnotation from '../HandAnnotation';

const CERTIFICATIONS = [
  {
    house: 'Microsoft Applied Skills',
    items: [
      'Model-Driven App Development & Dataverse Architecture',
      'Enterprise Cloud Architecture & Automation (Power Automate)',
    ],
  },
  {
    house: 'DeepLearning.AI',
    items: ['Supervised Machine Learning — Regression and Classification'],
  },
  {
    house: 'KodeKloud',
    items: ['Docker Training for the Absolute Beginner'],
  },
  {
    house: 'CalArts',
    items: ['Visual Elements of User Interface Design'],
  },
] as const;

const SKILL_COLUMNS = [
  {
    title: 'AI / ML',
    items: [
      'PyTorch',
      'TensorFlow',
      'YOLOv8',
      'EfficientNet',
      'OpenCV',
      'MediaPipe',
      'GANs',
    ],
  },
  {
    title: 'Full-Stack',
    items: [
      'React.js',
      'Next.js',
      'Node.js',
      'Express.js',
      '.NET Core',
      'ASP.NET MVC',
      'React Native',
      'Capacitor',
    ],
  },
  {
    title: 'Databases',
    items: ['PostgreSQL', 'SQL Server', 'SQLite'],
  },
  {
    title: 'Core systems',
    items: [
      'C++',
      'Python',
      'C#',
      'JavaScript',
      'C',
      'Docker',
      'Git',
      'Playwright',
    ],
  },
] as const;

/** PAGE 4 — Academic honors, certifications, and tools. */
function EducationSkillsPage() {
  return (
    <NewspaperPage className="np-education" folio="Page 4 — Honors & Certifications">
      <NewspaperHeader
        variant="interior"
        sectionTitle="Honors & Certifications"
      />

      <div className="np-education-layout">
        <Article
          className="np-education-feature"
          dropCap
          headline="FAST-NUCES, and the standing that followed"
          dek="National University of Computer and Emerging Sciences · B.S. Computer Science · 2022–2026"
          byline="Education · Special Section"
        >
          <p>
            <strong>Muhammad Anas Ahmed Shaikh</strong> completed the B.S. in
            Computer Science at FAST-NUCES with a <strong>3.73 CGPA</strong> —
            a record set not only in examinations, but in the work that
            followed them into industry.
          </p>
          <p>
            National standing: <strong>99.8th percentile</strong> on the HEC
            &amp; P@SHA Skill Competency Test — the top 0.2% nationwide. Seven
            appearances on the Dean’s List of Honors. President of the Youth
            Intelligentsia FAST Chapter.
          </p>
          <div className="np-education-facts">
            <div>
              <p className="np-fact-label">Degree</p>
              <p className="np-fact-value">B.S. Computer Science</p>
            </div>
            <div>
              <p className="np-fact-label">Standing</p>
              <p className="np-fact-value">3.73 CGPA · Top 0.2%</p>
            </div>
            <div>
              <p className="np-fact-label">Honors</p>
              <p className="np-fact-value">Dean’s List × 7</p>
            </div>
          </div>
        </Article>

        <aside className="np-education-aside">
          <NewspaperPhoto
            alt="FAST-NUCES campus photograph"
            aspect="portrait"
            caption="FAST-NUCES — four years, in one photograph."
            credit="Campus file"
            placeholderLabel="FAST-NUCES"
          />
          <HandAnnotation>seven times on the list</HandAnnotation>
        </aside>
      </div>

      <div className="np-notice-row">
        <article className="np-classified">
          <h3 className="np-classified-kicker">International notice</h3>
          <h4 className="np-classified-title">
            Universiti Teknikal Malaysia Melaka (UTeM)
          </h4>
          <p className="np-classified-meta">
            International Summer School · July–August 2025
          </p>
          <p>
            Immersive study in metaverse development, spatial frameworks, and
            3D environment logic.
          </p>
        </article>

        <article className="np-classified">
          <h3 className="np-classified-kicker">Leadership</h3>
          <h4 className="np-classified-title">Youth Intelligentsia</h4>
          <p className="np-classified-meta">President · FAST Chapter</p>
          <p>
            The chapter’s public face and organiser — community, debate, and
            taking ideas seriously.
          </p>
        </article>
      </div>

      <div className="np-double-rule" aria-hidden="true" />

      <section className="np-stamps" aria-label="Official certifications">
        <h2 className="np-skills-banner">
          Official Certifications
        </h2>
        <div className="np-stamp-grid">
          {CERTIFICATIONS.map((cert) => (
            <article key={cert.house} className="np-stamp">
              <p className="np-stamp-house">{cert.house}</p>
              <ul>
                {cert.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <div className="np-double-rule" aria-hidden="true" />

      <section className="np-skills" aria-label="Technical arsenal">
        <h2 className="np-skills-banner">Tools &amp; Technologies</h2>
        <div className="np-skills-grid">
          {SKILL_COLUMNS.map((col) => (
            <div key={col.title} className="np-skills-col">
              <h3 className="np-skills-col-title">{col.title}</h3>
              <ul>
                {col.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </NewspaperPage>
  );
}

export default EducationSkillsPage;
