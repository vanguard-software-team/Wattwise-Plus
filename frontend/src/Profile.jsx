import AuthenticatedLayout from "./AuthenticatedLayout.jsx";
import FormBasicInformation from "./compoments/FormBasicInformation.jsx";
import FormMoreInformation from "./compoments/FormMoreInformation.jsx";
function Profile() {
	return (
		<AuthenticatedLayout>
			<div className="p-1 sm:ml-52 bg-gray-50 font-jetbrains">
				<div className="p-2 border-gray-200 rounded-lg pt-10">
					<h2 className="text-lg font-bold">Basic Information</h2>
					<div className="flex justify-center">
						<FormBasicInformation />
					</div>
				</div>
				<div className="p-2 border-gray-200 rounded-lg pt-10">
					<h2 className="text-lg font-bold">More Information</h2>
					<div className="flex justify-center">
						<FormMoreInformation />
					</div>
				</div>
				<div className="p-2 border-gray-200 rounded-lg pt-10">
					<h2 className="text-lg font-bold">Security</h2>
					<div className="flex justify-center">
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}

export default Profile;
