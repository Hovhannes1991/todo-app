import {i18n} from "@/i18n/index.js";
export const dateParse = (date_string, long = true) => {
    const date = new Date(date_string);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month_key = date.toLocaleString('default', {month: long ? 'long': 'short'}).toLowerCase();
    const month = i18n.global.t(`${month_key}`);
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
}