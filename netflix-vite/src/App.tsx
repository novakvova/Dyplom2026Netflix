import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Movies from "./pages/Movies/Movies";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route element={<AdminLayout />}>

                    <Route path="/" element={<Navigate to="/movies" />} />

                    <Route path="/movies" element={<Movies />} />

                </Route>

            </Routes>
        </BrowserRouter>
    );
};

export default App;