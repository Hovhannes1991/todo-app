import {checkAuthMiddleware} from "@/middlewares/check-auth.async.middleware.js";
import {authMiddleware} from "@/middlewares/auth.middleware.js";
import {guestMiddleware} from "@/middlewares/guest.middleware.js";

const global_middlewares = [checkAuthMiddleware];

const middlewares = {
    auth: authMiddleware,
    guest: guestMiddleware
}
export const beforeEach = ((to, from, next) => {
    if (to.meta.middleware) {
        const route_middlewares = to.meta.middleware.map(m => middlewares[m]);
        const all_middlewares = [...global_middlewares, ...route_middlewares];
        runMiddlewares(all_middlewares, to, from, next);
    } else {
        runMiddlewares(global_middlewares, to, from, next);
    }
});

function runMiddlewares(middlewares, to, from, next) {
    const stack = middlewares.reverse();
    const _next = (...args) => {
        if (args.length > 0 || stack.length === 0) {
            next(...args);
        } else {
            const middleware = stack.pop();
            if (typeof middleware === 'function') {
                middleware(to, from, _next);
            } else {
                next();
            }
        }
    };

    _next();
}