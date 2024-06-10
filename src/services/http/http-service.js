import axiosInstance from "@/services/http/axios-instance.js";

export const httpService = {
    get(url, config = {}) {
        return axiosInstance.get(url, config);
    },
    post(url, data, config = {}) {
        return axiosInstance.post(url, data, config);
    },
    put(url, data, config = {}) {
        return axiosInstance.put(url, data, config);
    },
    delete(url, config = {}) {
        return axiosInstance.delete(url, config);
    }
};