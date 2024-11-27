<script setup>
    import { ref } from 'vue';
    import { useTodosStore } from '~/state/todosStore'

    // useTodosStore 是 Pinia 提供的组合式函数(Composable)
    // 它用于创建和访问 store 实例
    // 这是 Pinia 的设计模式，通过 use 前缀表示这是一个组合式 API
    // 返回的是 store 实例，可以访问 state、getters 和 actions
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
            title.value = ''; // Clear input after adding
        } catch (error) {
            // 乐观更新，如果添加失败，则从 state 中移除
            await useTodosStore().removeTodo(newTodo.id);
            console.error('Error adding todo:', error);
        }
    }
</script>

<template>
  <div class="mb-4 flex gap-2">
    <input 
      type="text" 
      v-model="title" 
      placeholder="Add your task" 
      class="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-red-400 focus:outline-none"
    />
    <button 
      @click="addTodo"
      class="rounded-md bg-red-400 px-6 py-2 text-white hover:bg-red-500"
    >
      ADD
    </button>
  </div>
</template>
