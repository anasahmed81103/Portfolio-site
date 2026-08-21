import IntroScene from './intro/IntroScene';

/**
 * Intro stage shell — mirrors SpaceExperience / EarthDiveExperience:
 * thin viewport wrapper that mounts the scene.
 */
function IntroExperience() {
  return (
    <div className="intro-experience">
      <IntroScene />
    </div>
  );
}

export default IntroExperience;
