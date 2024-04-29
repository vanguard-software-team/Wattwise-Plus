import ProviderAuthenticatedLayout from "./ProviderAuthenticatedLayout";
import SectionWithTitle from "../../components/SectionWithTitle.jsx";
import { useState, useRef, useEffect } from "react";
import SectionTitleDescription from "../../components/SectionTitleDescription.jsx";
import PropTypes from "prop-types";
import MetricsCard from "../../components/MetricsCard.jsx";
import {
	BarChart,
	Bar,
	Cell,
	Rectangle,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Label,
} from "recharts";
import { getOutliers, getConsumerConsumptionAggregateHourly, getClusterConsumptionAggregateHourly } from "../../service/api.jsx";
import { de, th } from "date-fns/locale";


function filterConsumers(consumers, threshold, isPositive) {
    const bestRecords = new Map();

    consumers.forEach((consumer) => {
        const deviation = parseFloat(consumer.deviation_percentage);

        // Check if the deviation meets the specified threshold
        const meetsThreshold = isPositive ? deviation >= threshold : deviation <= threshold;

        if (meetsThreshold) {
            const powerNumber = consumer.power_supply_number;
            const currentBest = bestRecords.get(powerNumber);

            // Determine if the current consumer has a more significant deviation than the stored one
            const isBetter = currentBest ? 
                (isPositive ? deviation > parseFloat(currentBest.deviation_percentage) :
                deviation < parseFloat(currentBest.deviation_percentage)) : true;

            if (isBetter) {
                bestRecords.set(powerNumber, consumer);
            }
        }
    });

    const filteredAndUniqueConsumers = Array.from(bestRecords.values());

    // Sort consumers by the absolute value of their deviation in descending order
    filteredAndUniqueConsumers.sort((a, b) => {
        const deviationA = Math.abs(parseFloat(a.deviation_percentage));
        const deviationB = Math.abs(parseFloat(b.deviation_percentage));
        return deviationB - deviationA;
    });

    return filteredAndUniqueConsumers;
}



function ProviderOutliers() {
	const [positiveThreshold, setPositiveThreshold] = useState(0.5);
	const [negativeThreshold, setNegativeThreshold] = useState(-0.5);
	const [positiveConsumers, setPositiveConsumers] = useState([]);
	const [negativeConsumers, setNegativeConsumers] = useState([]);
	const [selectedConsumer, setSelectedConsumer] = useState(undefined);
	const [dataAggregated, setDataAggregated] = useState([]);
	const metricsCardRef = useRef(null);
	const [isReadyToScroll, setIsReadyToScroll] = useState(false);

	const handleShowConsumerData = (consumer) => {
		const fetchAllOutliers = async () => {
			try {
				const response = await getOutliers();
				return response;
			} catch (error) {
				throw error;
			}
		};

		const setComparisonAggregateData = async (consumer) => {
			try {
				const consumerResponse = await getConsumerConsumptionAggregateHourly(consumer.email);
				const clusterResponse = await getClusterConsumptionAggregateHourly(consumer.cluster_id);
				const allOutliers = await fetchAllOutliers();

				const consumerData = consumerResponse.map(data => {
					let originalType = null;
					data.timeUnit = data.hour.slice(0, 5);
					delete data.hour;
					originalType = 'hour';
					return { ...data, originalType };
				});

				const clusterData = clusterResponse.map(data => {
					let originalType = null;
					data.timeUnit = data.hour.slice(0, 5);
					delete data.hour;
					originalType = 'hour';
					return { ...data, originalType };
				});



				const allOutliersData = allOutliers.filter(outlier => outlier.email === consumer.email);
				// change allOutliersData hour to timeUnit format
				allOutliersData.forEach((outlier) => {
					let hourString = String(outlier.hour).padStart(2, '0') + ':00';
					outlier.timeUnit = hourString;
					delete outlier.hour;
				});


				const dataAggregated = consumerData.map((consumerData, index) => {
					const clusterDataPoint = clusterData[index];
					const outliersData = allOutliersData.find(outlier => outlier.timeUnit === consumerData.timeUnit);
					return {
						timeUnit: consumerData.timeUnit,
						consumption_kwh_sum: parseFloat(consumerData.consumption_kwh_sum).toFixed(3),
						cluster_consumption_kwh_sum: parseFloat(clusterDataPoint.consumption_kwh_sum).toFixed(3),
						limit: outliersData ? parseFloat(outliersData.limit).toFixed(3) : null,

					};
				});

				dataAggregated.sort((a, b) => {
					return a.timeUnit.localeCompare(b.timeUnit);
				});

				setDataAggregated(dataAggregated);

			} catch (error) {
				console.error("Failed to fetch data: ", error);
				throw error;

			}
		};
		setSelectedConsumer(consumer);
		setComparisonAggregateData(consumer, setDataAggregated);
		setIsReadyToScroll(true);
	};

	useEffect(() => {
		const fetchPositiveOutliers = async () => {
			try {
				const response = await getOutliers();
				const positiveConsumers = filterConsumers(response, positiveThreshold, true);

				positiveConsumers.forEach((consumer) => {
					consumer.deviation_percentage = parseFloat(consumer.deviation_percentage).toFixed(2);
					consumer.lower_bound = parseFloat(consumer.lower_bound).toFixed(2);
					consumer.upper_bound = parseFloat(consumer.upper_bound).toFixed(2);

					let hourString = String(consumer.hour).padStart(2, '0') + ':00';
					consumer.time = hourString;
				});


				setPositiveConsumers(positiveConsumers);

			} catch (error) {
				throw error;
			}
		};

		fetchPositiveOutliers();
	}, [positiveThreshold]);

	useEffect(() => {
		const fetchNegativeOutliers = async () => {
			try {
				const response = await getOutliers();

				const negativeConsumers = filterConsumers(response, negativeThreshold, false);

				negativeConsumers.forEach((consumer) => {
					consumer.deviation_percentage = parseFloat(consumer.deviation_percentage).toFixed(2);
					consumer.lower_bound = parseFloat(consumer.lower_bound).toFixed(2);
					consumer.upper_bound = parseFloat(consumer.upper_bound).toFixed(2);

					let hourString = String(consumer.hour).padStart(2, '0') + ':00';
					consumer.time = hourString;
				});

				setNegativeConsumers(negativeConsumers);

			} catch (error) {
				throw error;
			}
		};

		fetchNegativeOutliers();
	}, [negativeThreshold]);


	useEffect(() => {
		if (isReadyToScroll && metricsCardRef.current) {
			metricsCardRef.current.scrollIntoView({ behavior: 'smooth' });
			setIsReadyToScroll(false);
		}
	}, [isReadyToScroll]);



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
								"Below you can inspect the consumers with positive deviation. You can also choose different thresholds from the selection below. Select 'Show' to inspect the consumer data compared to similar consumers"
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
						max="10"
						value={positiveThreshold}
						step="0.05"
						onChange={(e) => setPositiveThreshold(e.target.value)}
						className="lg:w-1/2 md:w-full h-1 mb-6 bg-gray-400 rounded-lg appearance-none cursor-pointer range-sm"
					/>

				</div>

				{/* positive deviation table */}
				<ConsumerTable
					consumers={positiveConsumers}
					onShow={handleShowConsumerData}
				/>

				<div className="p-2 border-2 border-gray-200 border-dashed rounded-lg mt-5">
					<div className="grid grid-cols-1 justify-center items-center gap-4 mb-1 ">
						<SectionTitleDescription
							title={"Negative Deviation"}
							description={
								"Below you can inspect the consumers with negative deviation. You can also choose different thresholds from the selection below. Select 'Show' to inspect the consumer data compared to similar consumers"
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
						min="-10"
						max="0"
						step="0.05"
						value={negativeThreshold}
						onChange={(e) => setNegativeThreshold(e.target.value)}
						className="w-1/2 h-1 mb-6 bg-gray-400 rounded-lg appearance-none cursor-pointer range-sm"
					/>
				</div>
				<ConsumerTable
					consumers={negativeConsumers}
					onShow={handleShowConsumerData}
				/>

				{selectedConsumer !== undefined && (
					<div>
						<div ref={metricsCardRef} className="grid grid-cols-1 justify-center items-center gap-4 mb-1 ">
							<MetricsCard
								title={"Consumer & Cluster Data"}
								description={
									"Below you can inspect the consumer data compared to similar consumers. The chart shows the mean consumption of the consumer and the mean consumption of the cluster."
								}
								metrics={[
									{
										title: "Number of Power Supply",
										description: selectedConsumer.power_supply_number,
									},
									{
										title: "Email",
										description: selectedConsumer.email,
									},
									{
										title: "Cluster",
										description: selectedConsumer.cluster_id,
									},
								]}
							/>
						</div>
						<div className="flex items-center m-2 justify-center rounded bg-gray-50 h-[calc(100vh-8rem)] rounded-b-lg pt-10">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									width={500}
									height={300}
									data={dataAggregated}
									margin={{
										top: 20,
										right: 30,
										left: 20,
										bottom: 5,
									}}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="timeUnit" />
									<YAxis yAxisId="left" orientation="left">
										<Label
											value="Mean Consumer Consumption (kwh)"
											angle={-90}
											position="insideLeft"
										/>
									</YAxis>
									<YAxis yAxisId="right" orientation="right">
										<Label
											value="Mean Cluster Consumption (kwh)"
											angle={90}
											position="insideRight"
										/>
									</YAxis>
									<Tooltip formatter={(value, name) => [
										value,
										name === 'consumption_kwh_sum' ? 'Mean Consumer Consumption (kwh)' :
											name === 'cluster_consumption_kwh_sum' ? 'Mean Cluster Consumption (kwh)' :
												name === 'limit' ? 'Limit'
														: name
									]} />
									<Legend formatter={(value) => [
										value === 'cluster_consumption_kwh_sum' ? 'Mean Cluster Consumption (kwh)':
										value === 'consumption_kwh_sum' ? 'Mean Consumer Consumption (kwh)':
										value === 'limit' ? 'Limit'
										: value
									]} />
									<Bar
										yAxisId="left"
										dataKey="consumption_kwh_sum"
										fill="#faa741"
										activeBar={<Rectangle fill="#fc8c03" stroke="black" />}
									/>
									<Bar
										yAxisId="right"
										dataKey="cluster_consumption_kwh_sum"
										fill="#d1d0cf"
										activeBar={<Rectangle fill="grey" stroke="black" />}
									/>
									<Bar
										yAxisId="left"
										dataKey="limit"
									>
										{dataAggregated.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={entry.consumption_kwh_sum > entry.limit ? '#ff0000' : '#219e43'}
											/>
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>

						</div>

					</div>
				)}
			</div>
		</ProviderAuthenticatedLayout>
	);
}

function ConsumerTable({ title, consumers, onShow }) {
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
								Cluster
							</th>
							<th scope="col" className="px-6 py-3">
								Consumption Deviation %
							</th>
							<th scope="col" className="px-6 py-3">
								Lower Bound (kwh)
							</th>
							<th scope="col" className="px-6 py-3">
								Upper Bound (kwh)
							</th>
							<th scope="col" className="px-6 py-3">
								Hour
							</th>
							<th scope="col" className="px-6 py-3">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{consumers.map((consumer) => (
							<tr
								key={consumer.power_supply_number}
								className="bg-white border-b"
							>
								<th
									scope="row"
									className="px-6 py-4 font-medium whitespace-nowrap"
								>
									{consumer.power_supply_number}
								</th>
								<td className="px-6 py-4">{consumer.email}</td>
								<td className="px-6 py-4">{consumer.cluster_id}</td>
								<td className="px-6 py-4">{consumer.deviation_percentage} %</td>
								<td className="px-6 py-4">{consumer.lower_bound} kwh</td>
								<td className="px-6 py-4">{consumer.upper_bound} kwh</td>
								<td className="px-6 py-4">{consumer.time}</td>
								<td className="px-6 py-4">
									<button
										onClick={() => onShow(consumer)}
										className="text-orange-400 hover:underline"
									>
										Show
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

ConsumerTable.propTypes = {
	title: PropTypes.string,
	consumers: PropTypes.arrayOf(
		PropTypes.shape({
			power_supply_number: PropTypes.string.isRequired,
			email: PropTypes.string.isRequired,
			deviation_percentage: PropTypes.string.isRequired,
		})
	).isRequired,
	onShow: PropTypes.func.isRequired,
};

export default ProviderOutliers;
