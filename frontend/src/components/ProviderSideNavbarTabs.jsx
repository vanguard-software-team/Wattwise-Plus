import SideNavbarSingleTab from "./SideNavbarSingleTab.jsx";
import PropTypes from "prop-types";
import { logout } from "../service/api.jsx";
import {
  FileSearch,
  LayoutDashboard,
  LogOut,
  OctagonAlert,
  UserRoundPen,
} from "lucide-react";

function ProviderSideNavbarTabs({ activeTab }) {
  return (
    <ul className='space-y-2 font-medium pt-6'>
      <SideNavbarSingleTab
        tab_name={"Overview"}
        link_to={"/provider/overview"}
        svg_icon={<LayoutDashboard className='text-gray-500 h-5 w-5' />}
        isActive={activeTab === "provider/overview"}
      />
      <SideNavbarSingleTab
        tab_name={"Insights"}
        link_to={"/provider/insights"}
        svg_icon={<FileSearch className='text-gray-500 h-5 w-5' />}
        isActive={activeTab === "provider/insights"}
      />
      <SideNavbarSingleTab
        tab_name={"Outliers"}
        link_to={"/provider/outlier-detection"}
        svg_icon={<OctagonAlert className='text-gray-500 h-5 w-5' />}
        isActive={activeTab === "provider/outlier-detection"}
      />
      <SideNavbarSingleTab
        tab_name={"Profile"}
        link_to={"/provider/profile"}
        svg_icon={<UserRoundPen className='text-gray-500 h-5 w-5' />}
        isActive={activeTab === "provider/profile"}
      />
      <SideNavbarSingleTab
        tab_name={"Sign out"}
        svg_icon={<LogOut className='text-gray-500 h-5 w-5' />}
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
