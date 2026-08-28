import Loader from "../../components/Loader.tsx";
import {useUsersQuery} from "../../hooks/useUsersQuery.ts";

const Main = () => {
    const { data: users, isLoading, isError, error } = useUsersQuery();

    if (isLoading) return <Loader />;

    if (isError) {
        return (
            <p className="text-center text-red-500 mt-20">
                Помилка: {(error as Error).message}
            </p>
        );
    }

    return (
        <div className="max-w-xl mx-auto mt-10 px-4 font-sans">
            <h1 className="text-2xl font-bold mb-6">Список користувачів</h1>
            <ul className="divide-y divide-gray-200">
                {users?.map((user) => (
                    <li key={user.id} className="flex items-center gap-3 py-3">
                        <span className="text-gray-400 text-sm">#{user.id}</span>
                        <strong className="text-gray-900">{user.fullName}</strong>
                        <span className="text-gray-500 ml-auto">{user.email}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Main;