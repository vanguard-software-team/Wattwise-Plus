import AuthenticatedLayout from "../AuthenticatedLayout";
import { useState } from "react";
import SectionTitleDescription from "../../compoments/SectionTitleDescription.jsx";
import ForecastingGroupButtons from "../../compoments/ForecastingGroupButtons.jsx";

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
const ForecastingButtonThreeMonthly = "Three-Monthly";
const forecastingButtonGroup = [
    ForecastingButtonHourly,
    ForecastingButtonWeekly,
    ForecastingButtonMonthly,
    ForecastingButtonThreeMonthly
];

function Forecasting() {
    const [forecastingData, setForecastingData] = useState("");
    const [selectedGranularity, setSelectedGranularity] = useState(GranularityButtonHours);
    const [selectedForecasting, setSelectedForecasting] = useState(ForecastingButtonHourly);

    const handleForecastingHorizonChange = (forecastingButton) => {
        setSelectedForecasting(forecastingButton);
        // switch (forecastingButton) {
        //     case ForecastingButtonHourly:
        //         setSelectedGranularity(GranularityButtonHours);
        //         break;
        //     case ForecastingButtonWeekly:
        //         setSelectedGranularity(GranularityButtonDays);
        //         break;
        //     case ForecastingButtonMonthly:
        //     case ForecastingButtonThreeMonthly:
        //         setSelectedGranularity(GranularityButtonWeeks);
        //         break;
        //     default:
        //         break;
        // }
        setForecastingData("");
    };

    const handleGranularityChange = (granularityButton) => {
        setSelectedGranularity(granularityButton);
        setForecastingData("");
    };

    return (
        <AuthenticatedLayout>
            <div className="p-1 sm:ml-40 bg-gray-200 font-robotoflex">
                <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
                    <div className="grid grid-cols-1 justify-center items-center gap-4 mb-1 ">
                        <SectionTitleDescription title={"Forecasting"} description={""} />
                    </div>
                </div>
                <div className="flex justify-end gap-4 mb-4">
                    <ForecastingGroupButtons
                        handleGranularityChange={handleGranularityChange}
                        handleForecastingHorizonChange={handleForecastingHorizonChange}
                        buttonNames={granularityButtonGroup}
                        buttonForecastingHorizon={forecastingButtonGroup}
                        defaultButtonName={selectedGranularity}
                        defaultForecastingHorizon={selectedForecasting}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Forecasting;
