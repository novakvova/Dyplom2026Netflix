import React from "react";
import "./Dashboard.css";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie
} from "recharts";

const viewsData = [
    { month: "Jan", views: 12000 },
    { month: "Feb", views: 15500 },
    { month: "Mar", views: 18300 },
    { month: "Apr", views: 20100 },
    { month: "May", views: 22800 },
    { month: "Jun", views: 24500 },
    { month: "Jul", views: 26900 },
    { month: "Aug", views: 29100 },
    { month: "Sep", views: 31500 },
    { month: "Oct", views: 34200 },
    { month: "Nov", views: 36100 },
    { month: "Dec", views: 39800 }
];

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back, Administrator</p>
                </div>

                <button className="export-btn">
                    Export Report
                </button>
            </div>

            <div className="stats-grid">

                <div className="stat-card">
                    <h4>Total Movies</h4>
                    <h2>154</h2>
                    <span className="positive">
                        +12 this month
                    </span>
                </div>

                <div className="stat-card">
                    <h4>Total Users</h4>
                    <h2>12,483</h2>
                    <span className="positive">
                        +324 today
                    </span>
                </div>

                <div className="stat-card">
                    <h4>Revenue</h4>
                    <h2>$48,250</h2>
                    <span className="positive">
                        +8.4%
                    </span>
                </div>

                <div className="stat-card">
                    <h4>Average Rating</h4>
                    <h2>8.7</h2>
                    <span>
                        IMDb
                    </span>
                </div>

            </div>

            <div className="chart-card">

                <div className="card-header">
                    <h2>Monthly Views</h2>
                </div>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >

                    <LineChart data={viewsData}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="views"
                            stroke="#E50914"
                            strokeWidth={3}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>
            <div className="charts-grid">

                <div className="chart-card">

                    <div className="card-header">
                        <h2>New Users</h2>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>

                        <BarChart
                            data={[
                                { month: "Jan", users: 220 },
                                { month: "Feb", users: 310 },
                                { month: "Mar", users: 410 },
                                { month: "Apr", users: 380 },
                                { month: "May", users: 540 },
                                { month: "Jun", users: 620 }
                            ]}
                        >

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="month" />

                            <YAxis />

                            <Tooltip />

                            <Bar
                                dataKey="users"
                                fill="#E50914"
                                radius={[8, 8, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

                <div className="chart-card">

                    <div className="card-header">
                        <h2>Movies by Genre</h2>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>

                        <PieChart>

                            <Pie
                                data={[
                                    { name: "Action", value: 35 },
                                    { name: "Drama", value: 25 },
                                    { name: "Sci-Fi", value: 18 },
                                    { name: "Comedy", value: 12 },
                                    { name: "Horror", value: 10 }
                                ]}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                label
                            />

                            <Tooltip />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

            </div>

            <div className="movies-table">

                <div className="card-header">
                    <h2>Recently Added Movies</h2>
                </div>

                <table>

                    <thead>

                    <tr>
                        <th>Title</th>
                        <th>Genre</th>
                        <th>Year</th>
                        <th>Rating</th>
                    </tr>

                    </thead>

                    <tbody>

                    <tr>
                        <td>Oppenheimer</td>
                        <td>Drama</td>
                        <td>2023</td>
                        <td>8.6</td>
                    </tr>

                    <tr>
                        <td>Dune: Part Two</td>
                        <td>Sci-Fi</td>
                        <td>2024</td>
                        <td>8.8</td>
                    </tr>

                    <tr>
                        <td>Interstellar</td>
                        <td>Sci-Fi</td>
                        <td>2014</td>
                        <td>8.9</td>
                    </tr>

                    <tr>
                        <td>Inception</td>
                        <td>Sci-Fi</td>
                        <td>2010</td>
                        <td>9.0</td>
                    </tr>

                    <tr>
                        <td>The Dark Knight</td>
                        <td>Action</td>
                        <td>2008</td>
                        <td>9.1</td>
                    </tr>

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default Dashboard;