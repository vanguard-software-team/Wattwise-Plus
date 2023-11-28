import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label} from 'recharts';
import SimpleResultCard from "./compoments/SimpleResultCard.jsx";
import AuthenticatedLayout from "./AuthenticatedLayout.jsx";
import RangeDatePicker from "./compoments/RangeDatePicker.jsx";
import GroupButtonsGranularity from "./compoments/GroupButtonsGranularity.jsx";
import {useState} from 'react';


const data1 = [
    {
        name: 'Page A',
        uv: 500,
        pv: 400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 30,
        pv: 228,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 50,
        pv: 128,
        amt: 2210,
    },
];


const data2 = [
    {
        name: 'Page A',
        uv: 1000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 2000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 250,
        pv: 428,
        amt: 4210,
    },
];

const data3 = [
    {
        name: 'Page A',
        uv: 0,
        pv: 5400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 1000,
        pv: 2398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 1050,
        pv: 828,
        amt: 1410,
    },
];

const data4 = [
    {
        name: 'Page A',
        uv: 100,
        pv: 200,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 1000,
        pv: 2398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 570,
        pv: 928,
        amt: 3210,
    },
];


function Dashboard() {
    const [data, setNewData] = useState(data1);
    const switchGranularity = (buttonName) => {
        switch (buttonName) {
            case 'Hourly':
                setNewData(data1);
                break;
            case 'Daily':
                setNewData(data2);
                break;
            case 'Weekly':
                setNewData(data3);
                break;
            case 'Monthly':
                setNewData(data4)
                break
            default:
                break;
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="p-1 sm:ml-52 bg-gray-200">
                <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4 font-play">
                        <SimpleResultCard title={"Today's consumption"} result={"20kwh"}/>
                        <SimpleResultCard title={"Today's cost"} result={"2€"}/>
                        <SimpleResultCard title={"Month's consumption"} result={"200kwh"}/>
                        <SimpleResultCard title={"Month's cost"} result={"20€"}/>
                    </div>


                    <div className="grid grid-cols-1 justify-center items-center gap-4 mb-4 ">
                        <RangeDatePicker title={"Consumption"}
                                         description={"Select a date range to inspect the consumption within the range"}/>
                    </div>
                    <div className="grid grid-cols-1 gap-4 mb-4 font-play">
                        <GroupButtonsGranularity
                            handleGranularityChange={switchGranularity}
                            buttonName1={"Hourly"}
                            buttonName2={"Daily"}
                            buttonName3={"Weekly"}
                            buttonName4={"Monthly"}
                        />

                    </div>


                    <div className="grid grid-cols-1 gap-4 mb-4 ">
                        <div
                            className="flex items-center justify-center rounded bg-gray-50 h-[calc(100vh-15rem)]  rounded-b-lg">

                            <ResponsiveContainer width="100%" height="100%" className="font-play pt-8">
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
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name" name="Your X-Axis Name" >
                                        {/*<Label value="Your X-Axis Name" position="insideBottom"  />*/}
                                    </XAxis>
                                    <YAxis yAxisId="left">
                                        <Label value="Consumption (kwh)" angle={-90} position="insideLeft" />
                                    </YAxis>
                                    <YAxis yAxisId="right" orientation="right">
                                        <Label value="Cost (€)" angle={90} position="insideRight" />
                                    </YAxis>
                                    <Tooltip/>
                                    <Legend/>
                                    <Line yAxisId="left" type="monotone" dataKey="pv" stroke="#8884d8" className="pt-10"
                                          activeDot={{r: 8}} />
                                    <Line yAxisId="right" type="monotone" dataKey="uv" stroke="#82ca9d"/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                            <p className="text-2xl text-gray-400 dark:text-gray-500">
                                Sample text
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Dashboard