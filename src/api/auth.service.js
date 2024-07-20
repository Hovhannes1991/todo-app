import {httpService} from "@/services/http/http-service.js";
import {getTokens} from "@/helpers/storage.js";

export const register = ({firstname, lastname, email, password}) => {
    return httpService.post("/auth/register", {firstname, lastname, email, password});
}

export const login = ({email, password}) => {
    return httpService.post("/auth/login", {email, password});
}

export const logout = () => {
    const {accessToken, refreshToken} = getTokens();
    return httpService.post("/auth/logout", {accessToken, refreshToken});
}

export const getUserByToken = () => {
    return httpService.get("auth/get-user-by-token");
}