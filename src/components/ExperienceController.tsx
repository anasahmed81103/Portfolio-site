/**
 * Stage switcher — picks which full-screen experience to mount.
 *
 * Important: Space and Earth Dive share ONE OrbitalExperience (one WebGL Canvas).
 * If we unmounted Space and mounted a new Dive scene, Earth would flicker black
 * while Three.js rebuilt the GPU context. Switching only the `stage` prop keeps
 * the planet, stars, and lights alive.
 *
 * `onBookHandoff` is just the name of the callback that leaves orbit for the
 * newspaper — there is no 3D book stage anymore.
 */
import { ExperienceStage } from '../app/experience';
import IntroExperience from './IntroExperience';
import OrbitalExperience from './OrbitalExperience';
import NotebookExperience from './NotebookExperience';

interface ExperienceControllerProps {
  stage: ExperienceStage;
  onStageChange?: (stage: ExperienceStage) => void;
}

function ExperienceController({
  stage,
  onStageChange,
}: ExperienceControllerProps) {
  switch (stage) {
    case ExperienceStage.Intro:
      return (
        <IntroExperience
          onSpaceHandoff={() => onStageChange?.(ExperienceStage.Space)}
        />
      );

    case ExperienceStage.Space:
    case ExperienceStage.EarthDive:
      return (
        <OrbitalExperience
          stage={stage}
          onProgressToDive={() =>
            onStageChange?.(ExperienceStage.EarthDive)
          }
          onBookHandoff={() => onStageChange?.(ExperienceStage.Notebook)}
        />
      );

    case ExperienceStage.Notebook:
      return <NotebookExperience />;
  }
}

export default ExperienceController;
