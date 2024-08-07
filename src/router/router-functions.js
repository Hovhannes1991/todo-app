import {checkAuthMiddleware} from "@/middlewares/check-auth.async.middleware.js";
import {authMiddleware} from "@/middlewares/auth.middleware.js";
import {activeUserMiddleware} from "@/middlewares/active-user.middleware.js";
import {inactiveUserMiddleware} from "@/middlewares/inactive-user.middleware.js";
import {emailVerificationMiddleware} from "@/middlewares/email-verification.middleware.js";
import {guestMiddleware} from "@/middlewares/guest.middleware.js";
import {setGetPageFlushMessage} from "@/helpers/storage.js";
import {toastService} from "@/services/toast.service.js";

const GLOBAL_MIDDLEWARES = [checkAuthMiddleware];

const middlewares = {
    auth: authMiddleware,
    guest: guestMiddleware,
    activeUser: activeUserMiddleware,
    inactiveUser: inactiveUserMiddleware,
    emailVerification: emailVerificationMiddleware
}
export const beforeEach = ((to, from, next) => {
    if (to.meta.middleware) {
        const routeMiddlewares = to.meta.middleware.map(m => middlewares[m]);
        const allMiddlewares = [...GLOBAL_MIDDLEWARES, ...routeMiddlewares];
        runMiddlewares(allMiddlewares, to, from, next);
    } else {
        runMiddlewares(GLOBAL_MIDDLEWARES, to, from, next);
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


export const afterEach = () => {
    const {message, type} = setGetPageFlushMessage();
    if (message && type) {
        toastService[type](message);
    }
}