import instance from "./api/interceptors.api.ts";
import type {IUser} from "../types/user.types.ts";
import {getUsersUrl} from "../config/api.config.ts";


export const UserService = {
    getAll: () => instance.get<IUser[]>(getUsersUrl()),
};