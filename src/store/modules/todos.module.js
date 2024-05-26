import * as types from '../mutation-types';

export const todos_store = {
    namespaced: true,

    state: () => ({
        todos: []
    }),

    mutations: {
        [types.SET_TODOS](state, {todos}) {
            state.todos = todos || [];
        },

        [types.ADD_TODO](state, {todo}) {
            state.todos = [...state.todos, todo];
        },

        [types.UPDATE_TODO](state, {id, updated_props}) {
            const todos = [...state.todos];
            const index = todos.findIndex(todo => todo._id === id);
            if (index === -1) return;

            todos[index] = {...todos[index], ...updated_props}
            state.todos = todos;
        },

        [types.DELETE_TODO](state, {id}) {
            state.todos = [...state.todos].filter(todo => todo._id !== id);
        }
    },

    getters: {
        todos: state => state.todos
    }
}