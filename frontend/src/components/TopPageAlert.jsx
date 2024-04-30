import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

function TopPageAlert({ alert_title, alert_message, href_to }) {
	return (
		<div className="hover:underline">
			<div
				className="p-4 text-sm text-yellow-800 bg-orange-50 font-cairo"
				role="alert"
			>
				<span className="font-bold">{alert_title}</span>
				{alert_message}
			</div>
		</div>
	);
}

TopPageAlert.propTypes = {
	alert_message: PropTypes.string.isRequired,
	alert_title: PropTypes.string.isRequired,
	href_to: PropTypes.string,
};
export default TopPageAlert;
