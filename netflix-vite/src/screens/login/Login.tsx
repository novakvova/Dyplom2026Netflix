import { useState, type FormEvent } from "react";
import { UseLoginMutation } from "./hooks/useLoginMutation.ts";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const { mutateAsync, isPending } = UseLoginMutation();

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);
        try {
            await mutateAsync({ data: { email, password } });
        } catch {
            setFormError("Невірний email або пароль");
        }
    };

    return (
        <div className="flex items-center justify-center px-4 mt-20">
            <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <h1 className="text-2xl font-bold text-center text-gray-900">Вхід</h1>

                <form className="space-y-4" onSubmit={onSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    {formError && <p className="text-red-500 text-sm">{formError}</p>}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium transition-colors"
                    >
                        {isPending ? "Вхід..." : "Увійти"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;