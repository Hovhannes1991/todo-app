import {httpService} from "@/services/http/http-service.js";

export const emailVerify = (token) => {
    return httpService.post("/verify/email", {token});
}

export const resendToken = (email) => {
    return httpService.post("verify/email-token-resend", {email});
}