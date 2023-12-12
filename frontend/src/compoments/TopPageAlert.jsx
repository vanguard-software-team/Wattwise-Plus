import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function TopPageAlert({ alert_title, alert_message, href_to }) {
	return (
		<Link to={href_to} className="hover:underline">
			<div
				className="p-4 text-sm text-yellow-800 bg-orange-50 font-play"
				role="alert"
			>
				<span className="font-bold">{alert_title}</span>
				{alert_message}
			</div>
		</Link>
	);
}

TopPageAlert.propTypes = {
	alert_message: PropTypes.string.isRequired,
	alert_title: PropTypes.string.isRequired,
	href_to: PropTypes.string.isRequired,
};
export default TopPageAlert;
