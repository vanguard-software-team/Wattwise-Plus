import PropTypes from "prop-types";
import { useState, useEffect } from "react";

function ForecastingGroupButtons({
	handleGranularityChange,
	handleForecastingHorizonChange,
	buttonNames,
	buttonForecastingHorizon,
	defaultButtonName,
	defaultForecastingHorizon,
}) {
useEffect(() => {
    setFocusedButton(defaultButtonName);
    setFocusedForecastingButton(defaultForecastingHorizon);
    handleGranularityChange(defaultButtonName);
    handleForecastingHorizonChange(defaultForecastingHorizon);
}, [defaultButtonName, defaultForecastingHorizon, handleGranularityChange, handleForecastingHorizonChange]);

	const buttonGranularityClass = "px-4 py-2 bg-orange-50 cursor-pointer border-t border-b border-gray-200 hover:bg-gray-100 hover:text-orange-400 focus:z-10 focus:ring-2 focus:ring-orange-400 focus:text-orange-500";
	const buttonForecastingHorizonClass = "px-4 py-2 bg-blue-50 cursor-pointer border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-400 focus:z-10 focus:ring-2 focus:ring-blue-400 focus:text-blue-500";
    const selectedGranularityClass = "z-10 ring-2 ring-orange-400 text-orange-500";
    const selectedForecastingHorizonClass = "z-10 ring-2 ring-blue-400 text-blue-500";

	const [focusedButton, setFocusedButton] = useState(defaultButtonName);
	const [focusedForecastingButton, setFocusedForecastingButton] = useState(defaultForecastingHorizon);

	function handleChange(event, buttonName) {
		setFocusedButton(buttonName);
		handleGranularityChange(buttonName);
	}

	function handleForecastingChange(event, buttonName) {
		setFocusedForecastingButton(buttonName);
		handleForecastingHorizonChange(buttonName);
	}

	return (
		<div>
<div className="inline-flex justify-end items-end text-sm font-medium text-gray-900">
    {buttonNames.map((buttonName, index) => (
    <button
        key={index}
        onClick={(event) => handleChange(event, buttonName)}
        className={`${buttonGranularityClass} ${
            focusedButton === buttonName || defaultButtonName === buttonName ? selectedGranularityClass : ""
        } ${index === 0 ? "rounded-l-lg" : ""}`}
    >
        {buttonName}
    </button>
    ))}
</div>
<div className="inline-flex mt-4 justify-end items-end text-sm font-medium text-gray-900">
    {buttonForecastingHorizon.map((buttonName, index) => (
        <button
            key={index}
            onClick={(event) => handleForecastingChange(event, buttonName)}
            className={`${buttonForecastingHorizonClass} ${
                focusedForecastingButton === buttonName ? selectedForecastingHorizonClass : ""
            } ${index === 0 ? "" : ""} ${
                index === buttonForecastingHorizon.length - 1 ? "rounded-r-lg" : ""
            }`}
        >
            {buttonName}
        </button>
    ))}
</div>
		</div>
	);
}

ForecastingGroupButtons.propTypes = {
	handleGranularityChange: PropTypes.func.isRequired,
	handleForecastingHorizonChange: PropTypes.func.isRequired,
	buttonNames: PropTypes.arrayOf(PropTypes.string).isRequired,
	buttonForecastingHorizon: PropTypes.arrayOf(PropTypes.string).isRequired,
	defaultButtonName: PropTypes.string.isRequired,
	defaultForecastingHorizon: PropTypes.string.isRequired,
};

export default ForecastingGroupButtons;
