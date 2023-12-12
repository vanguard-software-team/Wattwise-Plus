"use client";
import { Link } from "react-router-dom";

function LoginForm() {
	return (
		<form className="font-jetbrains w-96 p-6 bg-gray-100 border-4 border-gray-300 rounded-lg">
			<h1 className="text-center text-2xl font-bold">Log in</h1>
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
					placeholder="someone@gmail.com"
					required
				></input>
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
					className="bg-gray-50 border text-gray-900 text-sm rounded-lg border-orange-400 block w-full p-2.5 "
					required
				></input>
			</div>
			<div className="flex items-start mb-6">
				<div className="flex items-center h-5">
					<input
						id="remember"
						type="checkbox"
						value=""
						className="w-4 h-4 border border-gray-300 rounded bg-gray-50"
						required
					></input>
				</div>
				<label
					htmlFor="remember"
					className="ms-2 text-sm font-medium text-gray-900"
				>
					Remember me
				</label>
			</div>
			<button
				type="submit"
				className="text-white bg-orange-400 hover:bg-gray-600 hover:text-white font-bold rounded-lg w-full px-5 py-2.5 text-center"
			>
				Login
			</button>

			<p className="p-4 text-sm">
				You dont have an account?{" "}
				<Link to="/register" className="text-blue-500 p-2 hover:font-semibold">
					Sign Up
				</Link>
			</p>
		</form>
	);
}

export default LoginForm;
