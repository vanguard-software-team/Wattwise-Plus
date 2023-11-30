import AuthenticatedLayout from "./AuthenticatedLayout.jsx";
import RangeDatePicker from "./compoments/RangeDatePicker.jsx";

function Insights() {
    const handleDateRange = (ranges) => {
        console.log(ranges)
    }
    return (
        <AuthenticatedLayout>
            <div className="p-1 sm:ml-52 bg-gray-200">
                <div className="p-2 border-2 border-gray-200 border-dashed rounded-lg">
                    <div className="grid grid-cols-1 justify-center items-center gap-4 mb-4 ">
                        <RangeDatePicker title={"Peak Consumption & Cost"}
                                         description={"Select a date range to inspect the peak consumption and the cost within the range"}
                                         handleRangeChange={handleDateRange}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Insights