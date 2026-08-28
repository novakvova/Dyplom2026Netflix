import { useQuery } from '@tanstack/react-query';
import {UserService} from "../services/user.service.ts";
import type {IUser} from "../types/user.types.ts";

export const useUsersQuery = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => UserService.getAll().then((res) => res.data as IUser[]),
    });
};