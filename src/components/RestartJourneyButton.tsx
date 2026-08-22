import { ExperienceStage } from '../app/experience';

type RestartJourneyButtonProps = {
  stage: ExperienceStage;
  onRestart: () => void;
};

function variantForStage(stage: ExperienceStage): string {
  switch (stage) {
    case ExperienceStage.Space:
      return 'space';
    case ExperienceStage.EarthDive:
      return 'dive';
    case ExperienceStage.Notebook:
      return 'notebook';
    default:
      return 'space';
  }
}

/**
 * Top-right “Restart Journey” — hidden on Intro.
 * CSS modifier classes (see app.css) restyle it: cyan HUD in Space,
 * warm HUD in Dive, paper chip on the newspaper.
 */
function RestartJourneyButton({ stage, onRestart }: RestartJourneyButtonProps) {
  if (stage === ExperienceStage.Intro) return null;

  return (
    <button
      type="button"
      className={`restart-journey restart-journey--${variantForStage(stage)}`}
      onClick={onRestart}
    >
      Restart Journey
    </button>
  );
}

export default RestartJourneyButton;
