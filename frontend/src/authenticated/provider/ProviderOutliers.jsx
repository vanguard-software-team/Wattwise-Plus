import ProviderAuthenticatedLayout from "./ProviderAuthenticatedLayout";
import SectionWithTitle from "../../compoments/SectionWithTitle.jsx";


const consumers = [
	{
		numberOfPowerSupply: "11111111111",
		email: 'some1@mail.com',
		deviationPercentage: "20%",
	},
	{
		numberOfPowerSupply: "22222222222",
		email: 'some2@mail.com',
		deviationPercentage: "30%",
	},
	{
		numberOfPowerSupply: "33333333333",
		email: 'some3@mail.com',
		deviationPercentage: "10%",
	},
  {
		numberOfPowerSupply: "44444444444",
		email: 'some4@mail.com',
		deviationPercentage: "-60%",
	},
]

function sortConsumersByDeviation(consumers) {
  return [...consumers].sort((a, b) => {
      const deviationA = Math.abs(parseFloat(a.deviationPercentage.replace('%', '')));
      const deviationB = Math.abs(parseFloat(b.deviationPercentage.replace('%', '')));
      return deviationB - deviationA;
  });
}

function ProviderOutliers() {
  const sortedConsumers = sortConsumersByDeviation(consumers);
	return (
		<ProviderAuthenticatedLayout>
			<div className="p-1 sm:ml-40 mt-10bg-gray-200 font-robotoflex">
				<div className="p-2 rounded-lg bg-gray-50 border-b-2 border-orange-400 m-2">
            <SectionWithTitle
              title={"Outlier Detection"}
              description={
                "This tool identifies outliers, higher or lower than expected energy usage patterns among consumers."
              }
            />
        </div>
        <div className="relative max-h-[50vh] lg:flex justify-center overflow-y-auto sm:rounded-lg mt-6 m-2">
			<table className="w-full text-sm text-left rtl:text-right text-gray-500">
				<thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100">
					<tr>
						<th scope="col" className="px-6 py-3">Number of Power Supply</th>
						<th scope="col" className="px-6 py-3">Email</th>
						<th scope="col" className="px-6 py-3">Consumption Deviation %</th>
					</tr>
				</thead>
				<tbody>
					{sortedConsumers.map((consumer) => (
						<tr key={consumer.numberOfPowerSupply} className="bg-white border-b">
							<th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
								{consumer.numberOfPowerSupply}
							</th>
							<td className="px-6 py-4">{consumer.email}</td>
							<td className="px-6 py-4">{consumer.deviationPercentage}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
			</div>
		</ProviderAuthenticatedLayout>
	);
}

export default ProviderOutliers;
