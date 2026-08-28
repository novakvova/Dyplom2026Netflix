import { useState, type ChangeEvent, type FormEvent } from "react";
import type { AxiosError } from "axios";
import { UseRegisterMutation } from "./hooks/useRegisterMutation.ts";
import type {IRegister_Data} from "./types/IRegister.ts";

interface IApiErrorResponse {
    error?: string;
    errors?: Record<string, string[]>;
}

const Register = () => {
    const [form, setForm] = useState<IRegister_Data>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        imageFile: null,
    });

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    // const [firstName, setFirstName] = useState("");
    // const [lastName, setLastName] = useState("");
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    // const [confirmPassword, setConfirmPassword] = useState("");
    // const [imageFile, setImageFile] = useState<File | null>(null);
    // const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
    const [generalError, setGeneralError] = useState<string | null>(null);

    const { mutateAsync, isPending } = UseRegisterMutation();

    // прибираємо тимчасовий URL прев'ю при зміні/розмонтуванні
    // useEffect(() => {
    //     return () => {
    //         if (imagePreview) URL.revokeObjectURL(imagePreview);
    //     };
    // }, [imagePreview]);

    const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        // setImageFile(file);
        setForm({...form, imageFile: file});
        // setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const fieldError = (name: string) => fieldErrors?.[name]?.[0];

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFieldErrors(null);
        setGeneralError(null);

        try {
            await mutateAsync({
                data: form,
            });
        } catch (err) {
            const axiosError = err as AxiosError<IApiErrorResponse>;
            if (axiosError.response?.data?.errors) {
                setFieldErrors(axiosError.response.data.errors);
            } else if (axiosError.response?.data?.error) {
                setGeneralError(axiosError.response.data.error);
            } else {
                setGeneralError("Сталася помилка. Спробуйте пізніше.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center px-4 mt-12 mb-12">
            <div className="w-full max-w-md p-8 space-y-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <h1 className="text-2xl font-bold text-center text-gray-900">Реєстрація</h1>

                <form className="space-y-4" onSubmit={onSubmit} noValidate>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                            {form.imageFile ? (
                                <img src={URL.createObjectURL(form.imageFile)} alt="Прев'ю фото" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs text-gray-400">Фото</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Фото профілю (необов'язково)
                            </label>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={onImageChange}
                                className="block w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            {fieldError("imageFile") && (
                                <p className="text-red-500 text-xs mt-1">{fieldError("imageFile")}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ім'я</label>
                        <input
                            name="firstName"
                            type="text"
                            value={form.firstName}
                            onChange={onChangeHandler}
                            // onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        {fieldError("firstName") && <p className="text-red-500 text-xs mt-1">{fieldError("firstName")}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Прізвище</label>
                        <input
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={onChangeHandler}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        {fieldError("lastName") && <p className="text-red-500 text-xs mt-1">{fieldError("lastName")}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={onChangeHandler}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        {fieldError("email") && <p className="text-red-500 text-xs mt-1">{fieldError("email")}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={onChangeHandler}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <p className="text-gray-400 text-xs mt-1">
                            Мінімум 8 символів, велика і мала літери, цифра та спецсимвол
                        </p>
                        {fieldError("password") && <p className="text-red-500 text-xs mt-1">{fieldError("password")}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Підтвердження пароля</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={onChangeHandler}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        {fieldError("confirmPassword") && (
                            <p className="text-red-500 text-xs mt-1">{fieldError("confirmPassword")}</p>
                        )}
                    </div>

                    {generalError && <p className="text-red-500 text-sm">{generalError}</p>}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium transition-colors"
                    >
                        {isPending ? "Реєстрація..." : "Зареєструватися"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;