import {i18n} from "@/i18n/index.js";
export const dateParse = (dateString, long = true) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const monthKey = date.toLocaleString('default', {month: long ? 'long': 'short'}).toLowerCase();
    const month = i18n.global.t(`${monthKey}`);
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
}