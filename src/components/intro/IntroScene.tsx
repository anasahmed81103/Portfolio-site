import IntroAnimationController from './IntroAnimationController';
import IntroPage from './IntroPage';
import IntroDoodles from './IntroDoodles';
import IntroPolaroids from './IntroPolaroids';
import IntroSignature from './IntroSignature';
import './intro.css';

/**
 * Notebook intro scene: lined page, doodles, polaroids, signature.
 */
function IntroScene() {
  return (
    <IntroAnimationController>
      <IntroPage />
      <IntroDoodles />
      <IntroPolaroids />
      <IntroSignature />
    </IntroAnimationController>
  );
}

export default IntroScene;
