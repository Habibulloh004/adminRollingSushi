import "./Switch.css";

// eslint-disable-next-line react/prop-types, no-unused-vars
const Switch = ({ hasUserInteraction, setInteractionState }) => {
  return (
    <div className="containerSwitch">
      <input
        type="checkbox"
        className="checkbox peer"
        checked={hasUserInteraction}
        id="checkbox"
        onChange={() => setInteractionState()}
      />
      <label className="switch" htmlFor="checkbox">
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default Switch;
