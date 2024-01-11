import PropTypes from "prop-types";
import { useState, useEffect } from "react";

function ForecastingGranularityButtons({
	handleGranularityChange,
	granularityButtonNames,
	defaultGranularityButton,
}) {
    useEffect(() => {
        setFocusedButton(defaultGranularityButton);
    }, [defaultGranularityButton]);

	const buttonGranularityClass =
		"px-4 py-2 bg-orange-50 cursor-pointer text-sm border-t border-b border-gray-200 hover:bg-gray-100 hover:text-orange-400 focus:z-10 focus:ring-2 focus:ring-orange-400 focus:text-orange-500";
	const selectedGranularityClass =
		"z-10 ring-2 ring-orange-400 text-orange-500";

	const [focusedButton, setFocusedButton] = useState(defaultGranularityButton);

	function handleChange(event, buttonName) {
		setFocusedButton(buttonName);
		handleGranularityChange(buttonName);
	}

	return (
		<div>
			<div className="inline-flex justify-end pb-2 text-sm font-medium text-gray-900">
				{granularityButtonNames.map((buttonName, index) => (
					<button
						key={index}
						onClick={(event) => handleChange(event, buttonName)}
						className={`${buttonGranularityClass} ${
							focusedButton === buttonName ||
							defaultGranularityButton === buttonName
								? selectedGranularityClass
								: ""
						} ${index === 0 ? "rounded-l-lg" : ""}`}
					>
						{buttonName}
					</button>
				))}
			</div>
		</div>
	);
}

ForecastingGranularityButtons.propTypes = {
	handleGranularityChange: PropTypes.func.isRequired,
	granularityButtonNames: PropTypes.arrayOf(PropTypes.string).isRequired,
	defaultGranularityButton: PropTypes.string.isRequired,
};

export default ForecastingGranularityButtons;
