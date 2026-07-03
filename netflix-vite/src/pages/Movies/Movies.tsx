    import React, { useState } from "react";
    import "./Movies.css";

    type Movie = {
        id: number;
        title: string;
        genre: string;
        year: number;
        rating: number;
        status: "Published" | "Draft";
    };

    const initialMovies: Movie[] = [
        { id: 1, title: "Inception", genre: "Sci-Fi", year: 2010, rating: 9.0, status: "Published" },
        { id: 2, title: "Interstellar", genre: "Sci-Fi", year: 2014, rating: 8.9, status: "Published" },
        { id: 3, title: "The Dark Knight", genre: "Action", year: 2008, rating: 9.1, status: "Published" },
        { id: 4, title: "Joker", genre: "Drama", year: 2019, rating: 8.4, status: "Published" },
        { id: 5, title: "Titanic", genre: "Romance", year: 1997, rating: 7.9, status: "Published" },
        { id: 6, title: "Avatar", genre: "Sci-Fi", year: 2009, rating: 7.8, status: "Published" },
        { id: 7, title: "Avengers: Endgame", genre: "Action", year: 2019, rating: 8.4, status: "Published" },
        { id: 8, title: "The Matrix", genre: "Sci-Fi", year: 1999, rating: 8.7, status: "Published" },
        { id: 9, title: "Gladiator", genre: "Action", year: 2000, rating: 8.5, status: "Published" },
        { id: 10, title: "Oppenheimer", genre: "Drama", year: 2023, rating: 8.6, status: "Published" }
    ];

    const Movies: React.FC = () => {
        const [movies] = useState<Movie[]>(initialMovies);
        const [search, setSearch] = useState("");

        const filteredMovies = movies.filter(movie =>
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
                            <th>Genre</th>
                            <th>Year</th>
                            <th>Rating</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredMovies.map(movie => (
                            <tr key={movie.id}>
                                <td>{movie.id}</td>
                                <td>{movie.title}</td>
                                <td>{movie.genre}</td>
                                <td>{movie.year}</td>
                                <td>{movie.rating}</td>

                                <td>
                                        <span className={`status ${movie.status.toLowerCase()}`}>
                                            {movie.status}
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

    export default Movies;