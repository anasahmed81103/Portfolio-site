import { useState } from 'react';
import { ExperienceStage } from './experience';
import ExperienceController from '../components/ExperienceController';
import RestartJourneyButton from '../components/RestartJourneyButton';
import './app.css';

function App() {
  const [currentStage, setCurrentStage] = useState<ExperienceStage>(
    ExperienceStage.Intro,
  );

  return (
    <>
      <ExperienceController
        stage={currentStage}
        onStageChange={setCurrentStage}
      />

      <RestartJourneyButton
        stage={currentStage}
        onRestart={() => setCurrentStage(ExperienceStage.Intro)}
      />

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
