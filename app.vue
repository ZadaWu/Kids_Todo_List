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
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
    <div class="w-[400px] rounded-lg bg-white p-6 shadow-xl">
      <h1 class="mb-6 text-2xl font-bold">To-Do List 📝</h1>
      <AddTodos />
      <EmptyList v-if="todosStore.length === 0">No todos found</EmptyList>
      <TodoList/>
    </div>
  </div>
</template>
