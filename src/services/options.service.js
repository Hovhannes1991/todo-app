export const filterOptions = () => {
    return [
        {
            label: "Status",
            code: "status",
            items: [
                {label: "Completed", value: "status-completed"},
                {label: "Pending", value: "status-pending"}
            ]
        }
    ];
}