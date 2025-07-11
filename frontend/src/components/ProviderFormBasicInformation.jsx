import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getUserEmail } from "../service/api";

const inputClass =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-72 p-2.5";
const errorClass = "text-red-500 text-xs mt-1";

function ProviderFormBasicInformation() {

	const initialValues = {
		email: getUserEmail(),
	};

	const validationSchema = Yup.object({
		email: Yup.string()
			.email("Invalid email format")
			.required("Email is required"),
	});

	const handleSubmit = (values, {setSubmitting, resetForm}) => {
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
			{() => (
				<Form>
					<div className="grid lg:grid-cols-1 gap-4 mt-10 pb-5">
						{/* Email */}
						<div>
							<label
								className="block mb-2 text-sm font-medium text-gray-900"
							>
								Your Email
							</label>
							<Field
								type="email"
								name="email"
								className={`${inputClass} bg-slate-200 border-slate-400`}
								placeholder="Please fill your email"
								disabled={true}
							/>
							<ErrorMessage
								name="email"
								component="div"
								className={errorClass}
							/>
						</div>
					</div>
				</Form>
			)}
		</Formik>
	);
}

export default ProviderFormBasicInformation;
