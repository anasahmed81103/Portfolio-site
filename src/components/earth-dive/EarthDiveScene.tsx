import OrbitalScene from '../space/OrbitalScene';

/** @deprecated Use OrbitalScene — kept so older imports keep working. */
function EarthDiveScene() {
  return <OrbitalScene mode="dive" skipVisionReveal />;
}

export default EarthDiveScene;
