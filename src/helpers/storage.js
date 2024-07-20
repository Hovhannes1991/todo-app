export const saveTokens = ({accessToken, refreshToken}) => {
    if (accessToken) localStorage.setItem("access_token", accessToken);
    if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
}

export const getTokens = () => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    return {accessToken, refreshToken}
}

export const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
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