import * as types from '../mutation-types';
import {getAllCountries} from "@/services/http/countries.service.js";

export const countries_store = {
    namespaced: true,

    state: () => {
        return {
            countries: [],
            cities: false
        }
    },

    mutations: {
        [types.FETCH_COUNTRIES](state, payload) {
            state.countries = payload.countries;
        }
    },

    actions: {
        async fetchCountries(context) {
            try {
                const {data} = await getAllCountries();
                context.commit(types.FETCH_COUNTRIES, {countries: data.data});
            } catch (err) {
                console.log(err);
            }
        }
    },

    getters: {
        countries: state => state.countries,

        cities: state => state.cities
    },
}