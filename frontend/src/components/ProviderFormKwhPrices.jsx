import { Formik, Form, Field, useField, ErrorMessage } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { getKHWPrices } from "../service/api"; // Adjust this API function if needed

const inputClass =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-full p-2.5";
const errorClass = "text-red-500 text-xs mt-1";

const monthFields = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
];

const MyTextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <div>
            <label className="block mb-2 text-sm text-gray-900">{label}</label>
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
	// populate the form with the current year's prices

    const initialValues = {
        year: new Date().getFullYear().toString(),
        jan: "0.09", feb: "0.07", mar: "0.06", apr: "0.05", may: "0.09", jun: "0.08",
        jul: "0.10", aug: "0.09", sep: "0.08", oct: "0.07", nov: "0.10", dec: "0.10",
    };

    const monthValidation = Yup.number()
        .positive("Must be a positive number")
        .typeError("Must be a number");

    let validationShape = {
        year: Yup.number()
            .positive("Year must be positive")
            .typeError("Year must be a number"),
    };

    monthFields.forEach((month) => {
        validationShape[month] = monthValidation;
    });

    const validationSchema = Yup.object(validationShape);

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        resetForm();
        setSubmitting(false);
    };

    const fetchPricesForYear = async (year, setValues) => {
		// check if year is 4 digits
		if (!/^\d{4}$/.test(year)) {
			return;
		}
        const prices = await getKHWPrices(year);
        if (prices) {
            const monthPrices = monthFields.reduce((acc, month, index) => {
                const monthData = prices.find(p => p.month === index + 1); // months from API are likely 1-indexed
                acc[month] = monthData ? monthData.price.toString() : "";
                return acc;
            }, {});
            setValues({ ...initialValues, ...monthPrices, year });
        }
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
						<div className="flex justify-start">
							<MyTextInput
								label="Year"
								name="year"
								type="number"
								className="mb-4 p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
								onChange={(e) => {
									setFieldValue("year", e.target.value);
									fetchPricesForYear(e.target.value, setValues);
								}}
							/>
						</div>

						<div className="min-w-full shadow-md">
							<div className="bg-gray-100 flex rounded-lg">
								<div className="flex-1 px-6 py-3 text-center text-sm text-gray-700  tracking-wider">
									KWH Price in € / month
								</div>
							</div>
							<div className="bg-white divide-y divide-gray-200 rounded-b-lg ">
								{Object.keys(initialValues)
									.filter((key) => key !== "year")
									.reduce((acc, month, index, array) => {
										if (index % 3 === 0)
											acc.push(array.slice(index, index + 3));
										return acc;
									}, [])
									.map((monthGroup, idx) => (
										<div key={idx} className=" md:flex ">
											{monthGroup.map((month) => (
												<div
													key={month}
													className=" md:flex-1 w-full "
												>
													<div className="hover:bg-gray-50 flex">
														<div className="px-6 py-7 whitespace-nowrap text-xs text-gray-900 flex-1">
															{month.charAt(0).toUpperCase() + month.slice(1)}
														</div>
														<div className="px-4 py-4 whitespace-nowrap text-xs text-gray-600 flex-1">
															<Field
																type="number"
																name={month}
																className="p-2 border border-gray-300 rounded text-xs shadow-sm focus:ring-orange-300 focus:border-orange-300"
															/>
															<ErrorMessage
																name={month}
																component="div"
																className="text-red-600 text-xs mt-1"
															/>
														</div>
													</div>
												</div>
											))}
										</div>
									))}
							</div>
						</div>
					</div>

					<div className="flex justify-center pb-5 pt-4">
						<button
							type="submit"
							disabled={true}
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
