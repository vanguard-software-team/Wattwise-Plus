import { useState } from "react";
import WattwiseLogo from "../../assets/images/logos/small-logo-no-background.svg";
import SideNavbarTabs from "../../components/SideNavbarTabs.jsx";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

function AuthenticatedLayout(props) {
  const navbarClass =
    "font-ubuntu fixed top-0 left-0 z-40 w-10 w-40 h-screen transition-transform";
  const location = useLocation().pathname.replace("/", "");
  const [navbarOpener, openNavbar] = useState(false);
  const today = new Date(import.meta.env.VITE_TODAY_DATETIME);

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
        data-drawer-target='default-sidebar'
        data-drawer-toggle='default-sidebar'
        onClick={triggerOpenNavbar}
        aria-controls='default-sidebar'
        type='button'
        className=' inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200'
      >
        <span className='sr-only'>Open sidebar</span>
        <Menu className='w-6 h-6' aria-hidden='true' />
      </button>

      <aside
        id='default-sidebar'
        className={
          navbarOpener
            ? navbarClass + " sm:translate-x-0 transform-none"
            : navbarClass + " -translate-x-full sm:translate-x-0"
        }
        aria-label='Sidebar'
      >
        <div className='h-full px-3 py-4 overflow-y-auto bg-gray-100'>
          <Link to={"/overview"}>
            <img
              src={WattwiseLogo}
              className=' h-16 mx-auto'
              alt='Wattwise logo'
            ></img>
          </Link>
          <SideNavbarTabs activeTab={location} />
        </div>
      </aside>

      <div onClick={triggerOpenNavbarBody}>{props.children}</div>
    </>
  );
}

export default AuthenticatedLayout;

AuthenticatedLayout.propTypes = {
  children: PropTypes.node,
};
