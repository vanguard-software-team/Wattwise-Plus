import ProviderAuthenticatedLayout from "./ProviderAuthenticatedLayout";

function ProviderDashboard() {
  return (
    <ProviderAuthenticatedLayout>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-4xl font-bold">Welcome to the Provider Dashboard</h1>
        <p className="text-xl mt-4">This is a protected route</p>
      </div>
    </ProviderAuthenticatedLayout>
  );
}

export default ProviderDashboard;