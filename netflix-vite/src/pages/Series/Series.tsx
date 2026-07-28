import React, { useEffect, useState } from "react";
import "./Series.css";
import { getPopularTVSeries } from "../../api/tmdb";

type Serie = {
    id: number;
    name: string;
    original_language: string;
    first_air_date: string;
    vote_average: number;
};

const Series: React.FC = () => {
    const [series, setSeries] = useState<Serie[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getPopularTVSeries()
            .then((data) => setSeries(data))
            .catch((error) => console.error(error));
    }, []);

    const filteredSeries = series.filter((serie) =>
        serie.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="series-page">
            <div className="series-header">
                <h1>Series</h1>

                <div className="actions">
                    <input
                        type="text"
                        placeholder="Search series..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button className="add-btn">
                        + Add Series
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Language</th>
                        <th>First Air Date</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredSeries.map((serie) => (
                        <tr key={serie.id}>
                            <td>{serie.id}</td>

                            <td>{serie.name}</td>

                            <td>{serie.original_language.toUpperCase()}</td>

                            <td>{serie.first_air_date}</td>

                            <td>{serie.vote_average.toFixed(1)}</td>

                            <td>
                                    <span className="status published">
                                        Published
                                    </span>
                            </td>

                            <td className="actions">
                                <button className="edit">Edit</button>
                                <button className="delete">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Series;