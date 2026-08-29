import { useEffect, useRef, useState } from 'react';

type IntroMobileStartButtonProps = {
  exiting?: boolean;
  onClick: () => void;
};

const REVEAL_MS = 2400;

/**
 * Docked Start Journey control for real phones / touch.
 * Always mounted; CSS + `.intro-dock` hide it on mouse desktops.
 *
 * Real Chrome often never synthesizes `click` after a finger tap
 * (micro-movement + overflow:hidden). Native touchend/pointerdown
 * must fire the action — DevTools mouse clicks hide that bug.
 */
function IntroMobileStartButton({
  exiting = false,
  onClick,
}: IntroMobileStartButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), REVEAL_MS);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const fire = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      if (exiting) return;
      onClick();
    };

    button.addEventListener('touchend', fire, { passive: false });
    button.addEventListener('pointerdown', fire);
    button.addEventListener('click', fire);
    return () => {
      button.removeEventListener('touchend', fire);
      button.removeEventListener('pointerdown', fire);
      button.removeEventListener('click', fire);
    };
  }, [exiting, onClick]);

  const shown = visible && !exiting;

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`intro-mobile-start${visible ? ' is-visible' : ''}${exiting ? ' is-exiting' : ''}`}
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      aria-disabled={exiting || undefined}
      aria-label="Start journey"
    >
      START JOURNEY
    </button>
  );
}

export default IntroMobileStartButton;
