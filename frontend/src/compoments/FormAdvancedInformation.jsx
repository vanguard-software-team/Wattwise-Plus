import { useState, useEffect } from "react";

const inputClass =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-72 p-2.5";

function FormAdvancedInformation() {
	const initialFormData = {
		// Individual fields
		name: "Michalis Charatzoglou",
		email: "micharatz97@gmail.com",
		age: "26",
		// Company fields
		companyName: "",
		registrationNumber: "",
		address: "",
	};
	const [type, setType] = useState("Individual");
	const [formData, setFormData] = useState({ ...initialFormData });
	const [isChanged, setIsChanged] = useState(false);

	useEffect(() => {
		setIsChanged(JSON.stringify(formData) !== JSON.stringify(initialFormData));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formData]);

	const isFormDataFilled = () => {
		return type === "Individual"
			? formData.name || formData.email || formData.age
			: formData.companyName || formData.registrationNumber || formData.address;
	};

	const handleTypeChange = (newType) => {
		if (type !== newType && isFormDataFilled()) {
			if (
				window.confirm(
					"If you change your type, the stored advanced information will be reset. Are you sure?"
				)
			) {
				setType(newType);
				resetFormData();
			}
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
		// Handle form submission logic here
		resetFormData();
	};

	return (
		<form onSubmit={handleSubmit}>
			{/* Type selector */}
			<div className="flex justify-center items-center">
				<div className="w-full max-w-xs">
					{" "}
					{/* Adjust width as needed */}
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
				<div className="grid lg:grid-cols-3 md:grid-cols-1 gap-4 mt-10">
					{/* Individual fields */}
					<div>
						<label
							htmlFor="name"
							className="block mb-2 text-sm font-medium text-gray-900"
						>
							Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
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
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							className={inputClass}
							required
						/>
					</div>
					<div>
						<label
							htmlFor="age"
							className="block mb-2 text-sm font-medium text-gray-900"
						>
							Age
						</label>
						<input
							type="number"
							id="age"
							name="age"
							value={formData.age}
							onChange={handleInputChange}
							className={inputClass}
							required
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

			{/* Submit button */}
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
			</div>
		</form>
	);
}

export default FormAdvancedInformation;
