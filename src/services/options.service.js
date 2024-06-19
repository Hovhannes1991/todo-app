import {i18n} from "@/i18n/index.js";


export const filterOptions = () => {
    return [
        {
            label: i18n.global.t("status"),
            code: "status",
            items: [
                {label: i18n.global.t("completed"), value: "status-completed"},
                {label: i18n.global.t("pending"), value: "status-pending"}
            ]
        }
    ];
}