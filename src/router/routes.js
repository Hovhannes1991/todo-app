const AuthPage = () => import("@/pages/AuthPage.vue");
const HomePage = () => import("@/pages/HomePage.vue");

const NotFound404 = () => import("@/pages/404.vue");
const AccessDenied403 = () => import("@/pages/403.vue");

const routes = [
    {path: '/', redirect: {name: 'home'}},
    {path: '/auth', name: "auth", component: AuthPage, meta: {middleware: ["guest"], layout: "empty"}},
    {path: '/home', name: "home", component: HomePage, meta: {middleware: ["auth"]}},
    {path: '/access-denied', name: "403", component: AccessDenied403, meta: {layout: "empty"}},
    {path: '/not-found', name: "404", component: NotFound404, meta: {layout: "empty"}},
    {path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound404, meta: {layout: "empty"}},
]

export default routes;