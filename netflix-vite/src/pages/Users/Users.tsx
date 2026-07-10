import React, { useState } from 'react';
import "./Users.css";

type User = {
    id: number;
    user: string;
    name: string;
    surname: string;
    email: string;
    status: "Normal" | "Blocked";
    whyBlocked?: string;
};

const initialUsers: User[] = [
    { id: 1, name: "John", surname: "Doe", user: "John_Doe", email: "john_doe@gmail.com", status: "Blocked", whyBlocked: "Bad comment" },
    { id: 2, name: "Alex", surname: "Hamm", user: "Alex99", email: "Alex99@gmail.com", status: "Normal" },
    { id: 3, name: "Fred", surname: "Kane", user: "MovieFan", email: "FredMovie_Fan@gmail.com", status: "Normal" },
    { id: 4, name: "Harry", surname: "Benner", user: "DarKnight", email: "DarKnight@gmail.com", status: "Normal" },
    { id: 5, name: "Kate", surname: "Wensley", user: "Kate_W", email: "Kate_W@gmail.com", status: "Normal" },
];

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [search, setSearch] = useState("");

    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [blockReasonInput, setBlockReasonInput] = useState("");

    const startBlocking = (id: number) => {
        setEditingUserId(id);
        setBlockReasonInput(""); // очищуємо інпут перед введенням
    };

    const saveBlockStatus = (id: number) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === id
                    ? { ...user, status: "Blocked", whyBlocked: blockReasonInput.trim() || "Violation of terms" }
                    : user
            )
        );
        setEditingUserId(null); // закриваємо режим редагування
    };

    const handleUnblock = (id: number) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === id ? { ...user, status: "Normal", whyBlocked: undefined } : user
            )
        );
    };

    const cancelBlocking = () => {
        setEditingUserId(null);
    };

    // Фільтрація користувачів
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.surname.toLowerCase().includes(search.toLowerCase()) ||
        user.user.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="users-page">
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

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Block Reason</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredUsers.map((u) => {
                        const isEditingThisUser = editingUserId === u.id;

                        return (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.name} {u.surname}</td>
                                <td><strong>{u.user}</strong></td>
                                <td>{u.email}</td>
                                <td>
                                        <span className={`status ${u.status.toLowerCase()}`}>
                                            {u.status}
                                        </span>
                                </td>

                                <td className="reason-cell">
                                    {isEditingThisUser ? (
                                        <input
                                            type="text"
                                            className="table-reason-input"
                                            placeholder="Enter reason..."
                                            value={blockReasonInput}
                                            onChange={(e) => setBlockReasonInput(e.target.value)}
                                            autoFocus
                                        />
                                    ) : (
                                        u.status === "Blocked" ? u.whyBlocked : "—"
                                    )}
                                </td>

                                <td className="actions">
                                    {isEditingThisUser ? (
                                        <>
                                            <button className="save-btn" onClick={() => saveBlockStatus(u.id)}>Save</button>
                                            <button className="cancel-btn" onClick={cancelBlocking}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            {u.status === "Normal" ? (
                                                <button className="block-btn" onClick={() => startBlocking(u.id)}>Block</button>
                                            ) : (
                                                <button className="unblock-btn" onClick={() => handleUnblock(u.id)}>Unblock</button>
                                            )}
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;