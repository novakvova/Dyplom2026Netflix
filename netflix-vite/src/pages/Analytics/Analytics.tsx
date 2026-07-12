import React, { useState } from "react";
import "./Analytics.css";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from "recharts";

interface DeviceData {
    name: string;
    value: number;
    color: string;
}

interface RevenueData {
    month: string;
    Normal: number;
    Premium: number;
}

interface PeakHourData {
    hour: string;
    activeUsers: number;
}

const deviceData: DeviceData[] = [
    { name: "Smart TV", value: 55, color: "#E50914" },
    { name: "Mobile", value: 25, color: "#B81D24" },
    { name: "Desktop", value: 15, color: "#221F1F" },
    { name: "Tablet", value: 5, color: "#666666" },
];

const revenuePlanData: RevenueData[] = [
    { month: "Jan", Normal: 12000, Premium: 28000 },
    { month: "Feb", Normal: 13500, Premium: 30000 },
    { month: "Mar", Normal: 15000, Premium: 32000 },
    { month: "Apr", Normal: 14000, Premium: 35000 },
    { month: "May", Normal: 16500, Premium: 39000 },
    { month: "Jun", Normal: 18000, Premium: 42000 },
];

const peakHoursData: PeakHourData[] = [
    { hour: "00:00", activeUsers: 4200 },
    { hour: "04:00", activeUsers: 1100 },
    { hour: "08:00", activeUsers: 3500 },
    { hour: "12:00", activeUsers: 8900 },
    { hour: "16:00", activeUsers: 14200 },
    { hour: "20:00", activeUsers: 28500 },
    { hour: "22:00", activeUsers: 22100 },
];

const Analytics: React.FC = () => {
    const [timeRange, setTimeRange] = useState("7d");

    return (
        <div className="analytics">
            <div className="analytic-header">
                <div>
                    <h1>Analytics</h1>
                    <p>Deep insights on user engagement & platform performance</p>
                </div>
                <div className="time-filter">
                    <select
                        className="select-filter"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="1y">Last Year</option>
                    </select>
                </div>
            </div>

            <div className="analytics-grid-cards">
                <div className="analytics-card">
                    <h4>Avg. Watch Time / User</h4>
                    <h2>2.4 h/day</h2>
                    <span className="positive">+14% vs last month</span>
                </div>
                <div className="analytics-card">
                    <h4>Completion Rate</h4>
                    <h2>78.2%</h2>
                    <span className="positive">+3.1%</span>
                </div>
                <div className="analytics-card">
                    <h4>Churn Rate</h4>
                    <h2>1.8%</h2>
                    <span className="negative">-0.4%</span>
                </div>
                <div className="analytics-card">
                    <h4>Peak Concurrent Streamers</h4>
                    <h2>28,500</h2>
                    <span>at 20:00 UTC</span>
                </div>
            </div>

            <div className="chart-card">
                <div className="card-header">
                    <h2>Traffic & Peak Watch Hours</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={peakHoursData || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                        <XAxis dataKey="hour" stroke="#aaaaaa" />
                        <YAxis stroke="#aaaaaa" />
                        <Tooltip contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#333333", color: "#ffffff" }} />
                        <Area type="monotone" dataKey="activeUsers" stroke="#E50914" fill="#E50914" fillOpacity={0.3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <div className="card-header">
                        <h2>Revenue Breakdown (Normal vs Premium)</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={revenuePlanData || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                            <XAxis dataKey="month" stroke="#aaaaaa" />
                            <YAxis stroke="#aaaaaa" />
                            <Tooltip contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#333333", color: "#ffffff" }} />
                            <Bar dataKey="Normal" stackId="a" fill="#0071eb" />
                            <Bar dataKey="Premium" stackId="a" fill="#E50914" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <div className="card-header">
                        <h2>Views by Device</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={deviceData || []}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={40}
                                label={({ name, percent }) =>
                                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                                }                            >
                                {(deviceData || []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#333333", color: "#ffffff" }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;