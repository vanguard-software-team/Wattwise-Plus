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
import { getConsumerConsumptionAggregateHourly, getConsumerConsumptionAggregateDaily, getConsumerConsumptionAggregateMonthly } from "../service/api.jsx";
import	{ getConsumerConsumptionHourly, getConsumerConsumptionDaily, getConsumerConsumptionMonthly, getOutliers } from "../service/api.jsx";


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

	const [consumerInfoCard, setConsumerInfoCard] = useState([]);

	useEffect(() => {
		setConsumerInfoCard([
			{
				'title': 'Number of Power Supply',
				'description': consumerInfo.power_supply_number,
			},
			{
				'title': 'Email',
				'description': consumerInfo.email,
			},
			{
				'title': 'Consumer Type',
				'description': consumerInfo.consumer_type,
			},
		]);

	}, [consumerInfo]);


	const [dataAggregated, setNewDataAggregated] = useState([]);
	const [dataPeak, setPeakData] = useState([]);
	const [peakConsumptionPoint, setPeakConsumptionPoint] = useState([]);
	const today = new Date(import.meta.env.VITE_TODAY_DATETIME);
	const [dateRanges, setDateRanges] = useState({
		startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4),
		endDate: today,
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
	const switchGranularityAggregated = (buttonName) => {
		const setAggregateData = async (func, stateFunc) => {
			try {
				const response = await func(consumerInfo.email);
				const newdata = response.map(data => {
					let originalType = null;
					if (data.hour) {
						data.timeUnit = data.hour.slice(0, 5);
						delete data.hour;
						originalType = 'hour';
					} else if (data.day) {
						data.timeUnit = data.day;
						delete data.day;
					} else if (data.month) {
						data.timeUnit = data.month;
						delete data.month;
					}
					return { ...data, originalType };
				});

				newdata.sort((a, b) => {
					if (a.originalType === 'hour' && b.originalType === 'hour') {
						return a.timeUnit.localeCompare(b.timeUnit);
					}
					return 0;
				});

				// set cost to 2 decimal places
				newdata.forEach(data => {
					data.cost_euro = Number(data.cost_euro).toFixed(2);
				});
				

				stateFunc(newdata);

			} catch (error) {
				console.error("Failed to fetch data: ", error);
				throw error;

			}
		};
		switch (buttonName) {
			case GranularityButtonHours:
				setAggregateData(getConsumerConsumptionAggregateHourly, setNewDataAggregated);
				break;
			case GranularityButtonDays:
				setAggregateData(getConsumerConsumptionAggregateDaily, setNewDataAggregated);
				break;
			case GranularityButtonMonths:
				setAggregateData(getConsumerConsumptionAggregateMonthly, setNewDataAggregated);
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

    if (typeof numberOfPowerSupply === "undefined") {
		return null;
	}

	useEffect(() => {
		if (dateRanges.length === 0 || !dateRanges.startDate || !dateRanges.endDate) return;
		const fetchData = async () => {
			try {
				let newdata;
				if (defaultButtonName === GranularityButtonHourly) {
					newdata = await getConsumerConsumptionHourly(consumerInfo.email, dateRanges.startDate, dateRanges.endDate);
				} else if (defaultButtonName === GranularityButtonDaily) {
					newdata = await getConsumerConsumptionDaily(consumerInfo.email, dateRanges.startDate, dateRanges.endDate);
				} else if (defaultButtonName === GranularityButtonMonthly) {
					newdata = await getConsumerConsumptionMonthly(consumerInfo.email, dateRanges.startDate, dateRanges.endDate);
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
	}, [dateRanges, defaultButtonName]);

	return (
		<div className="p-1 sm:ml-40 bg-gray-200 font-robotoflex">
			<div className="grid grid-cols-1 justify-center items-center gap-4 mb-1 ">
				<MetricsCard
					title={"Consumer Data"}
					description={
						"Here you can inspect insights about your individual consumer about aggregated statistics and peak consumption."
					}
					metrics={consumerInfoCard}
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
							<Tooltip formatter={(value, name) => [
								value,
								name === 'consumption_kwh_sum' ? 'Mean Consumption (kwh)' :
									name === 'cost_euro' ? 'Mean Cost (€)' : name
									
							]} />
							<Legend formatter={(value) => [
								value === 'consumption_kwh_sum' ? 'Mean Consumption (kwh)' :
								value === 'cost_euro' ? 'Mean Cost (€)' : value
									
							]} />
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
								height={40}>

							</XAxis>
							<YAxis>
								<Label
									value="Consumption (kwh)"
									angle={-90}
									position="insideLeft"
								/>
							</YAxis>
							<Tooltip formatter={(value, name) => [
								value,
								name === 'consumption_kwh' ? 'Consumption (kwh)' : name
									
							]} />
							<Legend formatter={(value) => [
								value === 'consumption_kwh' ? 'Consumption (kwh)' : value
									
							]}  />
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
		</div>
	);
}

ProviderInsightsConsumerData.propTypes = {
	numberOfPowerSupply: PropTypes.string,
};

export default ProviderInsightsConsumerData;
