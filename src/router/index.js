import {createWebHistory, createRouter} from 'vue-router';
import routes from "./routes.js";
import {beforeEach} from "./router-functions.js";


const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(beforeEach);

export default router;

