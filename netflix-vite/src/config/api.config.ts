export const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export const API_URL = `${SERVER_URL}/api`;

export const getUsersUrl = () => '/users';
export const postLoginUrl = () => '/account/login';
export const postRegisterUrl = () => '/Account/Register';