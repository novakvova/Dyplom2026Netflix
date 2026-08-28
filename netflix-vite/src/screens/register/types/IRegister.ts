export interface IRegister_Data {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    imageFile: File | null;
}

export interface IRegister {
    token: string;
}