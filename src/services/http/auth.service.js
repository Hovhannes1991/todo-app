import axios from "axios";
import {getTokens} from "@/helpers/storage.js";

export const register = ({firstname, lastname, email, password}) => {
    return axios.post("/auth/register", {firstname, lastname, email, password});
}

export const login = ({email, password}) => {
    return axios.post("/auth/login", {email, password});
}

export const logout = () => {
    const {access_token, refresh_token} = getTokens();
    return axios.post("/auth/logout", {access_token, refresh_token});
}

export const getUserByToken = () => {
    return axios.get("auth/get-user-by-token");
}