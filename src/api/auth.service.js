import {httpService} from "@/services/http/http-service.js";
import {getTokens} from "@/helpers/storage.js";

export const register = ({firstname, lastname, email, password}) => {
    return httpService.post("/auth/register", {firstname, lastname, email, password});
}

export const login = ({email, password}) => {
    return httpService.post("/auth/login", {email, password});
}

export const logout = () => {
    const {access_token, refresh_token} = getTokens();
    return httpService.post("/auth/logout", {access_token, refresh_token});
}

export const getUserByToken = () => {
    return httpService.get("auth/get-user-by-token");
}