import {store} from "@/store/index.js";

export const emailVerificationMiddleware = (to, from, next) => {
    const user = store.getters["auth/user"];

    if (user?.emailIsVerified) {
        next();
    } else {
        next({name: "email-verify"});
    }
}