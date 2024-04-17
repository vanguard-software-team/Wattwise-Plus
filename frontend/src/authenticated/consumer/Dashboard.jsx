import SimpleResultCard from "../../compoments/SimpleResultCard.jsx";
import AuthenticatedLayout from "./AuthenticatedLayout.jsx";
import RangeDatePicker from "../../compoments/RangeDatePicker.jsx";
import GroupButtonsGranularity from "../../compoments/GroupButtonsGranularity.jsx";
import { useEffect, useState } from "react";
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
import { getConsumerConsumptionDaily, getConsumerConsumptionMonthly , getUserEmail } from "../../service/api.jsx";

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

function Dashboard() {
	const userEmail = getUserEmail();
	const today = new Date(import.meta.env.VITE_TODAY_DATETIME);
	const six_days_before = 6 * 24 * 60 * 60 * 1000; // 6 days before
	const [cardsData, setCardsData] = useState(null);
	const [todayConsumption, setTodayConsumption] = useState(null);
	const [todayCost, setTodayCost] = useState(null);
	const [monthConsumption, setMonthConsumption] = useState(null);
	const [monthCost, setMonthCost] = useState(null);
	const [percentageTodayConsumptionFromYesterday, setPercentageTodayConsumptionFromYesterday] = useState(null);
	const [percentageTodayCostFromYesterday, setPercentageTodayCostFromYesterday] = useState(null);
	const [percentageMonthlyConsumptionFromLastMonth, setPercentageMonthlyConsumptionFromLastMonth] = useState(null);
	const [percentageMonthlyCostFromLastMonth, setPercentageMonthlyCostFromLastMonth] = useState(null);
	const [dataIsLoading, setDataIsLoading] = useState(true);
	
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Using an environment variable to set the current date
                const today = new Date(import.meta.env.VITE_TODAY_DATETIME);
                let endDate = today;
                let startDate = new Date(endDate.getTime() - (6 * 24 * 60 * 60 * 1000)); // 6 days before today
                const daily_data = await getConsumerConsumptionDaily(userEmail, startDate, endDate);
				const current_month = today.getMonth();
				const first_day_of_month = new Date(today.getFullYear(), current_month, 1);
                const monthly_data = await getConsumerConsumptionMonthly(userEmail, first_day_of_month, today);

				const first_day_of_previous_month = new Date(today.getFullYear(), current_month - 1, 1);
				const last_day_of_previous_month = new Date(today.getFullYear(), current_month, 0);

				const last_month_data = await getConsumerConsumptionMonthly(userEmail, first_day_of_previous_month, last_day_of_previous_month);

                setTodayConsumption(daily_data[6]['consumption_kwh']);
                setTodayCost(daily_data[6]['cost_euro']);

                setMonthConsumption(monthly_data['consumption_kwh']);
                setMonthCost(monthly_data['cost_euro']);

                const yesterdayConsumption = daily_data[5]['consumption_kwh'];
                const yesterdayCost = daily_data[5]['cost_euro'];
                setPercentageTodayConsumptionFromYesterday(((daily_data[6]['consumption_kwh'] / yesterdayConsumption) * 100 - 100).toFixed(2));
                setPercentageTodayCostFromYesterday(((daily_data[6]['cost_euro'] / yesterdayCost) * 100 - 100).toFixed(2));


                setMonthConsumption(monthly_data[0]['consumption_kwh']);
				setMonthCost(monthly_data[0]['cost_euro']);
				
				const lastMonthConsumption = last_month_data[0]['consumption_kwh'];
                const lastMonthCost = last_month_data[0]['cost_euro'];
                setPercentageMonthlyConsumptionFromLastMonth(((monthly_data[0]['consumption_kwh'] / lastMonthConsumption) * 100 - 100).toFixed(2));
                setPercentageMonthlyCostFromLastMonth(((monthly_data[0]['cost_euro'] / lastMonthCost) * 100 - 100).toFixed(2));



				setDataIsLoading(false);



            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [userEmail]);


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
								chartData={[{ name: "Page A", uv: 1000, pv: 2400, amt: 2400 }, { name: "Page B", uv: 2000, pv: 1398, amt: 2210 }, { name: "Page C", uv: 250, pv: 428, amt: 4210 },{ name: "Page A", uv: 1000, pv: 2400, amt: 2400 }, { name: "Page B", uv: 2000, pv: 1398, amt: 2210 }, { name: "Page C", uv: 250, pv: 428, amt: 4210 },{ name: "Page A", uv: 1000, pv: 2400, amt: 2400 }, { name: "Page B", uv: 2000, pv: 1398, amt: 2210 }, { name: "Page C", uv: 250, pv: 428, amt: 4210 }]}
							/>
							<SimpleResultCard
								title={"Today's cost"}
								result={todayCost + "€"}
								difference={percentageTodayCostFromYesterday + "% from yesterday"}
								chartData={[{ name: "Page A", uv: 1000, pv: 2400, amt: 2400 }, { name: "Page B", uv: 2000, pv: 1398, amt: 2210 }, { name: "Page C", uv: 250, pv: 428, amt: 4210 },{ name: "Page A", uv: 1000, pv: 2400, amt: 2400 }, { name: "Page B", uv: 2000, pv: 1398, amt: 2210 }, { name: "Page C", uv: 250, pv: 428, amt: 4210 },{ name: "Page A", uv: 1000, pv: 2400, amt: 2400 }, { name: "Page B", uv: 2000, pv: 1398, amt: 2210 }, { name: "Page C", uv: 250, pv: 428, amt: 4210 }]}
							/>
							<SimpleResultCard
								title={"Month's consumption"}
								result={monthConsumption + "kwh"}
								difference={percentageMonthlyConsumptionFromLastMonth + "% from last month"}
								chartData={[{ name: "Page A", uv: 1000, pv: 2400, amt: 2400 }, { name: "Page B", uv: 2000, pv: 1398, amt: 2210 }, { name: "Page C", uv: 250, pv: 428, amt: 4210 },{ name: "Page A", uv: 1000, pv: 2400, amt: 2400 }, { name: "Page B", uv: 2000, pv: 1398, amt: 2210 }, { name: "Page C", uv: 250, pv: 428, amt: 4210 },{ name: "Page A", uv: 1000, pv: 2400, amt: 2400 }, { name: "Page B", uv: 2000, pv: 1398, amt: 2210 }, { name: "Page C", uv: 250, pv: 428, amt: 4210 }]}
							/>
							<SimpleResultCard
								title={"Month's cost"}
								result={monthCost + "€"}
								difference={percentageMonthlyCostFromLastMonth + "% from last month"}
								chartData={[{ name: "Page A", uv: 1000, pv: 2400, amt: 2400 }, { name: "Page B", uv: 2000, pv: 1398, amt: 2210 }, { name: "Page C", uv: 250, pv: 428, amt: 4210 },{ name: "Page A", uv: 1000, pv: 2400, amt: 2400 }, { name: "Page B", uv: 2000, pv: 1398, amt: 2210 }, { name: "Page C", uv: 250, pv: 428, amt: 4210 },{ name: "Page A", uv: 1000, pv: 2400, amt: 2400 }, { name: "Page B", uv: 2000, pv: 1398, amt: 2210 }, { name: "Page C", uv: 250, pv: 428, amt: 4210 }]}
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
				) : (
					<div className="flex justify-center items-center h-screen">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
					</div>
				)}
			</div>

		</AuthenticatedLayout>
	);
}

export default Dashboard;
