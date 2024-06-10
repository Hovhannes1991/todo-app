import {httpService} from "@/services/http/http-service.js";


export const updateProfile = async (user_data) => {
    return httpService.post("/profile/update-personal-data", user_data);
}

export const changeEmail = async (user_data) => {
    return httpService.post("/profile/change-email", user_data);
}

export const changePassword = async (user_data) => {
    return httpService.post("/profile/change-password", user_data);
}