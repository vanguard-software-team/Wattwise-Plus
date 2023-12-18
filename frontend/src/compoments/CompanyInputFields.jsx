import PropTypes from "prop-types";

const inputClass =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-72 p-2.5";

function CompanyInputFields({formData,handleInputChange}) {
	return (
		<div className="grid lg:grid-cols-3 md:grid-cols-1 gap-4 mt-10">
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
	);
}

CompanyInputFields.propTypes = {
	handleInputChange: PropTypes.func,
	formData: PropTypes.shape({
		companyName: PropTypes.string,
		registrationNumber: PropTypes.string,
		address: PropTypes.string,
	}),
};

export default CompanyInputFields;
