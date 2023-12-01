import AuthenticatedLayout from "./AuthenticatedLayout.jsx";
import RangeDatePicker from "./compoments/RangeDatePicker.jsx";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
    ResponsiveContainer, Label
} from 'recharts';

function Insights() {

    const data = [
        {
            name: 'Page A',
            uv: 20,
            pv: 200,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 10,
            pv: 100,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 30,
            pv: 300,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 50,
            pv: 500,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 10,
            pv: 100,
            amt: 2181,
        },
    ];
    const handleDateRange = (ranges) => {
        console.log(ranges)
    }
    return (
        <AuthenticatedLayout>
            <div className="p-1 sm:ml-52 bg-gray-200">
                <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
                    <div className="grid grid-cols-1 justify-center items-center gap-4 mb-1 ">
                        <RangeDatePicker title={"Peak Consumption & Cost"}
                                         description={"Select a date range to inspect the peak consumption and the cost within the range"}
                                         handleRangeChange={handleDateRange}
                        />
                    </div>
                </div>

                <div className="flex items-center m-2 justify-center rounded bg-gray-50 h-[calc(100vh-15rem)] rounded-b-lg">
                    <ResponsiveContainer width="100%" height="100%" className="font-play pt-8">
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
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name" name="Your X-Axis Name">
                                {/*<Label value="Your X-Axis Name" position="insideBottom"  />*/}
                            </XAxis>
                            <YAxis yAxisId="left">
                                <Label value="Consumption (kwh)" angle={-90} position="insideLeft"/>
                            </YAxis>
                            <YAxis yAxisId="right" orientation="right">
                                <Label value="Cost (€)" angle={90} position="insideRight"/>
                            </YAxis>
                            <Tooltip/>
                            <Legend/>
                            <ReferenceLine y={500} yAxisId="left" stroke="red">
                                <Label
                                    value="Peak Consumption"
                                    position="insideLeft"
                                    dy={-10} // Adjust the dy value to position the label as needed
                                    fill="red"
                                />
                            </ReferenceLine>
                            <ReferenceLine y={50} yAxisId="right" stroke="red">
                                <Label
                                    value="Peak Cost"
                                    position="insideRight"
                                    dy={-10} // Adjust the dy value to position the label as needed
                                    fill="red"
                                />
                            </ReferenceLine>


                            <Line yAxisId="left" type="monotone" dataKey="pv" stroke="#8884d8" className="pt-10"
                                  activeDot={{r: 8}}/>
                            <Line yAxisId="right" type="monotone" dataKey="uv" stroke="#82ca9d"/>
                        </LineChart>
                    </ResponsiveContainer>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Insights