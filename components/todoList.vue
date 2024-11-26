<template>
    <div>
        <Todo v-for="todo in todos" :key="todo.id" :todo="todo" @update:completed="handleUpdateCompleted" @edit="handleEditTodo" />
    </div>
</template>

<script setup>
    import { storeToRefs } from 'pinia';
    import { useTodosStore } from '~/state/todosStore'
    import Todo from './todo.vue';

    const store = useTodosStore()
    const {todos} = storeToRefs(store);

    const handleUpdateCompleted = (id, completed) => {
        // store.updateCompleted(id, completed);
        store.completeTodo(id, !completed);
    }

    const handleEditTodo = (id) => {
        console.log('edit', id);
    }
</script>