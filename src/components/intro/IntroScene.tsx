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
 * Assembles the intro page pieces. IntroAnimationController wraps them so
 * one GSAP timeline can find `.intro-doodle`, `.intro-polaroid`, etc. via
 * CSS class names (see intro.css).
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
