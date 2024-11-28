<template>
    <div>
        <Todo v-for="todo in oneListTodos" :key="todo.id" :todo="todo" @update:completed="handleUpdateCompleted" @remove="handleRemoveTodo" />
    </div>
</template>

<script setup>
    import { storeToRefs } from 'pinia'
    import { useTodosStore } from '~/state/todosStore'
    import { useTodos as useTodosService } from  '~/services/todos'
    import { doc } from 'firebase/firestore'
    import { useNuxtApp } from '#app'


    const props = defineProps({
        listId: {
            type: Number,
            required: true
        },
        listName: {
            type: String,
            required: true
        }
    })

    const todosService = useTodosService();
    
    import Todo from './todo.vue';

    const store = useTodosStore()
    const {todos} = storeToRefs(store);
    
    const oneListTodos = computed(() => {
        const { $firebaseDb: db } = useNuxtApp()
        // 创建对 lists collection 中特定文档的引用
        const listRef = doc(db, 'lists', props.listId.toString())
        return todos.value.filter((todo) => {
            // 比较引用对象
            return todo.list_id?.path === listRef.path
        })
    })

    console.log('oneListTodos', oneListTodos.value);
    const handleUpdateCompleted = async (id, completed) => {
        store.completeTodo(id, completed);
        try {
            console.log('id', id, 'completed', completed)
            await todosService.updateTodo(id, completed);
        } catch (error) {
            // 乐观更新，如果更新失败，则恢复原状态
            store.completeTodo(id, !completed);
            console.error('Error updating todo:', error);
        }
    }

    const handleRemoveTodo = async (id) => {
        let originTodo = store.removeTodo(id);
        try {
            await todosService.deleteTodo(id);
        } catch (error) {
            // 乐观更新，如果删除失败，则恢复原状态
            store.addTodo(originTodo);
            console.error('Error deleting todo:', error);
        }
    }
</script>