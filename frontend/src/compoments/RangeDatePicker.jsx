import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {DateRange} from 'react-date-range';
import {useState} from 'react';
import PropTypes from "prop-types";
import SimpleResultCard from "./SimpleResultCard.jsx";

function RangeDatePicker({title,description}) {
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
            color: 'fc8c03'
        }
    ]);

    const handleSelect = (ranges) => {
        // Log the selected range to the console
        console.log('Selected range:', ranges);

        // Set the selected date range
        setDateRange([ranges.selection]);

        // You can perform other actions here based on the selected range
        // For example: Trigger an API call, update state in parent components, etc.
    };

    return (
        <div className="font-play bg-gray-50">
        <div
            className="block pt-10 h-240">
            <h5 className=" mb-2 font-bold text-2xl tracking-tight text-gray-900 text-center  ">{title}</h5>
            <p className="font-normal text-gray-700 text-center">{description}</p>
        </div>
            <div className="flex items-center justify-center h-96  ">

                <DateRange
                    editableDateInputs={true}
                    onChange={handleSelect}
                    moveRangeOnFirstSelection={true}
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
};

export default RangeDatePicker;
