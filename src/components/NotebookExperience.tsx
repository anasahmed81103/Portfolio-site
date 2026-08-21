import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type JSX,
} from 'react';
import gsap from 'gsap';
import {
  NEWSPAPER_PAGES,
  type NewspaperPageId,
} from './notebook/newspaperData';
import PageNavigation from './notebook/PageNavigation';
import FrontPage from './notebook/pages/FrontPage';
import AboutPage from './notebook/pages/AboutPage';
import ExperiencePage from './notebook/pages/ExperiencePage';
import ProjectsPage from './notebook/pages/ProjectsPage';
import EducationSkillsPage from './notebook/pages/EducationSkillsPage';
import ResumeContactPage from './notebook/pages/ResumeContactPage';
import './notebook/newspaper.css';

const PAGE_COMPONENTS: Record<NewspaperPageId, () => JSX.Element> = {
  front: FrontPage,
  about: AboutPage,
  experience: ExperiencePage,
  projects: ProjectsPage,
  education: EducationSkillsPage,
  closing: ResumeContactPage,
};

/**
 * Final portfolio stage — living newspaper revealed after the Earth Dive flare.
 */
function NotebookExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const turningRef = useRef(false);
  const turnDirectionRef = useRef(1);
  const entranceDoneRef = useRef(false);
  const skipEntranceAnimRef = useRef(false);

  const [pageId, setPageId] = useState<NewspaperPageId>('front');
  const pageIndex = NEWSPAPER_PAGES.findIndex((p) => p.id === pageId);
  const PageComponent = PAGE_COMPONENTS[pageId];

  const goToIndex = useCallback(
    (nextIndex: number) => {
      if (turningRef.current) return;
      if (nextIndex < 0 || nextIndex >= NEWSPAPER_PAGES.length) return;
      const next = NEWSPAPER_PAGES[nextIndex];
      if (!next || next.id === pageId) return;

      const sheet = sheetRef.current;
      if (!sheet) {
        setPageId(next.id);
        return;
      }

      turnDirectionRef.current = nextIndex > pageIndex ? 1 : -1;
      turningRef.current = true;

      gsap.to(sheet, {
        x: turnDirectionRef.current * -42,
        opacity: 0.2,
        rotate: turnDirectionRef.current * -0.7,
        duration: 0.32,
        ease: 'power2.in',
        onComplete: () => {
          skipEntranceAnimRef.current = false;
          setPageId(next.id);
        },
      });
    },
    [pageId, pageIndex],
  );

  const goPrev = useCallback(() => {
    goToIndex(pageIndex - 1);
  }, [goToIndex, pageIndex]);

  const goNext = useCallback(() => {
    goToIndex(pageIndex + 1);
  }, [goToIndex, pageIndex]);

  const jumpTo = useCallback(
    (id: NewspaperPageId) => {
      const nextIndex = NEWSPAPER_PAGES.findIndex((p) => p.id === id);
      goToIndex(nextIndex);
    },
    [goToIndex],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault();
        goNext();
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  // Flare hold → paper + ink reveal (first mount only)
  useLayoutEffect(() => {
    const root = rootRef.current;
    const veil = veilRef.current;
    const sheet = sheetRef.current;
    if (!root || !veil || !sheet || entranceDoneRef.current) return;
    entranceDoneRef.current = true;
    skipEntranceAnimRef.current = true;

    const inkBits = sheet.querySelectorAll(
      '.np-masthead-title, .np-display-headline, .np-photo, .np-article, .np-teaser, .np-header',
    );

    const ctx = gsap.context(() => {
      gsap.set(veil, { opacity: 1 });
      gsap.set(sheet, { opacity: 0, y: 28, scale: 0.985 });
      gsap.set(inkBits, { opacity: 0, y: 12 });

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.to({}, { duration: 0.4 });
      tl.to(veil, { opacity: 0, duration: 0.95, ease: 'power2.inOut' });
      tl.to(
        sheet,
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' },
        '-=0.55',
      );
      tl.to(
        inkBits,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.04,
          ease: 'power2.out',
        },
        '-=0.45',
      );
    }, root);

    // Strict Mode remounts once in dev. Reset the flag so the reveal can
    // run again; otherwise the white veil stays opaque forever.
    return () => {
      ctx.revert();
      entranceDoneRef.current = false;
    };
  }, []);

  // Page-turn enter when pageId changes (not on first reveal)
  useLayoutEffect(() => {
    if (skipEntranceAnimRef.current) {
      skipEntranceAnimRef.current = false;
      return;
    }

    const sheet = sheetRef.current;
    if (!sheet) return;

    stageRef.current?.scrollTo({ top: 0, behavior: 'auto' });

    const direction = turnDirectionRef.current;
    gsap.fromTo(
      sheet,
      { x: direction * 48, opacity: 0.25, rotate: direction * 0.55 },
      {
        x: 0,
        opacity: 1,
        rotate: 0,
        duration: 0.52,
        ease: 'power3.out',
        onComplete: () => {
          turningRef.current = false;
        },
      },
    );
  }, [pageId]);

  return (
    <div ref={rootRef} className="notebook-experience">
      <div ref={stageRef} className="np-stage">
        <div ref={sheetRef} className="np-sheet">
          <PageComponent />
        </div>

        <PageNavigation
          currentId={pageId}
          onPrev={goPrev}
          onNext={goNext}
          onJump={jumpTo}
          canPrev={pageIndex > 0}
          canNext={pageIndex < NEWSPAPER_PAGES.length - 1}
        />
      </div>

      <div ref={veilRef} className="notebook-flash-veil" aria-hidden="true" />
    </div>
  );
}

export default NotebookExperience;
