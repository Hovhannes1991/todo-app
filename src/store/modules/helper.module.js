import * as types from '../mutation-types';

export const helpersStore = {
    namespaced: true,

    state: () => {
        return {
            showFullPageLoader: false,

            emailVerificationTokenIsSent: false
        }
    },

    mutations: {
        [types.TOGGLE_FULL_PAGE_LOADER](state, payload) {
            state.showFullPageLoader = payload;
        },

        [types.SET_EMAIL_VERIFICATION_IS_SENT](state, payload) {
            state.emailVerificationTokenIsSent = payload;
        }
    },

    getters: {
        showFullPageLoader: state => state.showFullPageLoader,

        emailVerificationTokenIsSent: state => state.emailVerificationTokenIsSent
    },
}