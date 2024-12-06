<script setup> 
  import EmptyList from "@/components/emptyList.vue";
  import Lists from "@/components/lists.vue";
  import AddList from "@/components/addList.vue";
  import { useTodosStore } from '~/state/todosStore'
  import { storeToRefs } from 'pinia';
  import { useTodoApi } from '~/apis/todoApi'

  const store = useTodosStore()
  const {todos: todosStore} = storeToRefs(store);
  const { $user } = useNuxtApp()

  watchEffect(async () => {
    if ($user.value) {
      const initTodos = await useTodoApi().getTodos($user.value.uid);
      store.setTodos(initTodos);
    }
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