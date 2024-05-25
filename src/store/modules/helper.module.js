import * as types from '../mutation-types';

export const helpers_store = {
    namespaced: true,

    state: () => {
        return {
            show_full_page_loader: false,
        }
    },

    mutations: {
        [types.TOGGLE_FULL_PAGE_LOADER](state, payload) {
            state.show_full_page_loader = payload;
        }
    },

    getters: {
        showFullPageLoader: state => state.show_full_page_loader
    },
}