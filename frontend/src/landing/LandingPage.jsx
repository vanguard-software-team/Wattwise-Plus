import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Link } from "react-router-dom";
import WattwiseLogo from "../assets/images/logos/logo-no-background.svg";
import InfoCardLandingPage from "../components/infoCardLandingPage.jsx";
import { VscGraphLine } from "react-icons/vsc";
import { MdOutlineGroup } from "react-icons/md";
import { PiWarningDuotone } from "react-icons/pi";
import { BsLightningChargeFill } from "react-icons/bs";
import { MdAutoGraph } from "react-icons/md";


function LandingPage() {
	return (
		<div className="flex flex-col min-h-screen bg-slate-100 ">
			<Navbar />
			<section className="bg-gradient-to-b from-slate-100 to-orange-200 lg:pt-10 md:pt-28 font-cairo h-screen">
				<div className=" py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6 rounded-xl lg:outline-4">
					<div className="lg:grid lg:grid-cols-2 pt-0">
						<div className=" max-w-screen-md">
							<h2 className="mb-4 text-5xl lg:pt-16 tracking-tight font-cairo text-gray-900  lg:visible">
								Energy consumption visualization & forecasting
							</h2>


							<p className="mb-8 font- text-gray-700 text-3xl">
								An intuitive tool enabling{" "}
								<a className="text-orange-400">consumers</a> to visualize and
								forecast energy consumption while empowering{" "}
								<a className="text-orange-400">providers</a> to monitor consumer
								metrics for efficient management.
							</p>

							<div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 ">
								<Link to="/login">
									<button
										type="button"
										className="text-black font-cairo font-bold bg-orange-400 hover:bg-gray-600 focus:ring-orange-400 focus:ring-2 hover:text-white focus:outline-none px-8 py-2 text-center"
									>
										Plug in
									</button>
								</Link>
							</div>
						</div>
						<div className="flex justify-center invisible lg:visible ">
							<img
								className="pt-16 h-90"
								src={WattwiseLogo}
								alt="Wattwise Logo"
							></img>
						</div>
					</div>
				</div>
			</section>
			<section className="bg-orange-200 min-h-screen">
				<div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 rounded-xl">
					<div className="lg:grid lg:grid-cols-2 lg:gap-8">
						<div className="max-w-lg lg:max-w-none">
							<h2 className="text-4xl sm:text-4xl lg:text-5xl font-cairo font-semibold tracking-tight text-gray-900 mb-4 lg:mb-0">
								I am a Consumer
							</h2>
						</div>
					</div>
					<div className="mt-12 grid gap-6 md:grid-cols-1 lg:grid-cols-3 lg:mt-40">
						<InfoCardLandingPage
							title="Visualize Consumption and Cost"
							description="View your energy consumption and cost in a user-friendly interface to make informed decisions. Choosing between differennt granularities, you can view your consumption on a hourly, daily, or monthly. There is also aggregation insights for your consumption and cost over time."
							Icon={VscGraphLine}
						/>
						<InfoCardLandingPage
							title="Forecast Consumption and Cost"
							description="Forecast your energy consumption and cost based on your historical data. Using machine or deep learning models, we provide you with a forecast of your future consumption and cost. You can also inspect machine learning model performance metrics in order to evaluate the model's performance."
							Icon={MdAutoGraph}

						/>
						<InfoCardLandingPage
							title="Compare with Similar Consumers"
							description="Compare your consumption and cost with similar consumers. By using clustering algorithms, we group you with similar consumers based on your personal information and provide you with insights on how you compare with them."
							Icon={MdOutlineGroup}

						/>

					</div>
				</div>
			</section>

			<section className="bg-gradient-to-b from-orange-200 to-slate-100 min-h-screen">
				<div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 rounded-xl">
					<div className="lg:grid lg:grid-cols-2 lg:gap-8">
						<div className="max-w-lg lg:max-w-none">
							<h2 className="text-4xl sm:text-4xl lg:text-5xl font-cairo font-semibold tracking-tight text-gray-900 mb-4 lg:mb-0">
								I am a Provider
							</h2>
						</div>
					</div>
					<div className="mt-12 grid gap-6 sm:grid-cols-1 lg:grid-cols-3 lg:mt-40">
						<InfoCardLandingPage
							title="Visualize Consumption and Cost "
							description="View your consumers' energy consumption and cost in a user-friendly interface to make informed decisions. Choosing between differennt granularities, you can view your consumers' consumption on a hourly, daily, or monthly basis. There is also aggregation insights for your consumers' consumption and cost over time."
							Icon={VscGraphLine}
						/>
						<InfoCardLandingPage
							title="Outlier Detection"
							description="Detect outliers in your consumers' consumption. By using anomaly detection algorithms, we provide you with insights on which consumers have unusual consumption and cost based on similar consumers. Using this information, you can investigate the reasons behind the outliers and take necessary actions."
							Icon={PiWarningDuotone}

						/>
						<InfoCardLandingPage
							title="Managment of KWH Prices"
							description="Manage your KWH prices for your consumers. You can set your KWH prices for each month of the year and view the impact of these prices on your consumers' consumption and cost. You can also inspect the impact of your KWH prices on your consumers' consumption and cost over time."
							Icon={BsLightningChargeFill}

						/>

					</div>
				</div>
			</section>
			<div className="">
			< Footer />
			</div>
			
		</div>
	);
}

export default LandingPage;
