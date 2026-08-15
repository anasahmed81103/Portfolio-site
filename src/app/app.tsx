import { useState } from 'react';
import { ExperienceStage } from './experience';
import ExperienceController from '../components/ExperienceController';
import './app.css';

function App() {
  const [currentStage, setCurrentStage] = useState<ExperienceStage>(
    ExperienceStage.Intro,
  );

  return (
    <>
      <ExperienceController stage={currentStage} />

      <nav>
        {Object.values(ExperienceStage).map((stage) => (
          <button
            key={stage}
            type="button"
            onClick={() => setCurrentStage(stage)}
          >
            {stage}
          </button>
        ))}
      </nav>
    </>
  );
}

export default App;