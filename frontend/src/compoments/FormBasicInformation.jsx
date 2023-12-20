import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const inputClass =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-72 p-2.5";
const errorClass = "text-red-500 text-xs mt-1";

function FormBasicInformation() {
	const initialValues = {
		powerSupplyNumber: "444",
		email: "some@mail.com",
		provider: "ΔΕΗ",
	};

	const validationSchema = Yup.object({
		powerSupplyNumber: Yup.string().required("Power supply number is required"),
		email: Yup.string()
			.email("Invalid email format")
			.required("Email is required"),
		provider: Yup.string().required("Provider is required"),
	});

	const handleSubmit = (values, {setSubmitting, resetForm}) => {
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
			validationSchema={validationSchema}
			onSubmit={handleSubmit}
		>
			{({ isSubmitting, dirty, isValid }) => (
				<Form>
					<div className="grid lg:grid-cols-3 gap-4 mt-10">
						{/* Power Supply Number */}
						<div>
							<label
								htmlFor="powerSupplyNumber"
								className="block mb-2 text-sm font-medium text-gray-900"
							>
								Number of Power Supply
							</label>
							<Field
								type="number"
								name="powerSupplyNumber"
								className={inputClass}
								placeholder="Find it in an electricity bill"
							/>
							<ErrorMessage
								name="powerSupplyNumber"
								component="div"
								className={errorClass}
							/>
						</div>
						{/* Email */}
						<div>
							<label
								htmlFor="email"
								className="block mb-2 text-sm font-medium text-gray-900"
							>
								Your Email
							</label>
							<Field
								type="email"
								name="email"
								className={inputClass}
								placeholder="Please fill your email"
							/>
							<ErrorMessage
								name="email"
								component="div"
								className={errorClass}
							/>
						</div>
						{/* Provider */}
						<div className="mb-6">
							<label
								htmlFor="provider"
								className="block mb-2 text-sm font-medium text-gray-900"
							>
								Your Provider
							</label>
							<Field as="select" name="provider" className={inputClass}>
								<option value="" disabled>
									Select your provider
								</option>
								<option value="ΗΡΩΝ">ΗΡΩΝ</option>
								<option value="ΔΕΗ">ΔΕΗ</option>
								<option value="Zενιθ">Zενιθ</option>
							</Field>
							<ErrorMessage
								name="provider"
								component="div"
								className={errorClass}
							/>
						</div>
					</div>
					<div className="flex justify-center pb-5">
						<button
							type="submit"
							disabled={isSubmitting || !dirty || !isValid}
							className="mt-4 bg-orange-500 text-sm text-white p-2 rounded disabled:bg-orange-300"
						>
							Save Changes
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
}

export default FormBasicInformation;
