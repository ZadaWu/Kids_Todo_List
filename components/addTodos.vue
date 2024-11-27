<script setup>
import { ref } from 'vue';
import { useTodosStore } from '~/state/todosStore'
import VoiceInput from './VoiceInput.vue'
import { useTodos as useTodosService } from '~/services/todos'

const todosService = useTodosService();
const title = ref('');
const props = defineProps({
    listId: {
        type: Number,
        required: true
    }
})

const addTodo = async () => {
    if (!title.value.trim()) return;
    
    const newTodo = {
        title: title.value,
        is_completed: false,
        created_at: new Date(),
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        list_id: props.listId
    }
    useTodosStore().addTodo(newTodo);
    try {
        await todosService.addTodo(newTodo);
        title.value = '';
    } catch (error) {
        await useTodosStore().removeTodo(newTodo.id);
        console.error('Error adding todo:', error);
    }
}

const handleVoiceInput = (event) => {
    title.value = event.text;
}
</script>

<template>
    <div class="add-todo-container">
        <div class="input-group">
            <input 
                type="text" 
                v-model="title" 
                placeholder="Add your task" 
                class="task-input"
                @keyup.enter="addTodo"
            />
            <VoiceInput @input="handleVoiceInput" />
        </div>
        <button 
            @click="addTodo"
            class="add-button"
        >
            Add Task
        </button>
    </div>
</template>

<style scoped>
.add-todo-container {
    background: white;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.input-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.task-input {
    flex: 1;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    transition: all 0.2s;
}

.task-input:focus {
    outline: none;
    border-color: #f87171;
    box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
}

.add-button {
    width: 100%;
    padding: 0.75rem;
    background: #f87171;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
}

.add-button:hover {
    background: #ef4444;
}

.add-button:active {
    transform: translateY(1px);
}
</style>
