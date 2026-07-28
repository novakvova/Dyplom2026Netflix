import React, { useEffect, useState } from "react";
import "./Movies.css";
import { getPopularMovies } from "../../api/tmdb.tsx";
type Movie = {
    id: number;
    title: string;
    release_date: string;
    vote_average: number;
    original_language: string;
};

const Movies: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getPopularMovies()
            .then((data) => setMovies(data))
            .catch((error) => console.error(error));
    }, []);

    const filteredMovies = movies.filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="movies-page">
            {/* HEADER */}
            <div className="movies-header">
                <h1>Movies</h1>

                <div className="actions">
                    <input
                        type="text"
                        placeholder="Search movie..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button className="add-btn">
                        + Add Movie
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Language</th>
                        <th>Release Date</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredMovies.map((movie) => (
                        <tr key={movie.id}>
                            <td>{movie.id}</td>

                            <td>{movie.title}</td>

                            <td>{movie.original_language.toUpperCase()}</td>

                            <td>{movie.release_date}</td>

                            <td>{movie.vote_average.toFixed(1)}</td>

                            <td>
                                    <span className="status published">
                                        Published
                                    </span>
                            </td>

                            <td className="actions">
                                <button className="edit">
                                    Edit
                                </button>

                                <button className="delete">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Movies;