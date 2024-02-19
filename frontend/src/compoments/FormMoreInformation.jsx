import { useState, useEffect } from "react";
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
	TIN: Yup.string(),
	phoneNumber: Yup.string(),
	companyBuildingType: Yup.string(),
	squareMeters: Yup.string(),
	floor: Yup.string(),
	companyBuilt: Yup.string(),
	numberOfemployees: Yup.string(),
	frames: Yup.string(),
	heatingType: Yup.string(),
	haveSolarPanels: Yup.bool(),
	hotWater: Yup.string(),
	evCarCharger: Yup.bool(),
});

const predefinedCompany = {
	companyName: "The boaring company",
	TIN: "165110332",
	phoneNumber: "6987142306",
	companyBuildingType: "Detached building",
	squareMeters: "120+",
	floor: "On the top floor",
	companyBuilt: "After 2010",
	numberOfemployees: "51-250",
	frames: "Aluminum or synthetic with double glazing",
	heatingType: "Central gas boiler",
	haveSolarPanels: true,
	hotWater: "Gas boiler",
	evCarCharger: true,
};

function FormMoreInformation() {
	const [type, setType] = useState("Individual");
	const [showModal, setShowModal] = useState(false);
	const [pendingType, setPendingType] = useState(null);
	const [initialValues, setInitialValues] = useState(predefinedIndividual); // Add this state

	useEffect(() => {
		// Update initial values when type changes
		if (type === "Individual") {
			setInitialValues(predefinedIndividual);
		} else {
			setInitialValues(predefinedCompany);
		}
	}, [type]);

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
			resetForm({
				values:
					pendingType === "Individual"
						? predefinedIndividual
						: predefinedCompany,
			});
		}
		setShowModal(false);
	};

	const handleSubmit = (values, { setSubmitting, resetForm }) => {
		console.log(values);
		// handle proper here after take the response from the backend
		// const handleSubmit = async (values, { setSubmitting, resetForm }) => {
		// 	try {
		// 		// Asynchronous operation (e.g., API call)
		// 		await someAsyncOperation(values);

		// 		// Reset the form to initial values after successful submission
		// 		resetForm();
		// 	} catch (error) {
		// 		console.error("Error submitting form:", error);
		// 	} finally {
		// 		// Ensure isSubmitting is set to false after operation
		// 		setSubmitting(false);
		// 	}
		// };
		resetForm();
		setSubmitting(false);
	};

	return (
		<Formik
			initialValues={initialValues}
			enableReinitialize // Add this property
			validationSchema={
				type === "Individual" ? individualSchema : companySchema
			}
			onSubmit={handleSubmit}
		>
			{({ resetForm, isSubmitting, dirty, isValid }) => (
				<Form>
					<div className="flex justify-center items-center pt-4 ">
						<div>
							<label className="block mb-2 text-sm text-gray-900 dark:text-gray-300">
								What consumer are you
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
					<hr className="mt-5"></hr>

					{type === "Individual" ? (
						<IndividualInputFields />
					) : (
						<CompanyInputFields />
					)}

					<div className="flex justify-center pb-5">
						<button
							type="submit"
							className="mt-4 bg-orange-500 text-sm text-white p-2 rounded disabled:bg-orange-300"
							disabled={isSubmitting || !dirty || !isValid}
						>
							Save changes
						</button>
						<ConfirmationModal
							isOpen={showModal}
							onClose={() => setShowModal(false)}
							onConfirm={() => handleModalConfirm(resetForm)}
							message="If you change the consumer type, the stored information will be reset"
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
}

export default FormMoreInformation;
