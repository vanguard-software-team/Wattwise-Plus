import RangeDatePicker from "./RangeDatePicker.jsx";
import {
	BarChart,
	Bar,
	Rectangle,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ReferenceLine,
	ResponsiveContainer,
	Label,
} from "recharts";
import GroupButtonsGranularity from "./GroupButtonsGranularity.jsx";
import MetricsCard from "./MetricsCard.jsx";
import SectionTitleDescription from "./SectionTitleDescription.jsx";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { getConsumerConsumptionDaily, getConsumerConsumptionMonthly, getConsumerConsumptionHourly } from "../service/api.jsx";
import { LoaderTop } from "./Loader.jsx";

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

function ProviderInsightsConsumerData({ numberOfPowerSupply, consumerInfo }) {
	if (typeof numberOfPowerSupply === "undefined") {
		return (
			<div className="bg-gray-200 p-5 text-center text-sm">
				<h2>Type a power supply number to inspect a consumer</h2>
			</div>

		);
	}
	else if (numberOfPowerSupply === null) {
		return (
			<div className="bg-gray-200 p-5 text-center text-sm">
				<h2>Consumer not found with this number of power supply</h2>
			</div>
		);

	}

	const userEmail = consumerInfo.email;


	const [data, setNewData] = useState(data1);
	const [dataAggregated, setNewDataAggregated] = useState(data1);
	const GranularityButtonName1 = "Hourly";
	const GranularityButtonName2 = "Daily";
	const GranularityButtonName3 = "Weekly";
	const GranularityButtonName4 = "Monthly";

	const GranularityButtonHours = "Hours";
	const GranularityButtonDays = "Days";
	const GranularityButtonMonths = "Months";
	const buttonGroup1 = [
		GranularityButtonName1,
		GranularityButtonName2,
		GranularityButtonName3,
		GranularityButtonName4,
	];
	const buttonGroup2 = [
		GranularityButtonHours,
		GranularityButtonDays,
		GranularityButtonMonths,
	];
	const upperLimitHourly = 2;
	const upperLimitDaily = 30;
	const upperLimitWeekly = 186;
	const [defaultButtonName, setDefaultButtonName] = useState(
		GranularityButtonName1
	);
	const switchGranularity = (buttonName) => {
		switch (buttonName) {
			case GranularityButtonName1:
				setNewData(data1);
				break;
			case GranularityButtonName2:
				setNewData(data2);
				break;
			case GranularityButtonName3:
				setNewData(data3);
				break;
			case GranularityButtonName4:
				setNewData(data4);
				break;
			default:
				break;
		}
	};

	const switchGranularityAggregated = (buttonName) => {
		switch (buttonName) {
			case GranularityButtonHours:
				setNewDataAggregated(data1);
				break;
			case GranularityButtonDays:
				setNewDataAggregated(data2);
				break;
			case GranularityButtonMonths:
				setNewDataAggregated(data3);
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
			setDefaultButtonName(GranularityButtonName1);
		} else if (differenceInDays <= upperLimitDaily) {
			setDefaultButtonName(GranularityButtonName2);
		} else if (differenceInDays <= upperLimitWeekly) {
			setDefaultButtonName(GranularityButtonName3);
		} else {
			setDefaultButtonName(GranularityButtonName4);
		}
	};

    if (typeof numberOfPowerSupply === "undefined") {
		return null;
	}

	return (
		<div className="p-1 sm:ml-40 bg-gray-200 font-robotoflex">
			<div className="grid grid-cols-1 justify-center items-center gap-4 mb-1 ">
				<MetricsCard
					title={"Consumer Data"}
					description={
						"Here you can inspect insights about your individual consumer about aggregated statistics and peak consumption. You can also compare your consumer with similar consumers."
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
				<div className="grid grid-cols-1 justify-center items-center gap-4 mb-1 ">
					<SectionTitleDescription
						title={"Aggregated statistics"}
						description={
							"Below you can inspect the mean consumption for all the available recorded data. You can also choose different granularities from the selection below"
						}
					/>
				</div>
			</div>
			<div className="grid grid-cols-1 gap-4 mb-4">
				<GroupButtonsGranularity
					handleGranularityChange={switchGranularityAggregated}
					buttonNames={buttonGroup2}
					defaultButtonName={GranularityButtonHours}
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
						<XAxis dataKey="name" />
						<YAxis yAxisId="left" orientation="left">
							<Label
								value="Mean Consumption (kwh)"
								angle={-90}
								position="insideLeft"
							/>
						</YAxis>
						<YAxis yAxisId="right" orientation="right">
							<Label value="Mean Cost (€)" angle={90} position="insideRight" />
						</YAxis>
						<Tooltip />
						<Legend />
						<Bar
							yAxisId="left"
							dataKey="pv"
							fill="#faa741"
							activeBar={<Rectangle fill="#fc8c03" stroke="black" />}
						/>
						<Bar
							yAxisId="right"
							dataKey="uv"
							fill="#d1d0cf"
							activeBar={<Rectangle fill="grey" stroke="black" />}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
			<div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
				<div className="flex bg-gray-50 justify-center items-center gap-4 mb-4 rounded-lg border-b-2 border-orange-400">
					<RangeDatePicker
						title={"Peak Consumption & Cost"}
						description={
							"Select a date range to inspect the peak consumption and the cost within the range"
						}
						handleRangeChange={handleDateRange}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 mb-4">
				<GroupButtonsGranularity
					handleGranularityChange={switchGranularity}
					buttonNames={buttonGroup1}
					defaultButtonName={defaultButtonName}
				/>
			</div>

			<div className="flex items-center m-2 justify-center rounded bg-gray-50 h-[calc(100vh-8rem)] rounded-b-lg">
				<ResponsiveContainer width="100%" height="100%" className="pt-8">
					<LineChart
						width={500}
						height={300}
						data={data}
						margin={{
							top: 25,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" name="Your X-Axis Name">
							{/*<Label value="Your X-Axis Name" position="insideBottom"  />*/}
						</XAxis>
						<YAxis>
							<Label
								value="Consumption (kwh)"
								angle={-90}
								position="insideLeft"
							/>
						</YAxis>
						<Tooltip />
						<Legend />
						<ReferenceLine x="Page C" stroke="red">
							<Label value="Peak Date" fill="red" />
						</ReferenceLine>
						<ReferenceLine y={500} stroke="red">
							<Label
								value="Peak Consumption"
								dy={-10} // Adjust the dy value to position the label as needed
								fill="red"
							/>
						</ReferenceLine>

						<Line
							dataKey="pv"
							stroke="#8884d8"
							className="pt-10"
							activeDot={{ r: 8 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

ProviderInsightsConsumerData.propTypes = {
	numberOfPowerSupply: PropTypes.string,
};

export default ProviderInsightsConsumerData;
