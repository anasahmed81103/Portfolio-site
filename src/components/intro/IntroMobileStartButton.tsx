type IntroMobileStartButtonProps = {
  exiting?: boolean;
  onClick: () => void;
};

/**
 * Mobile-only intro CTA. Separate from the desktop button so GSAP / HMR
 * cannot hide or disable it. Lives inside the intro shell so the black
 * handoff (z-index 30) covers it on the way to Space.
 */
function IntroMobileStartButton({
  exiting = false,
  onClick,
}: IntroMobileStartButtonProps) {
  return (
    <button
      type="button"
      className={`intro-mobile-start${exiting ? ' is-exiting' : ''}`}
      onClick={onClick}
      aria-label="Start journey"
    >
      START JOURNEY
    </button>
  );
}

export default IntroMobileStartButton;
