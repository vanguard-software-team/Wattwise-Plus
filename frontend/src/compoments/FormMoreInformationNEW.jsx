import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import ConfirmationModal from "./ComfirmationModal";
import CompanyInputFields from "./CompanyInputFields";
import IndividualInputFields from "./IndividualInputFields";

const inputClass =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-72 p-2.5";

const individualSchema = Yup.object().shape({
	fullName: Yup.string(),
	birthDate: Yup.date(),
	phoneNumber: Yup.string(),
	numberOfoccupants: Yup.string(),
	houseType: Yup.string(),
	squareMeters: Yup.string(),
	typeOfoccupants: Yup.string(),
	ageElectricityManager: Yup.string(),
	floor: Yup.string(),
	houseBuilt: Yup.string(),
	frames: Yup.string(),
	heatingType: Yup.string(),
	haveSolarPanels: Yup.bool(),
	hotWater: Yup.string(),
	evCarCharger: Yup.bool(),
});

const predefinedIndividual = {
	fullName: "John Doe",
	birthDate: new Date("2019-01-01"),
	phoneNumber: "1234567890",
	numberOfoccupants: "4",
	houseType: "Apartment",
	squareMeters: "31-65",
	typeOfoccupants: "Adults aged 18 to 29 only",
	ageElectricityManager: "25-34",
	floor: "1st floor (building without pilot)",
	houseBuilt: "1980-2000",
	frames: "Wooden or metal with single glazing",
	heatingType: "Central gas boiler",
	haveSolarPanels: true,
	hotWater: "Gas boiler",
	evCarCharger: false,
};

const companySchema = Yup.object().shape({
	companyName: Yup.string(),
	registrationNumber: Yup.string(),
	address: Yup.string(),
});

const predefinedCompany = {
	companyName: "The boaring company",
	registrationNumber: "12313131314",
	address: "This is address",
};

function FormMoreInformationNEW() {
	const [type, setType] = useState("Individual");
	const [showModal, setShowModal] = useState(false);
	const [pendingType, setPendingType] = useState(null);

	const handleTypeChange = (newType, resetForm) => {
		if (type !== newType) {
			setPendingType(newType);
			setShowModal(true);
		} else {
			setType(newType);
			resetForm();
		}
	};

	const handleModalConfirm = (resetForm) => {
		if (pendingType !== null) {
			setType(pendingType);
			setPendingType(null);
		}
		resetForm();
		setShowModal(false);
	};

	return (
		<Formik
			initialValues={
				type === "Individual" ? predefinedIndividual : predefinedCompany
			}
			validationSchema={
				type === "Individual" ? individualSchema : companySchema
			}
			onSubmit={(values, { resetForm }) => {
				console.log(values);
				resetForm();
			}}
		>
			{({ resetForm }) => (
				<Form>
					<div className="flex justify-center items-center pt-4">
						<div>
							<label className="mb-2 text-sm text-gray-900 dark:text-gray-300">
								Type
							</label>
							<Field
								as="select"
								name="type"
								className={inputClass}
								onChange={(e) => handleTypeChange(e.target.value, resetForm)}
							>
								<option value="Individual">Individual</option>
								<option value="Company">Company</option>
							</Field>
						</div>
					</div>

					{type === "Individual" ? (
						<IndividualInputFields />
					) : (
						<CompanyInputFields />
					)}

					<div className="flex justify-center pb-5">
						<button
							type="submit"
							className="mt-4 bg-orange-500 text-sm text-white p-2 rounded"
						>
							Save changes
						</button>
						<ConfirmationModal
							isOpen={showModal}
							onClose={() => setShowModal(false)}
							onConfirm={() => handleModalConfirm(resetForm)}
							message="If you change the consumer type, the stored information will be reset. Are you sure?"
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
}

export default FormMoreInformationNEW;
