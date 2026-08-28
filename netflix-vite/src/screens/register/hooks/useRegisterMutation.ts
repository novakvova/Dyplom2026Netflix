import { useMutation } from "@tanstack/react-query";
import type { IRegister_Data } from "../types/IRegister.ts";
import { RegisterService } from "../services/register.service.ts";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext.tsx";
import { RouterEnum } from "../../../config/RouterEnum.ts";

export const UseRegisterMutation = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    return useMutation({
        mutationKey: ["register-post"],
        mutationFn: (props: { data: IRegister_Data }) =>
            RegisterService.post(props).then((res) => res.data),
        onSuccess: (data) => {
            login(data.token);
            navigate(RouterEnum.MAIN);
        },
    });
};