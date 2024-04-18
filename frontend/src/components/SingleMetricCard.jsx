import PropTypes from "prop-types";

function SingleMetricCard({ title, description, metric }) {
	return (
		<div className="bg-gray-50 rounded-lg border-b-2 border-orange-400">
			<div className="block p-10 h-240">
				<h5 className="mb-2 font-bold text-xl tracking-tight text-gray-900 text-center">
					{title}
				</h5>
                
                <p className="font-normal text-sm text-gray-500 text-center">{description}</p>
				<p className=" pt-2 font-bold text-xl text-gray-500 text-center">{metric}</p>
			</div>
		</div>
	);
}

SingleMetricCard.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
    metric: PropTypes.string.isRequired,
};
export default SingleMetricCard;
