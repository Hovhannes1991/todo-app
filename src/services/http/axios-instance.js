import axios from 'axios';
import router from '@/router/index.js';
import Swal from 'sweetalert2';
import {clearTokens, getTokens, saveTokens} from "@/helpers/storage.js";

const MODE = import.meta.env.MODE

const BASE_URL_PROD = 'https://todo-app-manager-backend.vercel.app/';
const BASE_URL_DEV = 'http://localhost:4000/';
const BASE_URL = MODE === "development" ? BASE_URL_DEV : BASE_URL_PROD;

const axiosInstance = axios.create({
    baseURL: BASE_URL
});

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
axiosInstance.interceptors.request.use(request => {
    const {accessToken} = getTokens();

    if (accessToken) {
        request.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    request.headers['Access-Control-Allow-Origin'] = '*';

    return request
})


// Response interceptor
axiosInstance.interceptors.response.use(response => response, err => {
    const originalRequest = err.config;

    const ERROR_STATUS = err?.response?.status || 500;

    if (ERROR_STATUS === 401 && !originalRequest._retry && originalRequest.url !== REFRESH_TOKEN_URL) {
        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({resolve, reject});
            })
                .then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosInstance(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise(function (resolve, reject) {
            const {refreshToken} = getTokens();
            axiosInstance.post(REFRESH_TOKEN_URL, {refreshToken})
                .then(({data}) => {
                    const accessToken = data.accessToken;
                    axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
                    originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
                    saveTokens({accessToken})
                    processQueue(null, data);
                    resolve(axiosInstance(originalRequest));
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

export default axiosInstance;