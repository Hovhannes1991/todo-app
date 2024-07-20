import {httpService} from "@/services/http/http-service.js";

export const getUserTodos = (userId) => {
    return httpService.get("/todo/get-all?user_id=" + userId);
}
export const toggleTodo = (id) => {
    return httpService.post("/todo/toggle", {id});
}

export const addTodo = (todo) => {
    return httpService.post("/todo/add", {title: todo});
}

export const editTodo = (todo) => {
    return httpService.put("/todo/edit", {id: todo._id, todo})
}

export const deleteTodo = (id) => {
    return httpService.delete("/todo/delete?id=" + id);
}