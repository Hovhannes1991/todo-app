import {createStore} from 'vuex'
import {userStore} from "@/store/modules/auth.module.js";
import {todosStore} from "@/store/modules/todos.module.js";
import {helpersStore} from "@/store/modules/helper.module.js";
import {countriesStore} from "@/store/modules/countries.module.js";

export const store = createStore({
    modules: {
        auth: userStore,
        todos: todosStore,
        helpers: helpersStore,
        countries: countriesStore
    }
})