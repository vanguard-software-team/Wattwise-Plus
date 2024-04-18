import SimpleResultCard from "../../components/SimpleResultCard.jsx";
import AuthenticatedLayout from "./AuthenticatedLayout.jsx";
import RangeDatePicker from "../../components/RangeDatePicker.jsx";
import GroupButtonsGranularity from "../../components/GroupButtonsGranularity.jsx";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader.jsx";
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
import { getConsumerConsumptionDaily, getConsumerConsumptionHourly, getConsumerConsumptionMonthly, getUserEmail } from "../../service/api.jsx";

function Dashboard() {
	const userEmail = getUserEmail();
	const [todayConsumption, setTodayConsumption] = useState(null);
	const [todayCost, setTodayCost] = useState(null);
	const [monthConsumption, setMonthConsumption] = useState(null);
	const [monthCost, setMonthCost] = useState(null);
	const [percentageTodayConsumptionFromYesterday, setPercentageTodayConsumptionFromYesterday] = useState(null);
	const [percentageTodayCostFromYesterday, setPercentageTodayCostFromYesterday] = useState(null);
	const [percentageMonthlyConsumptionFromLastMonth, setPercentageMonthlyConsumptionFromLastMonth] = useState(null);
	const [percentageMonthlyCostFromLastMonth, setPercentageMonthlyCostFromLastMonth] = useState(null);
	const [todaysConsumptionCardPreviousData, setTodaysConsumptionCardPreviousData] = useState([]);
	const [todaysCostCardPreviousData, setTodaysCostCardPreviousData] = useState([]);
	const [monthsConsumptionCardPreviousData, setMonthsConsumptionCardPreviousData] = useState([]);
	const [monthsCostCardPreviousData, setMonthsCostCardPreviousData] = useState([]);
	const [dataIsLoading, setDataIsLoading] = useState(true);


	useEffect(() => {
		const fetchCardsData = async () => {
			try {
				const today = new Date(import.meta.env.VITE_TODAY_DATETIME);
				let endDate = today;
				let startDate = new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7 days before today
				const daily_data = await getConsumerConsumptionDaily(userEmail, startDate, endDate);
				const current_month = today.getMonth();
				const first_day_of_month = new Date(today.getFullYear(), current_month, 1);
				const monthly_data = await getConsumerConsumptionMonthly(userEmail, first_day_of_month, today);

				const end_date_months = new Date(today.getFullYear(), current_month, 1);
				const start_date_months = new Date(today.getFullYear(), current_month - 3, 1);
				const prev_monthly_data = await getConsumerConsumptionMonthly(userEmail, start_date_months, end_date_months);

				const first_day_of_previous_month = new Date(today.getFullYear(), current_month - 1, 1);
				const last_day_of_previous_month = new Date(today.getFullYear(), current_month, 0);

				const last_month_data = await getConsumerConsumptionMonthly(userEmail, first_day_of_previous_month, last_day_of_previous_month);

				setTodayConsumption(Number(daily_data[7]['consumption_kwh']).toFixed(2));
				setTodayCost(daily_data[7]['cost_euro']);

				setMonthConsumption(monthly_data['consumption_kwh']);
				setMonthCost(monthly_data['cost_euro']);

				const yesterdayConsumption = daily_data[5]['consumption_kwh'];
				const yesterdayCost = daily_data[5]['cost_euro'];
				setPercentageTodayConsumptionFromYesterday(((daily_data[7]['consumption_kwh'] / yesterdayConsumption) * 100 - 100).toFixed(2));
				setPercentageTodayCostFromYesterday(((daily_data[7]['cost_euro'] / yesterdayCost) * 100 - 100).toFixed(2));


				setMonthConsumption(monthly_data[0]['consumption_kwh']);
				setMonthCost(monthly_data[0]['cost_euro']);

				const lastMonthConsumption = last_month_data[0]['consumption_kwh'];
				const lastMonthCost = last_month_data[0]['cost_euro'];
				setPercentageMonthlyConsumptionFromLastMonth(((monthly_data[0]['consumption_kwh'] / lastMonthConsumption) * 100 - 100).toFixed(2));
				setPercentageMonthlyCostFromLastMonth(((monthly_data[0]['cost_euro'] / lastMonthCost) * 100 - 100).toFixed(2));


				setTodaysConsumptionCardPreviousData(daily_data.slice(0, 7).map(data => ({
					date: new Date(data.day).toDateString(),
					value: Number(data.consumption_kwh).toFixed(2)
				})));

				setTodaysCostCardPreviousData(daily_data.slice(0, 7).map(data => ({
					date: new Date(data.day).toDateString(),
					value: Number(data.cost_euro).toFixed(2)
				})));


				setMonthsConsumptionCardPreviousData(prev_monthly_data.slice(0, 6).map(data => ({
					date: new Date(data.month).toDateString(),
					value: Number(data.consumption_kwh).toFixed(2)
				})));

				setMonthsCostCardPreviousData(prev_monthly_data.slice(0, 6).map(data => ({
					date: new Date(data.month).toDateString(),
					value: Number(data.cost_euro).toFixed(2)
				})));


				setDateRanges(
					{
						startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
						endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
					}
				);


				setDataIsLoading(false);



			} catch (error) {
				console.error("Error fetching data: ", error);
			}
		};

		fetchCardsData();
	}, [userEmail]);


	const [data, setNewData] = useState([]);
	const [dateRanges, setDateRanges] = useState([]);
	const GranularityButtonHourly = "Hourly";
	const GranularityButtonDaily = "Daily";
	const GranularityButtonMonthly = "Monthly";
	const buttonGroup1 = [
		GranularityButtonHourly,
		GranularityButtonDaily,
		GranularityButtonMonthly,
	];
	const [defaultButtonName, setDefaultButtonName] = useState(
		GranularityButtonHourly
	);


	const switchGranularity = (buttonName) => {
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

	const handleDateRange = (ranges) => {
		ranges.startDate.setHours(0, 0, 0, 0);
		ranges.endDate.setHours(23, 59, 59, 999);
		setDateRanges(ranges);
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

				const formattedData = newdata.map(data => ({
					timeUnit: new Date(data.timeUnit).toLocaleString(),
					consumption_kwh: Number(data.consumption_kwh).toFixed(2),
					cost_euro: Number(data.cost_euro).toFixed(2),
				}));
				setNewData(formattedData);
			} catch (error) {
				console.error("Error fetching data: ", error);
			}
		};

		fetchData();
	}, [dateRanges, defaultButtonName, userEmail]);



	return (
		<AuthenticatedLayout>
			<div className="p-1 sm:ml-40 bg-gray-200">
				{!dataIsLoading ? (
					<div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
						<div className="grid grid-cols-2 gap-4 mb-4 font-robotoflex">
							<SimpleResultCard
								title={"Today's consumption"}
								result={todayConsumption + "kwh"}
								difference={percentageTodayConsumptionFromYesterday + "% from yesterday"}
								chartData={todaysConsumptionCardPreviousData}
								activeIndex={6}
								metric={"kwh"}
							/>
							<SimpleResultCard
								title={"Today's cost"}
								result={todayCost + "€"}
								difference={percentageTodayCostFromYesterday + "% from yesterday"}
								chartData={todaysCostCardPreviousData}
								activeIndex={6}
								metric={"€"}
							/>
							<SimpleResultCard
								title={"Month's consumption"}
								result={monthConsumption + "kwh"}
								difference={percentageMonthlyConsumptionFromLastMonth + "% from last month"}
								chartData={monthsConsumptionCardPreviousData}
								activeIndex={2}
								metric={"kwh"}
							/>
							<SimpleResultCard
								title={"Month's cost"}
								result={monthCost + "€"}
								difference={percentageMonthlyCostFromLastMonth + "% from last month"}
								chartData={monthsCostCardPreviousData}
								activeIndex={2}
								metric={"€"}
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
						<div className="grid grid-cols-1 gap-4 mb-4 font-robotoflex">
							<GroupButtonsGranularity
								handleGranularityChange={switchGranularity}
								buttonNames={buttonGroup1}
								defaultButtonName={defaultButtonName}
							/>
						</div>

						<div className="grid grid-cols-1 gap-4 mb-4 ">
							<div className="flex items-center justify-center rounded bg-gray-50 h-[calc(100vh-8rem)] rounded-b-lg">
								<ResponsiveContainer
									width="100%"
									height="100%"
									className="font-robotoflex pt-8"
								>
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
										<XAxis
											dataKey="timeUnit"
											name="Time"
											interval={Math.floor(data.length / 6)}
											padding={{ left: 20, right: 20 }}
											height={40}
											
										>
										</XAxis>
										<YAxis yAxisId="left">
											<Label
												value="Consumption (kwh)"
												angle={-90}
												position="insideLeft"
											/>
										</YAxis>
										<Tooltip />
										<YAxis yAxisId="right" orientation="right">
											<Label value="Cost (€)" angle={90} position="insideRight" />
										</YAxis>
										<Legend />
										<Line
											yAxisId="left"
											dataKey="consumption_kwh"
											stroke="#FFA500" // Orange color
											strokeWidth={2} // Thicker line
											activeDot={{ r: 8 }}
										/>
										<Line
											yAxisId="right"
											dataKey="cost_euro"
											stroke="#AEAEAE" // Gray color
											strokeWidth={2} // Thicker line
											activeDot={{ r: 8 }}
										/>
									</LineChart>
								</ResponsiveContainer>


							</div>
						</div>
					</div>
				) : (
					<Loader />
				)}
			</div>

		</AuthenticatedLayout>
	);
}

export default Dashboard;
