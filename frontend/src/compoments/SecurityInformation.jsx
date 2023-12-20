import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const inputClass =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-72 p-2.5";
const errorClass = "text-sm text-red-600";

// Yup schema for validation
const PasswordSchema = Yup.object().shape({
	currentPassword: Yup.string().required("Current password is required"),
	newPassword: Yup.string()
		.required("New password is required")
		.min(6, "Password must be at least 6 characters long")
		.matches(/\d/, "Password must include at least one number")
		.matches(
			/[!@#$%^&*(),.?":{}|<>]/,
			"Password must include at least one symbol"
		),
	retypeNewPassword: Yup.string()
		.required("You must retype the new password") // Require the field
		.oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});

function SecurityInformation() {
	return (
		<Formik
			initialValues={{
				currentPassword: "",
				newPassword: "",
				retypeNewPassword: "",
			}}
			validationSchema={PasswordSchema}
			onSubmit={(values, { setSubmitting, resetForm }) => {
				console.log(values);
				resetForm();
				setSubmitting(false);
			}}
		>
			{({ isSubmitting, dirty, isValid }) => (
				<Form>
					<div className="grid grid-cols-1 gap-4 mt-5">
						<p className="pt-4 text-gray-400">Password change</p>

						{/* Current Password */}
						<div className="p-1">
							<label
								htmlFor="currentPassword"
								className="block mb-2 text-sm font-medium text-gray-900"
							>
								Current Password
							</label>
							<Field
								type="password"
								name="currentPassword"
								className={inputClass}
							/>
							<ErrorMessage
								name="currentPassword"
								component="div"
								className={errorClass}
							/>
						</div>

						{/* New Password */}
						<div className="p-1">
							<label
								htmlFor="newPassword"
								className="block mb-2 text-sm font-medium text-gray-900"
							>
								New Password
							</label>
							<Field
								type="password"
								name="newPassword"
								className={inputClass}
							/>
							<ErrorMessage
								name="newPassword"
								component="div"
								className={errorClass}
							/>
						</div>

						{/* Retype New Password */}
						<div className="p-1">
							<label
								htmlFor="retypeNewPassword"
								className="block mb-2 text-sm font-medium text-gray-900"
							>
								Retype New Password
							</label>
							<Field
								type="password"
								name="retypeNewPassword"
								className={inputClass}
							/>
							<ErrorMessage
								name="retypeNewPassword"
								component="div"
								className={errorClass}
							/>
						</div>

						{/* Submit Button */}
						<div className="flex justify-center pb-5">
							<button
								type="submit"
								disabled={isSubmitting || !dirty || !isValid}
								className={`mt-4 bg-orange-500 text-sm text-white p-2 rounded ${
									!dirty || !isValid ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								Save changes
							</button>
						</div>
					</div>
				</Form>
			)}
		</Formik>
	);
}

export default SecurityInformation;
