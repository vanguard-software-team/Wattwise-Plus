import { Formik, Form, Field, useField, ErrorMessage } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";

const inputClass =
	"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-full p-2.5";
const errorClass = "text-red-500 text-xs mt-1";

const monthFields = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const MyTextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <div>
            <label className="block mb-2 text-sm text-gray-900">
                {label}
            </label>
            <input {...field} {...props} className={inputClass} />
            {meta.touched && meta.error ? (
                <div className={errorClass}>{meta.error}</div>
            ) : null}
        </div>
    );
};

MyTextInput.propTypes = {
    label: PropTypes.string.isRequired,
};

function ProviderFormKwhPrices() {
	const initialValues = {
		year: new Date().getFullYear(),
		jan: "",
		feb: "",
		mar: "",
		apr: "",
		may: "",
		jun: "",
		jul: "",
		aug: "",
		sep: "",
		oct: "",
		nov: "",
		dec: "",
	};


    const monthValidation = Yup.number()
    .positive("Must be a positive number")
    .typeError("Must be a number");

    let validationShape = {
        year: Yup.number()
            .positive("Year must be positive")
            .typeError("Year must be a number")
    };

    monthFields.forEach(month => {
        validationShape[month] = monthValidation;
    });
    
    const validationSchema = Yup.object(validationShape);
    

	const fetchPricesForYear = async (year, setValues) => {
		// replace this with axios request to fetch data
		// example: const response = await axios.get(`/api/kwh-prices/${year}`);
		// setValues(response.data);
		// for now, let's simulate fetching data
		const simulatedData = {
			jan: 10,
			feb: 12,
			mar: 11,
			apr: 13,
			may: 14,
			jun: 15,
			jul: 14,
			aug: 13,
			sep: 12,
			oct: 11,
			nov: 10,
			dec: 12,
		};
		setValues({ ...simulatedData, year: year });
	};

	const handleSubmit = (values, { setSubmitting, resetForm }) => {
		console.log(values);
		resetForm();
		setSubmitting(false);
	};

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={handleSubmit}
			enableReinitialize // This is important to update values when year changes
		>
			{({ isSubmitting, dirty, isValid, setFieldValue, values, setValues }) => (
				<Form>
					<div className="grid grid-cols-1 gap-4 mt-10">
						<MyTextInput
							label="Year"
							name="year"
							type="number"
							onChange={(e) => {
								setFieldValue("year", e.target.value);
								fetchPricesForYear(e.target.value, setValues);
							}}
						/>

						<table className="min-w-full table-auto text-sm">
							<thead>
								<tr>
									<th className="px-4 py-2">Month</th>
									<th className="px-4 py-2">kWh Price in €</th>
								</tr>
							</thead>
							<tbody>
								{Object.keys(initialValues)
									.filter((key) => key !== "year")
									.map((month) => (
										<tr key={month}>
											<td className="border px-4 py-2 text-center text-sm">
												{month.charAt(0).toUpperCase() + month.slice(1)}
											</td>
											<td className="border px-4 py-2 text-sm">
												<Field
													type="number"
													name={month}
													className={inputClass}
												/>
                                                <ErrorMessage name={month} component="div" className={errorClass} />
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
					<div className="flex justify-center pb-5">
						<button
							type="submit"
							disabled={isSubmitting || !dirty || !isValid}
							className="mt-4 bg-orange-500 text-white text-sm p-2 rounded disabled:bg-orange-300"
						>
							Save Changes
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
}

export default ProviderFormKwhPrices;
