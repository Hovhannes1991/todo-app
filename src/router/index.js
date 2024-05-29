import {createWebHistory, createRouter} from 'vue-router';
import routes from "./routes.js";
import {beforeEach, afterEach} from "./router-functions.js";


const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(beforeEach);
router.afterEach(afterEach);

export default router;

