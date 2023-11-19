import {Link} from "react-router-dom";

function RegisterForm() {
    return (
        <form className="font-play w-96 p-8 bg-gray-100 border border-4 border-gray-200 rounded-lg">
            <h1 className="text-center text-2xl font-bold">Sign Up</h1>
            <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your
                    email</label>
                <input type="email" id="email"
                       className="bg-gray-50 border text-gray-900 text-sm rounded-lg border-orange-400 block w-full p-2.5"
                       required></input>
            </div>
            <div className="mb-6">
                <label htmlFor="provider" className="block mb-2 text-sm font-medium text-gray-900">Your
                    provider</label>
                <select type="text" id="provider"
                        className="bg-gray-50 border text-gray-900 rounded-lg border-orange-400 block w-full p-2.5"
                        required>
                    <option disabled selected></option>
                    <option>ΗΡΩΝ</option>
                    <option>ΔΕΗ</option>
                    <option>Zενιθ</option>
                </select>
            </div>
            <div className="mb-6">
                <label htmlFor="power_suply_number" className="block mb-2 text-sm font-medium text-gray-900">Αριθμός
                    παροχής</label>
                <input type="number" id="password"
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg border-orange-400 block w-full p-2.5 "
                       required></input>
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Your
                    password</label>
                <input type="password" id="password"
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg border-orange-400 block w-full p-2.5 "
                       required></input>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer"></input>
                    <div
                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-400"></div>
                    <span className="ms-3 text-gray-900 dark:text-gray-300">I am a provider</span>
            </label>
            <button type="submit"
                    className="text-white bg-orange-400 hover:bg-gray-600 hover:text-white font-bold rounded-lg w-full px-5 py-2.5 text-center">Sign
                Up
            </button>

            <p className="p-4">You have an account? <Link to="/login" className="text-blue-500 p-2 hover:font-semibold">Log
                in</Link></p>
        </form>
);
}

export default RegisterForm