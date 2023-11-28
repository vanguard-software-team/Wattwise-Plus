import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {DateRange} from 'react-date-range';
import {useState} from 'react';
import PropTypes from "prop-types";

function RangeDatePicker({title, description, handleRangeChange}) {
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
            color: 'fc8c03'
        }
    ]);

    const handleSelect = (ranges) => {
        setDateRange([ranges.selection]);
        handleRangeChange(ranges.selection)
    };

    return (
        <div className="font-play bg-gray-50">
            <div
                className="block pt-10 h-240">
                <h5 className="mb-2 font-bold text-2xl tracking-tight text-gray-900 text-center">{title}</h5>
                <p className="font-normal text-gray-700 text-center">{description}</p>
            </div>
            <div className="flex items-center justify-center h-96  ">

                <DateRange
                    editableDateInputs={true}
                    onChange={handleSelect}
                    ranges={dateRange}
                    color="#fc8c03"
                />
            </div>
        </div>
    )
        ;
}

RangeDatePicker.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    handleRangeChange: PropTypes.func,
};

export default RangeDatePicker;
