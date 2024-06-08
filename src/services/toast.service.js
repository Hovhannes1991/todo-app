import {toast} from "vue3-toastify";

const autoClose = 1000;
export const toastSuccess = (message) => {
    toast.success(message, {transition: "flip", autoClose});
}

export const toastWarn = (message) => {
    toast.warn(message, {transition: "bounce", autoClose});
}

export const toastError = (message) => {
    toast.success(message, {transition: "bounce", autoClose});
}

export const toastService = {
    success: toastSuccess,
    warn: toastWarn,
    error: toastError
}