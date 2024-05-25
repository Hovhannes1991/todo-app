import {createStore} from 'vuex'
import {user_store} from "@/store/modules/auth.module.js";
import {todos_store} from "@/store/modules/todos.module.js";
import {helpers_store} from "@/store/modules/helper.module.js";

export const store = createStore({
    modules: {
        auth: user_store,
        todos: todos_store,
        helpers: helpers_store
    }
})