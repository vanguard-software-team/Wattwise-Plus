import { useState, useEffect } from "react";
import BirthdateDatePicker from "./BirthdateDatePicker";
import ConfirmationModal from "./ComfirmationModal";

const inputClass =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-72 p-2.5";

function FormMoreInformation() {
	const initialFormData = {
		// Individual fields
		fullName: "sdfsdf",
		birthDate: new Date(),
		phoneNumber: "45345",
		// Company fields
		companyName: "",
		registrationNumber: "",
		address: "",
	};
	const [type, setType] = useState("Individual");
	const [formData, setFormData] = useState({ ...initialFormData });
	const [isChanged, setIsChanged] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [pendingType, setPendingType] = useState(null);

	useEffect(() => {
		setIsChanged(JSON.stringify(formData) !== JSON.stringify(initialFormData));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formData]);

	const isFormDataFilled = () => {
		return type === "Individual"
			? formData.fullName || formData.birthDate || formData.phoneNumber
			: formData.companyName || formData.registrationNumber || formData.address;
	};

	const handleTypeChange = (newType) => {
		if (type !== newType && isFormDataFilled()) {
			setPendingType(newType); 
			setShowModal(true);
		} else {
			setType(newType);
		}
	};

	const resetFormData = () => {
		setFormData({ ...initialFormData });
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
		resetFormData();
	};

	const handleModalConfirm = () => {
		if (pendingType !== null) {
			setType(pendingType);
			setPendingType(null);
		}
		resetFormData();
		setShowModal(false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex justify-center items-center pt-4">
				<div>
					<label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
						Type
					</label>
					<select
						name="type"
						className={inputClass}
						value={type}
						onChange={(e) => handleTypeChange(e.target.value)}
					>
						<option value="Individual">Individual</option>
						<option value="Company">Company</option>
					</select>
				</div>
			</div>

			{/* Conditional fields */}
			{type === "Individual" ? (
				<div className="grid lg:grid-cols-3 md:grid-cols-1 gap-4 mt-5">
					{/* Individual fields */}
					<div>
						<label
							htmlFor="fullname"
							className="block mb-2 text-sm font-medium text-gray-900"
						>
							Full Name
						</label>
						<input
							type="text"
							id="fullName"
							name="fullName"
							value={formData.fullName}
							onChange={handleInputChange}
							className={inputClass}
							required
						/>
					</div>
					<div>
						<label
							htmlFor="email"
							className="block mb-2 text-sm font-medium text-gray-900"
						>
							Birthdate
						</label>
						<BirthdateDatePicker
							id="birthDate"
							name="birthDate"
							defaultDate={formData.birthDate}
							onDateChange={handleInputChange}
						/>
					</div>
					<div>
						<label
							htmlFor="age"
							className="block mb-2 text-sm font-medium text-gray-900"
						>
							Contact Phone
						</label>
						<input
							type="number"
							id="phoneNumber"
							name="phoneNumber"
							value={formData.phoneNumber}
							onChange={handleInputChange}
							className={inputClass}
						/>
					</div>
				</div>
			) : (
				<div className="grid lg:grid-cols-3 md:grid-cols-1 gap-4 mt-10">
					{/* Company fields */}
					<div>
						<label
							htmlFor="companyName"
							className="block mb-2 text-sm font-medium text-gray-900"
						>
							Company Name
						</label>
						<input
							type="text"
							id="companyName"
							name="companyName"
							value={formData.companyName}
							onChange={handleInputChange}
							className={inputClass}
							required
						/>
					</div>
					<div>
						<label
							htmlFor="registrationNumber"
							className="block mb-2 text-sm font-medium text-gray-900"
						>
							Registration Number
						</label>
						<input
							type="text"
							id="registrationNumber"
							name="registrationNumber"
							value={formData.registrationNumber}
							onChange={handleInputChange}
							className={inputClass}
							required
						/>
					</div>
					<div>
						<label
							htmlFor="address"
							className="block mb-2 text-sm font-medium text-gray-900"
						>
							Address
						</label>
						<input
							type="text"
							id="address"
							name="address"
							value={formData.address}
							onChange={handleInputChange}
							className={inputClass}
							required
						/>
					</div>
				</div>
			)}

			<div className="flex justify-center items-center">
				<button
					type="submit"
					disabled={!isChanged}
					className={`mt-4 bg-orange-500 text-sm text-white p-2 rounded disabled:bg-orange-300 ${
						!isChanged ? "opacity-50 cursor-not-allowed" : ""
					}`}
				>
					Save changes
				</button>
				<ConfirmationModal
					isOpen={showModal}
					onClose={() => setShowModal(false)}
					onConfirm={handleModalConfirm}
					message="If you change the consumer type, the stored  information will be reset. Are you sure?"
				/>
			</div>
		</form>
	);
}

export default FormMoreInformation;
