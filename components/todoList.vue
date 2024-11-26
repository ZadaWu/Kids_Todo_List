<template>
    <div>
        <Todo v-for="todo in todos" :key="todo.id" :todo="todo" @update:completed="handleUpdateCompleted" @edit="handleRemoveTodo" />
    </div>
</template>

<script setup>
    import { storeToRefs } from 'pinia'
    import { useTodosStore } from '~/state/todosStore'
    import { useTodos as useTodosService } from  '~/services/todos'
    const todosService = useTodosService();
    
    import Todo from './todo.vue';

    const store = useTodosStore()
    const {todos} = storeToRefs(store);

    const handleUpdateCompleted = async (id, completed) => {
        store.completeTodo(id, completed);
        try {
            await todosService.updateTodo(id, completed);
        } catch (error) {
            // 乐观更新，如果更新失败，则恢复原状态
            store.completeTodo(id, !completed);
            console.error('Error updating todo:', error);
        }
    }

    const handleRemoveTodo = (id) => {
        store.removeTodo(id);
    }
</script>