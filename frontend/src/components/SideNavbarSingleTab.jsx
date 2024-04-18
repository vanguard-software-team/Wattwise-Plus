import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function SideNavbarSingleTab({ link_to, svg_icon, tab_name, isActive, onClick }) {
    const activeClassName = isActive ? "bg-orange-300" : "hover:bg-gray-200";
    
    const handleClick = (event) => {
        if (onClick) {
            event.preventDefault(); // Prevent default link behavior
            onClick(); // Execute the provided onClick function
        }
    };

    return (
        <li>
            <Link
                to={link_to}
                onClick={handleClick}
                className={`flex items-center p-2 text-gray-900 rounded group ${activeClassName}`}
            >
                {svg_icon}
                <span className="ms-3">{tab_name}</span>
            </Link>
        </li>
    );
}

SideNavbarSingleTab.propTypes = {
    link_to: PropTypes.string,
    svg_icon: PropTypes.element.isRequired,
    tab_name: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
};


export default SideNavbarSingleTab;
