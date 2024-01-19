import ProviderAuthenticatedLayout from "./ProviderAuthenticatedLayout";
import SectionWithTitle from "../../compoments/SectionWithTitle.jsx";
import { useState } from "react";
import SectionTitleDescription from "../../compoments/SectionTitleDescription.jsx";
import PropTypes from "prop-types";

const consumers = [
	{
		numberOfPowerSupply: "11111111111",
		email: "some1@mail.com",
		deviationPercentage: "20%",
	},
	{
		numberOfPowerSupply: "22222222222",
		email: "some2@mail.com",
		deviationPercentage: "30%",
	},
	{
		numberOfPowerSupply: "33333333333",
		email: "some3@mail.com",
		deviationPercentage: "10%",
	},
	{
		numberOfPowerSupply: "44444444444",
		email: "some4@mail.com",
		deviationPercentage: "-60%",
	},
];

function filterConsumers(consumers, threshold, isPositive) {
    return consumers
        .filter((consumer) => {
            const deviation = parseFloat(
                consumer.deviationPercentage.replace("%", "")
            );
            // Adjusted comparison logic
            return isPositive ? deviation >= threshold : deviation <= threshold;
        })
        .sort((a, b) => {
            const deviationA = Math.abs(
                parseFloat(a.deviationPercentage.replace("%", ""))
            );
            const deviationB = Math.abs(
                parseFloat(b.deviationPercentage.replace("%", ""))
            );
            return deviationB - deviationA;
        });
}


function ProviderOutliers() {
	const [positiveThreshold, setPositiveThreshold] = useState(20);
	const [negativeThreshold, setNegativeThreshold] = useState(-20);
	const positiveConsumers = filterConsumers(consumers, positiveThreshold, true);
	const negativeConsumers = filterConsumers(
		consumers,
		negativeThreshold,
		false
	);

	return (
		<ProviderAuthenticatedLayout>
			<div className="p-1 sm:ml-40 bg-gray-200 font-robotoflex">
				<div className="p-2 rounded-lg bg-gray-50 border-b-2 border-orange-400 m-2">
					<SectionWithTitle
						title={"Outlier Detection"}
						description={
							"This tool identifies outliers, higher or lower than expected energy usage patterns among consumers."
						}
					/>
				</div>

				<div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
					<div className="grid grid-cols-1 justify-center items-center gap-4 mb-1 ">
						<SectionTitleDescription
							title={"Positive Deviation"}
							description={
								"Below you can inspect the consumers with positive deviation. You can also choose different thresholds from the selection below"
							}
						/>
					</div>
				</div>

				{/*  positive deviation slider */}
				<div className="w-full py-3 ml-5 mt-2">
					<label
						htmlFor="positive-slider"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Positive Deviation Threshold:{" "}
						<span className="font-semibold">{positiveThreshold}%</span>
					</label>
					<input
						id="positive-slider"
						type="range"
						min="0"
						max="100"
						value={positiveThreshold}
						onChange={(e) => setPositiveThreshold(e.target.value)}
						className="lg:w-1/2 md:w-full h-1 mb-6 bg-gray-400 rounded-lg appearance-none cursor-pointer range-sm"
					/>
				</div>

				{/* positive deviation table */}
				<ConsumerTable consumers={positiveConsumers} />

				<div className="p-2 border-2 border-gray-200 border-dashed rounded-lg mt-5">
					<div className="grid grid-cols-1 justify-center items-center gap-4 mb-1 ">
						<SectionTitleDescription
							title={"Negative Deviation"}
							description={
								"Below you can inspect the consumers with negative deviation. You can also choose different thresholds from the selection below"
							}
						/>
					</div>
				</div>

				{/* negative deviation slider */}
				<div className="w-full py-3 ml-5 mt-2">
					<label
						htmlFor="negative-slider"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Negative Deviation Threshold:
						<span className="font-semibold">{negativeThreshold}%</span>
					</label>
					<input
						id="negative-slider"
						type="range"
						min="-100" // Minimum value set to -100
						max="0" // Maximum value set to 0
						value={negativeThreshold}
						onChange={(e) => setNegativeThreshold(e.target.value)}
						className="w-1/2 h-1 mb-6 bg-gray-400 rounded-lg appearance-none cursor-pointer range-sm"
					/>
				</div>
				<ConsumerTable consumers={negativeConsumers} />
			</div>
		</ProviderAuthenticatedLayout>
	);
}

function ConsumerTable({ title, consumers }) {
	return (
		<div>
			<h2 className="text-lg font-bold ">{title}</h2>
			<div className="relative max-h-[50vh] lg:flex justify-center overflow-y-auto sm:rounded-lg m-2">
				<table className="w-full text-sm text-left rtl:text-right text-gray-500">
					<thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100">
						<tr>
							<th scope="col" className="px-6 py-3">
								Number of Power Supply
							</th>
							<th scope="col" className="px-6 py-3">
								Email
							</th>
							<th scope="col" className="px-6 py-3">
								Consumption Deviation %
							</th>
						</tr>
					</thead>
					<tbody>
						{consumers.map((consumer) => (
							<tr
								key={consumer.numberOfPowerSupply}
								className="bg-white border-b"
							>
								<th
									scope="row"
									className="px-6 py-4 font-medium whitespace-nowrap"
								>
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
	);
}

ConsumerTable.propTypes = {
	title: PropTypes.string.isRequired,
	consumers: PropTypes.arrayOf(
		PropTypes.shape({
			numberOfPowerSupply: PropTypes.string.isRequired,
			email: PropTypes.string.isRequired,
			deviationPercentage: PropTypes.string.isRequired,
		})
	).isRequired,
};

export default ProviderOutliers;
