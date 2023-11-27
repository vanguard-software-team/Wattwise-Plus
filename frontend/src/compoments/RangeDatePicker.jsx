import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import { useState } from 'react';

function RangeDatePicker() {
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
        <div className="font-play flex items-center justify-center h-96 border-orange-400 border-b-2 rounded-lg bg-gray-50">
            <DateRange
                editableDateInputs={true}
                onChange={handleSelect}
                moveRangeOnFirstSelection={true}
                ranges={dateRange}
                color="#fc8c03"
            />
        </div>
    );
}

export default RangeDatePicker;
