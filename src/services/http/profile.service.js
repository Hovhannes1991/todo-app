import axios from "axios";


export const updateProfile = async (user_data) => {
    return axios.post("/profile/update-personal-data", user_data);
}

export const changeEmail = async (user_data) => {
    return axios.post("/profile/change-email", user_data);
}

export const changePassword = async (user_data) => {
    return axios.post("/profile/change-password", user_data);
}