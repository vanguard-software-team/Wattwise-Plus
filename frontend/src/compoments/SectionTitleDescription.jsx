import PropTypes from "prop-types";

function SectionTitleDescription({ title, description }) {
	return (
		<div className="bg-gray-50 rounded-lg border-b-2 border-orange-400">
			<div className="block p-10 h-240">
				<h5 className="mb-2 font-bold text-xl tracking-tight text-gray-900 text-center">
					{title}
				</h5>
				<p className="text-sm text-gray-700 text-center">{description}</p>
			</div>
		</div>
	);
}

SectionTitleDescription.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
};
export default SectionTitleDescription;
