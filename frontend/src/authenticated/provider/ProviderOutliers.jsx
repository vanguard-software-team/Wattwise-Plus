import ProviderAuthenticatedLayout from "./ProviderAuthenticatedLayout";
import SectionWithTitle from "../../components/SectionWithTitle.jsx";
import { useState, useRef, useEffect } from "react";
import SectionTitleDescription from "../../components/SectionTitleDescription.jsx";
import PropTypes from "prop-types";
import RangeDatePicker from "../../components/RangeDatePicker.jsx";
import GroupButtonsGranularity from "../../components/GroupButtonsGranularity.jsx";
import MetricsCard from "../../components/MetricsCard.jsx";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Label,
} from "recharts";

const data1 = [
	{
		name: "Page A",
		uv: 25,
		pv: 200,
		amt: 2400,
	},
	{
		name: "Page B",
		uv: 10,
		pv: 100,
		amt: 2210,
	},
	{
		name: "Page C",
		uv: 50,
		pv: 500,
		amt: 2000,
	},
	{
		name: "Page D",
		uv: 10,
		pv: 100,
		amt: 2181,
	},
];
const data2 = [
	{
		name: "Page A",
		uv: 20,
		pv: 200,
		amt: 2400,
	},
	{
		name: "Page B",
		uv: 10,
		pv: 100,
		amt: 2210,
	},
	{
		name: "Page C",
		uv: 100,
		pv: 600,
		amt: 2000,
	},
	{
		name: "Page D",
		uv: 20,
		pv: 100,
		amt: 2181,
	},
];
const data3 = [
	{
		name: "Page A",
		uv: 260,
		pv: 120,
		amt: 2400,
	},
	{
		name: "Page B",
		uv: 200,
		pv: 500,
		amt: 2210,
	},
	{
		name: "Page C",
		uv: 400,
		pv: 800,
		amt: 2000,
	},
	{
		name: "Page D",
		uv: 200,
		pv: 1000,
		amt: 2181,
	},
];
const data4 = [
	{
		name: "Page A",
		uv: 20,
		pv: 10,
		amt: 2400,
	},
	{
		name: "Page B",
		uv: 10,
		pv: 50,
		amt: 2210,
	},
	{
		name: "Page C",
		uv: 50,
		pv: 200,
		amt: 2000,
	},
	{
		name: "Page D",
		uv: 10,
		pv: 500,
		amt: 2181,
	},
];

const metricsData = [
	{
		title: "Min consumption",
		description: "-6% from similar consumers",
	},
	{
		title: "Mean consumption",
		description: "+2% from similar consumers",
	},
	{
		title: "Max consumption",
		description: "+5% from similar consumers",
	},
];

const metricsData2 = [
	{
		title: "Min consumption",
		description: "-10% from similar consumers",
	},
	{
		title: "Mean consumption",
		description: "+5% from similar consumers",
	},
	{
		title: "Max consumption",
		description: "+4% from similar consumers",
	},
];

const metricsData3 = [
	{
		title: "Min consumption",
		description: "-15% from similar consumers",
	},
	{
		title: "Mean consumption",
		description: "+12% from similar consumers",
	},
	{
		title: "Max consumption",
		description: "+8% from similar consumers",
	},
];
const metricsData4 = [
	{
		title: "Min consumption",
		description: "-17% from similar consumers",
	},
	{
		title: "Mean consumption",
		description: "+14% from similar consumers",
	},
	{
		title: "Max consumption",
		description: "+18% from similar consumers",
	},
];

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

const GranularityButtonName1 = "Hourly";
const GranularityButtonName2 = "Daily";
const GranularityButtonName3 = "Weekly";
const GranularityButtonName4 = "Monthly";

const buttonGroup1 = [
	GranularityButtonName1,
	GranularityButtonName2,
	GranularityButtonName3,
	GranularityButtonName4,
];

const upperLimitHourly = 2;
const upperLimitDaily = 30;
const upperLimitWeekly = 186;

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

	const [numberOfPowerSupply, setnumberOfPowerSupply] = useState(undefined);
	const [dataComparison, setNewDataComparison] = useState(data1);

	const [defaultComparisonMetrics, setComparisonMetrics] =
		useState(metricsData);

	const metricsCardRef = useRef(null); // Create a ref for the metrics card
	const [isReadyToScroll, setIsReadyToScroll] = useState(false);
	useEffect(() => {
		if (isReadyToScroll && metricsCardRef.current) {
			metricsCardRef.current.scrollIntoView({ behavior: 'smooth' });
			setIsReadyToScroll(false); // Reset the state
		}
	}, [isReadyToScroll]); // Only re-run the effect if isReadyToScroll changes
	


	const handlenumberOfPowerSupplyShow = (number) => {
		setnumberOfPowerSupply(number);
		setIsReadyToScroll(true); // Indicate that we're ready to scroll
	};
	
	

	const [defaultButtonNameComparison, setDefaultButtonNameComparison] =
		useState(GranularityButtonName1);

	const switchGranularityComparison = (buttonName) => {
		switch (buttonName) {
			case GranularityButtonName1:
				setNewDataComparison(data1);
				setComparisonMetrics(metricsData);
				break;
			case GranularityButtonName2:
				setNewDataComparison(data2);
				setComparisonMetrics(metricsData2);
				break;
			case GranularityButtonName3:
				setNewDataComparison(data3);
				setComparisonMetrics(metricsData3);
				break;
			case GranularityButtonName4:
				setNewDataComparison(data4);
				setComparisonMetrics(metricsData4);
				break;
			default:
				break;
		}
	};

	const handleDateRangeComparison = (ranges) => {
		const differenceInMs = ranges.endDate - ranges.startDate;
		const millisecondsInADay = 1000 * 60 * 60 * 24; // milliseconds * seconds * minutes * hours
		const differenceInDays = differenceInMs / millisecondsInADay + 1;
		if (differenceInDays <= upperLimitHourly) {
			setDefaultButtonNameComparison(GranularityButtonName1);
		} else if (differenceInDays <= upperLimitDaily) {
			setDefaultButtonNameComparison(GranularityButtonName2);
		} else if (differenceInDays <= upperLimitWeekly) {
			setDefaultButtonNameComparison(GranularityButtonName3);
		} else {
			setDefaultButtonNameComparison(GranularityButtonName4);
		}
	};

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
						max="100"
						value={positiveThreshold}
						onChange={(e) => setPositiveThreshold(e.target.value)}
						className="lg:w-1/2 md:w-full h-1 mb-6 bg-gray-400 rounded-lg appearance-none cursor-pointer range-sm"
					/>
				</div>

				{/* positive deviation table */}
				<ConsumerTable
					consumers={positiveConsumers}
					onShow={handlenumberOfPowerSupplyShow}
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
						min="-100" // Minimum value set to -100
						max="0" // Maximum value set to 0
						value={negativeThreshold}
						onChange={(e) => setNegativeThreshold(e.target.value)}
						className="w-1/2 h-1 mb-6 bg-gray-400 rounded-lg appearance-none cursor-pointer range-sm"
					/>
				</div>
				<ConsumerTable
					consumers={negativeConsumers}
					onShow={handlenumberOfPowerSupplyShow}
				/>

				{numberOfPowerSupply !== undefined && (
					<div>
						<div ref={metricsCardRef} className="grid grid-cols-1 justify-center items-center gap-4 mb-1 ">
							<MetricsCard
								title={"Consumer Data"}
								description={
									"Below you can inspect an overview about your selected consumer consumption and cost for the given date range compared to similar consumers"
								}
								metrics={[
									{
										title: "Number of Power Supply",
										description: numberOfPowerSupply,
									},
									{
										title: "Email",
										description: "some@mail.com",
									},
									{
										title: "Last Update",
										description: "15/01/2024 12:00",
									},
								]}
							/>
						</div>
						<div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
							<div className="flex bg-gray-50 justify-center items-center gap-4 mb-4 rounded-lg border-b-2 border-orange-400">
								<RangeDatePicker
									title={"Comparison with similar consumers"}
									description={
										"Below you can inspect a comparison of your selected consumer consumption and cost for the given date range compared to similar consumers"
									}
									handleRangeChange={handleDateRangeComparison}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 mb-4">
							<GroupButtonsGranularity
								handleGranularityChange={switchGranularityComparison}
								buttonNames={buttonGroup1}
								defaultButtonName={defaultButtonNameComparison}
							/>
						</div>

						<MetricsCard
							metrics={defaultComparisonMetrics}
							title={"Comparison Metrics"}
							description="Comparison metrics for the given date range compared to similar consumers"
						/>

						<div className="flex items-center m-2 justify-center rounded bg-gray-50 h-[calc(100vh-8rem)] rounded-b-lg">
							<ResponsiveContainer width="100%" height="100%" className="pt-8">
								<LineChart
									width={500}
									height={300}
									data={dataComparison}
									margin={{
										top: 5,
										right: 30,
										left: 20,
										bottom: 5,
									}}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis>
										<Label
											value="Consumption (kwh)"
											angle={-90}
											position="insideLeft"
										/>
									</YAxis>
									<Tooltip />
									<Legend />
									<Line
										dataKey="pv"
										stroke="#8884d8"
										activeDot={{ r: 8 }}
										strokeDasharray="5 5"
									/>
									<Line dataKey="uv" stroke="#82ca9d" />
								</LineChart>
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
								Consumption Deviation %
							</th>
							<th scope="col" className="px-6 py-3">
								Action
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
								<td className="px-6 py-4">
									<button
										onClick={() => onShow(consumer.numberOfPowerSupply)}
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
			numberOfPowerSupply: PropTypes.string.isRequired,
			email: PropTypes.string.isRequired,
			deviationPercentage: PropTypes.string.isRequired,
		})
	).isRequired,
	onShow: PropTypes.func.isRequired,
};

export default ProviderOutliers;
