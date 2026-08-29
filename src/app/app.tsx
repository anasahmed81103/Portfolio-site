/**
 * Root React component.
 *
 * Holds the current experience stage in React state and wires:
 * - BootScreen — session preload so Earth / newspaper / audio are ready
 * - ExperienceController — which scene to show
 * - RestartJourneyButton — jump back to Intro from later stages
 * - Audio unlock — browsers block autoplay until the user clicks / types / moves
 *
 * Intro is not mounted until preload finishes, so reveal sounds cannot start
 * while textures are still on the network.
 */
import { useCallback, useLayoutEffect, useState } from 'react';
import { ExperienceStage } from './experience';
import ExperienceController from '../components/ExperienceController';
import RestartJourneyButton from '../components/RestartJourneyButton';
import SiteWatermark from '../components/SiteWatermark';
import BootScreen from '../components/boot/BootScreen';
import {
  installAudioUnlock,
  resetAudioSession,
} from '../audio/stageAudio';
import './app.css';

function App() {
  const [sessionReady, setSessionReady] = useState(false);
  // Start on the sketchbook. Later stages call setCurrentStage via onStageChange.
  const [currentStage, setCurrentStage] = useState<ExperienceStage>(
    ExperienceStage.Intro,
  );

  useLayoutEffect(() => {
    installAudioUnlock();
  }, []);

  const handleBootComplete = useCallback(() => {
    setSessionReady(true);
  }, []);

  if (!sessionReady) {
    return <BootScreen onComplete={handleBootComplete} />;
  }

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
