/**
 * Root React component.
 *
 * Holds the current experience stage in React state and wires:
 * - ExperienceController — which scene to show
 * - RestartJourneyButton — jump back to Intro from later stages
 * - Audio unlock — browsers block autoplay until the user clicks / types / moves
 *
 * `useLayoutEffect` runs before the browser paints, so child intro animations
 * can start after sounds are already preloading.
 */
import { useLayoutEffect, useState } from 'react';
import { ExperienceStage } from './experience';
import ExperienceController from '../components/ExperienceController';
import RestartJourneyButton from '../components/RestartJourneyButton';
import SiteWatermark from '../components/SiteWatermark';
import {
  installAudioUnlock,
  resetAudioSession,
} from '../audio/stageAudio';
import './app.css';

function App() {
  // Start on the sketchbook. Later stages call setCurrentStage via onStageChange.
  const [currentStage, setCurrentStage] = useState<ExperienceStage>(
    ExperienceStage.Intro,
  );

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
          // Soft-stop looping beds, then allow reveal cues to play again.
          resetAudioSession({ fadeOut: 0.6 });
          setCurrentStage(ExperienceStage.Intro);
        }}
      />

      <SiteWatermark stage={currentStage} />
    </>
  );
}

export default App;
