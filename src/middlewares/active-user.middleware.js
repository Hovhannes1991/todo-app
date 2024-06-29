import {store} from "@/store/index.js";

export const activeUserMiddleware = (to, from, next) => {
    const user = store.getters["auth/user"]
    if (user && !user.is_deleted) {
        next();
    } else {
        next({name: "restore-profile"});
    }
}