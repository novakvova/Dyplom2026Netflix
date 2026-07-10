import React, { useState } from "react";
import "./Reviews.css";

type Review = {
    id: number;
    user: string;
    movieTitle: string;
    comment: string;
    rating: number;
    status: "Approved" | "Pending";
};

const initialReviews: Review[] = [
    { id: 1, user: "Alex99", movieTitle: "Breaking Bad", comment: "The best series ever made! Masterpiece.", rating: 5, status: "Approved" },
    { id: 2, user: "John_Doe", movieTitle: "Stranger Things", comment: "Season 4 was great, but season 3 felt a bit slow.", rating: 4, status: "Pending" },
    { id: 3, user: "MovieFan", movieTitle: "Game of Thrones", comment: "The ending ruined everything, but the rest was pure gold.", rating: 3, status: "Approved" },
    { id: 4, user: "Kate_W", movieTitle: "Wednesday", comment: "Very stylish and fun to watch. Jenna Ortega is amazing.", rating: 5, status: "Pending" },
    { id: 5, user: "DarKnight", movieTitle: "The Boys", comment: "Brutal, bloody, and absolutely hilarious.", rating: 5, status: "Approved" }
];

const Reviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [search, setSearch] = useState("");

    const handleApprove = (id: number) => {
        setReviews(prevReviews =>
            prevReviews.map(review =>
                review.id === id ? { ...review, status: "Approved" } : review
            )
        );
    };

    const handleDelete = (id: number) => {
        setReviews(prevReviews => prevReviews.filter(review => review.id !== id));
    };

    const filteredReviews = reviews.filter(review =>
        review.movieTitle.toLowerCase().includes(search.toLowerCase()) ||
        review.user.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="reviews-page">
            <div className="reviews-header">
                <h1>User Reviews</h1>

                <div className="actions">
                    <input
                        type="text"
                        placeholder="Search movie or user"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Movie / Serie</th>
                        <th>Comment</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredReviews.map((review) => (
                        <tr key={review.id}>
                            <td>{review.id}</td>
                            <td><strong>{review.user}</strong></td>
                            <td>{review.movieTitle}</td>
                            <td className="comment-cell">{review.comment}</td>
                            <td>⭐ {review.rating}/5</td>
                            <td>
                                    <span className={`status ${review.status.toLowerCase()}`}>
                                        {review.status}
                                    </span>
                            </td>
                            <td className="actions">
                                {review.status === "Pending" && (
                                    <button
                                        className="approve-btn"
                                        onClick={() => handleApprove(review.id)}
                                    >
                                        Approve
                                    </button>
                                )}
                                <button
                                    className="delete"
                                    onClick={() => handleDelete(review.id)}
                                >
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

export default Reviews;