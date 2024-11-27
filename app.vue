<script setup>
  import EmptyList from "@/components/emptyList.vue";
  import Lists from "@/components/lists.vue";
  import AddList from "@/components/addList.vue";
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
  <div class="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
    <AddList />
    <div class="w-[1200px] rounded-lg bg-white p-6 shadow-xl">
      <EmptyList v-if="todosStore.length === 0">No todos found</EmptyList>
      <Lists />
    </div>
  </div>
</template>
