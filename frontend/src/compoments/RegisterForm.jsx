import { Link } from "react-router-dom";
import { useState } from "react";

function RegisterForm() {
	const [providerIndicator, isProvider] = useState(true);
	const [selectedOption, setSelectedOption] = useState("");

	const handleSelectChange = (event) => {
		setSelectedOption(event.target.value);
	};

	function switchRoleSignUp() {
		isProvider(!providerIndicator);
	}

	return (
		<form className="font-robotoflex w-96 p-7 bg-gray-100 border-4 border-gray-300 rounded-lg">
			<h1 className="text-center text-2xl font-bold">Sign Up</h1>
			{providerIndicator ? (
				<>
					<p className="text-center font-bold bg-orange-300 m-4">Consumer</p>
					<div className="mb-6">
						<label
							htmlFor="power_suply_number"
							className="block mb-2 text-sm font-medium text-gray-900"
						>
							Number of power supply
						</label>
						<input
							type="number"
							id="power_suply_number"
							className="bg-gray-50 border border-orange-400 text-gray-900  text-sm rounded-lg block w-full p-2.5 "
							placeholder="Find it in an electricity bill"
							required
						></input>
					</div>
				</>
			) : (
				<>
					<p className="text-center font-bold bg-orange-300 m-4">Provider</p>
					<div className="mb-6">
						<label
							htmlFor="secret_provider_code"
							className="block mb-2 text-sm font-medium text-gray-900"
						>
							Secret provider code{" "}
						</label>
						<input
							type="text"
							id="secret_provider_code"
							className="bg-gray-50 border border-orange-400 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
							placeholder="The secret code is provided from the provider"
							required
						></input>
					</div>
				</>
			)}
			<div className="mb-6">
				<label
					htmlFor="email"
					className="block mb-2 text-sm font-medium text-gray-900"
				>
					Your email
				</label>
				<input
					type="email"
					id="email"
					className="bg-gray-50 border text-gray-900 text-sm rounded-lg border-orange-400 block w-full p-2.5"
					required
				></input>
			</div>
			<div className="mb-6">
				<label
					htmlFor="provider"
					className="block mb-2 text-sm font-medium text-gray-900"
				>
					Your provider
				</label>
				<select
					type="text"
					id="provider"
					className="bg-gray-50 border text-gray-900 rounded-lg border-orange-400 block w-full p-2.5"
					value={selectedOption}
					onChange={handleSelectChange}
					required
				>
					<option value="" disabled></option>
					<option value="ΗΡΩΝ">ΗΡΩΝ</option>
					<option value="ΔΕΗ">ΔΕΗ</option>
					<option value="Zενιθ">Zενιθ</option>
				</select>
			</div>

			<div className="mb-6">
				<label
					htmlFor="password"
					className="block mb-2 text-sm font-medium text-gray-900"
				>
					Your password
				</label>
				<input
					type="password"
					id="password"
					className="bg-gray-50 border border-orange-400 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
					required
				></input>
			</div>
			<label className="relative inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					onChange={switchRoleSignUp}
					className="sr-only peer"
				></input>
				<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-400"></div>
				<span className="ms-3 text-gray-900 dark:text-gray-300">
					I am a provider
				</span>
			</label>
			<button
				type="submit"
				className="text-white bg-orange-400 hover:bg-gray-600 hover:text-white font-bold rounded-lg w-full px-5 py-2.5 text-center"
			>
				Sign Up
			</button>

			<p className="p-4 text-sm">
				You have an account?{" "}
				<Link to="/login" className="text-blue-500 p-2 hover:font-semibold">
					Log in
				</Link>
			</p>
		</form>
	);
}

export default RegisterForm;
