import {httpService} from "@/services/http/http-service.js";


export const updateProfile = async (userData) => {
    return httpService.post("/profile/update-personal-data", userData);
}

export const changeEmail = async (newEmail, password) => {
    return httpService.post("/profile/change-email", {newEmail, password});
}

export const changeEmailConfirm = async (token) => {
    return httpService.post("/profile/change-email-confirm", {token});
}

export const changePassword = async (oldPassword, newPassword) => {
    return httpService.post("/profile/change-password", {oldPassword, newPassword});
}

export const deleteProfile = async () => {
    return httpService.delete("/profile/delete-profile");
}

export const restoreProfile = async () => {
    return httpService.post("/profile/restore-profile");
}