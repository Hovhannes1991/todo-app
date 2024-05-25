import Swal from 'sweetalert2';
import router from '@/router/index.js';
import axios from 'axios';
import {clearTokens, getTokens, saveTokens} from "@/helpers/storage.js";

const MODE = import.meta.env.MODE

const BASE_URL_PROD = 'https://todo-app-manager-backend.vercel.app/';
const BASE_URL_DEV = 'http://localhost:4000/';
const BASE_URL = MODE === "development" ? BASE_URL_DEV : BASE_URL_PROD;
axios.defaults.baseURL = BASE_URL;

const REFRESH_TOKEN_URL = "auth/refresh-token";


//the variable is for checking is the refresh call running
let isRefreshing = false;

//we need to keep failed requests, when refresh call updates the access token, but some of them get unauthorised,
//then execute with new access token
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Request interceptor
axios.interceptors.request.use(request => {
    const {access_token} = getTokens();

    if (access_token) {
        request.headers['Authorization'] = `Bearer ${access_token}`;
    }

    request.headers['Access-Control-Allow-Origin'] = '*';

    return request
})


// Response interceptor
axios.interceptors.response.use(response => response, err => {
    const originalRequest = err.config;

    const ERROR_STATUS = err?.response?.status || 500;

    if (ERROR_STATUS === 401 && !originalRequest._retry && originalRequest.url !== REFRESH_TOKEN_URL) {
        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({resolve, reject});
            })
                .then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axios(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise(function (resolve, reject) {
            const {refresh_token} = getTokens();
            axios.post(REFRESH_TOKEN_URL, {refresh_token})
                .then(({data}) => {
                    const access_token = data.access_token;
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
                    originalRequest.headers['Authorization'] = 'Bearer ' + access_token;
                    saveTokens({access_token})
                    processQueue(null, data);
                    resolve(axios(originalRequest));
                })
                .catch(error => {
                    processQueue(error, null);
                    clearTokens();
                    router.push({name: "auth"});
                    reject(error);
                })
                .finally(() => {
                    isRefreshing = false;
                });
        });
    }


    if (ERROR_STATUS >= 500) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!"
        });
    }


    if (ERROR_STATUS === 403) {
        router.push({name: '403'})
    }

    if (ERROR_STATUS === 404) {
        router.push({name: '404'})
    }


    return Promise.reject(err);
})