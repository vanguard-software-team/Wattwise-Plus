import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import SimpleResultCard from "./compoments/SimpleResultCard.jsx";
import AuthenticatedLayout from "./AuthenticatedLayout.jsx";
import RangeDatePicker from "./compoments/RangeDatePicker.jsx";

const data2 = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        amt: 2100,
    },
];


function Dashboard() {
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

                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <RangeDatePicker/>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div className="flex items-center justify-center rounded bg-gray-50 h-96 dark:bg-gray-800">
                            <ResponsiveContainer width="100%" height="100%" className="font-play pt-5">
                                <LineChart
                                    width={500}
                                    height={300}
                                    data={data2}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
                                    <Line type="monotone" dataKey="uv" stroke="#82ca9d"/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                            <p className="text-2xl text-gray-400 dark:text-gray-500">
                                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="M9 1v16M1 9h16"/>
                                </svg>
                            </p>
                        </div>
                        <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                            <p className="text-2xl text-gray-400 dark:text-gray-500">
                                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="M9 1v16M1 9h16"/>
                                </svg>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
                        <p className="text-2xl text-gray-400 dark:text-gray-500">
                            <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                 fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M9 1v16M1 9h16"/>
                            </svg>
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                            <p className="text-2xl text-gray-400 dark:text-gray-500">
                                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="M9 1v16M1 9h16"/>
                                </svg>
                            </p>
                        </div>
                        <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                            <p className="text-2xl text-gray-400 dark:text-gray-500">
                                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="M9 1v16M1 9h16"/>
                                </svg>
                            </p>
                        </div>
                        <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                            <p className="text-2xl text-gray-400 dark:text-gray-500">
                                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="M9 1v16M1 9h16"/>
                                </svg>
                            </p>
                        </div>
                        <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                            <p className="text-2xl text-gray-400 dark:text-gray-500">
                                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="M9 1v16M1 9h16"/>
                                </svg>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Dashboard