import { Field, ErrorMessage } from "formik";

const inputClass =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-72 p-2.5";

function CompanyInputFields() {
	return (
		<>
			<p className="pt-4 text-gray-400">Personal Information</p>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
				{/* Company Name */}
				<div className="p-2">
					<label
						htmlFor="companyName"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Company Name
					</label>
					<Field
						name="companyName"
						className={inputClass}
						placeholder="Type your company name"
					/>
					<ErrorMessage name="companyName" component="div" />
				</div>
			</div>
		</>
	);
}

export default CompanyInputFields;
