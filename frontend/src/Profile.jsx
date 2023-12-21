import AuthenticatedLayout from "./AuthenticatedLayout.jsx";
import FormBasicInformation from "./compoments/FormBasicInformation.jsx";
import FormMoreInformation from "./compoments/FormMoreInformation.jsx";
import SecurityInformation from "./compoments/SecurityInformation.jsx";

const InformationSVG = (
	<svg
		className="w-6 h-6 text-gray-800 dark:text-white"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 20 20"
	>
		<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
	</svg>
);

const securitySVG = (
	<svg
		className="w-6 h-6 text-gray-800 dark:text-white"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 16 20"
	>
		<path d="M14 7h-1.5V4.5a4.5 4.5 0 1 0-9 0V7H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-5 8a1 1 0 1 1-2 0v-3a1 1 0 1 1 2 0v3Zm1.5-8h-5V4.5a2.5 2.5 0 1 1 5 0V7Z" />
	</svg>
);
function Profile() {
	return (
		<AuthenticatedLayout>
			<div className="p-2 sm:ml-40 bg-gray-50 font-robotoflex">
				<div className="p-2 border-b-4 border-gray-300 rounded-lg pt-10">
					<div className="flex items-center pl-10">
						{InformationSVG}
						<h2 className="text-lg font-bold ml-2">Basic Information</h2>
					</div>
					<div className="flex justify-center">
						<FormBasicInformation />
					</div>
				</div>
				<div className="p-2 border-b-4 border-gray-300 rounded-lg pt-10">
					<div className="flex items-center pl-10">
						{InformationSVG}
						<h2 className="text-lg font-bold ml-2">More Information</h2>
					</div>
					<div className="flex pl-10 mt-2">
						<h2 className="text-sm font text-red-500">
							Fill the information below to unlock personalized insights
						</h2>
					</div>
					<div className="flex justify-center">
						<FormMoreInformation />
					</div>
				</div>

				<div className="p-2 border-b-4 border-gray-300 rounded-lg pt-10">
					<div className="flex items-center pl-10">
						{securitySVG}
						<h2 className="text-lg font-bold ml-2">Security</h2>
					</div>
					<div className="flex justify-center">
						<SecurityInformation />
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}

export default Profile;
