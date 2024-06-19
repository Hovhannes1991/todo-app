import {createApp} from 'vue'
import './style.css'
import 'vue3-toastify/dist/index.css';
import App from './App.vue'
import router from "@/router/index.js";
import {store} from "@/store/index.js";

import {i18n} from "./i18n/index.js";

import "./plugins/font-awsome-icons.js";

import PrimeVue from 'primevue/config';

const app = createApp(App);
app.use(i18n);
app.use(PrimeVue);
app.use(router);
app.use(store);


app.mount('#app')
