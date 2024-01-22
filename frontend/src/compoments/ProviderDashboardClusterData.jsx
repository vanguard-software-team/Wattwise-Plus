import PropTypes from "prop-types";
import SimpleResultCard from "./SimpleResultCard.jsx";
import RangeDatePicker from "./RangeDatePicker.jsx";
import GroupButtonsGranularity from "./GroupButtonsGranularity.jsx";
import MetricsCard from "./MetricsCard.jsx";
import { useState } from "react";
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

const cards_data = [
	{
		name: "Page A",
		uv: 4000,
		pv: 2400,
		amt: 2400,
	},
	{
		name: "Page B",
		uv: 3000,
		pv: 1398,
		amt: 2210,
	},
	{
		name: "Page C",
		uv: 2000,
		pv: 9800,
		amt: 2290,
	},
	{
		name: "Page D",
		uv: 2780,
		pv: 3908,
		amt: 2000,
	},
	{
		name: "Page E",
		uv: 1890,
		pv: 4800,
		amt: 2181,
	},
	{
		name: "Page F",
		uv: 2390,
		pv: 3800,
		amt: 2500,
	},
	{
		name: "Page G",
		uv: 3490,
		pv: 4300,
		amt: 2100,
	},
];

const data1 = [
	{
		name: "Page A",
		uv: 500,
		pv: 400,
		amt: 2400,
	},
	{
		name: "Page B",
		uv: 30,
		pv: 228,
		amt: 2210,
	},
	{
		name: "Page C",
		uv: 50,
		pv: 128,
		amt: 2210,
	},
];

const data2 = [
	{
		name: "Page A",
		uv: 1000,
		pv: 2400,
		amt: 2400,
	},
	{
		name: "Page B",
		uv: 2000,
		pv: 1398,
		amt: 2210,
	},
	{
		name: "Page C",
		uv: 250,
		pv: 428,
		amt: 4210,
	},
];

const data3 = [
	{
		name: "Page A",
		uv: 0,
		pv: 5400,
		amt: 2400,
	},
	{
		name: "Page B",
		uv: 1000,
		pv: 2398,
		amt: 2210,
	},
	{
		name: "Page C",
		uv: 1050,
		pv: 828,
		amt: 1410,
	},
];

const data4 = [
	{
		name: "Page A",
		uv: 100,
		pv: 200,
		amt: 2400,
	},
	{
		name: "Page B",
		uv: 1000,
		pv: 2398,
		amt: 2210,
	},
	{
		name: "Page C",
		uv: 570,
		pv: 928,
		amt: 3210,
	},
];

function ProviderDashboardClusterData({ clusterID }) {
	const [data, setNewData] = useState(data1);
	const GranularityButtonHourly = "Hourly";
	const GranularityButtonDaily = "Daily";
	const GranularityButtonWeekly = "Weekly";
	const GranularityButtonMonthly = "Monthly";
	const buttonGroup1 = [
		GranularityButtonHourly,
		GranularityButtonDaily,
		GranularityButtonWeekly,
		GranularityButtonMonthly,
	];
	const upperLimitHourly = 2;
	const upperLimitDaily = 30;
	const upperLimitWeekly = 186;
	const [defaultButtonName, setDefaultButtonName] = useState(
		GranularityButtonHourly
	);
	const switchGranularity = (buttonName) => {
		switch (buttonName) {
			case GranularityButtonHourly:
				setNewData(data1);
				break;
			case GranularityButtonDaily:
				setNewData(data2);
				break;
			case GranularityButtonWeekly:
				setNewData(data3);
				break;
			case GranularityButtonMonthly:
				setNewData(data4);
				break;
			default:
				break;
		}
	};

	const handleDateRange = (ranges) => {
		const differenceInMs = ranges.endDate - ranges.startDate;
		const millisecondsInADay = 1000 * 60 * 60 * 24; // milliseconds * seconds * minutes * hours
		const differenceInDays = differenceInMs / millisecondsInADay + 1;
		if (differenceInDays <= upperLimitHourly) {
			setDefaultButtonName(GranularityButtonHourly);
		} else if (differenceInDays <= upperLimitDaily) {
			setDefaultButtonName(GranularityButtonDaily);
		} else if (differenceInDays <= upperLimitWeekly) {
			setDefaultButtonName(GranularityButtonWeekly);
		} else {
			setDefaultButtonName(GranularityButtonMonthly);
		}
	};

	if (typeof clusterID === "undefined") {
		return null;
	}

	return (
		<div className="p-1 sm:ml-40 bg-gray-200 font-robotoflex">
			<div
				className="p-4 mb-4 text-sm text-orange-500 rounded-lg m-2 bg-gray-50"
				role="alert"
			>
				<span className="flex justify-center">
					The results represent the mean values across all consumers in the
					cluster
				</span>
			</div>
			<div className="grid grid-cols-1 justify-center items-center gap-4 mb-1 ">
				<MetricsCard
					title={"Cluster Data"}
					description={
						"Here you can inspect an overview of your selected cluster about the consumption and the cost. The result represent the mean values across all consumers in the cluster."
					}
					metrics={[
						{
							title: "Cluster ID",
							description: clusterID,
						},
						{
							title: "# of Consumers",
							description: "10",
						},
						{
							title: "Last Update",
							description: "15/01/2024 12:00",
						},
					]}
				/>
			</div>

			<div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
				<div className="grid grid-cols-2 gap-4 mb-4 ">
					<SimpleResultCard
						title={"Today's consumption"}
						result={"20kwh"}
						difference={"-20% from yesterday"}
						chartData={cards_data}
					/>
					<SimpleResultCard
						title={"Today's cost"}
						result={"2€"}
						difference={"-20% from yesterday"}
						chartData={cards_data}
					/>
					<SimpleResultCard
						title={"Month's consumption"}
						result={"200kwh"}
						difference={"+10% from last month"}
						chartData={cards_data}
					/>
					<SimpleResultCard
						title={"Month's cost"}
						result={"20€"}
						difference={"+10% from last month"}
						chartData={cards_data}
					/>
				</div>

				<div className="flex bg-gray-50 justify-center items-center gap-4 mb-4 rounded-lg border-b-2 border-orange-400 ">
					<RangeDatePicker
						title={"Consumption & Cost"}
						description={
							"Select a date range to inspect the consumption and the cost within the range"
						}
						handleRangeChange={handleDateRange}
					/>
				</div>
				<div className="grid grid-cols-1 gap-4 mb-4">
					<GroupButtonsGranularity
						handleGranularityChange={switchGranularity}
						buttonNames={buttonGroup1}
						defaultButtonName={defaultButtonName}
					/>
				</div>

				<div className="grid grid-cols-1 gap-4 mb-4 ">
					<div className="flex items-center justify-center rounded bg-gray-50 h-[calc(100vh-8rem)] rounded-b-lg">
						<ResponsiveContainer width="100%" height="100%" className="pt-8">
							<LineChart
								width={500}
								height={300}
								data={data}
								margin={{
									top: 5,
									right: 30,
									left: 20,
									bottom: 5,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" name="Your X-Axis Name">
									{/*<Label value="Your X-Axis Name" position="insideBottom"  />*/}
								</XAxis>
								<YAxis yAxisId="left">
									<Label
										value="Consumption (kwh)"
										angle={-90}
										position="insideLeft"
									/>
								</YAxis>
								<YAxis yAxisId="right" orientation="right">
									<Label value="Cost (€)" angle={90} position="insideRight" />
								</YAxis>
								<Tooltip />
								<Legend />
								<Line
									yAxisId="left"
									dataKey="pv"
									stroke="#8884d8"
									className="pt-10"
									activeDot={{ r: 8 }}
								/>
								<Line yAxisId="right" dataKey="uv" stroke="#82ca9d" />
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>
	);
}

ProviderDashboardClusterData.propTypes = {
	clusterID: PropTypes.string,
};

export default ProviderDashboardClusterData;
