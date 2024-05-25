import {store} from "@/store/index.js";

export const guestMiddleware = (to, from, next) => {
    if (!store.getters["auth/user"]) {
        next();
    } else {
        next({name: "home"});
    }
}