import { useLayoutEffect, useState } from 'react';
import { ExperienceStage } from './experience';
import ExperienceController from '../components/ExperienceController';
import RestartJourneyButton from '../components/RestartJourneyButton';
import {
  installAudioUnlock,
  resetAudioSession,
} from '../audio/stageAudio';
import './app.css';

function App() {
  const [currentStage, setCurrentStage] = useState<ExperienceStage>(
    ExperienceStage.Intro,
  );

  // Layout phase — before child intro effects — so unlock + preload are ready.
  useLayoutEffect(() => {
    installAudioUnlock();
  }, []);

  return (
    <>
      <ExperienceController
        stage={currentStage}
        onStageChange={setCurrentStage}
      />

      <RestartJourneyButton
        stage={currentStage}
        onRestart={() => {
          resetAudioSession({ fadeOut: 0.6 });
          setCurrentStage(ExperienceStage.Intro);
        }}
      />
    </>
  );
}

export default App;
