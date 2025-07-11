import PropTypes from "prop-types";

function SectionWithTitle({ title, description, children }) {
	return (
		<div className="bg-gray-50 rounded-lg ">
			<div className="block p-10 h-240">
				<h5 className="mb-2 font-bold text-2xl tracking-tight text-gray-900 text-center">
					{title}
				</h5>
				<p className="text-sm text-gray-700 text-center">{description}</p>
				{children}
			</div>
		</div>
	);
}

SectionWithTitle.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	children: PropTypes.node,
};
export default SectionWithTitle;
