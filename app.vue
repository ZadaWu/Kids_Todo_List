<script setup>
  import AddTodos from "@/components/addTodos.vue";
  import EmptyList from "@/components/emptyList.vue";
  import TodoList from "@/components/todoList.vue";
  import { useTodos } from '~/hooks/useTodos'
  import { useTodosStore } from '~/state/todosStore'
  import { storeToRefs } from 'pinia';

  const { fetchTodos } = useTodos();
  const store = useTodosStore()
  const {todos: todosStore} = storeToRefs(store);

  onMounted(async () => {
    const initTodos = await fetchTodos();
    store.setTodos(initTodos);
  })
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <div class="todo-container">
      <h1>Todo List</h1>
      <AddTodos />
      <EmptyList v-if="todosStore.length === 0">No todos found</EmptyList>
      <TodoList/>
    </div>
  </div>
</template>
