import {store} from "@/store/index.js";
import {getTokens} from "@/helpers/storage.js";


export const checkAuthMiddleware = async (to, from, next) => {
    if (store.getters["auth/user"]) next();
    else if (!getTokens().access_token) next();

    else {
        await store.dispatch("auth/checkAuth");
        next();
    }
}