import instance from "../../../services/api/interceptors.api.ts";
import { postLoginUrl } from "../../../config/api.config.ts";
import type {ILogin, ILogin_Data} from "../types/ILogin.ts";

export const LoginService = {
    post: ({ data }: { data: ILogin_Data }) =>
        instance<ILogin>({
            url: postLoginUrl(),
            method: "POST",
            data,
        }),
};