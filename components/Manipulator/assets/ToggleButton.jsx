const ToggleButton = ({ setState, isOpen }) => {
    return (
        <label className="switch">
            <input
                type="checkbox"
                className="input"
                checked={!isOpen}
                onChange={() => setState((prev) => !prev)}
            />
            <span className="slider"></span>
        </label>
    );
};

export default ToggleButton