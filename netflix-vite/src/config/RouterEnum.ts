export const RouterEnum = {
    MAIN: '/',
    LOGIN: '/login',
    REGISTER: '/register',
} as const;

export type RouterEnum = typeof RouterEnum[keyof typeof RouterEnum];