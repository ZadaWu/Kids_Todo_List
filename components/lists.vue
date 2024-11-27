<script setup>
import { useListsStore } from '@/state/listsStore'
import { useListService } from '@/services/list'
import TodoList from './todoList.vue'
import AddTodos from './addTodos.vue'
const listsStore = useListsStore()
const listService = useListService()


onMounted(async () => {
    listsStore.setLists(await listService.getLists())
})


</script>

<template>
    <div class="flex flex-row items-start justify-top gap-6 p-4">
        <div v-for="list in listsStore.getLists" 
             :key="list?.id" 
             class="w-[350px] p-6 rounded-lg list-card">
            <div class="list-header">
                <h1 class="mb-2 text-2xl font-bold">{{ list?.name }} 📝</h1>
            </div>
            <AddTodos :listId="list?.id" />
            <TodoList :listId="list?.id" :listName="list?.name" />
        </div>
    </div>
</template>

<style scoped>
.list-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(209, 213, 219, 0.3);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.list-header {
    border-bottom: 2px solid rgba(209, 213, 219, 0.3);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
}
</style>