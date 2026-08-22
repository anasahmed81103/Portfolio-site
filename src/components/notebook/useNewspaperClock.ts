/**
 * Live masthead clock. Intl.DateTimeFormat does the locale formatting.
 * Updates every 30s — enough for a printed “edition time” without a 1s tick.
 */
import { useEffect, useState } from 'react';

export type NewspaperClock = {
  /** e.g. Friday, 21 August 2026 */
  date: string;
  /** e.g. 10:57 PM */
  time: string;
  /** Date and time for the masthead */
  masthead: string;
};

function formatClock(now: Date): NewspaperClock {
  const date = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now);

  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(now);

  return {
    date,
    time,
    masthead: `${date} · ${time}`,
  };
}

/**
 * Living edition clock — weekday, date, and time from the reader's machine.
 * State only updates when the displayed minute changes.
 */
function useNewspaperClock(): NewspaperClock {
  const [clock, setClock] = useState(() => formatClock(new Date()));

  useEffect(() => {
    const tick = () => {
      const next = formatClock(new Date());
      setClock((prev) => (prev.masthead === next.masthead ? prev : next));
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return clock;
}

export default useNewspaperClock;
