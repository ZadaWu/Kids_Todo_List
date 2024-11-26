import { defineStore } from 'pinia'

export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: []
  }),
  getters: {
    getTodos: (state) => state.todos
  },
  actions: {
    setTodos( todos) {
      this.todos = todos;
    },
    addTodo(todo) {
      this.todos.push(todo);
    },
    removeTodo(id) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
    },
    updateTodo(todo) {
      const index = state.todos.findIndex((t) => t.id === todo.id);
      if(index !== -1) {
        state.todos[index] = todo;
      }
    }
  }
})