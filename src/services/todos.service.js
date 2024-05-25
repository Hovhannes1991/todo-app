import axios from "axios";

export const getUserTodos = (user_id) => {
    return axios.get("/todo/get-all?user_id=" + user_id)
}
export const toggleTodo = (id) => {
    return axios.post("/todo/toggle", {id});
}

export const addTodo = (todo) => {
    return axios.post("/todo/add", {title: todo})
}