import { useMutation } from "@tanstack/react-query";
import type { ILogin_Data } from "../types/ILogin.ts";
import { LoginService } from "../services/login.service.ts";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext.tsx";
import { RouterEnum } from "../../../config/RouterEnum.ts";

export const UseLoginMutation = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    return useMutation({
        mutationKey: ["login-post"],
        mutationFn: (props: { data: ILogin_Data }) =>
            LoginService.post(props).then((res) => res.data),
        onSuccess: (data) => {
            login(data.token);
            navigate(RouterEnum.MAIN);
        },
    });
};