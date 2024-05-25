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

        [types.TOGGLE_COMPLETED_STATUS](state, {id}) {
            const todos = [...state.todos];
            const index = todos.findIndex(todo => todo._id === id);
            if (index === -1) return;

            todos[index] = {...todos[index], completed: !todos[index].completed}
            state.todos = todos;
        }
    },

    getters: {
        todos: state => state.todos
    }
}