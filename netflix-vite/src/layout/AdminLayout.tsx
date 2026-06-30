import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ flex: 1 }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;