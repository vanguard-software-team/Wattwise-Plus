import ProviderAuthenticatedLayout from "./ProviderAuthenticatedLayout";

function ProviderInsights() {
  return (
    <ProviderAuthenticatedLayout>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-4xl font-bold">Welcome to the Provider Insights</h1>
      </div>
    </ProviderAuthenticatedLayout>
  );
}

export default ProviderInsights;