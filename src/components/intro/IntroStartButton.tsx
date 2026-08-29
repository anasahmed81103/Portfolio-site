type IntroStartButtonProps = {
  disabled?: boolean;
  pressed?: boolean;
  onClick: () => void;
};

/** Desktop diary CTA — GSAP in IntroAnimationController fades this in. */
function IntroStartButton({ disabled, pressed, onClick }: IntroStartButtonProps) {
  return (
    <button
      type="button"
      className={`intro-start-button${pressed ? ' is-pressed' : ''}`}
      disabled={disabled}
      onPointerDown={(event) => {
        event.stopPropagation();
        onClick();
      }}
      onClick={onClick}
      aria-label="Start journey"
    >
      START JOURNEY
    </button>
  );
}

export default IntroStartButton;
