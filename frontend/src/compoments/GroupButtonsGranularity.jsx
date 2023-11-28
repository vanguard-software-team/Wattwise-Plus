import PropTypes from "prop-types";
import {useState, useEffect} from "react";

function GroupButtonsGranularity({
                                     handleGranularityChange,
                                     buttonName1,
                                     buttonName2,
                                     buttonName3,
                                     buttonName4,
                                     defaultButtonName
                                 }) {

    useEffect(() => {
        setFocusedButton(defaultButtonName);
        handleGranularityChange(defaultButtonName);
    }, [defaultButtonName]);
    const middleButtonClass =
        "px-4 py-2 bg-white cursor-pointer border-t border-b border-gray-200 hover:bg-gray-100 hover:text-orange-400 focus:z-10 focus:ring-2 focus:ring-orange-400 focus:text-orange-500";
    const leftButtonClass = middleButtonClass + " rounded-l-lg";
    const rightButtonClass = middleButtonClass + " rounded-r-lg";
    const selectedButtonAddClass = " z-10 ring-2 ring-orange-400 text-orange-500"

    const [focusedButton, setFocusedButton] = useState(defaultButtonName);

    function handleChange(event, buttonName) {
        setFocusedButton(buttonName);
        handleGranularityChange(event.target.innerText);
    }

    return (
        <div className="inline-flex justify-end items-end text-sm font-medium text-gray-900">
            <button
                onClick={(event) => handleChange(event, buttonName1)}
                className={`${leftButtonClass} ${
                    focusedButton === buttonName1 ? selectedButtonAddClass : ''
                }`}
            >
                {buttonName1}
            </button>
            <button
                onClick={(event) => handleChange(event, buttonName2)}
                className={`${middleButtonClass} ${
                    focusedButton === buttonName2 ? selectedButtonAddClass : ''
                }`}
            >
                {buttonName2}
            </button>
            <button
                onClick={(event) => handleChange(event, buttonName3)}
                className={`${middleButtonClass} ${
                    focusedButton === buttonName3 ? selectedButtonAddClass : ''
                }`}
            >
                {buttonName3}
            </button>
            <button
                onClick={(event) => handleChange(event, buttonName4)}
                className={`${rightButtonClass} ${
                    focusedButton === buttonName4 ? selectedButtonAddClass : ''
                }`}
            >
                {buttonName4}
            </button>
        </div>
    );
}

GroupButtonsGranularity.propTypes = {
    handleGranularityChange: PropTypes.func.isRequired,
    buttonName1: PropTypes.string.isRequired,
    buttonName2: PropTypes.string.isRequired,
    buttonName3: PropTypes.string.isRequired,
    buttonName4: PropTypes.string.isRequired,
    defaultButtonName: PropTypes.string.isRequired,
};

export default GroupButtonsGranularity;
