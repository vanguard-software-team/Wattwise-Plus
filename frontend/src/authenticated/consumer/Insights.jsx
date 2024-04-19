import AuthenticatedLayout from "./AuthenticatedLayout.jsx";
import RangeDatePicker from "../../components/RangeDatePicker.jsx";
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
import { useState, useEffect } from "react";
import GroupButtonsGranularity from "../../components/GroupButtonsGranularity.jsx";
import MetricsCard from "../../components/MetricsCard.jsx";
import SectionTitleDescription from "../../components/SectionTitleDescription.jsx";
import { getConsumerConsumptionAggregateHourly, getConsumerConsumptionAggregateDaily, getConsumerConsumptionAggregateMonthly, getUserEmail } from "../../service/api.jsx";
import { getConsumerConsumptionDaily, getConsumerConsumptionHourly, getConsumerConsumptionMonthly } from "../../service/api.jsx";
import { getClusterConsumptionHourly, getClusterConsumptionDaily, getClusterConsumptionMonthly, getConsumerInfo } from "../../service/api.jsx";
import { set } from "date-fns";

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

function Insights() {
	const userEmail = getUserEmail();
	const [dataPeak, setPeakData] = useState([]);
	const [peakConsumptionPoint, setPeakConsumptionPoint] = useState([]);
	const [dataComparison, setNewDataComparison] = useState([]);
	const [dataAggregated, setNewDataAggregated] = useState([]);
	const today = new Date(import.meta.env.VITE_TODAY_DATETIME);
	const [dateRanges, setDateRanges] = useState({
		startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4),
		endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
	});
	const [dateRangesComparison, setDateRangesComparison] = useState({
		startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4),
		endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
	});
	const GranularityButtonHourly = "Hourly";
	const GranularityButtonDaily = "Daily";
	const GranularityButtonMonthly = "Monthly";

	const GranularityButtonHours = "Hours";
	const GranularityButtonDays = "Days";
	const GranularityButtonMonths = "Months";
	const buttonGroup1 = [
		GranularityButtonHourly,
		GranularityButtonDaily,
		GranularityButtonMonthly,
	];
	const buttonGroup2 = [
		GranularityButtonHours,
		GranularityButtonDays,
		GranularityButtonMonths,
	];
	const [defaultButtonName, setDefaultButtonName] = useState(
		GranularityButtonHourly
	);
	const [defaultButtonNameComparison, setDefaultButtonNameComparison] =
		useState(GranularityButtonHourly);
	const [defaultComparisonMetrics, setComparisonMetrics] =
		useState(metricsData);

	const switchGranularityPeak = (buttonName) => {
		switch (buttonName) {
			case GranularityButtonHourly:
				setDefaultButtonName(GranularityButtonHourly);
				break;
			case GranularityButtonDaily:
				setDefaultButtonName(GranularityButtonDaily);
				break;
			case GranularityButtonMonthly:
				setDefaultButtonName(GranularityButtonMonthly);
				break;
			default:
				break;
		}
	};

	const switchGranularityComparison = (buttonName) => {
		switch (buttonName) {
			case GranularityButtonHourly:
				setNewDataComparison(data1);
				setComparisonMetrics(metricsData);
				break;
			case GranularityButtonDaily:
				setNewDataComparison(data2);
				setComparisonMetrics(metricsData2);
				break;
			case GranularityButtonMonthly:
				setNewDataComparison(data4);
				setComparisonMetrics(metricsData4);
				break;
			default:
				break;
		}
	};

	const switchGranularityAggregated = (buttonName) => {
		const setAggregateData = async (func,stateFunc) => {
			try {
				const response = await func(userEmail);
				const newdata = response.map(data => {
					if (data.hour) {
						data.timeUnit = data.hour.slice(0, 5);;	
						delete data.hour;
					} else if (data.day) {
						data.timeUnit = data.day;
						delete data.day;
					} else if (data.month) {
						data.timeUnit = data.month;
						delete data.month;
					}
					return data;
				});
				stateFunc(newdata);
			} catch (error) {
				console.error("Failed to fetch data: ", error);
				throw error;
			
			}
		};
		switch (buttonName) {
			case GranularityButtonHours:
				setAggregateData(getConsumerConsumptionAggregateHourly,setNewDataAggregated);
				break;
			case GranularityButtonDays:
				setAggregateData(getConsumerConsumptionAggregateDaily,setNewDataAggregated);
				break;
			case GranularityButtonMonths:
				setAggregateData(getConsumerConsumptionAggregateMonthly,setNewDataAggregated);
				break;
			default:
				break;
		}
	};

	const handleDateRange = (ranges) => {
		ranges.startDate.setHours(0, 0, 0, 0);
		ranges.endDate.setHours(23, 59, 59, 999);
		setDateRanges(ranges);
	};
	const handleDateRangeComparison = (ranges) => {
		ranges.startDate.setHours(0, 0, 0, 0);
		ranges.endDate.setHours(23, 59, 59, 999);
		setDateRangesComparison(ranges);
	};

	useEffect(() => {
		if (dateRanges.length === 0 || !dateRanges.startDate || !dateRanges.endDate) return;

		const fetchData = async () => {
			try {
				let newdata;
				if (defaultButtonName === GranularityButtonHourly) {
					newdata = await getConsumerConsumptionHourly(userEmail, dateRanges.startDate, dateRanges.endDate);
				} else if (defaultButtonName === GranularityButtonDaily) {
					newdata = await getConsumerConsumptionDaily(userEmail, dateRanges.startDate, dateRanges.endDate);
				} else if (defaultButtonName === GranularityButtonMonthly) {
					newdata = await getConsumerConsumptionMonthly(userEmail, dateRanges.startDate, dateRanges.endDate);
				}

				newdata = newdata.map(data => {
					if (data.hour) {
						data.timeUnit = data.hour;
						delete data.hour;
					} else if (data.day) {
						data.timeUnit = data.day;
						delete data.day;
					} else if (data.month) {
						data.timeUnit = data.month;
						delete data.month;
					}
					return data;
				});

				let peakConsumption = 0;
				let peakDate = "";
				newdata.forEach(data => {
					if (data.consumption_kwh > peakConsumption) {
						peakConsumption = data.consumption_kwh;
						peakDate = data.timeUnit;
					}
				});


				setPeakConsumptionPoint({
					peakConsumption: peakConsumption,
					peakDate: new Date(peakDate).toLocaleString(),
				});


				const formattedData = newdata.map(data => ({
					timeUnit: new Date(data.timeUnit).toLocaleString(),
					consumption_kwh: Number(data.consumption_kwh).toFixed(2),
					cost_euro: Number(data.cost_euro).toFixed(2),
				}));
				setPeakData(formattedData);
			} catch (error) {
				console.error("Error fetching data: ", error);
			}
		};

		fetchData();
	}, [dateRanges, defaultButtonName, userEmail]);

	useEffect(() => {
		if (dateRangesComparison.length === 0 || !dateRangesComparison.startDate || !dateRangesComparison.endDate) return;

		const fetchData = async () => {
			try {
				let consumer_info = await getConsumerInfo(userEmail);
				let consumer_data;
				let cluster_data;

				console.log("consumer_info", consumer_info);
				console.log("dateRangesComparison", dateRangesComparison);
				console.log("userEmail", userEmail);
				console.log("dateRangesComparison.startDate", dateRangesComparison.startDate);
				console.log("dateRangesComparison.endDate", dateRangesComparison.endDate);
				
				if (defaultButtonNameComparison === GranularityButtonHourly) {
					consumer_data = await getConsumerConsumptionHourly(userEmail, dateRangesComparison.startDate, dateRangesComparison.endDate);
					cluster_data = await getClusterConsumptionHourly(consumer_info.cluster, dateRangesComparison.startDate, dateRangesComparison.endDate);
				} else if (defaultButtonNameComparison === GranularityButtonDaily) {
					consumer_data = await getConsumerConsumptionDaily(userEmail, dateRangesComparison.startDate, dateRangesComparison.endDate);
					cluster_data = await getClusterConsumptionDaily(consumer_info.cluster, dateRangesComparison.startDate, dateRangesComparison.endDate);
				} else if (defaultButtonNameComparison === GranularityButtonMonthly) {
					consumer_data = await getConsumerConsumptionMonthly(userEmail, dateRangesComparison.startDate, dateRangesComparison.endDate);
					cluster_data = await getClusterConsumptionMonthly(consumer_info.cluster, dateRangesComparison.startDate, dateRangesComparison.endDate);
				}

				console.log("consumer_data", consumer_data);

				consumer_data = consumer_data.map(data => {
					if (data.hour) {
						data.timeUnit = data.hour;
						delete data.hour;
					} else if (data.day) {
						data.timeUnit = data.day;
						delete data.day;
					} else if (data.month) {
						data.timeUnit = data.month;
						delete data.month;
					}
					return data;
				});

				cluster_data = cluster_data.map(data => {
					if (data.hour) {
						data.timeUnit = data.hour;
						delete data.hour;
					} else if (data.day) {
						data.timeUnit = data.day;
						delete data.day;
					} else if (data.month) {
						data.timeUnit = data.month;
						delete data.month;
					}
					return data;
				});


				const consumerformattedData = consumer_data.map(data => ({
					timeUnit: new Date(data.timeUnit).toLocaleString(),
					consumption_kwh: Number(data.consumption_kwh).toFixed(2),
					cost_euro: Number(data.cost_euro).toFixed(2),
				}));

				const clusterformattedData = cluster_data.map(data => ({
					timeUnit: new Date(data.timeUnit).toLocaleString(),
					consumption_kwh: Number(data.consumption_kwh).toFixed(2),
					cost_euro: Number(data.cost_euro).toFixed(2),
				}));

				// combine the two data sets into one for comparison
				const combinedData = consumerformattedData.map((data, index) => {
					return {
						timeUnit: data.timeUnit,
						consumption_kwh: data.consumption_kwh,
						cost_euro: data.cost_euro,
						cluster_consumption_kwh: clusterformattedData[index].consumption_kwh,
						cost_euro_sum: clusterformattedData[index].cost_euro,
					};
				});

				console.log("combinedData", combinedData);

				setNewDataComparison(combinedData);
						
						

				
			} catch (error) {
				console.error("Error fetching data: ", error);
			}
		};

		fetchData();
	}, [dateRangesComparison, defaultButtonNameComparison, userEmail]);
	
	return (
		<AuthenticatedLayout>
			<div className="p-1 sm:ml-40 bg-gray-200 font-robotoflex">
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
							<XAxis dataKey="timeUnit" />
							<YAxis yAxisId="left" orientation="left">
								<Label
									value="Mean Consumption (kwh)"
									angle={-90}
									position="insideLeft"
								/>
							</YAxis>
							<YAxis yAxisId="right" orientation="right">
								<Label
									value="Mean Cost (€)"
									angle={90}
									position="insideRight"
								/>
							</YAxis>
							<Tooltip />
							<Legend />
							<Bar
								yAxisId="left"
								dataKey="consumption_kwh_sum"
								fill="#faa741"
								activeBar={<Rectangle fill="#fc8c03" stroke="black" />}
							/>
							<Bar
								yAxisId="right"
								dataKey="cost_euro"
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
						handleGranularityChange={switchGranularityPeak}
						buttonNames={buttonGroup1}
						defaultButtonName={defaultButtonName}
					/>
				</div>

				<div className="flex items-center m-2 justify-center rounded bg-gray-50 h-[calc(100vh-8rem)] rounded-b-lg">
					<ResponsiveContainer width="100%" height="100%" className="pt-8">
						<LineChart
							width={500}
							height={300}
							data={dataPeak}
							margin={{
								top: 25,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis 
								dataKey="timeUnit"
								interval={Math.floor(dataPeak.length / 6)}
								padding={{ left: 20, right: 20 }}
								height={40}>
								
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
							<ReferenceLine x={peakConsumptionPoint.peakDate} stroke="gray" strokeWidth={3}>
								<Label fill="gray" position="outside" />
							</ReferenceLine>
							<ReferenceLine y={peakConsumptionPoint.peakConsumption} stroke="gray" strokeWidth={3}>
								<Label
									value="Peak Consumption"
									dy={-20} // Adjust the dy value to position the label as needed
									fill="gray"
								/>
							</ReferenceLine>

							<Line
								dataKey="consumption_kwh"
								stroke="#FFA500"
								className="pt-10"
								activeDot={{ r: 8 }}
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
				<div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
					<div className="flex bg-gray-50 justify-center items-center gap-4 mb-4 rounded-lg border-b-2 border-orange-400">
						<RangeDatePicker
							title={"Comparison with similar consumers"}
							description={
								"Below you can inspect a comparison of your consumption and cost with other similar consumers for the given date range"
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
							<XAxis dataKey="timeUnit" />
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
								dataKey="cluster_consumption_kwh"
								stroke="#808080"
								activeDot={{ r: 8 }}
								strokeDasharray="7 7"
								strokeWidth={3} 
							/>
							<Line
								dataKey="consumption_kwh"
								stroke="#FFA500"
								className="pt-10"
								activeDot={{ r: 8 }}
								strokeWidth={2} 
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}

export default Insights;
