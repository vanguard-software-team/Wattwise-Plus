import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlug, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import PropTypes from "prop-types";

const seachInputClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-300 block w-full ps-10 p-2.5";
const searchButtonClass = "p-2.5 ms-2 text-sm font-medium text-white bg-orange-400 rounded-lg border hover:bg-orange-500 focus:ring-2 focus:outline-none focus:ring-orange-300";
const disabledButtonClass = "p-2.5 ms-2 text-sm font-medium text-white bg-gray-400 rounded-lg border";

function ProviderDashboardConsumer({ onSubmit }) {
    const formik = useFormik({
        initialValues: {
            powerSupply: '',
        },
        validationSchema: Yup.object({
            powerSupply: Yup.string()
                .matches(/^[0-9]+$/, "Only positive numbers are allowed")
                .length(11, "Must be exactly 11 digits")
                .required("Required"),
        }),
        onSubmit: values => {
            onSubmit(values.powerSupply);
        },
    });

    const isButtonDisabled = !(formik.isValid && formik.dirty);

    return (
        <div className="flex justify-center items-center ">
            <form className="flex lg:w-1/3 w-full items-center mt-10 p-2" onSubmit={formik.handleSubmit}>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <FontAwesomeIcon icon={faPlug} className="w-4 h-4 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        name="powerSupply"
                        className={seachInputClass}
                        placeholder="Number of power supply of a consumer"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.powerSupply}
                    />
                    <div className="text-xs h-5 absolute">
                    {formik.touched.powerSupply && formik.errors.powerSupply ? (
                        <div className="text-red-500">{formik.errors.powerSupply}</div>
                    ) : null}
                    </div>
                </div>
                <button
                    type="submit"
                    className={isButtonDisabled ? disabledButtonClass : searchButtonClass}
                    disabled={isButtonDisabled}
                >
                    <FontAwesomeIcon className="w-4 h-4 " icon={faMagnifyingGlass} />
                    <span className="sr-only">Search</span>
                </button>
            </form>
        </div>
    );
}

ProviderDashboardConsumer.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default ProviderDashboardConsumer;
