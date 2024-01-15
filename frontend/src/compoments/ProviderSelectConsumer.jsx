import PropTypes from "prop-types";
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlug, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const seachInputClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-300 block w-full ps-10 p-2.5";
const searchButtonClass = "p-2.5 ms-2 text-sm font-medium text-white bg-orange-400 rounded-lg border hover:bg-orange-500 focus:ring-2 focus:outline-none focus:ring-orange-300";

function ProviderDashboardConsumer({ onSubmit }) {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };
	
    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(inputValue);
    };

    return (
        <div className="flex justify-center items-center ">
            <form className="flex lg:w-1/2 w-full items-center mt-10 p-2" onSubmit={handleSubmit}>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <FontAwesomeIcon icon={faPlug} className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                        type="number"
                        className={seachInputClass}
                        placeholder="Number of power supply of a consumer"
                        required
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </div>
                <button
                    type="submit"
                    className={searchButtonClass}
                >
                    <FontAwesomeIcon className="w-4 h-4" icon={faMagnifyingGlass} />
                    <span className="sr-only">Search</span>
                </button>
            </form>
        </div>
    );
}


ProviderDashboardConsumer.propTypes = {
    onSubmit: PropTypes.func.isRequired
};
export default ProviderDashboardConsumer;
