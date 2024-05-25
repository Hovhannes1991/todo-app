import {store} from "@/store/index.js";

export const authMiddleware = (to, from, next) => {
    if (store.getters["auth/user"]) {
        next();
    } else {
        next({name: "auth"});
    }
}