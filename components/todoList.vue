<template>
  <ul>
    <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
  </ul>
</template>

<script setup>
    import { storeToRefs } from 'pinia';
    import { useTodosStore } from '~/state/todosStore'
    const store = useTodosStore()
    const {todos} = storeToRefs(store);
</script>