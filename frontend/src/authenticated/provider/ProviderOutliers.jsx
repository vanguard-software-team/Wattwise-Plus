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
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Label,
} from "recharts";
import { getOutliers, getConsumerConsumptionAggregateHourly } from "../../service/api.jsx";


function filterConsumers(consumers, threshold, isPositive) {
    const bestRecords = new Map();

    consumers.forEach((consumer) => {
        const deviation = parseFloat(consumer.deviation_percentage);

        const meetsThreshold = isPositive ? deviation >= threshold : deviation <= threshold;

        if (meetsThreshold) {
            const powerNumber = consumer.power_supply_number;
            const currentBest = bestRecords.get(powerNumber);

            const isBetter = currentBest ? 
                (isPositive ? deviation > parseFloat(currentBest.deviation_percentage) :
                deviation < parseFloat(currentBest.deviation_percentage)) : true;

            if (isBetter) {
                bestRecords.set(powerNumber, consumer);
            }
        }
    });

    const filteredAndUniqueConsumers = Array.from(bestRecords.values());

    filteredAndUniqueConsumers.sort((a, b) => {
        const deviationA = Math.abs(parseFloat(a.deviation_percentage));
        const deviationB = Math.abs(parseFloat(b.deviation_percentage));
        return deviationB - deviationA;
    });

    return filteredAndUniqueConsumers;
}

function calculateOutlierStats(dataAggregated) {
    const validData = dataAggregated.filter(d => d.limit !== null);
    
    if (validData.length === 0) return null;
    
    const totalHours = validData.length;
    const hoursExceedingLimit = validData.filter(d => d.exceedsLimit).length;
    const percentageExceeding = ((hoursExceedingLimit / totalHours) * 100).toFixed(1);
    
    const avgConsumption = (validData.reduce((sum, d) => sum + parseFloat(d.consumption_kwh_sum), 0) / totalHours).toFixed(2);
    const avgLimit = (validData.reduce((sum, d) => sum + parseFloat(d.limit), 0) / totalHours).toFixed(2);
    
    const maxExcess = validData
        .filter(d => d.exceedsLimit)
        .reduce((max, d) => Math.max(max, parseFloat(d.deviationFromLimit)), 0);
    
    // Additional statistics
    const totalExcessConsumption = validData
        .filter(d => d.exceedsLimit)
        .reduce((sum, d) => sum + (parseFloat(d.consumption_kwh_sum) - parseFloat(d.limit)), 0);
    
    const complianceRate = ((totalHours - hoursExceedingLimit) / totalHours * 100).toFixed(1);
    
    return {
        percentageExceeding,
        hoursExceedingLimit,
        totalHours,
        avgConsumption,
        avgLimit,
        maxExcess: maxExcess.toFixed(1),
        totalExcessConsumption: totalExcessConsumption.toFixed(2),
        complianceRate
    };
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
			const response = await getOutliers();
			return response;
		};

		const setComparisonAggregateData = async (consumer) => {
			try {
				const consumerResponse = await getConsumerConsumptionAggregateHourly(consumer.email);
				const allOutliers = await fetchAllOutliers();

				const consumerData = consumerResponse.map(data => {
					let originalType = null;
					data.timeUnit = data.hour.slice(0, 5);
					delete data.hour;
					originalType = 'hour';
					return { ...data, originalType };
				});

				const allOutliersData = allOutliers.filter(outlier => outlier.email === consumer.email);
				allOutliersData.forEach((outlier) => {
					let hourString = String(outlier.hour).padStart(2, '0') + ':00';
					outlier.timeUnit = hourString;
					delete outlier.hour;
				});

				const dataAggregated = consumerData.map((consumerData) => {
					const outliersData = allOutliersData.find(outlier => outlier.timeUnit === consumerData.timeUnit);
					const consumption = parseFloat(consumerData.consumption_kwh_sum);
					const limit = outliersData ? parseFloat(outliersData.limit) : null;
					
					return {
						timeUnit: consumerData.timeUnit,
						consumption_kwh_sum: consumption.toFixed(3),
						limit: limit ? limit.toFixed(3) : null,
						exceedsLimit: limit && consumption > limit,
						deviationFromLimit: limit ? ((consumption - limit) / limit * 100).toFixed(2) : null
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
		};

		fetchPositiveOutliers();
	}, [positiveThreshold]);

	useEffect(() => {
		const fetchNegativeOutliers = async () => {
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
			<div className="p-1 sm:ml-40 bg-gray-200 font-ubuntu">
				<div className="p-2 rounded-lg bg-gray-50 border-b-2 border-orange-400 m-2">
					<SectionWithTitle
						title={"Outlier Detection & Consumer Compliance Analysis"}
						description={
							"This tool identifies consumers exceeding usage limits and helps providers assess patterns of non-compliance to take appropriate measures."
						}
					/>
				</div>

				<div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
					<div className="grid grid-cols-1 justify-center items-center gap-4 mb-1 ">
						<SectionTitleDescription
							title={"Positive Deviation"}
							description={
								"Consumers exceeding their usage limits. Use the threshold slider to filter by deviation percentage. Select 'Show' to analyze compliance patterns and determine if intervention is needed."
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
								"Consumers using significantly less energy than expected. Use the threshold slider to filter by deviation percentage. Select 'Show' to analyze usage patterns for potential efficiency insights."
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
								title={"Consumer Limit Compliance Analysis"}
								description={
									"Analysis shows consumer consumption vs. established limits. Red bars indicate hours exceeding limits, green bars show compliance."
								}
								metrics={(() => {
									const stats = calculateOutlierStats(dataAggregated);
									return [
										{
											title: "Power Supply Number",
											description: (
												<div 
													className="cursor-help"
													title="Unique identifier for the consumer's power supply connection"
												>
													{selectedConsumer.power_supply_number}
												</div>
											),
										},
										{
											title: "Email",
											description: (
												<div 
													className="cursor-help"
													title="Consumer's registered email address for account identification"
												>
													{selectedConsumer.email}
												</div>
											),
										},
										{
											title: "Cluster ID",
											description: (
												<div 
													className="cursor-help"
													title="Consumer group classification based on usage patterns and demographics"
												>
													{selectedConsumer.cluster_id}
												</div>
											),
										},
										...(stats ? [
											{
												title: "Hours Exceeding Limit",
												description: (
													<div 
														className="cursor-help"
														title={`Time periods where consumption exceeded established limits. ${
															stats.percentageExceeding > 30 ? "High violation rate - intervention recommended" :
															stats.percentageExceeding > 10 ? "Monitor closely for compliance issues" : 
															"Within acceptable range - normal variation"
														}`}
													>
														{stats.hoursExceedingLimit}/{stats.totalHours} ({stats.percentageExceeding}%)
													</div>
												),
											},
											{
												title: "Average Daily Consumption",
												description: (
													<div 
														className="cursor-help"
														title="Consumer's mean energy usage across monitored hours. Compare with limit to assess overall compliance pattern."
													>
														{stats.avgConsumption} kWh
													</div>
												),
											},
											{
												title: "Average Daily Limit",
												description: (
													<div 
														className="cursor-help"
														title="Established usage threshold based on grid capacity and fair usage policies. Values above this indicate policy violations."
													>
														{stats.avgLimit} kWh
													</div>
												),
											},
											{
												title: "Maximum Excess",
												description: (
													<div 
														className="cursor-help"
														title={`Highest percentage above limit recorded during monitoring period. ${
															stats.maxExcess > 50 ? "Severe violation detected - immediate action required" :
															stats.maxExcess > 25 ? "Significant excess usage - consider penalties" : 
															"Minor deviation - within tolerance range"
														}`}
													>
														{stats.maxExcess}% above limit
													</div>
												),
											},
											{
												title: "Total Excess Consumption",
												description: (
													<div 
														className="cursor-help"
														title="Cumulative energy consumed above established limits. Used for billing adjustments, penalty calculations, and infrastructure impact assessment."
													>
														{stats.totalExcessConsumption} kWh
													</div>
												),
											},
											{
												title: "Compliance Rate",
												description: (
													<div 
														className="cursor-help"
														title={`Percentage of time consumer stayed within limits. ${
															stats.complianceRate > 90 ? "Excellent compliance - reliable consumer" :
															stats.complianceRate > 70 ? "Good compliance - minor monitoring needed" : 
															"Poor compliance - requires intervention measures"
														}`}
													>
														{stats.complianceRate}%
													</div>
												),
											}
										] : [])
									];
								})()}
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
									<YAxis orientation="left">
										<Label
											value="Energy Consumption (kWh)"
											angle={-90}
											position="insideLeft"
										/>
									</YAxis>
									<Tooltip formatter={(value, name) => [
										value,
										name === 'consumption_kwh_sum' ? 'Consumer Consumption (kWh)' :
											name === 'limit' ? 'Usage Limit (kWh)' : name
									]} />
									<Legend formatter={(value) => 
										value === 'consumption_kwh_sum' ? 'Consumer Consumption (kWh)':
										value === 'limit' ? 'Usage Limit (kWh)' : value
									} />
									<Bar
										dataKey="consumption_kwh_sum"
										name="Consumer Consumption"
									>
										{dataAggregated.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={entry.exceedsLimit ? '#ff4444' : '#22c55e'}
											/>
										))}
									</Bar>
									<Bar
										dataKey="limit"
										fill="#94a3b8"
										name="Usage Limit"
									/>
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
