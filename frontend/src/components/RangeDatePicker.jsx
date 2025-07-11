import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useState } from "react";
import PropTypes from "prop-types";
import { DateRange, DateRangePicker } from "react-date-range";

function RangeDatePicker({ title, description, handleRangeChange }) {
	const today = new Date(import.meta.env.VITE_TODAY_DATETIME);
	const [dateRange, setDateRange] = useState([
		{
			startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4),
			endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
			key: "selection",
			color: "fc8c03",
		},
	]);
	const [showDatePicker, setShowDatePicker] = useState(false);

	const handleSelect = (ranges) => {
		setDateRange([ranges.selection]);
		handleRangeChange(ranges.selection);
	};

	const handleButtonClick = () => {
		setShowDatePicker(!showDatePicker);
	};
	

	return (
		<div className="font-cairo bg-gray-50">
			<div className="block pt-10 h-240">
				<h5 className="mb-2 font-bold text-xl tracking-tight text-gray-900 text-center">
					{title}
				</h5>
				<p className="text-sm text-gray-700 text-center">{description}</p>
			</div>
			<div className="text-center mt-4">
				<button
					onClick={handleButtonClick}
					className="text-2xs bg-orange-400 hover:bg-gray-500 font-bold text-white text-xs py-1 px-2 rounded mb-2"
				>
					{showDatePicker ? "Hide Dates" : "Show Dates"}
				</button>
			</div>

			{/* <div className="flex lg:hidden items-center justify-center h-auto mb-4">
				{showDatePicker && (
					<DateRange
						editableDateInputs={true}
						onChange={handleSelect}
						ranges={dateRange}
						color="#fc8c03"
						maxDate={new Date(import.meta.env.VITE_TODAY_DATETIME)}
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
						maxDate={new Date(import.meta.env.VITE_TODAY_DATETIME)}
					/>
				)}
			</div> */}

			<div className="flex items-center justify-center h-auto mb-4">
				{showDatePicker && (
					<DateRange
						editableDateInputs={true}
						onChange={handleSelect}
						ranges={dateRange}
						color="#fc8c03"
						maxDate={new Date(import.meta.env.VITE_TODAY_DATETIME)}
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
