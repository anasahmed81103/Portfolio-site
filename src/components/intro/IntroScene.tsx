import type { ReactNode } from 'react';
import IntroAnimationController from './IntroAnimationController';
import IntroPage from './IntroPage';
import IntroDoodles from './IntroDoodles';
import IntroAnnotations from './IntroAnnotations';
import IntroPolaroids from './IntroPolaroids';
import IntroSignature from './IntroSignature';
import './intro.css';

type IntroSceneProps = {
  startButton?: ReactNode;
};

/**
 * Notebook intro scene: lined page, doodles, polaroids, signature.
 */
function IntroScene({ startButton }: IntroSceneProps) {
  return (
    <IntroAnimationController>
      <IntroPage />
      <IntroDoodles />
      <IntroAnnotations />
      <IntroPolaroids />
      <IntroSignature />
      {startButton}
    </IntroAnimationController>
  );
}

export default IntroScene;
