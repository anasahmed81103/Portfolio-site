/**
 * First paint of a session: ruled notebook page + a small ink doodle.
 *
 * Stays up until `preloadSessionAssets` finishes (Earth maps, newspaper
 * photos, sounds, fonts). Intro is not mounted yet, so reveal audio cannot
 * start ahead of the textures.
 */
import { useEffect, useRef, useState } from 'react';
import { preloadSessionAssets } from '../../preload/sessionAssets';
import IntroPlaneSvg from '../intro/IntroPlaneSvg';
import './boot.css';

const MIN_MS = 900;
const LEAVE_MS = 420;

const STATUS_LINES = [
  { until: 0.22, text: 'sharpening pencils…' },
  { until: 0.45, text: 'unfolding the atlas…' },
  { until: 0.68, text: 'warming the globe…' },
  { until: 0.9, text: 'inking the headlines…' },
  { until: 1, text: 'ready when you are' },
] as const;

function statusFor(progress: number): string {
  for (const line of STATUS_LINES) {
    if (progress < line.until) return line.text;
  }
  return STATUS_LINES[STATUS_LINES.length - 1].text;
}

type BootScreenProps = {
  onComplete: () => void;
};

function BootScreen({ onComplete }: BootScreenProps) {
  const [target, setTarget] = useState(0);
  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const shownRef = useRef(0);
  const completedRef = useRef(false);
  const startedAtRef = useRef(0);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const next = shownRef.current + (target - shownRef.current) * 0.12;
      const snapped =
        target >= 1 && next > 0.995 ? 1 : Math.min(target, next);
      shownRef.current = snapped;
      setShown(snapped);
      if (Math.abs(target - snapped) > 0.002) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  useEffect(() => {
    let cancelled = false;
    startedAtRef.current = performance.now();

    const finish = () => {
      if (cancelled || completedRef.current) return;
      completedRef.current = true;
      shownRef.current = 1;
      setShown(1);
      setLeaving(true);
      window.setTimeout(onComplete, LEAVE_MS);
    };

    void preloadSessionAssets((ratio) => {
      if (cancelled) return;
      setTarget(ratio);
      if (ratio < 1) return;

      const elapsed = performance.now() - startedAtRef.current;
      const wait = Math.max(0, MIN_MS - elapsed);
      window.setTimeout(finish, wait);
    });

    return () => {
      cancelled = true;
    };
  }, [onComplete]);

  const percent = Math.round(shown * 100);
  const status = statusFor(shown);

  return (
    <div
      className={`boot-screen${leaving ? ' boot-screen--leaving' : ''}`}
      style={{ ['--boot-p' as string]: String(shown) }}
      role="status"
      aria-live="polite"
      aria-label={`Loading portfolio, ${percent} percent`}
    >
      <div className="boot-page" aria-hidden="true" />

      <div className="boot-card">
        <p className="boot-kicker">the notebook is waking up</p>
        <h1 className="boot-title">just a moment</h1>

        <svg className="boot-globe" viewBox="0 0 120 120">
          <circle
            className="boot-globe-stroke"
            cx="60"
            cy="60"
            r="38"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          <ellipse
            className="boot-globe-stroke"
            cx="60"
            cy="60"
            rx="16"
            ry="38"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            className="boot-globe-stroke"
            d="M24 48 C40 42 80 42 96 48 M24 72 C40 78 80 78 96 72"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            className="boot-globe-stroke boot-globe-land"
            d="M42 40 C48 36 54 44 58 50 C62 58 52 62 46 58 C40 52 38 46 42 40 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>

        <div className="boot-flight">
          <svg className="boot-flight-path" viewBox="0 0 240 64">
            <path
              d="M8 48 C 70 8, 150 8, 232 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeDasharray="5 7"
              strokeLinecap="round"
            />
          </svg>
          <div className="boot-plane-wrap">
            <IntroPlaneSvg className="boot-plane" />
          </div>
        </div>

        <div className="boot-bar" aria-hidden="true">
          <span className="boot-bar-fill" />
        </div>

        <p className="boot-status">{status}</p>
        <p className="boot-percent">{percent}%</p>
      </div>
    </div>
  );
}

export default BootScreen;
