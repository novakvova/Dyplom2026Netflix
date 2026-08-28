import {Routes, Route} from "react-router-dom";

import AdminLayout from "./layout/AdminLayout";
import Premium from "./pages/Premium/premium.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Movies from "./pages/Movies/Movies";
import Series from "./pages/Series/Series.tsx";
import Reviews from "./pages/Reviews/Reviews.tsx";
import Users from "./pages/Users/Users.tsx";
import Subscriptions from "./pages/Subscriptions/Subscriptions.tsx";
import Settings from "./pages/Settings/Settings.tsx";
import Analytics from "./pages/Analytics/Analytics.tsx";
import HomePage from "./pages/Home/HomePage.tsx";
import Login from "./screens/login/Login.tsx";
import Register from "./screens/register/Register.tsx";
import Header from "./components/Header.tsx";

const App = () => {
    return (
        <>
            <Header/>
            <Routes>
                <Route path={"/"}>
                    <Route
                        index
                        element={<HomePage/>}
                    />
                </Route>
                <Route path={"login"} element={<Login/>}/>
                <Route path={"register"} element={<Register/>}/>
                <Route
                    path="/premium"
                    element={<Premium/>}
                />


                <Route path={"admin"} element={<AdminLayout/>}>

                    {/* Dashboard */}
                    <Route
                        index
                        element={<Dashboard/>}
                    />


                    {/* Movies */}
                    <Route
                        path="movies"
                        element={<Movies/>}
                    />

                    {/* Series */}
                    <Route
                        path="series"
                        element={<Series/>}
                    />

                    {/* Reviews */}
                    <Route
                        path="reviews"
                        element={<Reviews/>}
                    />

                    {/* Users */}
                    <Route
                        path="users"
                        element={<Users/>}
                    />

                    {/* Subscriptions */}
                    <Route
                        path="subscriptions"
                        element={<Subscriptions/>}
                    />

                    {/* Settings */}
                    <Route
                        path="settings"
                        element={<Settings/>}
                    />

                    {/* Analytics */}
                    <Route
                        path="analytics"
                        element={<Analytics/>}
                    />

                </Route>

            </Routes>
        </>
    );
};

export default App;