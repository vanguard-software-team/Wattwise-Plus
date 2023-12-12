import { useState } from "react";

function FormBasicInformation() {
	const inputClass =
		"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-72 p-2.5";
	const errorClass = "text-red-500 text-xs mt-1";
	const [formData, setFormData] = useState({
		powerSupplyNumber: "123123123123",
		email: "micharatz97@gmail.com",
		provider: "ΗΡΩΝ",
	});
	const [formErrors, setFormErrors] = useState({});
	const [isDirty, setIsDirty] = useState(false);

	const handleInputChange = (event) => {
		const { id, value } = event.target;
		setFormData((prevState) => ({
			...prevState,
			[id]: value,
		}));
		validateField(id, value);
		setIsDirty(true);
	};

	const validateField = (field, value) => {
		let errors = { ...formErrors };
		switch (field) {
			case "powerSupplyNumber":
				errors.powerSupplyNumber =
					value === "" ? "Power supply contain only numbers" : "";
				break;
			case "email":
				errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
					? ""
					: "Email is invalid";
				break;
			case "provider":
				errors.provider = value === "" ? "Provider is required" : "";
				break;
			default:
				break;
		}
		setFormErrors(errors);
	};

	const isFormValid = () => {
		return (
			Object.values(formErrors).every((x) => x === "") &&
			formData.powerSupplyNumber !== "" &&
			formData.email !== "" &&
			formData.provider !== ""
		);
	};

	const handleSubmit = (event) => {
		console.log(event);
		event.preventDefault();
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="grid lg:grid-cols-3 md:grid-cols-1 gap-4 mt-10">
				<div>
					<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Number of power supply
					</label>
					<input
						type="number"
						id="powerSupplyNumber"
						className={inputClass}
						placeholder="Find it in an electricity bill"
						value={formData.powerSupplyNumber}
						onChange={handleInputChange}
						required
					></input>
					{formErrors.powerSupplyNumber && (
						<div className={errorClass}>{formErrors.powerSupplyNumber}</div>
					)}
				</div>
				<div>
					<label className="block mb-2 text-sm font-medium text-gray-900">
						Your email
					</label>
					<input
						type="email"
						id="email"
						className={inputClass}
						value={formData.email}
						onChange={handleInputChange}
						required
					></input>
					{formErrors.email && (
						<div className={errorClass}>{formErrors.email}</div>
					)}
				</div>
				<div className="mb-6">
					<label
						htmlFor="provider"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Your provider
					</label>
					<select
						id="provider"
						className={inputClass}
						value={formData.provider}
						onChange={handleInputChange}
						required
					>
						<option value="" disabled>
							Select your provider
						</option>
						<option value="ΗΡΩΝ">ΗΡΩΝ</option>
						<option value="ΔΕΗ">ΔΕΗ</option>
						<option value="Zενιθ">Zενιθ</option>
					</select>
					{formErrors.provider && (
						<div className={errorClass}>{formErrors.provider}</div>
					)}
				</div>
			</div>
			<div className="flex justify-center">
				<button
					type="submit"
					disabled={!isDirty || !isFormValid()}
					className="mt-4 bg-orange-500 text-sm text-white p-2 rounded disabled:bg-orange-300"
				>
					Save Changes
				</button>
			</div>
		</form>
	);
}

export default FormBasicInformation;
