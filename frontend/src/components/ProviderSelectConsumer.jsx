import { useFormik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlug,
  faMagnifyingGlass,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";

const seachInputClass =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-300 block w-full ps-10 pe-10 p-2.5";
const searchButtonClass =
  "p-2.5 ms-2 text-sm font-medium text-white bg-orange-400 rounded-lg border hover:bg-orange-500 focus:ring-2 focus:outline-none focus:ring-orange-300";
const disabledButtonClass =
  "p-2.5 ms-2 text-sm font-medium text-white bg-gray-400 rounded-lg border";
const dropdownClass =
  "absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1";
const dropdownItemClass =
  "px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer border-b border-gray-100 last:border-b-0";
const dropdownItemSelectedClass =
  "px-4 py-2 text-sm bg-orange-100 text-orange-700 cursor-pointer border-b border-gray-100 last:border-b-0";

function ProviderDashboardConsumer({ onSubmit, availablePSNs }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredPSNs, setFilteredPSNs] = useState(availablePSNs || []);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      powerSupply: "",
    },
    validationSchema: Yup.object({
      powerSupply: Yup.string()
        .matches(/^[0-9]+$/, "Only positive numbers are allowed")
        .length(11, "Must be exactly 11 digits")
        .required("Required"),
    }),
    onSubmit: (values) => {
      onSubmit(values.powerSupply);
    },
  });

  // Filter PSNs based on input
  useEffect(() => {
    if (availablePSNs) {
      const filtered = availablePSNs.filter((psn) =>
        psn.toLowerCase().includes(formik.values.powerSupply.toLowerCase())
      );
      setFilteredPSNs(filtered);
    }
  }, [formik.values.powerSupply, availablePSNs]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    formik.handleChange(e);
    setIsDropdownOpen(true);
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleOptionSelect = (psn) => {
    formik.setFieldValue("powerSupply", psn);
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isButtonDisabled = !(formik.isValid && formik.dirty);

  return (
    <div className='flex justify-center items-center'>
      <form
        className='flex lg:w-1/3 w-full items-center mt-10 p-2'
        onSubmit={formik.handleSubmit}
      >
        <div className='relative w-full' ref={dropdownRef}>
          <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
            <FontAwesomeIcon icon={faPlug} className='w-4 h-4 text-gray-500' />
          </div>
          {/* Custom searchable dropdown */}
          <input
            ref={inputRef}
            type='text'
            name='powerSupply'
            className={seachInputClass}
            placeholder='Number of power supply of a consumer'
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={formik.handleBlur}
            value={formik.values.powerSupply}
            autoComplete='off'
          />
          {/* Dropdown toggle button */}
          <button
            type='button'
            className='absolute inset-y-0 end-0 flex items-center pe-3'
            onClick={toggleDropdown}
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Custom dropdown */}
          {isDropdownOpen && filteredPSNs.length > 0 && (
            <div className={dropdownClass}>
              {filteredPSNs.slice(0, 10).map((psn) => (
                <div
                  key={psn}
                  className={
                    formik.values.powerSupply === psn
                      ? dropdownItemSelectedClass
                      : dropdownItemClass
                  }
                  onClick={() => handleOptionSelect(psn)}
                >
                  <div className='flex items-center'>
                    <FontAwesomeIcon
                      icon={faPlug}
                      className='w-3 h-3 text-gray-400 mr-2'
                    />
                    <span className='font-mono'>{psn}</span>
                  </div>
                </div>
              ))}
              {filteredPSNs.length > 10 && (
                <div className='px-4 py-2 text-xs text-gray-500 text-center border-t'>
                  {filteredPSNs.length - 10} more results available...
                </div>
              )}
            </div>
          )}

          {/* Show "No matches" when filtering returns empty */}
          {isDropdownOpen &&
            filteredPSNs.length === 0 &&
            formik.values.powerSupply && (
              <div className={dropdownClass}>
                <div className='px-4 py-3 text-sm text-gray-500 text-center'>
                  No matching power supply numbers found
                </div>
              </div>
            )}

          <div className='text-xs h-5 absolute'>
            {formik.touched.powerSupply && formik.errors.powerSupply ? (
              <div className='text-red-500'>{formik.errors.powerSupply}</div>
            ) : null}
          </div>
        </div>
        <button
          type='submit'
          className={isButtonDisabled ? disabledButtonClass : searchButtonClass}
          disabled={isButtonDisabled}
        >
          <FontAwesomeIcon className='w-4 h-4 ' icon={faMagnifyingGlass} />
          <span className='sr-only'>Search</span>
        </button>
      </form>
    </div>
  );
}

ProviderDashboardConsumer.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ProviderDashboardConsumer;
