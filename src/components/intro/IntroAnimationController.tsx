import { useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';

type IntroAnimationControllerProps = {
  children: ReactNode;
};

/**
 * Owns the intro scene root and runs entrance + idle GSAP motion.
 * Wrapping children (instead of reading a parent ref) keeps the animated
 * DOM and the effect on the same component — same idea as tickers/controllers
 * living inside Space / Earth Dive scenes.
 */
function IntroAnimationController({ children }: IntroAnimationControllerProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const doodles = gsap.utils.toArray<SVGElement>('.intro-doodle', root);
      const pictures = gsap.utils.toArray<HTMLElement>('.intro-polaroid', root);
      const letters = gsap.utils.toArray<SVGPathElement>(
        '.intro-signature-letter',
        root,
      );
      const fills = gsap.utils.toArray<SVGPathElement>(
        '.intro-signature-fill',
        root,
      );
      const sketches = gsap.utils.toArray<SVGPathElement>(
        '.intro-signature-sketch',
        root,
      );
      const accents = gsap.utils.toArray<SVGPathElement>(
        '.intro-signature-underline, .intro-signature-flourish',
        root,
      );

      if (doodles.length === 0 && pictures.length === 0) return;

      gsap.set(doodles, { opacity: 0, scale: 0.35, rotate: -12 });
      gsap.set(pictures, { opacity: 0, y: 28, rotate: -6 });
      gsap.set(fills, { opacity: 0 });

      const prepareStroke = (path: SVGPathElement) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        return length;
      };

      for (const path of [...letters, ...sketches, ...accents]) {
        prepareStroke(path);
      }

      const strokeDuration = (target: SVGPathElement) => {
        const length = target.getTotalLength();
        // Font outlines are long; keep organic timing without feeling slow.
        return Math.max(0.4, Math.min(1.15, length / 900));
      };

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.to(doodles, {
        opacity: 1,
        scale: 1,
        rotate: (index: number) => (index % 2 === 0 ? -4 : 5),
        duration: 0.7,
        stagger: {
          each: 0.08,
          from: 'random',
        },
      }).to(
        pictures,
        {
          opacity: 1,
          y: 0,
          rotate: (index: number) => (index % 2 === 0 ? -3 : 4),
          duration: 0.75,
          stagger: 0.15,
        },
        '-=0.35',
      );

      // Pen draws real Allura glyph outlines, letter by letter.
      if (letters.length > 0) {
        tl.to(
          letters,
          {
            strokeDashoffset: 0,
            duration: (_i: number, target: SVGPathElement) =>
              strokeDuration(target),
            stagger: 0.1,
            ease: 'none',
          },
          '-=0.15',
        );

        // Soft fill settles in just behind the pen.
        tl.to(
          fills,
          {
            opacity: 1,
            duration: 0.45,
            stagger: 0.1,
            ease: 'power1.out',
          },
          '<0.28',
        );

        // Barely-there second pass for sketch texture (same letterforms).
        tl.to(
          sketches,
          {
            strokeDashoffset: 0,
            duration: (_i: number, target: SVGPathElement) =>
              strokeDuration(target) * 0.85,
            stagger: 0.1,
            ease: 'none',
          },
          '<0.12',
        );
      }

      if (accents.length > 0) {
        tl.to(
          accents,
          {
            strokeDashoffset: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power1.inOut',
          },
          '-=0.35',
        );
      }

      // Settle to clean filled type — keep a whisper of stroke for ink texture.
      tl.to(
        letters,
        {
          opacity: 0.18,
          duration: 0.4,
          ease: 'power1.out',
        },
        '-=0.15',
      ).to(
        sketches,
        {
          opacity: 0,
          duration: 0.35,
          ease: 'power1.out',
        },
        '<',
      );

      // Brief hold on the finished signature, then keep scene alive.
      tl.to({}, { duration: 0.55 });

      gsap.to(doodles, {
        y: (index: number) => (index % 2 === 0 ? -6 : 7),
        rotate: (index: number) => (index % 2 === 0 ? -7 : 8),
        duration: (index: number) => 2.4 + (index % 5) * 0.35,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.12,
          from: 'random',
        },
        delay: tl.duration(),
      });

      gsap.to(pictures, {
        y: '+=6',
        rotate: '+=2',
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.4,
        delay: tl.duration(),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="intro-scene"
      aria-label="Notebook intro"
    >
      {children}
    </div>
  );
}

export default IntroAnimationController;
