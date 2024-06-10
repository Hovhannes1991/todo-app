const AuthPage = () => import("@/pages/AuthPage.vue");
const HomePage = () => import("@/pages/HomePage.vue");

const ProfilePage = () => import("@/pages/ProfilePage.vue");
const EmailVerify = () => import("@/pages/EmailVerify.vue");
const NotFound404 = () => import("@/pages/404.vue");
const AccessDenied403 = () => import("@/pages/403.vue");

const routes = [
    {path: '/', redirect: {name: 'home'}},
    {path: '/auth', name: "auth", component: AuthPage, meta: {middleware: ["guest"], layout: "guest"}},
    {path: '/home', name: "home", component: HomePage, meta: {middleware: ["auth", "emailVerification"]}},
    {path: '/profile', name: "profile", component: ProfilePage, meta: {middleware: ["auth", "emailVerification"]}},
    {path: '/email-verification', name: "email-verify", component: EmailVerify, meta: {middleware: ["auth"]}, layout: "guest"},
    {path: '/access-denied', name: "403", component: AccessDenied403, meta: {layout: "empty"}},
    {path: '/not-found', name: "404", component: NotFound404, meta: {layout: "empty"}},
    {path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound404, meta: {layout: "empty"}},
]

export default routes;