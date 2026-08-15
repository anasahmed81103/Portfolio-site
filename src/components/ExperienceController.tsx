import { ExperienceStage } from '../app/experience';
import IntroExperience from './IntroExperience';
import SpaceExperience from './SpaceExperience';
import EarthDiveExperience from './EarthDiveExperience';
import BookExperience from './BookExperience';
import NotebookExperience from './NotebookExperience';

interface ExperienceControllerProps {
  stage: ExperienceStage;
}

function ExperienceController({
  stage,
}: ExperienceControllerProps) {
  switch (stage) {
    case ExperienceStage.Intro:
      return <IntroExperience />;

    case ExperienceStage.Space:
      return <SpaceExperience />;

    case ExperienceStage.EarthDive:
      return <EarthDiveExperience />;

    case ExperienceStage.Book:
      return <BookExperience />;

    case ExperienceStage.Notebook:
      return <NotebookExperience />;
  }
}

export default ExperienceController;