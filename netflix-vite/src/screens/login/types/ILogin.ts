export interface ILogin {
    token: string;
}

export interface IAuthTokenInfo {
    email: string;
    exp: number;
    role: string;
}

export interface ILogin_Data {
    email: string;
    password: string;
}