import PropTypes from "prop-types";
import { useState, useEffect } from "react";

function GroupButtonsGranularity({
	handleGranularityChange,
	buttonNames,
	defaultButtonName,
}) {
	useEffect(() => {
		setFocusedButton(defaultButtonName);
		handleGranularityChange(defaultButtonName);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultButtonName]);

	const buttonClass =
		"px-4 py-2 bg-white cursor-pointer border-t border-b border-gray-200 hover:bg-gray-100 hover:text-orange-400 focus:z-10 focus:ring-2 focus:ring-orange-400 focus:text-orange-500";
	const selectedButtonAddClass = "z-10 ring-2 ring-orange-400 text-orange-500";

	const [focusedButton, setFocusedButton] = useState(defaultButtonName);

	function handleChange(event, buttonName) {
		setFocusedButton(buttonName);
		handleGranularityChange(buttonName);
	}

	return (
		<div className="inline-flex justify-end items-end text-sm font-medium text-gray-900">
			{buttonNames.map((buttonName, index) => (
				<button
					key={index}
					onClick={(event) => handleChange(event, buttonName)}
					className={`${buttonClass} ${
						focusedButton === buttonName ? selectedButtonAddClass : ""
					} ${index === 0 ? "rounded-l-lg" : ""} ${
						index === buttonNames.length - 1 ? "rounded-r-lg" : ""
					}`}
				>
					{buttonName}
				</button>
			))}
		</div>
	);
}

GroupButtonsGranularity.propTypes = {
	handleGranularityChange: PropTypes.func.isRequired,
	buttonNames: PropTypes.arrayOf(PropTypes.string).isRequired,
	defaultButtonName: PropTypes.string.isRequired,
};

export default GroupButtonsGranularity;
