import {Link} from "react-router-dom";
import PropTypes from "prop-types";

function SideNavbarSingleTab({link_to, svg_icon, tab_name}) {
    return (
        <li>
            <Link to={link_to}
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
                {svg_icon}
                <span className="ms-3">{tab_name}</span>
            </Link>
        </li>
    );
}

SideNavbarSingleTab.propTypes = {
    link_to: PropTypes.string.isRequired,
    svg_icon: PropTypes.element.isRequired,
    tab_name: PropTypes.string.isRequired
};

export default SideNavbarSingleTab