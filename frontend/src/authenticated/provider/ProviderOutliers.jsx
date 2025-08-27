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


function getDeviationColor(deviationType, severity) {
	if (deviationType === 'excess') {
		return severity === 'high' ? 'bg-red-600 text-white' : 
			severity === 'medium' ? 'bg-red-400 text-white' : 'bg-red-200 text-red-800';
	} else {
		return severity === 'high' ? 'bg-blue-600 text-white' : 
			severity === 'medium' ? 'bg-blue-400 text-white' : 'bg-blue-200 text-blue-800';
	}
}

function getSeverityBadge(severity) {
	switch (severity) {
		case 'high':
			return 'bg-orange-100 text-orange-800 border-orange-200';
		case 'medium':
			return 'bg-yellow-100 text-yellow-800 border-yellow-200';
		case 'low':
			return 'bg-green-100 text-green-800 border-green-200';
		default:
			return 'bg-gray-100 text-gray-800 border-gray-200';
	}
}

function getDeviationDescription(deviationType, deviation) {
	const absDeviation = Math.abs(deviation);
	if (deviationType === 'excess') {
		if (absDeviation >= 5) return 'Critical excess - immediate action required';
		if (absDeviation >= 2) return 'Significant excess - monitoring recommended';
		return 'Minor excess - within tolerance';
	} else {
		if (absDeviation >= 5) return 'Significant underuse - efficiency opportunity';
		if (absDeviation >= 2) return 'Notable underuse - investigate patterns';
		return 'Slight underuse - normal variation';
	}
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
	const [deviationThreshold, setDeviationThreshold] = useState(0.5);
	const [filteredOutliers, setFilteredOutliers] = useState([]);
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
		const fetchAllOutliers = async () => {
			try {
				console.log("Fetching outliers from:", `${import.meta.env.VITE_BACKEND_HOST}/outliers`);
				const response = await getOutliers();
				console.log("Raw API response:", response);
				console.log("Response type:", typeof response);
				console.log("Is array:", Array.isArray(response));
				
				// Handle null or undefined response
				if (!response) {
					console.error("No response received from outliers API");
					setFilteredOutliers([]);
					return;
				}

				// If response has a data property, use that (common API pattern)
				let dataArray = response;
				if (response.data && Array.isArray(response.data)) {
					dataArray = response.data;
					console.log("Using response.data, length:", dataArray.length);
				} else if (response.results && Array.isArray(response.results)) {
					dataArray = response.results;
					console.log("Using response.results, length:", dataArray.length);
				}

				// Handle non-array response
				if (!Array.isArray(dataArray)) {
					console.error("API response is not an array:", dataArray);
					console.error("Available properties:", Object.keys(response || {}));
					setFilteredOutliers([]);
					return;
				}
				
				console.log("Processing", dataArray.length, "outliers");
				
				// Handle empty array
				if (dataArray.length === 0) {
					console.log("No outliers found in response");
					setFilteredOutliers([]);
					return;
				}
				
				// Process all outliers and add deviation type and formatting
				const processedOutliers = dataArray.map((consumer, index) => {
					try {
						const deviation = parseFloat(consumer.deviation_percentage || 0);
						return {
							...consumer,
							deviation_percentage: deviation.toFixed(2),
							lower_bound: parseFloat(consumer.lower_bound || 0).toFixed(2),
							upper_bound: parseFloat(consumer.upper_bound || 0).toFixed(2),
							time: String(consumer.hour || 0).padStart(2, '0') + ':00',
							deviation_type: deviation > 0 ? 'excess' : 'underuse',
							severity: Math.abs(deviation) >= 5 ? 'high' : Math.abs(deviation) >= 2 ? 'medium' : 'low',
							abs_deviation: Math.abs(deviation)
						};
					} catch (error) {
						console.error(`Error processing outlier at index ${index}:`, error, consumer);
						return null;
					}
				}).filter(Boolean); // Remove null entries

				console.log("Successfully processed", processedOutliers.length, "outliers");

				// Remove duplicates by keeping the highest absolute deviation per power supply number
				const uniqueOutliers = new Map();
				processedOutliers.forEach((consumer) => {
					const powerNumber = consumer.power_supply_number;
					const current = uniqueOutliers.get(powerNumber);
					
					if (!current || consumer.abs_deviation > current.abs_deviation) {
						uniqueOutliers.set(powerNumber, consumer);
					}
				});

				const allOutliers = Array.from(uniqueOutliers.values());
				console.log("Unique outliers:", allOutliers.length);
				
				// Sort by absolute deviation (highest first)
				allOutliers.sort((a, b) => b.abs_deviation - a.abs_deviation);
				
				// Apply initial filtering
				const filtered = allOutliers.filter(consumer => 
					consumer.abs_deviation >= deviationThreshold
				);
				console.log("Filtered outliers:", filtered.length, "with threshold:", deviationThreshold);
				setFilteredOutliers(filtered);
				
			} catch (error) {
				console.error("Failed to fetch outliers: ", error);
				console.error("Error details:", error.message);
				if (error.response) {
					console.error("Response status:", error.response.status);
					console.error("Response data:", error.response.data);
				}
				setFilteredOutliers([]);
			}
		};

		fetchAllOutliers();
	}, [deviationThreshold]);


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
					<div className="grid grid-cols-1 justify-center items-center gap-4 mb-1">
						<SectionTitleDescription
							title={"Consumer Usage Deviation Analysis"}
							description={
								"This table shows consumers with significant deviations from expected usage patterns. Red indicators show excess consumption (above limits), blue indicators show underuse (significantly below expected). Use the threshold slider to filter results by deviation severity."
							}
						/>
						
						{/* Legend */}
						<div className="flex flex-wrap gap-6 justify-center bg-gray-50 p-4 rounded-lg">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-red-500 rounded"></div>
								<span className="text-sm font-medium">Excess Usage (Over Limits)</span>
								<span className="text-xs text-gray-600">- Requires intervention</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-500 rounded"></div>
								<span className="text-sm font-medium">Underuse (Below Expected)</span>
								<span className="text-xs text-gray-600">- Efficiency opportunity</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-orange-500 rounded"></div>
								<span className="text-sm font-medium">High Severity (≥5%)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-yellow-500 rounded"></div>
								<span className="text-sm font-medium">Medium Severity (2-5%)</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-green-500 rounded"></div>
								<span className="text-sm font-medium">Low Severity (&lt;2%)</span>
							</div>
						</div>
					</div>
				</div>

				{/* Unified threshold slider */}
				<div className="w-full py-3 ml-5 mt-2">
					<label
						htmlFor="deviation-slider"
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Minimum Deviation Threshold:{" "}
						<span className="font-semibold">{deviationThreshold}%</span>
						<span className="text-xs text-gray-600 ml-2">
							(Shows consumers with deviation ≥ {deviationThreshold}% from expected usage)
						</span>
					</label>
					<input
						id="deviation-slider"
						type="range"
						min="0"
						max="10"
						value={deviationThreshold}
						step="0.05"
						onChange={(e) => setDeviationThreshold(parseFloat(e.target.value))}
						className="lg:w-1/2 md:w-full h-1 mb-6 bg-gray-400 rounded-lg appearance-none cursor-pointer range-sm"
					/>
				</div>

				{/* Unified outliers table */}
				<UnifiedOutliersTable
					outliers={filteredOutliers}
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

function UnifiedOutliersTable({ outliers, onShow }) {
	if (outliers.length === 0) {
		return (
			<div className="text-center py-8 bg-gray-50 rounded-lg m-2">
				<p className="text-gray-500">No outliers found with the current threshold settings.</p>
				<p className="text-sm text-gray-400 mt-2">Try adjusting the deviation threshold to see more results.</p>
			</div>
		);
	}

	return (
		<div className="m-2">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-bold text-gray-800">
					Consumer Usage Outliers ({outliers.length} found)
				</h2>
				<div className="text-sm text-gray-600">
					Sorted by deviation severity (highest first)
				</div>
			</div>
			
			<div className="relative max-h-[60vh] lg:flex justify-center overflow-y-auto sm:rounded-lg border border-gray-200">
				<table className="w-full text-sm text-left rtl:text-right text-gray-500">
					<thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
						<tr>
							<th scope="col" className="px-4 py-3">
								Status
							</th>
							<th scope="col" className="px-4 py-3">
								Power Supply #
							</th>
							<th scope="col" className="px-4 py-3">
								Consumer Email
							</th>
							<th scope="col" className="px-4 py-3">
								Cluster
							</th>
							<th scope="col" className="px-4 py-3">
								Deviation
							</th>
							<th scope="col" className="px-4 py-3">
								Peak Hour
							</th>
							<th scope="col" className="px-4 py-3">
								Description
							</th>
							<th scope="col" className="px-4 py-3">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{outliers.map((outlier, index) => (
							<tr
								key={`${outlier.power_supply_number}-${index}`}
								className="bg-white border-b hover:bg-gray-50"
							>
								<td className="px-4 py-4">
									<div className="flex flex-col gap-1">
										<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDeviationColor(outlier.deviation_type, outlier.severity)}`}>
											{outlier.deviation_type === 'excess' ? 'Excess' : 'Underuse'}
										</span>
										<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityBadge(outlier.severity)}`}>
											{outlier.severity.charAt(0).toUpperCase() + outlier.severity.slice(1)}
										</span>
									</div>
								</td>
								<th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
									{outlier.power_supply_number}
								</th>
								<td className="px-4 py-4 text-gray-700">
									{outlier.email}
								</td>
								<td className="px-4 py-4">
									<span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
										Cluster {outlier.cluster_id}
									</span>
								</td>
								<td className="px-4 py-4">
									<div className="text-center">
										<div className={`font-bold text-lg ${parseFloat(outlier.deviation_percentage) > 0 ? 'text-red-600' : 'text-blue-600'}`}>
											{outlier.deviation_percentage > 0 ? '+' : ''}{outlier.deviation_percentage}%
										</div>
										<div className="text-xs text-gray-500">
											{Math.abs(parseFloat(outlier.deviation_percentage)).toFixed(1)}% from expected
										</div>
									</div>
								</td>
								<td className="px-4 py-4 text-center font-medium">
									{outlier.time}
								</td>
								<td className="px-4 py-4">
									<div className="text-xs text-gray-600 max-w-32">
										{getDeviationDescription(outlier.deviation_type, parseFloat(outlier.deviation_percentage))}
									</div>
								</td>
								<td className="px-4 py-4">
									<button
										onClick={() => onShow(outlier)}
										className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-3 py-2 rounded transition-colors"
									>
										Analyze
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			
			{/* Summary statistics */}
			<div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
				<div className="bg-red-50 border border-red-200 rounded-lg p-3">
					<div className="font-medium text-red-800">Excess Usage</div>
					<div className="text-xl font-bold text-red-600">
						{outliers.filter(o => o.deviation_type === 'excess').length}
					</div>
					<div className="text-red-600 text-xs">consumers over limits</div>
				</div>
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
					<div className="font-medium text-blue-800">Underuse</div>
					<div className="text-xl font-bold text-blue-600">
						{outliers.filter(o => o.deviation_type === 'underuse').length}
					</div>
					<div className="text-blue-600 text-xs">consumers under expected</div>
				</div>
				<div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
					<div className="font-medium text-orange-800">High Severity</div>
					<div className="text-xl font-bold text-orange-600">
						{outliers.filter(o => o.severity === 'high').length}
					</div>
					<div className="text-orange-600 text-xs">critical cases</div>
				</div>
				<div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
					<div className="font-medium text-gray-800">Average Deviation</div>
					<div className="text-xl font-bold text-gray-600">
						{outliers.length > 0 ? (outliers.reduce((sum, o) => sum + Math.abs(parseFloat(o.deviation_percentage)), 0) / outliers.length).toFixed(1) : 0}%
					</div>
					<div className="text-gray-600 text-xs">from expected usage</div>
				</div>
			</div>
		</div>
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

UnifiedOutliersTable.propTypes = {
	outliers: PropTypes.arrayOf(
		PropTypes.shape({
			power_supply_number: PropTypes.string.isRequired,
			email: PropTypes.string.isRequired,
			cluster_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			deviation_percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			deviation_type: PropTypes.string.isRequired,
			severity: PropTypes.string.isRequired,
			lower_bound: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			upper_bound: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			time: PropTypes.string.isRequired,
		})
	).isRequired,
	onShow: PropTypes.func.isRequired,
};

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
