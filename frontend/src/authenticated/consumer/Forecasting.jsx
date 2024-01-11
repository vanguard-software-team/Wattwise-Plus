import AuthenticatedLayout from "../AuthenticatedLayout";
import { useState, useEffect } from "react";
import ForecastingGranularityButtons from "../../compoments/ForecastingGranularityButtons.jsx";
import SectionTitleDescription from "../../compoments/SectionTitleDescription.jsx";
import ForecastingHorizonButtons from "../../compoments/ForecastingHorizonButtons.jsx";
import MetricsCard from "../../compoments/MetricsCard.jsx";
import SingleMetricCard from "../../compoments/SingleMetricCard.jsx";
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
		uv: 500,
		uv_prediction: 300,
		pv: 400,
		pv_prediction: 200,
	},
	{
		name: "Page B",
		uv: 30,
		uv_prediction: 50,
		pv: 228,
		pv_prediction: 200,
	},
	{
		name: "Page C",
		uv: 50,
		uv_prediction: 80,
		pv: 128,
		pv_prediction: 228,
	},
];

const data2 = [
	{
		name: "Page A",
		uv: 900,
		uv_prediction: 100,
		pv: 700,
		pv_prediction: 800,
	},
	{
		name: "Page B",
		uv: 20,
		uv_prediction: 60,
		pv: 128,
		pv_prediction: 55,
	},
	{
		name: "Page C",
		uv: 500,
		uv_prediction: 800,
		pv: 1280,
		pv_prediction: 2280,
	},
];

const data3 = [
	{
		name: "Page A",
		uv: 300,
		uv_prediction: 200,
		pv: 500,
		pv_prediction: 300,
	},
	{
		name: "Page B",
		uv: 10,
		uv_prediction: 30,
		pv: 228,
		pv_prediction: 95,
	},
	{
		name: "Page C",
		uv: 20,
		uv_prediction: 80,
		pv: 250,
		pv_prediction: 150,
	},
];

const data4 = [
	{
		name: "Page A",
		uv: 200,
		uv_prediction: 600,
		pv: 700,
		pv_prediction: 100,
	},
	{
		name: "Page B",
		uv: 100,
		uv_prediction: 300,
		pv: 278,
		pv_prediction: 15,
	},
	{
		name: "Page C",
		uv: 200,
		uv_prediction: 450,
		pv: 150,
		pv_prediction: 120,
	},
];

const forecastingMetrics = [
	{
		title: "MAPE",
		description: "3%",
	},
	{
		title: "RMSE",
		description: "2.5 kwh",
	},
	{
		title: "MSE",
		description: "1.3 kwh",
	},
];

const GranularityButtonHours = "Hours";
const GranularityButtonDays = "Days";
const GranularityButtonWeeks = "Weeks";
const granularityButtonGroup = [
	GranularityButtonHours,
	GranularityButtonDays,
	GranularityButtonWeeks,
];

const ForecastingButtonHourly = "Hourly";
const ForecastingButtonWeekly = "Weekly";
const ForecastingButtonMonthly = "Monthly";
const ForecastingButtonThreeMonthly = "3-Monthly";
const forecastingButtonGroup = [
	ForecastingButtonHourly,
	ForecastingButtonWeekly,
	ForecastingButtonMonthly,
	ForecastingButtonThreeMonthly,
];

function Forecasting() {
	const [forecastingData, setForecastingData] = useState(data1);
	const [selectedGranularity, setSelectedGranularity] = useState(
		GranularityButtonHours
	);
	const [selectedForecasting, setSelectedForecasting] = useState(
		ForecastingButtonHourly
	);

	const handleForecastingHorizonChange = (forecastingButton) => {
		setSelectedForecasting(forecastingButton);
		switch (forecastingButton) {
			case ForecastingButtonHourly:
				setSelectedGranularity(GranularityButtonHours);
				break;
			case ForecastingButtonWeekly:
				setSelectedGranularity(GranularityButtonDays);
				break;
			case ForecastingButtonMonthly:
				setSelectedGranularity(GranularityButtonWeeks);
				break;
			case ForecastingButtonThreeMonthly:
				setSelectedGranularity(GranularityButtonWeeks);
				break;
			default:
				break;
		}
	};

	const handleGranularityChange = (granularityButton) => {
		setSelectedGranularity(granularityButton);
	};

	useEffect(() => {
		console.log("Forecasting:", selectedForecasting);
		console.log("Granularity:", selectedGranularity);

		switch (selectedGranularity) {
			case GranularityButtonHours:
				switch (selectedForecasting) {
					case ForecastingButtonHourly:
						setForecastingData(data1);
						break;
					case ForecastingButtonWeekly:
						setForecastingData(data2);
						break;
					case ForecastingButtonMonthly:
						setForecastingData(data3);
						break;
					case ForecastingButtonThreeMonthly:
						setForecastingData(data4);
						break;
				}
				break;
			case GranularityButtonDays:
				switch (selectedForecasting) {
					case ForecastingButtonHourly:
						setForecastingData(data2);
						break;
					case ForecastingButtonWeekly:
						setForecastingData(data3);
						break;
					case ForecastingButtonMonthly:
						setForecastingData(data1);
						break;
					case ForecastingButtonThreeMonthly:
						setForecastingData(data4);
						break;
				}
				break;
			case GranularityButtonWeeks:
				switch (selectedForecasting) {
					case ForecastingButtonHourly:
						setForecastingData(data4);
						break;
					case ForecastingButtonWeekly:
						setForecastingData(data2);
						break;
					case ForecastingButtonMonthly:
						setForecastingData(data3);
						break;
					case ForecastingButtonThreeMonthly:
						setForecastingData(data1);
						break;
				}
				break;
			// default case if needed
		}
	}, [selectedForecasting, selectedGranularity]);
	return (
		<AuthenticatedLayout>
			<div className="p-1 sm:ml-40 bg-gray-200 font-robotoflex">
				<div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
					<div className="grid grid-cols-1 justify-center items-center gap-4 mb-1 ">
						<SectionTitleDescription
							title={"Forecasting"}
							description={
								"Inspect consumption and cost forecasts. Use the orange tabs to adjust how detailed the data is, and the blue tabs to change the time range of the forecast."
							}
						/>
					</div>
				</div>
				<div className="lg:flex p-2 justify-end mb-4">
					<ForecastingGranularityButtons
						handleGranularityChange={handleGranularityChange}
						granularityButtonNames={granularityButtonGroup}
						defaultGranularityButton={selectedGranularity}
					/>
					<div>
						<ForecastingHorizonButtons
							handleForecastingHorizonChange={handleForecastingHorizonChange}
							buttonForecastingHorizon={forecastingButtonGroup}
							defaultForecastingHorizon={selectedForecasting}
						/>
					</div>
				</div>
				<div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
					<div className="grid grid-cols-1 justify-center items-center gap-4 mb-1 ">
						<SectionTitleDescription
							title={"Consumption Forecasting"}
							description={
								"This tools offers valuable insights into expected consumption patterns presented in kilowatt-hours (kWh), aiding in efficient resource management and planning."
							}
						/>
					</div>
				</div>
				<div className="flex items-center m-2 justify-center rounded bg-gray-50 h-[calc(100vh-15rem)] rounded-b-lg">
					<ResponsiveContainer width="100%" height="100%" className="pt-8">
						<LineChart
							width={500}
							height={300}
							data={forecastingData}
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
								dataKey="uv"
								stroke="#8884d8"
								activeDot={{ r: 8 }}
								strokeDasharray="5 5"
							/>
							<Line dataKey="uv_prediction" stroke="#82ca9d" />
						</LineChart>
					</ResponsiveContainer>
				</div>
				<div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
					<div className="grid grid-cols-1 justify-center items-center gap-4 mb-1 ">
						<SectionTitleDescription
							title={"Cost Forecasting"}
							description={
								"This tool provides a forward-looking view of expected costs, measured in Euros (€), helping you to budget and plan more effectively for the future."
							}
						/>
					</div>
				</div>
				<div className="lg:flex p-2 justify-end mb-4">
					<ForecastingGranularityButtons
						handleGranularityChange={handleGranularityChange}
						granularityButtonNames={granularityButtonGroup}
						defaultGranularityButton={selectedGranularity}
					/>
					<div>
						<ForecastingHorizonButtons
							handleForecastingHorizonChange={handleForecastingHorizonChange}
							buttonForecastingHorizon={forecastingButtonGroup}
							defaultForecastingHorizon={selectedForecasting}
						/>
					</div>
				</div>
				<div className="flex items-center m-2 justify-center rounded bg-gray-50 h-[calc(100vh-15rem)] rounded-b-lg">
					<ResponsiveContainer width="100%" height="100%" className="pt-8">
						<LineChart
							width={500}
							height={300}
							data={forecastingData}
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
								<Label value="Cost (€)" angle={-90} position="insideLeft" />
							</YAxis>
							<Tooltip />
							<Legend />
							<Line
								dataKey="pv"
								stroke="#8884d8"
								activeDot={{ r: 8 }}
								strokeDasharray="5 5"
							/>
							<Line dataKey="pv_prediction" stroke="#82ca9d" />
						</LineChart>
					</ResponsiveContainer>
				</div>
				<div className="grid grid-cols-2 pt-2 m-2 gap-4 mb-4 font-robotoflex">
					<SingleMetricCard
						title={"Energy Forecast Deviation"}
						description={"Average deviation from actual consumption"}
						metric={"+5%"}
					/>
					<SingleMetricCard
						title={"Cost Forecast Deviation"}
						description={"Average deviation from actual cost"}
						metric={"+10%"}
					/>
				</div>
				<div className="grid grid-cols-1 gap-4 mb-4 font-robotoflex">
					<MetricsCard
						metrics={forecastingMetrics}
						title={"Forecast Evaluation Metrics"}
						description="The following metrics are used to measure the performance of the forecasting by comparing predicted values with actual values."
					/>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}

export default Forecasting;
