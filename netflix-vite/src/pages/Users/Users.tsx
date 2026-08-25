import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Users.css";

type User = {
    id: number;
    fullName: string;
    email: string;
    status: "Normal" | "Blocked";
    whyBlocked?: string;
};

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [blockReasonInput, setBlockReasonInput] = useState("");

    // Отримання користувачів з API
    useEffect(() => {
        axios
            .get("http://localhost:5127/api/users/list")
            .then((response) => {
                console.log("Users from API:", response.data);

                setUsers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setError("Failed to load users");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Почати блокування
    const startBlocking = (id: number) => {
        setEditingUserId(id);
        setBlockReasonInput("");
    };

    // Зберегти блокування
    const saveBlockStatus = (id: number) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id
                    ? {
                        ...user,
                        status: "Blocked",
                        whyBlocked:
                            blockReasonInput.trim() ||
                            "Violation of terms",
                    }
                    : user
            )
        );

        setEditingUserId(null);
        setBlockReasonInput("");
    };

    // Розблокувати користувача
    const handleUnblock = (id: number) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id
                    ? {
                        ...user,
                        status: "Normal",
                        whyBlocked: undefined,
                    }
                    : user
            )
        );
    };

    // Скасувати блокування
    const cancelBlocking = () => {
        setEditingUserId(null);
        setBlockReasonInput("");
    };

    // Пошук користувачів
    const filteredUsers = users.filter((user) =>
        [
            user.fullName,
            user.email,
        ].some((value) =>
            value?.toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <div className="users-page">

            {/* HEADER */}
            <div className="users-header">
                <h1>Registered Users</h1>

                <div className="actions">
                    <input
                        type="text"
                        placeholder="Search user..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* TABLE */}
            <div className="table-container">

                {loading ? (
                    <div className="loading">
                        Loading users...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="no-users">
                        No users found
                    </div>
                ) : (
                    <table>

                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Block Reason</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>

                        {filteredUsers.map((u) => {

                            const isEditingThisUser =
                                editingUserId === u.id;

                            return (
                                <tr key={u.id}>

                                    {/* ID */}
                                    <td>
                                        {u.id}
                                    </td>

                                    {/* FULL NAME */}
                                    <td>
                                        {u.fullName}
                                    </td>



                                    {/* EMAIL */}
                                    <td>
                                        {u.email}
                                    </td>

                                    {/* STATUS */}
                                    <td>
                                    <span
                                        className={`status ${(u.status || "Normal").toLowerCase()}`}
                                    >
                                        {u.status || "Normal"}
                                    </span>
                                    </td>

                                    {/* BLOCK REASON */}
                                    <td className="reason-cell">

                                        {isEditingThisUser ? (

                                            <input
                                                type="text"
                                                className="table-reason-input"
                                                placeholder="Enter reason..."
                                                value={blockReasonInput}
                                                onChange={(e) =>
                                                    setBlockReasonInput(
                                                        e.target.value
                                                    )
                                                }
                                                autoFocus
                                            />

                                        ) : (

                                            u.status === "Blocked"
                                                ? u.whyBlocked
                                                : "—"

                                        )}

                                    </td>

                                    {/* ACTIONS */}
                                    <td className="actions">

                                        {isEditingThisUser ? (

                                            <>
                                                <button
                                                    className="save-btn"
                                                    onClick={() =>
                                                        saveBlockStatus(
                                                            u.id
                                                        )
                                                    }
                                                >
                                                    Save
                                                </button>

                                                <button
                                                    className="cancel-btn"
                                                    onClick={
                                                        cancelBlocking
                                                    }
                                                >
                                                    Cancel
                                                </button>
                                            </>

                                        ) : (

                                            <>
                                                {u.status === "Normal" ? (

                                                    <button
                                                        className="block-btn"
                                                        onClick={() =>
                                                            startBlocking(
                                                                u.id
                                                            )
                                                        }
                                                    >
                                                        Block
                                                    </button>

                                                ) : (

                                                    <button
                                                        className="unblock-btn"
                                                        onClick={() =>
                                                            handleUnblock(
                                                                u.id
                                                            )
                                                        }
                                                    >
                                                        Unblock
                                                    </button>

                                                )}
                                            </>

                                        )}

                                    </td>

                                </tr>
                            );
                        })}

                        </tbody>

                    </table>
                )}

            </div>

        </div>
    );
};

export default Users;