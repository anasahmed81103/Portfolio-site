import NewspaperPage from '../NewspaperPage';
import NewspaperHeader from '../NewspaperHeader';
import Article from '../Article';
import NewspaperPhoto from '../NewspaperPhoto';
import HandAnnotation from '../HandAnnotation';

const SKILL_COLUMNS = [
  {
    title: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML / CSS'],
  },
  {
    title: 'Front of house',
    items: ['React', 'Three.js / R3F', 'GSAP', 'Vite', 'Design systems'],
  },
  {
    title: 'Back of house',
    items: ['Node', 'APIs', 'Databases', 'Auth patterns', 'Cloud basics'],
  },
  {
    title: 'Vision & AI',
    items: ['CV pipelines', 'Model eval', 'Data tooling', 'MLops notes'],
  },
] as const;

/** PAGE 5 — Education article + editorial skills layout. */
function EducationSkillsPage() {
  return (
    <NewspaperPage className="np-education" folio="Page 5 — Education & Skills">
      <NewspaperHeader variant="interior" sectionTitle="Education & Skills" />

      <div className="np-education-layout">
        <Article
          className="np-education-feature"
          dropCap
          headline="Cum laude, and then the real curriculum"
          dek="Formal study reported with the same ink as the rest of the paper."
          byline="Education · Special Section"
        >
          <p>
            <strong>University Name</strong> — Bachelor of Science in Computer
            Science (placeholder). Honors, GPA, and notable coursework will
            replace this paragraph.
          </p>
          <p>
            Societies, debate, leadership, and the side quests that shaped the
            person behind the byline belong in the second column of this story.
          </p>
          <div className="np-education-facts">
            <div>
              <p className="np-fact-label">Degree</p>
              <p className="np-fact-value">B.S. Computer Science</p>
            </div>
            <div>
              <p className="np-fact-label">Standing</p>
              <p className="np-fact-value">Cum Laude · placeholder</p>
            </div>
            <div>
              <p className="np-fact-label">Focus</p>
              <p className="np-fact-value">AI / Vision · Systems</p>
            </div>
          </div>
        </Article>

        <aside className="np-education-aside">
          <NewspaperPhoto
            alt="Campus or study placeholder"
            aspect="portrait"
            caption="Years of study, compressed into one plate."
            credit="Campus file"
            placeholderLabel="Campus"
          />
          <HandAnnotation>add diploma details later</HandAnnotation>
        </aside>
      </div>

      <div className="np-double-rule" aria-hidden="true" />

      <section className="np-skills" aria-label="Skills">
        <h2 className="np-skills-banner">The toolshed — reported by department</h2>
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
