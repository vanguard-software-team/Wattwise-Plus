import {useState} from "react";
import {Link} from "react-router-dom";
import WattwiseLogo from '/src/assets/images/logos/small-logo-no-background.svg';

function Navbar() {
    const navbarClass = 'items-center justify-between w-full md:flex md:w-auto md:order-1'
    const [navbarOpener,openNavbar] = useState(false)
    function triggerOpenNavbar(){openNavbar(!navbarOpener)}
    return (
        <nav className="bg-gray-100 font-play w-full z-20 top-0 start-0  ">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 rounded-b-xl">
                <Link className="flex items-center space-x-3 rtl:space-x-reverse" to="/"><img src={WattwiseLogo} className="h-20" alt="Wattwise Logo"></img></Link>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <Link to="/login"><button type="button"
                            className="text-black font-play font-bold bg-orange-400 hover:bg-gray-600 hover:text-white focus:ring-orange-400 focus:ring-2  text-sm px-8 py-2 text-center">Plug in
                    </button></Link>
                    <button data-collapse-toggle="navbar-sticky" type="button" onClick={triggerOpenNavbar}
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            aria-controls="navbar-sticky" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M1 1h15M1 7h15M1 13h15"/>
                        </svg>
                    </button>
                </div>
                <div className={navbarOpener ? navbarClass : navbarClass + ' hidden'}
                     id="navbar-sticky">
                    <ul className="flex flex-col font-bold text-lg font-play p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-100 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
                        <li>
                            <Link to="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-orange-500 md:p-0 sm:hover:bg-amber-500">Home</Link>
                        </li>
                        <li>
                            <Link to="/"
                               className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-orange-500 md:p-0">I am a consumer</Link>
                        </li>
                        <li>
                            <Link to="/"
                               className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-orange-500 md:p-0">I am a provider</Link>
                        </li>
                        <li>
                            <Link to="/"
                               className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent hover:text-orange-500 md:p-0">About</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar