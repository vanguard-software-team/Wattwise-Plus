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
  ResponsiveContainer,
  Label,
} from "recharts";
import { useState, useEffect } from "react";
import GroupButtonsGranularity from "../../components/GroupButtonsGranularity.jsx";
import MetricsCard from "../../components/MetricsCard.jsx";
import SectionTitleDescription from "../../components/SectionTitleDescription.jsx";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import {
  getConsumerConsumptionAggregateHourly,
  getConsumerConsumptionAggregateDaily,
  getConsumerConsumptionAggregateMonthly,
  getUserEmail,
} from "../../service/api.jsx";
import {
  getConsumerConsumptionDaily,
  getConsumerConsumptionHourly,
  getConsumerConsumptionMonthly,
} from "../../service/api.jsx";
import {
  getClusterConsumptionHourly,
  getClusterConsumptionDaily,
  getClusterConsumptionMonthly,
  getConsumerInfo,
} from "../../service/api.jsx";

function Insights() {
  const userEmail = getUserEmail();
  const [dataComparison, setNewDataComparison] = useState([]);
  const [dataAggregated, setNewDataAggregated] = useState([]);
  const today = new Date(import.meta.env.VITE_TODAY_DATETIME);

  const [dateRangesComparison, setDateRangesComparison] = useState({
    startDate: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 4
    ),
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

  const [defaultButtonNameComparison, setDefaultButtonNameComparison] =
    useState(GranularityButtonHourly);
  const [defaultComparisonMetrics, setComparisonMetrics] = useState([]);

  const switchGranularityComparison = (buttonName) => {
    switch (buttonName) {
      case GranularityButtonHourly:
        setDefaultButtonNameComparison(GranularityButtonHourly);
        break;
      case GranularityButtonDaily:
        setDefaultButtonNameComparison(GranularityButtonDaily);
        break;
      case GranularityButtonMonthly:
        setDefaultButtonNameComparison(GranularityButtonMonthly);
        break;
      default:
        break;
    }
  };

  const switchGranularityAggregated = (buttonName) => {
    const setAggregateData = async (func, stateFunc) => {
      try {
        const response = await func(userEmail);
        const newdata = response.map((data) => {
          let originalType = null;
          if (data.hour) {
            data.timeUnit = data.hour.slice(0, 5);
            delete data.hour;
            originalType = "hour";
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
          if (a.originalType === "hour" && b.originalType === "hour") {
            return a.timeUnit.localeCompare(b.timeUnit);
          }
          return 0;
        });

        // set cost to 2 decimal places
        newdata.forEach((data) => {
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
        setAggregateData(
          getConsumerConsumptionAggregateHourly,
          setNewDataAggregated
        );
        break;
      case GranularityButtonDays:
        setAggregateData(
          getConsumerConsumptionAggregateDaily,
          setNewDataAggregated
        );
        break;
      case GranularityButtonMonths:
        setAggregateData(
          getConsumerConsumptionAggregateMonthly,
          setNewDataAggregated
        );
        break;
      default:
        break;
    }
  };

  const handleDateRangeComparison = (ranges) => {
    ranges.startDate.setHours(0, 0, 0, 0);
    ranges.endDate.setHours(23, 59, 59, 999);
    setDateRangesComparison(ranges);
  };

  useEffect(() => {
    if (
      dateRangesComparison.length === 0 ||
      !dateRangesComparison.startDate ||
      !dateRangesComparison.endDate
    )
      return;

    const fetchData = async () => {
      try {
        let consumer_info = await getConsumerInfo(userEmail);
        let consumer_data;
        let cluster_data;

        if (defaultButtonNameComparison === GranularityButtonHourly) {
          consumer_data = await getConsumerConsumptionHourly(
            userEmail,
            dateRangesComparison.startDate,
            dateRangesComparison.endDate
          );
          cluster_data = await getClusterConsumptionHourly(
            consumer_info.cluster,
            dateRangesComparison.startDate,
            dateRangesComparison.endDate
          );
        } else if (defaultButtonNameComparison === GranularityButtonDaily) {
          consumer_data = await getConsumerConsumptionDaily(
            userEmail,
            dateRangesComparison.startDate,
            dateRangesComparison.endDate
          );
          cluster_data = await getClusterConsumptionDaily(
            consumer_info.cluster,
            dateRangesComparison.startDate,
            dateRangesComparison.endDate
          );
        } else if (defaultButtonNameComparison === GranularityButtonMonthly) {
          consumer_data = await getConsumerConsumptionMonthly(
            userEmail,
            dateRangesComparison.startDate,
            dateRangesComparison.endDate
          );
          cluster_data = await getClusterConsumptionMonthly(
            consumer_info.cluster,
            dateRangesComparison.startDate,
            dateRangesComparison.endDate
          );
        }

        consumer_data = consumer_data.map((data) => {
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

        cluster_data = cluster_data.map((data) => {
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

        const consumerformattedData = consumer_data.map((data) => ({
          timeUnit: new Date(data.timeUnit).toLocaleString(),
          consumption_kwh: Number(data.consumption_kwh).toFixed(2),
          cost_euro: Number(data.cost_euro).toFixed(2),
        }));

        const clusterformattedData = cluster_data.map((data) => ({
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
            cluster_consumption_kwh:
              clusterformattedData[index].consumption_kwh,
            cost_euro_sum: Number(
              clusterformattedData[index].cost_euro
            ).toFixed(2),
          };
        });

        // find the min consumption in consumer and cluster data and calculate the difference in percentage
        const minConsumerConsumption = Math.min(
          ...consumer_data.map((data) => data.consumption_kwh)
        );
        const minClusterConsumption = Math.min(
          ...cluster_data.map((data) => data.consumption_kwh)
        );
        const minConsumptionDifference =
          ((minConsumerConsumption - minClusterConsumption) /
            minClusterConsumption) *
          100;

        // find the mean consumption in consumer and cluster data and calculate the difference in percentage
        function calculateMeanConsumption(data) {
          const total = data.reduce(
            (acc, entry) => acc + parseFloat(entry.consumption_kwh),
            0
          );
          return total / data.length;
        }
        const meanConsumerConsumption = calculateMeanConsumption(consumer_data);
        const meanClusterConsumption = calculateMeanConsumption(cluster_data);
        const meanConsumptionDifference =
          ((meanConsumerConsumption - meanClusterConsumption) /
            meanClusterConsumption) *
          100;

        // find the max consumption in consumer and cluster data and calculate the difference in percentage
        const maxConsumerConsumption = Math.max(
          ...consumer_data.map((data) => data.consumption_kwh)
        );
        const maxClusterConsumption = Math.max(
          ...cluster_data.map((data) => data.consumption_kwh)
        );
        const maxConsumptionDifference =
          ((maxConsumerConsumption - maxClusterConsumption) /
            maxClusterConsumption) *
          100;

        setComparisonMetrics([
          {
            title: "Min consumption",
            description: (
              <span className="flex items-center justify-center gap-1">
                {minConsumptionDifference >= 0 ? (
                  <FiTrendingUp className="text-red-500" size={20} />
                ) : (
                  <FiTrendingDown className="text-green-500" size={20} />
                )}
                {Math.abs(minConsumptionDifference).toFixed(2)}% from similar consumers
              </span>
            ),
          },
          {
            title: "Mean consumption",
            description: (
              <span className="flex items-center justify-center gap-1">
                {meanConsumptionDifference >= 0 ? (
                  <FiTrendingUp className="text-red-500" size={20} />
                ) : (
                  <FiTrendingDown className="text-green-500" size={20} />
                )}
                {Math.abs(meanConsumptionDifference).toFixed(2)}% from similar consumers
              </span>
            ),
          },
          {
            title: "Max consumption",
            description: (
              <span className="flex items-center justify-center gap-1">
                {maxConsumptionDifference >= 0 ? (
                  <FiTrendingUp className="text-red-500" size={20} />
                ) : (
                  <FiTrendingDown className="text-green-500" size={20} />
                )}
                {Math.abs(maxConsumptionDifference).toFixed(2)}% from similar consumers
              </span>
            ),
          },
        ]);

        setNewDataComparison(combinedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [dateRangesComparison, defaultButtonNameComparison, userEmail]);
  console.log("default :", defaultComparisonMetrics);
  return (
    <AuthenticatedLayout>
      <div className='p-1 sm:ml-40 bg-gray-200 font-ubuntu'>
        <div className='p-2 border-2 border-gray-200 border-dashed rounded-lg'>
          <div className='grid grid-cols-1 justify-center items-center gap-4 mb-1 '>
            <SectionTitleDescription
              title={"Aggregated statistics"}
              description={
                "Below you can inspect the mean consumption for all the available recorded data. You can also choose different granularities from the selection below"
              }
            />
          </div>
        </div>
        <div className='grid grid-cols-1 gap-4 mb-4'>
          <GroupButtonsGranularity
            handleGranularityChange={switchGranularityAggregated}
            buttonNames={buttonGroup2}
            defaultButtonName={GranularityButtonHours}
          />
        </div>
        <div className='flex items-center m-2 justify-center rounded bg-gray-50 h-[calc(100vh-8rem)] rounded-b-lg pt-10'>
          <ResponsiveContainer width='100%' height='100%'>
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
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='timeUnit' />
              <YAxis yAxisId='left' orientation='left'>
                <Label
                  value='Mean Consumption (kwh)'
                  angle={-90}
                  position='insideLeft'
                />
              </YAxis>
              <YAxis yAxisId='right' orientation='right'>
                <Label
                  value='Mean Cost (€)'
                  angle={90}
                  position='insideRight'
                />
              </YAxis>
              <Tooltip
                formatter={(value, name) => [
                  value,
                  name === "consumption_kwh_sum"
                    ? "Mean Consumption (kwh)"
                    : name === "cost_euro"
                    ? "Mean Cost (€)"
                    : name,
                ]}
              />
              <Legend
                formatter={(value) => [
                  value === "consumption_kwh_sum"
                    ? "Mean Consumption (kwh)"
                    : value === "cost_euro"
                    ? "Mean Cost (€)"
                    : value,
                ]}
              />
              <Bar
                yAxisId='left'
                dataKey='consumption_kwh_sum'
                fill='#faa741'
                activeBar={<Rectangle fill='#fc8c03' stroke='black' />}
              />
              <Bar
                yAxisId='right'
                dataKey='cost_euro'
                fill='#d1d0cf'
                activeBar={<Rectangle fill='grey' stroke='black' />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='p-2 border-2 border-gray-200 border-dashed rounded-lg'>
          <div className='flex bg-gray-50 justify-center items-center gap-4 mb-4 rounded-lg border-b-2 border-orange-400'>
            <RangeDatePicker
              title={"Comparison with similar consumers"}
              description={
                "Below you can inspect a comparison of your consumption and cost with other similar consumers for the given date range"
              }
              handleRangeChange={handleDateRangeComparison}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 mb-4'>
          <GroupButtonsGranularity
            handleGranularityChange={switchGranularityComparison}
            buttonNames={buttonGroup1}
            defaultButtonName={defaultButtonNameComparison}
          />
        </div>

        <MetricsCard
          metrics={defaultComparisonMetrics}
          title={"Comparison Metrics"}
          description='Comparison metrics for the given date range compared to similar consumers'
        />

        <div className='flex items-center m-2 justify-center rounded bg-gray-50 h-[calc(100vh-8rem)] rounded-b-lg'>
          <ResponsiveContainer width='100%' height='100%' className='pt-8'>
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
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='timeUnit' height={40} />
              <YAxis>
                <Label
                  value='Consumption (kwh)'
                  angle={-90}
                  position='insideLeft'
                />
              </YAxis>
              <Tooltip
                formatter={(value, name) => [
                  value,
                  name === "consumption_kwh"
                    ? "Consumption (kwh)"
                    : name === "cluster_consumption_kwh"
                    ? "Similar Consumers Consumption (kwh)"
                    : name,
                ]}
              />
              <Legend
                formatter={(value) => [
                  value === "consumption_kwh"
                    ? "Consumption (kwh)"
                    : value === "cluster_consumption_kwh"
                    ? "Similar Consumers Consumption (kwh)"
                    : value,
                ]}
              />
              <Line
                dataKey='cluster_consumption_kwh'
                stroke='#808080'
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                dataKey='consumption_kwh'
                stroke='#FFA500'
                className='pt-10'
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
