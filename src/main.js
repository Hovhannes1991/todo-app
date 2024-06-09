import {createApp} from 'vue'
import './style.css'
import 'vue3-toastify/dist/index.css';
import App from './App.vue'
import router from "@/router/index.js";
import {store} from "@/store/index.js";
import "./plugins/axios.js";

import PrimeVue from 'primevue/config';

import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';

library.add(fas, fab);

const app = createApp(App);
app.use(PrimeVue);
app.use(router);
app.use(store);


app.mount('#app')
