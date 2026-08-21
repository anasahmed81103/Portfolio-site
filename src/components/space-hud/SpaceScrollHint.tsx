import './SpaceHud.css';

type SpaceScrollHintProps = {
  /** Space: "scroll" · Earth Dive: "scroll down" */
  label?: string;
  /** Down-arrow mark under the label (Earth Dive only). */
  showArrow?: boolean;
};

/** Blinking sci-fi cue — top-left on Space / Earth Dive. */
function SpaceScrollHint({
  label = 'scroll',
  showArrow = false,
}: SpaceScrollHintProps) {
  return (
    <p className="space-scroll-hint" aria-hidden="true">
      <span className="space-scroll-hint-row">{label}</span>
      {showArrow ? (
        <span className="space-scroll-hint-mark" aria-hidden="true">
          ↓
        </span>
      ) : null}
    </p>
  );
}

export default SpaceScrollHint;
