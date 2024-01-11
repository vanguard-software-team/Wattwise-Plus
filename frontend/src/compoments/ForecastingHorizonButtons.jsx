import PropTypes from "prop-types";
import { useState, useEffect } from "react";

function ForecastingHorizonButtons({
	handleForecastingHorizonChange,
	buttonForecastingHorizon,
	defaultForecastingHorizon,
}) {
useEffect(() => {
    setFocusedForecastingButton(defaultForecastingHorizon);
}, [defaultForecastingHorizon]);

	const buttonForecastingHorizonClass =
		"px-4 py-2 bg-blue-50 cursor-pointer border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-400 focus:z-10 focus:ring-2 focus:ring-blue-400 focus:text-blue-500";
	const selectedForecastingHorizonClass =
		"z-10 ring-2 ring-blue-400 text-blue-500";

	const [focusedForecastingButton, setFocusedForecastingButton] = useState(
		defaultForecastingHorizon
	);

	function handleForecastingChange(event, buttonName) {
		setFocusedForecastingButton(buttonName);
		handleForecastingHorizonChange(buttonName);
	}

	return (
		<div>
			<div className="inline-flex justify-end items-end text-sm font-medium text-gray-900">
				{buttonForecastingHorizon.map((buttonName, index) => (
					<button
						key={index}
						onClick={(event) => handleForecastingChange(event, buttonName)}
						className={`${buttonForecastingHorizonClass} ${
							focusedForecastingButton === buttonName
								? selectedForecastingHorizonClass
								: ""
						} ${index === 0 ? "" : ""} ${
							index === buttonForecastingHorizon.length - 1
								? "rounded-r-lg"
								: ""
						}`}
					>
						{buttonName}
					</button>
				))}
			</div>
		</div>
	);
}

ForecastingHorizonButtons.propTypes = {
	handleForecastingHorizonChange: PropTypes.func.isRequired,
	buttonForecastingHorizon: PropTypes.arrayOf(PropTypes.string).isRequired,
	defaultForecastingHorizon: PropTypes.string.isRequired,
};

export default ForecastingHorizonButtons;
