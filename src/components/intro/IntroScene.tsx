import type { ReactNode } from 'react';
import IntroAnimationController from './IntroAnimationController';
import IntroPage from './IntroPage';
import IntroDoodles from './IntroDoodles';
import IntroAnnotations from './IntroAnnotations';
import IntroPolaroids from './IntroPolaroids';
import IntroSignature from './IntroSignature';
import './intro.css';

type IntroSceneProps = {
  inkTrail?: ReactNode;
};

/**
 * Assembles the intro page pieces. IntroAnimationController wraps them so
 * one GSAP timeline can find `.intro-doodle`, `.intro-polaroid`, etc. via
 * CSS class names (see intro.css).
 *
 * Start buttons stay outside this tree — `.intro-scene` is
 * `pointer-events: none`, and some mobile engines ignore
 * `pointer-events: auto` on descendants of that.
 */
function IntroScene({ inkTrail }: IntroSceneProps) {
  return (
    <IntroAnimationController>
      <IntroPage />
      <IntroDoodles />
      <IntroAnnotations />
      <IntroPolaroids />
      <IntroSignature />
      {inkTrail}
    </IntroAnimationController>
  );
}

export default IntroScene;
