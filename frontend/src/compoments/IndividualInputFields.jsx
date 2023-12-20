import { Field, useField, ErrorMessage } from "formik";
import BirthdateDatePicker from "./BirthdateDatePicker";

const inputClass =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-72 p-2.5";

function DatePickerField({ ...props }) {
	const [field, , helpers] = useField(props);
	return (
		<BirthdateDatePicker
			key={field.value || "key-for-reset"}
			{...field}
			{...props}
			defaultDate={field.value}
			onDateChange={(value) => helpers.setValue(value)}
		/>
	);
}

function IndividualInputFields() {
	return (
		<>
			<p className="pt-4 text-gray-400">Personal Information</p>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
				{/* Full Name */}
				<div className="p-2">
					<label
						htmlFor="fullName"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Full Name
					</label>
					<Field
						name="fullName"
						className={inputClass}
						placeholder="Type your full name"
					/>
					<ErrorMessage name="fullName" component="div" />
				</div>

				{/* Birthdate */}
				<div className="p-2">
					<label
						htmlFor="birthDate"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Birthdate
					</label>
					<DatePickerField name="birthDate" />
				</div>

				{/* Phone Number */}
				<div className="p-2">
					<label
						htmlFor="phoneNumber"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Contact Phone
					</label>
					<Field
						name="phoneNumber"
						className={inputClass}
						placeholder="Type your phone"
					/>
					<ErrorMessage name="phoneNumber" component="div" />
				</div>

				{/* House Type */}
				<div className="p-2">
					<label
						htmlFor="houseType"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						House Type
					</label>
					<Field as="select" name="houseType" className={inputClass}>
						<option disabled value="">
							Choose the house type
						</option>
						<option value="Apartment">Apartment</option>
						<option value="Detached house">Detached house</option>
					</Field>
					<ErrorMessage name="houseType" component="div" />
				</div>
				{/* Square Meters */}
				<div className="p-2">
					<label
						htmlFor="squareMeters"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Square Meters (&#13217;)
					</label>
					<Field as="select" name="squareMeters" className={inputClass}>
						<option disabled value="">
							Choose the square meters
						</option>
						<option value="5-30">5-30</option>
						<option value="31-65">31-65</option>
						<option value="66-90">66-90</option>
						<option value="90-120">90-120</option>
						<option value="120+">120+</option>
					</Field>
					<ErrorMessage name="squareMeters" component="div" />
				</div>
			</div>
		</>
	);
}

export default IndividualInputFields;
