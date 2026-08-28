import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.tsx";
import { RouterEnum } from "../config/RouterEnum.ts";

const Header = () => {
    const { isAuthenticated, email, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate(RouterEnum.MAIN);
    };

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Link to={RouterEnum.MAIN} className="text-lg font-bold text-gray-900">
                WebApiQRCode
            </Link>

            {isAuthenticated ? (
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm">{email}</span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors"
                    >
                        Вихід
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <Link
                        to={RouterEnum.LOGIN}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                    >
                        Вхід
                    </Link>
                    <Link
                        to={RouterEnum.REGISTER}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium transition-colors"
                    >
                        Реєстрація
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Header;