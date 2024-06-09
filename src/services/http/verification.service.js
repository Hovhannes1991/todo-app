import axios from "axios";

export const emailVerify = (token) => {
    return axios.post("/verify/email", {token});
}

export const resendToken = (email) => {
    return axios.post("verify/email-token-resend", {email});
}