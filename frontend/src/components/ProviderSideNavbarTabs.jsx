import SideNavbarSingleTab from "./SideNavbarSingleTab.jsx";
import PropTypes from "prop-types";
import { logout } from "../service/api.jsx";

const dashboardSVG = (
	<svg
		className="w-5 h-5 text-gray-500 group-hover:text-gray-900"
		aria-hidden="true"
		fill="currentColor"
		viewBox="0 0 20 20"
	>
		<path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
	</svg>
);

const insightsSVG = (
	<svg
		className="w-5 h-5 text-gray-500 group-hover:text-gray-900"
		aria-hidden="true"
		fill="currentColor"
		viewBox="0 0 20 20"
	>
		<path d="M8 15.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm11.707 2.793-4-4a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414-1.414Z" />
	</svg>
);

const profileSVG = (
	<svg
		className="w-5 h-5 text-gray-500 group-hover:text-gray-900"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 14 18"
	>
		<path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
	</svg>
);

const outlierSVG = (
	<svg
		className="w-5 h-5 text-gray-500 dark:text-white"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 20 20"
	>
		<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
	</svg>
);

const logoutSVG = (
	<svg
		className="w-5 h-5 text-gray-500 group-hover:text-gray-900"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 18 15"
	>
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M1 7.5h11m0 0L8 3.786M12 7.5l-4 3.714M12 1h3c.53 0 1.04.196 1.414.544.375.348.586.82.586 1.313v9.286c0 .492-.21.965-.586 1.313A2.081 2.081 0 0 1 15 14h-3"
		/>
	</svg>
);

function ProviderSideNavbarTabs({ activeTab }) {
	return (
		<ul className="space-y-2 font-medium pt-6">
			<SideNavbarSingleTab
				tab_name={"Dashboard"}
				link_to={"/provider/dashboard"}
				svg_icon={dashboardSVG}
				isActive={activeTab === "provider/dashboard"}
			/>
			<SideNavbarSingleTab
				tab_name={"Insights"}
				link_to={"/provider/insights"}
				svg_icon={insightsSVG}
				isActive={activeTab === "provider/insights"}
			/>
			<SideNavbarSingleTab
				tab_name={"Outliers"}
				link_to={"/provider/outlier-detection"}
				svg_icon={outlierSVG}
				isActive={activeTab === "provider/outlier-detection"}
			/>
			<SideNavbarSingleTab
				tab_name={"Profile"}
				link_to={"/provider/profile"}
				svg_icon={profileSVG}
				isActive={activeTab === "provider/profile"}
			/>
			<SideNavbarSingleTab
				tab_name={"Sign out"}
				svg_icon={logoutSVG}
				onClick={() => {
					logout();
				}}
				isActive={activeTab === "logout"}
			/>
		</ul>
	);
}

ProviderSideNavbarTabs.propTypes = {
	activeTab: PropTypes.string.isRequired,
};

export default ProviderSideNavbarTabs;
