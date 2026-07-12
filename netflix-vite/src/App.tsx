import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Movies from "./pages/Movies/Movies";
import Series from "./pages/Series/Series.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import Reviews from "./pages/Reviews/Reviews.tsx";
import Users from "./pages/Users/Users.tsx";
import Subscriptions from "./pages/Subscriptions/Subscriptions.tsx";
import Settings from "./pages/Settings/Settings.tsx";
import Analytics from "./pages/Analytics/Analytics.tsx";
const App = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route element={<AdminLayout />}>

                    <Route path="/" element={<Dashboard/>} />

                    <Route path="/movies" element={<Movies />} />

                    <Route path="/series" element={<Series/>}/>

                    <Route path="/reviews" element={<Reviews/>}/>

                    <Route path="/users" element={<Users/>}/>

                    <Route path="/subscriptions" element={<Subscriptions/>}/>

                    <Route path="/settings" element={<Settings/>}/>

                    <Route path="/analytics" element={<Analytics/>}/>

                </Route>

            </Routes>
        </BrowserRouter>
    );
};

export default App;