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
        path: "/admin",
        end: true // <-- важливо: щоб не залишався активним на під-роутах
    },
    {
        title: "Movies",
        icon: <MdMovie />,
        path: "/admin/movies"
    },
    {
        title: "Series",
        icon: <FaTv />,
        path: "/admin/series"
    },
    {
        title: "Users",
        icon: <MdPeople />,
        path: "/admin/users"
    },
    {
        title: "Subscriptions",
        icon: <BsCreditCard />,
        path: "/admin/subscriptions"
    },
    {
        title: "Reviews",
        icon: <BsStarFill />,
        path: "/admin/reviews"
    },
    {
        title: "Analytics",
        icon: <MdAnalytics />,
        path: "/admin/analytics"
    },
    {
        title: "Settings",
        icon: <MdSettings />,
        path: "/admin/settings"
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
                            end={item.end}
                            className={({ isActive }) =>
                                isActive ? "menu-item active" : "menu-item"
                            }
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
    );
};

export default Sidebar;