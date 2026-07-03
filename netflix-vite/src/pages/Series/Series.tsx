import React, {useState} from "react";
import "./Series.css"
type Serie = {
    id: number,
    title: string;
    genre: string;
    year: number;
    rating: number;
    status: "Published" | "Draft";
};

const initialSeries: Serie[] = [
    { id: 1, title: "Breaking Bad", genre: "Crime", year: 2008, rating: 9.5, status: "Published" },
    { id: 2, title: "Game of Thrones", genre: "Fantasy", year: 2011, rating: 9.2, status: "Published" },
    { id: 3, title: "Stranger Things", genre: "Sci-Fi", year: 2016, rating: 8.7, status: "Published" },
    { id: 4, title: "The Last of Us", genre: "Drama", year: 2023, rating: 8.8, status: "Published" },
    { id: 5, title: "Sherlock", genre: "Crime", year: 2010, rating: 9.1, status: "Published" },
    { id: 6, title: "Peaky Blinders", genre: "Crime", year: 2013, rating: 8.8, status: "Published" },
    { id: 7, title: "The Witcher", genre: "Fantasy", year: 2019, rating: 8.0, status: "Published" },
    { id: 8, title: "Dark", genre: "Sci-Fi", year: 2017, rating: 8.7, status: "Published" },
    { id: 9, title: "Wednesday", genre: "Fantasy", year: 2022, rating: 8.1, status: "Published" },
    { id: 10, title: "The Boys", genre: "Action", year: 2019, rating: 8.7, status: "Published" }
];
const Series: React.FC = () => {
    const [series] = useState<Serie[]>(initialSeries);
    const [search, setSearch] = useState("");

    const filteredSeries = series.filter(serie =>
    serie.title.toLowerCase().includes(search.toLowerCase())
    );



        return (
            <div className="series-page">

                <div className="series-header">
                    <h1>Series</h1>

                    <div className="actions">
                        <input
                            type="text"
                            placeholder="Search serie"
                            value={search}
                            onChange={(e)=>setSearch(e.target.value)}
                        />

                        <button className="add-btn">
                            + Add Serie
                        </button>
                    </div>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Genre</th>
                            <th>Year</th>
                            <th>Rating</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredSeries.map((serie) => (
                            <tr key={serie.id}>
                                <td>{serie.id}</td>
                                <td>{serie.title}</td>
                                <td>{serie.genre}</td>
                                <td>{serie.year}</td>
                                <td>{serie.rating}</td>
                                <td>
                                    <span className={`status ${serie.status.toLowerCase()}`}>
                                        {serie.status}
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