import SideNavbarSingleTab from "./SideNavbarSingleTab.jsx";
import PropTypes from "prop-types";
import { logout } from "../service/api.jsx";
import {
  ChartNoAxesCombined,
  FileSearch,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  UserRoundPen,
} from "lucide-react";

function SideNavbarTabs({ activeTab }) {
  return (
    <ul className='space-y-2 font-medium pt-6'>
      <SideNavbarSingleTab
        tab_name={"Overview"}
        link_to={"/overview"}
        svg_icon={<LayoutDashboard className='text-gray-500 h-5 w-5' />}
        isActive={activeTab === "overview"}
      />
      <SideNavbarSingleTab
        tab_name={"Insights"}
        link_to={"/insights"}
        svg_icon={<FileSearch className='text-gray-500 h-5 w-5' />}
        isActive={activeTab === "insights"}
      />
      <SideNavbarSingleTab
        tab_name={"Forecasting"}
        link_to={"/forecasting"}
        svg_icon={<ChartNoAxesCombined className='text-gray-500 h-5 w-5' />}
        isActive={activeTab === "forecasting"}
      />

      <SideNavbarSingleTab
        tab_name={"Talk to Dias"}
        link_to={"/chat"}
        svg_icon={<MessageCircle className='text-gray-500 h-5 w-5' />}
        isActive={activeTab === "chat"}
      />
      <SideNavbarSingleTab
        tab_name={"Profile"}
        link_to={"/profile"}
        svg_icon={<UserRoundPen className='text-gray-500 h-5 w-5' />}
        isActive={activeTab === "profile"}
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

SideNavbarTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

export default SideNavbarTabs;
