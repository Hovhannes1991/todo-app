import {httpService} from "@/services/http/http-service.js";


export const updateProfile = async (user_data) => {
    return httpService.post("/profile/update-personal-data", user_data);
}

export const changeEmail = async (new_email, password) => {
    return httpService.post("/profile/change-email", {new_email, password});
}

export const changeEmailConfirm = async (token) => {
    return httpService.post("/profile/change-email-confirm", {token});
}

export const changePassword = async (old_password, new_password) => {
    return httpService.post("/profile/change-password", {old_password, new_password});
}