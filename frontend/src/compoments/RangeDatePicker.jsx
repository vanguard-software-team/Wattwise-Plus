import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {useState} from 'react';
import PropTypes from 'prop-types';
import {DateRange, DateRangePicker} from 'react-date-range';


function RangeDatePicker({title, description, handleRangeChange}) {
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
            color: 'fc8c03',
        },
    ]);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSelect = (ranges) => {
        setDateRange([ranges.selection]);
        handleRangeChange(ranges.selection);
    };

    const handleButtonClick = () => {
        setShowDatePicker(!showDatePicker); // Toggle the visibility of the date picker
    };

    return (
        <div className="font-play bg-gray-50">
            <div className="block pt-10 h-240">
                <h5 className="mb-2 font-bold text-2xl tracking-tight text-gray-900 text-center">{title}</h5>
                <p className="font-normal text-gray-700 text-center">{description}</p>
            </div>
            <div className="text-center mt-4">
                <button onClick={handleButtonClick}
                        className="text-2xs bg-orange-400 hover:bg-gray-500 font-bold text-white text-sm  py-2 px-4 rounded mb-2 ">
                    {showDatePicker ? 'Hide Dates' : 'Show Dates'}
                </button>
            </div>
            <div className="flex lg:hidden items-center justify-center h-auto mb-4">
                {showDatePicker && (
                    <DateRange
                        editableDateInputs={true}
                        onChange={handleSelect}
                        ranges={dateRange}
                        color="#fc8c03"
                        maxDate={new Date()}
                    />
                )}
            </div>
            <div className="hidden lg:flex items-center justify-center h-auto mb-4">
                {showDatePicker && (
                    <DateRangePicker
                        editableDateInputs={true}
                        onChange={handleSelect}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        ranges={dateRange}
                        color="#fc8c03"
                        direction="horizontal"
                        maxDate={new Date()}
                    />
                )}
            </div>


        </div>
    );
}

RangeDatePicker.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    handleRangeChange: PropTypes.func,
};

export default RangeDatePicker;
