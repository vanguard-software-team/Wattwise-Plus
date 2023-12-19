import { useState } from "react";

const inputClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-300 focus:border-orange-300 block w-72 p-2.5";
const errorClass = "text-sm text-red-600";

function SecurityInformation() {
    const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', retypeNewPassword: '' });
    const [isChanged, setIsChanged] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const validatePassword = (password) => {
        const minLength = 6;
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return `Password must be at least ${minLength} characters long.`;
        }
        if (!hasNumber) {
            return "Password must include at least one number.";
        }
        if (!hasSymbol) {
            return "Password must include at least one symbol.";
        }
        return "";
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);

        const newPasswordError = validatePassword(updatedFormData.newPassword);
        const retypeNewPasswordError = updatedFormData.newPassword !== updatedFormData.retypeNewPassword 
            ? "Passwords do not match." 
            : "";

        setValidationErrors({
            ...validationErrors,
            [name]: name === 'newPassword' ? newPasswordError : name === 'retypeNewPassword' ? retypeNewPasswordError : ''
        });

        setIsChanged(
            updatedFormData.currentPassword &&
            !newPasswordError &&
            updatedFormData.newPassword === updatedFormData.retypeNewPassword
        );
    };

    const handleSubmit = (event) => {
        console.log(event);
        event.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 mt-5">
                <p className="pt-4 text-gray-400">Password change</p>
                <div className="p-1">
                    <label htmlFor="currentPassword" className="block mb-2 text-sm font-medium text-gray-900">
                        Current Password
                    </label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className={inputClass}
                        required
                    />
                </div>
                <div className="p-1">
                    <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className={inputClass}
                        required
                    />
                    {validationErrors.newPassword && <p className={errorClass}>{validationErrors.newPassword}</p>}
                </div>
                <div className="p-1">
                    <label htmlFor="retypeNewPassword" className="block mb-2 text-sm font-medium text-gray-900">
                        Retype New Password
                    </label>
                    <input
                        type="password"
                        id="retypeNewPassword"
                        name="retypeNewPassword"
                        value={formData.retypeNewPassword}
                        onChange={handleInputChange}
                        className={inputClass}
                        required
                    />
                    {validationErrors.retypeNewPassword && <p className={errorClass}>{validationErrors.retypeNewPassword}</p>}
                </div>
                <div className="flex justify-center pb-5">
                    <button
                        type="submit"
                        disabled={!isChanged}
                        className={`mt-4 bg-orange-500 text-sm text-white p-2 rounded disabled:bg-orange-300 ${
                            !isChanged ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </form>
    );
}

export default SecurityInformation;
