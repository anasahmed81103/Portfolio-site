import { ExperienceStage } from '../app/experience';
import IntroExperience from './IntroExperience';
import SpaceExperience from './SpaceExperience';
import EarthDiveExperience from './EarthDiveExperience';
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
      return <IntroExperience />;

    case ExperienceStage.Space:
      return <SpaceExperience />;

    case ExperienceStage.EarthDive:
      return (
        <EarthDiveExperience
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
