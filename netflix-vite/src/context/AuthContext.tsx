import { createContext, useContext, useState, type FC, type PropsWithChildren } from "react";
import {jwtDecode} from "jwt-decode";
import type {IAuthTokenInfo} from "../screens/login/types/ILogin.ts";

interface IAuthState {
    email: string | null;
}

interface IAuthContextValue extends IAuthState {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AUTH_STORAGE_KEY = "auth";

const getInitialState = (): IAuthState => {
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!token) return { email: null };
    try {
        const decode = jwtDecode<IAuthTokenInfo>(token);
        return {email: decode.email} as IAuthState;
    } catch {
        return { email: null };
    }
};

const AuthContext = createContext<IAuthContextValue | null>(null);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const [auth, setAuth] = useState<IAuthState>(getInitialState);

    const login = (token: string) => {
        const decode = jwtDecode<IAuthTokenInfo>(token);
        //console.log("Decode token", decode);
        const newState = { token, email: decode.email };
        localStorage.setItem(AUTH_STORAGE_KEY, token);
        setAuth(newState);
    };

    const logout = () => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuth({ email: null });
    };

    return (
        <AuthContext.Provider value={{ ...auth, isAuthenticated: !!auth.email, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};