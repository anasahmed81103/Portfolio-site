type IntroStartButtonProps = {
  disabled?: boolean;
  pressed?: boolean;
  onClick: () => void;
};

/** Paper-style diary CTA — the only trigger into Space. */
function IntroStartButton({ disabled, pressed, onClick }: IntroStartButtonProps) {
  return (
    <button
      type="button"
      className={`intro-start-button${pressed ? ' is-pressed' : ''}`}
      disabled={disabled}
      onClick={onClick}
      aria-label="Start journey"
    >
      START JOURNEY
    </button>
  );
}

export default IntroStartButton;
