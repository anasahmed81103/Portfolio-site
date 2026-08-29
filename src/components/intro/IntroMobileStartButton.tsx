type IntroMobileStartButtonProps = {
  exiting?: boolean;
  onClick: () => void;
};

/** Docked Start Journey — plain button, no extra touch listeners. */
function IntroMobileStartButton({
  exiting = false,
  onClick,
}: IntroMobileStartButtonProps) {
  return (
    <button
      type="button"
      className={`intro-mobile-start${exiting ? ' is-exiting' : ''}`}
      onClick={onClick}
      disabled={exiting}
      aria-label="Start journey"
    >
      START JOURNEY
    </button>
  );
}

export default IntroMobileStartButton;
