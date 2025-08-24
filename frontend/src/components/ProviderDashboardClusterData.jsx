import PropTypes from "prop-types";
import SimpleResultCard from "./SimpleResultCard.jsx";
import RangeDatePicker from "./RangeDatePicker.jsx";
import GroupButtonsGranularity from "./GroupButtonsGranularity.jsx";
import MetricsCard from "./MetricsCard.jsx";
import { useEffect, useState } from "react";
import { LoaderTop } from "./Loader.jsx";
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
  getClusterConsumptionHourly,
  getClusterConsumptionDaily,
  getClusterConsumptionMonthly,
} from "../service/api";

function ProviderDashboardClusterData({ clusterInfoData }) {
  if (typeof clusterInfoData === "undefined") {
    return (
      <div className='bg-gray-200 p-5 text-center text-sm'>
        <h2>Select a group to inspect its information</h2>
      </div>
    );
  }
  const [todayConsumption, setTodayConsumption] = useState(null);
  const [todayCost, setTodayCost] = useState(null);
  const [monthConsumption, setMonthConsumption] = useState(null);
  const [monthCost, setMonthCost] = useState(null);
  const [
    percentageTodayConsumptionFromYesterday,
    setPercentageTodayConsumptionFromYesterday,
  ] = useState(null);
  const [
    percentageTodayCostFromYesterday,
    setPercentageTodayCostFromYesterday,
  ] = useState(null);
  const [
    percentageMonthlyConsumptionFromLastMonth,
    setPercentageMonthlyConsumptionFromLastMonth,
  ] = useState(null);
  const [
    percentageMonthlyCostFromLastMonth,
    setPercentageMonthlyCostFromLastMonth,
  ] = useState(null);
  const [
    todaysConsumptionCardPreviousData,
    setTodaysConsumptionCardPreviousData,
  ] = useState([]);
  const [todaysCostCardPreviousData, setTodaysCostCardPreviousData] = useState(
    []
  );
  const [
    monthsConsumptionCardPreviousData,
    setMonthsConsumptionCardPreviousData,
  ] = useState([]);
  const [monthsCostCardPreviousData, setMonthsCostCardPreviousData] = useState(
    []
  );
  const [dataIsLoading, setDataIsLoading] = useState(true);
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

  const [clusterInfoCard, setClusterInfoCard] = useState([]);

  useEffect(() => {
    setClusterInfoCard([
      {
        title: "Group ID",
        description: String(clusterInfoData.id),
      },
      {
        title: "# of Consumers",
        description: String(clusterInfoData.number_of_consumers),
      },
      {
        title: "Group Type",
        description: clusterInfoData.cluster_type,
      },
    ]);
  }, [clusterInfoData]);

  useEffect(() => {
    const fetchCardsData = async () => {
      try {
        setDataIsLoading(true);
        const today = new Date(import.meta.env.VITE_TODAY_DATETIME);
        let endDate = today;
        let startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days before today

        const daily_data = await getClusterConsumptionDaily(
          clusterInfoData.id,
          startDate,
          endDate
        );
        const current_month = today.getMonth();
        const first_day_of_month = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        const monthly_data = await getClusterConsumptionMonthly(
          clusterInfoData.id,
          first_day_of_month,
          today
        );

        const end_date_months = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        const start_date_months = new Date(
          today.getFullYear(),
          current_month - 3,
          1
        );
        const prev_monthly_data = await getClusterConsumptionMonthly(
          clusterInfoData.id,
          start_date_months,
          end_date_months
        );

        const first_day_of_previous_month = new Date(
          today.getFullYear(),
          current_month - 1,
          1
        );
        const last_day_of_previous_month = new Date(
          today.getFullYear(),
          current_month,
          0
        );

        const last_month_data = await getClusterConsumptionMonthly(
          clusterInfoData.id,
          first_day_of_previous_month,
          last_day_of_previous_month
        );

        setTodayConsumption(
          Number(daily_data[7]["consumption_kwh"]).toFixed(2)
        );
        setTodayCost(daily_data[7]["cost_euro"]);

        setMonthConsumption(monthly_data["consumption_kwh"]);
        setMonthCost(monthly_data["cost_euro"]);

        const yesterdayConsumption = daily_data[5]["consumption_kwh"];
        const yesterdayCost = daily_data[5]["cost_euro"];
        setPercentageTodayConsumptionFromYesterday(
          (
            (daily_data[7]["consumption_kwh"] / yesterdayConsumption) * 100 -
            100
          ).toFixed(2)
        );
        setPercentageTodayCostFromYesterday(
          ((daily_data[7]["cost_euro"] / yesterdayCost) * 100 - 100).toFixed(2)
        );

        setMonthConsumption(monthly_data[0]["consumption_kwh"]);
        setMonthCost(monthly_data[0]["cost_euro"]);

        const lastMonthConsumption = last_month_data[0]["consumption_kwh"];
        const lastMonthCost = last_month_data[0]["cost_euro"];
        setPercentageMonthlyConsumptionFromLastMonth(
          (
            (monthly_data[0]["consumption_kwh"] / lastMonthConsumption) * 100 -
            100
          ).toFixed(2)
        );
        setPercentageMonthlyCostFromLastMonth(
          ((monthly_data[0]["cost_euro"] / lastMonthCost) * 100 - 100).toFixed(
            2
          )
        );

        setTodaysConsumptionCardPreviousData(
          daily_data.slice(0, 7).map((data) => ({
            date: new Date(data.day).toDateString(),
            value: Number(data.consumption_kwh).toFixed(2),
          }))
        );

        setTodaysCostCardPreviousData(
          daily_data.slice(0, 7).map((data) => ({
            date: new Date(data.day).toDateString(),
            value: Number(data.cost_euro).toFixed(2),
          }))
        );

        setMonthsConsumptionCardPreviousData(
          prev_monthly_data.slice(0, 6).map((data) => ({
            date: new Date(data.month).toDateString(),
            value: Number(data.consumption_kwh).toFixed(2),
          }))
        );

        setMonthsCostCardPreviousData(
          prev_monthly_data.slice(0, 6).map((data) => ({
            date: new Date(data.month).toDateString(),
            value: Number(data.cost_euro).toFixed(2),
          }))
        );

        setDateRanges({
          startDate: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 4
          ),
          endDate: today,
        });

        setDataIsLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchCardsData();
  }, [clusterInfoData]);

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

  if (typeof clusterInfoData === "undefined") {
    return null;
  }

  useEffect(() => {
    if (dateRanges.length === 0 || !dateRanges.startDate || !dateRanges.endDate)
      return;

    const fetchData = async () => {
      try {
        let newdata;
        if (defaultButtonName === GranularityButtonHourly) {
          newdata = await getClusterConsumptionHourly(
            clusterInfoData.id,
            dateRanges.startDate,
            dateRanges.endDate
          );
        } else if (defaultButtonName === GranularityButtonDaily) {
          newdata = await getClusterConsumptionDaily(
            clusterInfoData.id,
            dateRanges.startDate,
            dateRanges.endDate
          );
        } else if (defaultButtonName === GranularityButtonMonthly) {
          newdata = await getClusterConsumptionMonthly(
            clusterInfoData.id,
            dateRanges.startDate,
            dateRanges.endDate
          );
        }

        newdata = newdata.map((data) => {
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

        const formattedData = newdata.map((data) => ({
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
  }, [dateRanges, defaultButtonName]);

  return (
    <div className='p-1 sm:ml-40 bg-gray-200 font-ubuntu'>
      <div
        className='p-4 mb-4 text-sm text-orange-500 rounded-lg m-2 bg-gray-50'
        role='alert'
      >
        <span className='flex justify-center'>
          The results represent the mean values across all consumers in the
          group.
        </span>
      </div>
      <div className='grid grid-cols-1 justify-center items-center gap-4 mb-1 '>
        <MetricsCard
          title={"Group Info"}
          description={
            "Here you can inspect an overview of your selected group about the consumption and the cost. The result represent the mean values across all consumers in the group."
          }
          metrics={clusterInfoCard}
        />
      </div>

      {!dataIsLoading ? (
        <div className='p-2 border-2 border-gray-200 border-dashed rounded-lg'>
          <div className='grid grid-cols-2 gap-4 mb-4 font-ubuntu'>
            <SimpleResultCard
              title={"Daily consumption"}
              result={todayConsumption + "kwh"}
              difference={
                percentageTodayConsumptionFromYesterday + "% from yesterday"
              }
              chartData={todaysConsumptionCardPreviousData}
              activeIndex={6}
              metric={"kwh"}
            />
            <SimpleResultCard
              title={"Daily cost"}
              result={todayCost + "€"}
              difference={percentageTodayCostFromYesterday + "% from yesterday"}
              chartData={todaysCostCardPreviousData}
              activeIndex={6}
              metric={"€"}
            />
            <SimpleResultCard
              title={"Monthly consumption"}
              result={monthConsumption + "kwh"}
              difference={
                percentageMonthlyConsumptionFromLastMonth + "% from last month"
              }
              chartData={monthsConsumptionCardPreviousData}
              activeIndex={2}
              metric={"kwh"}
            />
            <SimpleResultCard
              title={"Monthly cost"}
              result={monthCost + "€"}
              difference={
                percentageMonthlyCostFromLastMonth + "% from last month"
              }
              chartData={monthsCostCardPreviousData}
              activeIndex={2}
              metric={"€"}
            />
          </div>

          <div className='flex bg-gray-50 justify-center items-center gap-4 mb-4 rounded-lg border-b-2 border-orange-400 '>
            <RangeDatePicker
              title={"Consumption & Cost"}
              description={
                "Select a date range to inspect the consumption and the cost within the range"
              }
              handleRangeChange={handleDateRange}
            />
          </div>
          <div className='grid grid-cols-1 gap-4 mb-4'>
            <GroupButtonsGranularity
              handleGranularityChange={switchGranularity}
              buttonNames={buttonGroup1}
              defaultButtonName={defaultButtonName}
            />
          </div>

          <div className='grid grid-cols-1 gap-4 mb-4 '>
            <div className='flex items-center justify-center rounded bg-gray-50 h-[calc(100vh-8rem)] rounded-b-lg'>
              <ResponsiveContainer
                width='100%'
                height='100%'
                className='font-ubuntu pt-8'
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
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='timeUnit' name='Time' height={40}></XAxis>
                  <YAxis yAxisId='left'>
                    <Label
                      value='Group Consumption (kwh)'
                      angle={-90}
                      position='insideLeft'
                    />
                  </YAxis>
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      name === "consumption_kwh"
                        ? "Group Consumption (kwh)"
                        : name === "cost_euro"
                        ? "Group Cost (€)"
                        : name,
                    ]}
                  />
                  <YAxis yAxisId='right' orientation='right'>
                    <Label
                      value='Group Cost (€)'
                      angle={90}
                      position='insideRight'
                    />
                  </YAxis>
                  <Legend
                    formatter={(value) => [
                      value === "consumption_kwh"
                        ? "Group Consumption (kwh)"
                        : value === "cost_euro"
                        ? "Group Cost (€)"
                        : value,
                    ]}
                  />
                  <Line
                    yAxisId='left'
                    dataKey='consumption_kwh'
                    stroke='#FFA500'
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId='right'
                    dataKey='cost_euro'
                    stroke='gray'
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <LoaderTop />
      )}
    </div>
  );
}

ProviderDashboardClusterData.propTypes = {
  clusterID: PropTypes.string,
};

export default ProviderDashboardClusterData;
