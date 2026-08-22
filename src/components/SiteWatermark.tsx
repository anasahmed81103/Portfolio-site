import { ExperienceStage } from '../app/experience';

type SiteWatermarkProps = {
  stage: ExperienceStage;
};

function variantForStage(stage: ExperienceStage): string {
  switch (stage) {
    case ExperienceStage.Intro:
      return 'intro';
    case ExperienceStage.Space:
      return 'space';
    case ExperienceStage.EarthDive:
      return 'dive';
    case ExperienceStage.Notebook:
      return 'notebook';
    default:
      return 'intro';
  }
}

/** Small bottom copyright line — quiet watermark, not a footer bar. */
function SiteWatermark({ stage }: SiteWatermarkProps) {
  const year = new Date().getFullYear();

  return (
    <p
      className={`site-watermark site-watermark--${variantForStage(stage)}`}
      aria-label={`Copyright ${year} Anas Ahmed`}
    >
      © {year} Anas Ahmed · All rights reserved
    </p>
  );
}

export default SiteWatermark;
