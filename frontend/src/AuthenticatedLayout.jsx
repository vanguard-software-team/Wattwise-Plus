import { useState } from "react";
import WattwiseLogo from "./assets/images/logos/small-logo-no-background.svg";
import SideNavbarTabs from "./compoments/SideNavbarTabs.jsx";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import TopPageAlert from "./compoments/TopPageAlert.jsx";
import { useLocation } from "react-router-dom";

function AuthenticatedLayout(props) {
	const navbarClass =
		"font-robotoflex fixed top-0 left-0 z-40 w-10 w-40 h-screen transition-transform";
	const location = useLocation().pathname.replace("/", "");
	const [navbarOpener, openNavbar] = useState(false);

	function triggerOpenNavbar() {
		openNavbar(!navbarOpener);
	}

	function triggerOpenNavbarBody() {
		if (navbarOpener === true) {
			openNavbar(!navbarOpener);
		}
	}

	return (
		<>
			<button
				data-drawer-target="default-sidebar"
				data-drawer-toggle="default-sidebar"
				onClick={triggerOpenNavbar}
				aria-controls="default-sidebar"
				type="button"
				className=" inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
			>
				<span className="sr-only">Open sidebar</span>
				<svg
					className="w-6 h-6"
					aria-hidden="true"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						clipRule="evenodd"
						fillRule="evenodd"
						d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
					></path>
				</svg>
			</button>

			<aside
				id="default-sidebar"
				className={
					navbarOpener
						? navbarClass + " sm:translate-x-0 transform-none"
						: navbarClass + " -translate-x-full sm:translate-x-0"
				}
				aria-label="Sidebar"
			>
				<div className="h-full px-3 py-4 overflow-y-auto bg-gray-100">
					<Link to={"/dashboard"}>
						<img
							src={WattwiseLogo}
							className=" h-16 mx-auto"
							alt="Wattwise logo"
						></img>
					</Link>
					<SideNavbarTabs activeTab={location} />
				</div>
			</aside>

			<div className="text-center sm:ml-40">
				<TopPageAlert
					alert_title="Unlock better Insights: "
					alert_message="Share more details in your Profile to unlock deeper, personalized insights!"
					href_to="/profile"
				/>
			</div>

			<div onClick={triggerOpenNavbarBody}>{props.children}</div>
		</>
	);
}

export default AuthenticatedLayout;

AuthenticatedLayout.propTypes = {
	children: PropTypes.node,
};
