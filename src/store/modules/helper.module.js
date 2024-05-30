import * as types from '../mutation-types';

export const helpers_store = {
    namespaced: true,

    state: () => {
        return {
            show_full_page_loader: false,

            email_verification_token_is_sent: false
        }
    },

    mutations: {
        [types.TOGGLE_FULL_PAGE_LOADER](state, payload) {
            state.show_full_page_loader = payload;
        },

        [types.SET_EMAIL_VERIFICATION_IS_SENT](state, payload) {
            state.email_verification_token_is_sent = payload;
        }
    },

    getters: {
        showFullPageLoader: state => state.show_full_page_loader,

        emailVerificationTokenIsSent: state => state.email_verification_token_is_sent
    },
}