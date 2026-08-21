import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "./layout/AdminLayout";

import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Movies from "./pages/Movies/Movies";
import Series from "./pages/Series/Series.tsx";
import Reviews from "./pages/Reviews/Reviews.tsx";
import Users from "./pages/Users/Users.tsx";
import Subscriptions from "./pages/Subscriptions/Subscriptions.tsx";
import Settings from "./pages/Settings/Settings.tsx";
import Analytics from "./pages/Analytics/Analytics.tsx";
import HomePage from "./pages/Home/HomePage.tsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} >
                    <Route
                        index
                        element={<HomePage />}
                    />
                </Route>

                <Route path={"admin"} element={<AdminLayout />}>

                    {/* Dashboard */}
                    <Route
                        index
                        element={<Dashboard />}
                    />

                    {/* Movies */}
                    <Route
                        path="movies"
                        element={<Movies />}
                    />

                    {/* Series */}
                    <Route
                        path="series"
                        element={<Series />}
                    />

                    {/* Reviews */}
                    <Route
                        path="reviews"
                        element={<Reviews />}
                    />

                    {/* Users */}
                    <Route
                        path="users"
                        element={<Users />}
                    />

                    {/* Subscriptions */}
                    <Route
                        path="subscriptions"
                        element={<Subscriptions />}
                    />

                    {/* Settings */}
                    <Route
                        path="settings"
                        element={<Settings />}
                    />

                    {/* Analytics */}
                    <Route
                        path="analytics"
                        element={<Analytics />}
                    />

                </Route>

            </Routes>
        </BrowserRouter>
    );
};

export default App;