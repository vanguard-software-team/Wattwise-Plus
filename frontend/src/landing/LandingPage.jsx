import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Link } from "react-router-dom";
import WattwiseLogo from "../assets/images/logos/logo-no-background.svg";
import { login } from "../service/api.jsx";

function LandingPage() {
	return (
		<>
			<Navbar />
			<section className="bg-gradient-to-b from-slate-100 to-orange-300 lg:pt-10 md:pt-28 font-cairo h-screen">
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
						<div className="flex justify-center invisible lg:visible pb-10">
							<img
								className="pt-16 h-90"
								src={WattwiseLogo}
								alt="Wattwise Logo"
							></img>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</>
	);
}

export default LandingPage;
