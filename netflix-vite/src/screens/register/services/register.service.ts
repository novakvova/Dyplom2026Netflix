import instance from "../../../services/api/interceptors.api.ts";
import { postRegisterUrl } from "../../../config/api.config.ts";
import type { IRegister, IRegister_Data } from "../types/IRegister.ts";

// const buildFormData = (data: IRegister_Data): FormData => {
//     const formData = new FormData();
//     formData.append("firstName", data.firstName);
//     formData.append("lastName", data.lastName);
//     formData.append("email", data.email);
//     formData.append("password", data.password);
//     formData.append("confirmPassword", data.confirmPassword);
//     if (data.imageFile) {
//         formData.append("imageFile", data.imageFile);
//     }
//     return formData;
// };

export const RegisterService = {
    post: ({ data }: { data: IRegister_Data }) =>
        instance<IRegister>({
            url: postRegisterUrl(),
            method: "POST",
            headers: { "Content-Type": "multipart/form-data" },
            data: data,
            // data: buildFormData(data),
        }),
};