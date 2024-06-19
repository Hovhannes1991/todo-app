import {i18n} from "@/i18n/index.js";
import * as types from '../mutation-types';
import {getTokens, clearTokens, saveUserData, clearUserData, setGetPageFlushMessage} from "@/helpers/storage.js";
import {getUserByToken, logout} from "@/api/auth.service.js";

export const user_store = {
    namespaced: true,

    state: () => ({
        user: null,
    }),

    mutations: {
        [types.UPDATE_USER](state, payload) {
            state.user = payload.user;
        },

        [types.UPDATE_USER_PROPERTY](state, payload) {
            const user = {...state.user}
            for(let key in payload) {
                user[key] = payload[key];
            }
            state.user = user;
        }
    },

    actions: {
        async checkAuth(context) {
            const {access_token} = getTokens();
            if (context.getters.user || !access_token) return;

            try {
                context.commit("helpers/" + types.TOGGLE_FULL_PAGE_LOADER, true, {root: true});
                const {data} = await getUserByToken();
                context.commit(types.UPDATE_USER, {user: data.user});
                saveUserData(data.user);
            } catch (err) {
                console.log(err);
                clearTokens();
                clearUserData();
                context.commit(types.UPDATE_USER, {user: null});
            }
            context.commit("helpers/" + types.TOGGLE_FULL_PAGE_LOADER, false, {root: true});
        },

        async logout(context) {
            try {
                await logout();
                clearTokens();
                clearUserData();
                setGetPageFlushMessage(i18n.global.t("logout_success"));
                context.commit(types.UPDATE_USER, {user: null});
            } catch (err) {
                console.log(err);
            }
        }
    },

    getters: {
        user: state => state.user,

        todos: state => state.user?.todos || []
    }
}