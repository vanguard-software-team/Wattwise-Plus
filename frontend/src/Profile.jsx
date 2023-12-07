import AuthenticatedLayout from "./AuthenticatedLayout.jsx";
function Profile() {
  return (
    <AuthenticatedLayout>
      <div className="p-1 sm:ml-52 bg-gray-50">
        <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
          <div className="grid grid-cols-2 gap-4 mb-4 font-play">
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default Profile;
