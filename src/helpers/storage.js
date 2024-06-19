export const saveTokens = ({access_token, refresh_token}) => {
    if (access_token) localStorage.setItem("access_token", access_token);
    if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
}

export const getTokens = () => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    return {access_token, refresh_token}
}

export const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
}

export const getUserData = () => {
    const user_data = localStorage.getItem("user_data");
    if (!user_data) return null;
    return JSON.parse(user_data);
}

export const getUserId = () => {
    const user_data = getUserData();
    return user_data?.id;
}

export const saveUserData = (user) => {
    localStorage.setItem("user_data", JSON.stringify(user));
}

export const clearUserData = () => {
    localStorage.removeItem("user_data");
}

export const setGetAuthPageSection = (section) => {
    if (section) localStorage.setItem("auth_page_section", section);
    else return localStorage.getItem("auth_page_section");
}

export const setGetPageFlushMessage = (message, type = "success") => {
    if (message) localStorage.setItem("flush_message", JSON.stringify({message, type}));
    else {
        const data = JSON.parse(localStorage.getItem("flush_message"));
        localStorage.removeItem("flush_message");
        return {message: data?.message, type: data?.type};
    }
}


export const getSelectedLocale = () => {
    return localStorage.getItem("locale") || null;
}

export const setSelectedLocale = (language) => {
    localStorage.setItem("locale", language);
}