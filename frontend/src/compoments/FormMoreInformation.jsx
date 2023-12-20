import { useState, useEffect } from "react";
import ConfirmationModal from "./ComfirmationModal";
import CompanyInputFields from "./CompanyInputFields";
import IndividualFormFields from "./IndividualFormFields";

const inputClass =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-72 p-2.5";

function FormMoreInformation() {
	const initialFormData = {
		// Individual fields
		fullName: "",
		birthDate: undefined,
		phoneNumber: "",
		numberOfoccupants: undefined,
		houseType: undefined,
		squareMeters: undefined,
		typeOfoccupants: undefined,
		ageElectricityManager: undefined,
		floor: undefined,
		houseBuilt: undefined,
		frames: undefined,
		heatingType: undefined,
		haveSolarPanels: undefined,
		hotWater: undefined,
		evCarCharger: undefined,
		// Company fields
		companyName: undefined,
		registrationNumber: undefined,
		address: undefined,
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
		if (type === "Individual") {
			return (
				formData.fullName ||
				formData.birthDate ||
				formData.phoneNumber ||
				formData.numberOfoccupants ||
				formData.houseType ||
				formData.squareMeters ||
				formData.typeOfoccupants ||
				formData.ageElectricityManager ||
				formData.floor ||
				formData.houseBuilt ||
				formData.frames ||
				formData.heatingType ||
				formData.haveSolarPanels ||
				formData.hotWater ||
				formData.evCarCharger
			);
		} else {
			// Company fields check
			return (
				formData.companyName || formData.registrationNumber || formData.address
			);
		}
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
		let submittedData = {};
		if (type === "Individual") {
			submittedData = {
				fullName: formData.fullName,
				birthDate: formData.birthDate,
				phoneNumber: formData.phoneNumber,
				numberOfoccupants: formData.numberOfoccupants,
				houseType: formData.houseType,
				squareMeters: formData.squareMeters,
				typeOfoccupants: formData.typeOfoccupants,
				ageElectricityManager: formData.ageElectricityManager,
				floor: formData.floor,
				houseBuilt: formData.houseBuilt,
				frames: formData.frames,
				heatingType: formData.heatingType,
				haveSolarPanels: formData.haveSolarPanels,
				hotWater: formData.hotWater,
				evCarCharger: formData.evCarCharger,
			};
		} else if (type === "Company") {
			submittedData = {
				companyName: formData.companyName,
				registrationNumber: formData.registrationNumber,
				address: formData.address,
			};
		}
		console.log(submittedData);
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
					<label className="mb-2 text-sm  text-gray-900 dark:text-gray-300">
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

			{type === "Individual" ? (
				<IndividualFormFields
					formData={formData}
					handleInputChange={handleInputChange}
				/>
			) : (
				<CompanyInputFields
					formData={formData}
					handleInputChange={handleInputChange}
				/>
			)}

			<div className="flex justify-center pb-5">
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
