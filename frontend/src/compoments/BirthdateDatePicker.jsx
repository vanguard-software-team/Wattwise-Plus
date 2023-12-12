import Datepicker from "tailwind-datepicker-react";
import { useState } from "react";
import PropTypes from "prop-types";



function BirthdateDatePicker({ defaultDate, onDateChange }) {
	const options = {
		title: "Date of birth",
		autoHide: true,
		todayBtn: false,
		clearBtn: true,
		clearBtnText: "Clear",
		maxDate: new Date("2030-01-01"),
		minDate: new Date("1950-01-01"),
		theme: {
			background: "bg-gray-50",
			todayBtn: "",
			clearBtn: "",
			icons: "bg-gray-50 hover:text-orange-500",
			text: "",
			disabledText: "",
			input: "",
			inputIcon: "",
			selected: "bg-orange-400 hover:bg-orange-500",
		},
		icons: {
			// () => ReactElement | JSX.Element
			prev: () => <span className="text-sm">Previous</span>,
			next: () => <span className="text-sm">Next</span>,
		},
		datepickerClassNames: "top-30",
		defaultDate: defaultDate,
		language: "en",
		disabledDates: [],
		weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
		inputNameProp: "date",
		inputIdProp: "date",
		inputPlaceholderProp: "Select Date",
		inputDateFormatProp: {
			day: "numeric",
			month: "long",
			year: "numeric",
		},
	};
	const [show, setShow] = useState(false);
	const handleChange = (selectedDate) => {
		const event = {
            target: {
                name: 'birthDate', // The name of the field
                value: selectedDate, // The new value
            },
        };
		onDateChange(event);
		console.log(selectedDate);
	};
	const handleClose = (state) => {
		setShow(state);
	};
	return (
		<div>
			<Datepicker
				options={options}
				onChange={handleChange}
				show={show}
				setShow={handleClose}
			/>
		</div>
	);
}

BirthdateDatePicker.propTypes = {
	defaultDate: PropTypes.instanceOf(Date),
	onDateChange: PropTypes.func.isRequired
};

export default BirthdateDatePicker;
