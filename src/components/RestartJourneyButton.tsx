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
      onPointerDown={(event) => event.stopPropagation()}
      onClick={onRestart}
      aria-label="Restart Journey"
    >
      <span className="restart-label-full">Restart Journey</span>
      <span className="restart-label-short">Restart</span>
    </button>
  );
}

export default RestartJourneyButton;
