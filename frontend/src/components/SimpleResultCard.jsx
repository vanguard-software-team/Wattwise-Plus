import PropTypes from "prop-types";
import WeeklyBarchart from "./WeeklyBarchart.jsx";

function SimpleResultCard({ title, result, difference, chartData, activeIndex, metric }) {
	return (
		<div className="grid lg:grid-cols-2 pt-10 h-36 bg-gray-50 border-orange-400 border-b-2 rounded-lg  hover:bg-gray-100">
			<div>
				<h5 className=" mb-2 font-bold lg:text-xl tracking-tight text-gray-900 text-center">
					{title}
				</h5>
				<p className="font-normal lg:text-xl text-gray-700 text-center ">
					{result}
				</p>
				<p className="text-sm text-gray-500 text-center ">{difference}</p>
			</div>
			
			<div className="flex font-normal lg:text-xl text-gray-700 lg:visible invisible">
				<WeeklyBarchart data={chartData} initialActiveIndex={activeIndex} metric={metric}/>
			</div>
		</div>
	);
}

SimpleResultCard.propTypes = {
	title: PropTypes.string.isRequired,
	result: PropTypes.string.isRequired,
	difference: PropTypes.string.isRequired,
	chartData: PropTypes.array.isRequired,
	metric: PropTypes.string,
	activeIndex: PropTypes.number,
};
export default SimpleResultCard;
