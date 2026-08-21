import { ExperienceStage } from '../app/experience';
import IntroExperience from './IntroExperience';
import OrbitalExperience from './OrbitalExperience';
import BookExperience from './BookExperience';
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

    // Same component instance for Space → Earth Dive keeps one Canvas alive.
    case ExperienceStage.Space:
    case ExperienceStage.EarthDive:
      return (
        <OrbitalExperience
          stage={stage}
          onProgressToDive={() =>
            onStageChange?.(ExperienceStage.EarthDive)
          }
          onBookHandoff={() => onStageChange?.(ExperienceStage.Book)}
        />
      );

    case ExperienceStage.Book:
      return <BookExperience />;

    case ExperienceStage.Notebook:
      return <NotebookExperience />;
  }
}

export default ExperienceController;
