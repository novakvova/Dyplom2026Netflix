import { NavLink } from "react-router-dom";
import {
    MdDashboard,
    MdMovie,
    MdPeople,
    MdAnalytics,
    MdSettings
} from "react-icons/md";
import { FaTv } from "react-icons/fa";
import { BsCreditCard, BsStarFill } from "react-icons/bs";

import "./Sidebar.css";

const menuItems = [
    {
        title: "Dashboard",
        icon: <MdDashboard />,
        path:"/"
    },
    {
        title:"Movies",
        icon: <MdMovie />,
        path:"/movies"
    },
    {
        title:"Series",
        icon: <FaTv />,
        path:"/series"
    },
    {
        title:"Users",
        icon: <MdPeople />,
        path:"/users"
    },
    {
        title:"Subscriptions",
        icon: <BsCreditCard />,
        path:"/subscriptions"
    },
    {
        title:"Reviews",
        icon: <BsStarFill />,
        path:"/reviews"
    },
    {
      title:"Analytics",
      icon: <MdAnalytics />,
      path:"/analytics"
    },
    {
        title:"Settings",
        icon: <MdSettings />,
        path:"/settings"
    }
    ];

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <div className="logo">
                TEFLEX <span>ADMIN</span>
            </div>
            <ul className="menu">
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <NavLink
                            to={item.path}
                            className={({isActive}) => isActive ? `menu-item active` : `menu-item`}
                        >
                            <div className="icon">{item.icon}</div>
                            <span>{item.title}</span>
                            </NavLink>
                    </li>
                ))}
            </ul>
            <div className="sidebar-footer">
                <div className="admin-info">
                    <div className="avatar"></div>
                    <div>
                        <p>Admin</p>
                        <span>Online</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Sidebar;
