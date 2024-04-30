import AuthenticatedLayout from "./AuthenticatedLayout.jsx";
import { useState, useEffect } from "react";
import ForecastingGranularityButtons from "../../components/ForecastingGranularityButtons.jsx";
import SectionTitleDescription from "../../components/SectionTitleDescription.jsx";
import ForecastingHorizonButtons from "../../components/ForecastingHorizonButtons.jsx";
import MetricsCard from "../../components/MetricsCard.jsx";
import SingleMetricCard from "../../components/SingleMetricCard.jsx";
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
import { 
	getUserEmail , 
	getConsumerForecatistingHourly, 
	getConsumerForecatistingDaily,
	getConsumerConsumptionHourly,  
	getConsumerConsumptionDaily
} from "../../service/api.jsx";

const GranularityButtonHours = "Hours";
const GranularityButtonDays = "Days";
const granularityButtonGroup = [
	GranularityButtonHours,
	GranularityButtonDays,
];

const ForecastingButtonHourly = "Hourly";
const ForecastingButtonWeekly = "Weekly";
const ForecastingButtonMonthly = "Monthly";
const forecastingButtonGroup = [
	ForecastingButtonHourly,
	ForecastingButtonWeekly,
	ForecastingButtonMonthly,
];



function Forecasting() {
	const today = new Date(import.meta.env.VITE_TODAY_DATETIME);
	const userEmail = getUserEmail();
	const [forecastingData, setForecastingData] = useState([]);
	const [selectedGranularity, setSelectedGranularity] = useState(
		GranularityButtonHours
	);
	const [selectedForecasting, setSelectedForecasting] = useState(
		ForecastingButtonHourly
	);
	const [forecastingMetrics, setForecastingMetrics] = useState([]);
	const [energyForecastDeviation, setEnergyForecastDeviation] = useState("");
	const [costForecastDeviation, setCostForecastDeviation] = useState("");

	const handleForecastingHorizonChange = (forecastingButton) => {
		setSelectedForecasting(forecastingButton);
		switch (forecastingButton) {
			case ForecastingButtonHourly:
				setSelectedGranularity(GranularityButtonHours);
				break;
			case ForecastingButtonWeekly:
				setSelectedGranularity(GranularityButtonDays);
				break;
			default:
				break;
		}
	};

	const handleGranularityChange = (granularityButton) => {
		setSelectedGranularity(granularityButton);
	};

    useEffect(() => {
        const fetchData = async (func, email, start_date, end_date) => {
            try {
                const response = await func(email, start_date, end_date);
                return response;
            } catch (error) {
                console.error(error);
                return [];
            }
        };

        const loadData = async () => {
			let forecastData;
			let consumptionData;
			let combinedData;
			let energyForecastDeviation;
			let costForecastDeviation;
            switch (selectedGranularity) {
                case GranularityButtonHours:
                    switch (selectedForecasting) {
                        case ForecastingButtonHourly:
                            const yesterday = new Date(today);
                            yesterday.setDate(yesterday.getDate() - 1);
                            const tomorrow = new Date(today);
                            tomorrow.setDate(tomorrow.getDate() + 1);

                            forecastData = await fetchData(getConsumerForecatistingHourly, userEmail, yesterday, tomorrow);
                            consumptionData = await fetchData(getConsumerConsumptionHourly, userEmail, yesterday, today);

                            combinedData = forecastData.map((forecast) => {
                                const consumption = consumptionData.find(
                                    (consumption) => consumption.hour === forecast.hour
                                );
                                return { ...forecast, ...consumption };
                            });

                            combinedData.forEach((data) => {
                                data.timeUnit = new Date(data.hour).toLocaleString();
                                delete data.hour;
                            });
                            break;
                        case ForecastingButtonWeekly:
							const last_week_date = new Date(today);
                            last_week_date.setDate(today.getDate() - 7);
                            const next_week_date = new Date(today);
                            next_week_date.setDate(today.getDate() + 7);

                            forecastData = await fetchData(getConsumerForecatistingHourly, userEmail, last_week_date, next_week_date);
                            consumptionData = await fetchData(getConsumerConsumptionHourly, userEmail, last_week_date, today);

                            combinedData = forecastData.map((forecast) => {
                                const consumption = consumptionData.find(
                                    (consumption) => consumption.hour === forecast.hour
                                );
                                return { ...forecast, ...consumption };
                            });

                            combinedData.forEach((data) => {
                                data.timeUnit = new Date(data.hour).toLocaleString();
                                delete data.hour;
                            });
						
                            break;
                        case ForecastingButtonMonthly:
							const last_month_date = new Date(today);
                            last_month_date.setDate(today.getDate() - 30);
                            const next_month_date = new Date(today);
                            next_month_date.setDate(today.getDate() + 30);

                            forecastData = await fetchData(getConsumerForecatistingHourly, userEmail, last_month_date, next_month_date);
                            consumptionData = await fetchData(getConsumerConsumptionHourly, userEmail, last_month_date, today);

                            combinedData = forecastData.map((forecast) => {
                                const consumption = consumptionData.find(
                                    (consumption) => consumption.hour === forecast.hour
                                );
                                return { ...forecast, ...consumption };
                            });

                            combinedData.forEach((data) => {
                                data.timeUnit = new Date(data.hour).toLocaleString();
                                delete data.hour;
                            });
                            break;
                    }
                    break;
                case GranularityButtonDays:
					switch (selectedForecasting) {
                        case ForecastingButtonHourly:
                            const yesterday = new Date(today);
                            yesterday.setDate(yesterday.getDate() - 1);
                            const tomorrow = new Date(today);
                            tomorrow.setDate(tomorrow.getDate() + 1);

                            forecastData = await fetchData(getConsumerForecatistingDaily, userEmail, yesterday, tomorrow);
                            consumptionData = await fetchData(getConsumerConsumptionDaily, userEmail, yesterday, today);

                            combinedData = forecastData.map((forecast) => {
                                const consumption = consumptionData.find(
                                    (consumption) => consumption.day === forecast.day
                                );
                                return { ...forecast, ...consumption };
                            });

                            combinedData.forEach((data) => {
                                data.timeUnit = new Date(data.day).toLocaleString();
                                delete data.day;
                            });
                            break;
                        case ForecastingButtonWeekly:
							const last_week_date = new Date(today);
                            last_week_date.setDate(today.getDate() - 7);
                            const next_week_date = new Date(today);
                            next_week_date.setDate(today.getDate() + 7);

                            forecastData = await fetchData(getConsumerForecatistingDaily, userEmail, last_week_date, next_week_date);
                            consumptionData = await fetchData(getConsumerConsumptionDaily, userEmail, last_week_date, today);

                            combinedData = forecastData.map((forecast) => {
                                const consumption = consumptionData.find(
                                    (consumption) => consumption.day === forecast.day
                                );
                                return { ...forecast, ...consumption };
                            });

                            combinedData.forEach((data) => {
                                data.timeUnit = new Date(data.day).toLocaleString();
                                delete data.day;
                            });

                            break;
                        case ForecastingButtonMonthly:
							const last_month_date = new Date(today);
                            last_month_date.setDate(today.getDate() - 30);
                            const next_month_date = new Date(today);
                            next_month_date.setDate(today.getDate() + 30);

                            forecastData = await fetchData(getConsumerForecatistingDaily, userEmail, last_month_date, next_month_date);
                            consumptionData = await fetchData(getConsumerConsumptionDaily, userEmail, last_month_date, today);

                            combinedData = forecastData.map((forecast) => {
                                const consumption = consumptionData.find(
                                    (consumption) => consumption.day === forecast.day
                                );
                                return { ...forecast, ...consumption };
                            });

                            combinedData.forEach((data) => {
                                data.timeUnit = new Date(data.day).toLocaleString();
                                delete data.day;
                            });
                            break;
                    }
                    break;
				default:
					break;

            }

			energyForecastDeviation = combinedData.slice(0, consumptionData.length).reduce((acc, data) => {
				const deviation = (data.consumption_kwh - data.forecasting_consumption_kwh);
				return acc + deviation;
			}
			, 0) / consumptionData.length;
			energyForecastDeviation = energyForecastDeviation.toFixed(2);

			costForecastDeviation = combinedData.slice(0, consumptionData.length).reduce((acc, data) => {
				if (data.cost_euro == 0.00) {
					return acc;
				}
				const deviation = (data.cost_euro - data.forecasting_cost_euro);
				return acc + deviation;
			}
			, 0) / consumptionData.length;
			
			costForecastDeviation = costForecastDeviation.toFixed(2);

			const mape = combinedData.slice(0, consumptionData.length).reduce((acc, data) => {
				const deviation = Math.abs((data.consumption_kwh - data.forecasting_consumption_kwh) / data.consumption_kwh);
				return acc + deviation;
			}
			, 0) / consumptionData.length;
			const mae = combinedData.slice(0, consumptionData.length).reduce((acc, data) => {
				const deviation = Math.abs(data.consumption_kwh - data.forecasting_consumption_kwh);
				return acc + deviation;
			}
			, 0) / consumptionData.length;
			const r2 = 1 - (combinedData.slice(0, consumptionData.length).reduce((acc, data) => {
				const deviation = Math.pow(data.consumption_kwh - data.forecasting_consumption_kwh, 2);
				return acc + deviation;
			}
			, 0) / combinedData.slice(0, consumptionData.length).reduce((acc, data) => {
				const deviation = Math.pow(data.consumption_kwh - mape, 2);
				return acc + deviation;
			}
			, 0));
			const metrics = [
				{
					title: "Mean Absolute Percentage Error (MAPE)",
					description: mape.toFixed(2),
				},
				{
					title: "Mean Absolute Error (MAE)",
					description: mae.toFixed(2),
				},
				{
					title: "R-Squared (R2)",
					description: r2.toFixed(2),
				},
			];
			setForecastingMetrics(metrics);
			setCostForecastDeviation(costForecastDeviation);
			setEnergyForecastDeviation(energyForecastDeviation);
			setForecastingData(combinedData);
        };

        loadData();

    }, [selectedForecasting, selectedGranularity]);
	

	return (
		<AuthenticatedLayout>
			<div className="p-1 sm:ml-40 bg-gray-200 font-cairo">
				<div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
					<div className="grid grid-cols-1 justify-center items-center gap-4 mb-1 ">
						<SectionTitleDescription
							title={"Consumption Forecasting"}
							description={
								"This tools offers valuable insights into expected consumption patterns presented in kilowatt-hours (kWh), aiding in efficient resource management and planning. Use the orange tabs to adjust how detailed the data is, and the blue tabs to change the time range of the forecast."
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
				<div className="flex items-center m-2 justify-center rounded bg-gray-50 h-[calc(100vh-8rem)] rounded-b-lg">
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
							<XAxis dataKey="timeUnit" />
							<YAxis>
								<Label
									value="Consumption (kwh)"
									angle={-90}
									position="insideLeft"
								/>
							</YAxis>
							<Tooltip formatter={(value, name) => [
								value,
								name === 'consumption_kwh' ? 'Consumption (kwh)' :
								name === 'forecasting_consumption_kwh' ? 'Forecasted Consumption (kwh)' : name
									
							]} />
							<Legend formatter={(value) => [
								value === 'consumption_kwh' ? 'Consumption (kwh)' : 
								value === 'forecasting_consumption_kwh' ? 'Forecasted Consumption (kwh)' : name
									
							]}  />
							<Line
								dataKey="forecasting_consumption_kwh"
								stroke="gray"
								activeDot={{ r: 8 }}
								strokeWidth={2}
							/>
							<Line dataKey="consumption_kwh" stroke="#FFA500" strokeWidth={2} />
						</LineChart>
					</ResponsiveContainer>
				</div>
				<div className="grid grid-cols-2 pt-2 m-2 gap-4 mb-4 font-cairo">
					<SingleMetricCard
						title={"Energy Forecast Deviation (kwh)"}
						description={"Average deviation from actual consumption"}
						metric={energyForecastDeviation}
					/>
					<SingleMetricCard
						title={"Cost Forecast Deviation (€)"}
						description={"Average deviation from actual cost"}
						metric={costForecastDeviation}
					/>
				</div>
				<div className="grid grid-cols-1 gap-4 mb-4 font-cairo">
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
