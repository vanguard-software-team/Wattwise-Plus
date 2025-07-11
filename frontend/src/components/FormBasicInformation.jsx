import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getConsumerInfo, getUserEmail } from "../service/api";
import { useEffect, useState } from "react";

const inputClass =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-72 p-2.5";
const errorClass = "text-red-500 text-xs mt-1";

function FormBasicInformation() {
  const [userEmail, setUserEmail] = useState("");
  const [initialValues, setInitialValues] = useState({ email: '', power_supply_number: '' });

  useEffect(() => {
    setUserEmail(getUserEmail());
  }, []);

  useEffect(() => {
    const fetchConsumerInfo = async () => {
      if (userEmail) {
        const response = await getConsumerInfo(userEmail);
        if (response) {
          setInitialValues({
            email: response.email,
            power_supply_number: response.power_supply_number.toString(),
          });
        }
      }
    };
    fetchConsumerInfo();
  }, [userEmail]);

  const validationSchema = Yup.object({
    power_supply_number: Yup.string().required("Power supply number is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    resetForm();
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, dirty, isValid }) => (
        <Form>
          <div className="grid lg:grid-cols-2 gap-4 mt-10">
            {/* Power Supply Number */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Number of Power Supply
              </label>
              <Field
                type="number"
                name="power_supply_number"
                className={inputClass}
                placeholder="Find it in an electricity bill"
              />
              <ErrorMessage
                name="power_supply_number"
                component="div"
                className={errorClass}
              />
            </div>
            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
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
