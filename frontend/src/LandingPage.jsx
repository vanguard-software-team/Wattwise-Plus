'use client';
import Navbar from "./compoments/Navbar.jsx";
import Footer from "./compoments/Footer.jsx";
import {Link} from "react-router-dom";

function LandingPage() {
    return (
        <>
            <Navbar/>
            <section className="lg:pt-28 font-play">
                <div
                    className="lg:bg-gray-200 lg:bg-opacity-50 py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6 rounded-xl lg:outline-dotted lg:outline-4">
                    <div className=" max-w-screen-md">
                        <h2 className="mb-4 text-6xl tracking-tight font-extrabold text-gray-900 dark:text-white">Brightening energy horizons.</h2>
                        <p className="mb-8 font-bold text-gray-700 sm:text-xl">
                            Welcome to our innovative energy visualization and forecasting tool, where we illuminate the
                            path to a sustainable future. At Wattwise, we're dedicated to brightening energy
                            horizons by providing comprehensive visual insights and accurate forecasts. Explore our
                            platform to visualize energy trends, forecast consumption, and optimize your energy
                            strategies. Empower your decisions and embrace a brighter, more efficient energy landscape
                            with our cutting-edge tools and expertise.
                        </p>
                        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                            <a href="#">
                                <Link to="/login">
                                    <button type="button"
                                            className="text-black font-play font-bold bg-orange-400 hover:bg-gray-600 hover:text-white focus:outline-none px-4 py-2 text-center">Plug in
                                    </button>
                                </Link>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </>

    );
}

export default LandingPage