import {store} from "@/store/index.js";

export const inactiveUserMiddleware = (to, from, next) => {
    const user = store.getters["auth/user"]
    if (user && user.isDeleted) {
        next();
    } else {
        next({name: "home"});
    }
}