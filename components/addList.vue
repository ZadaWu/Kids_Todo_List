<script setup>
import { useListsStore } from '@/state/listsStore'
import Modal from './modal.vue'
import { notification } from '~/composables/notification'
import { useListApi } from '~/apis/listApi'
const listsStore = useListsStore()
const isAddListModalOpen = ref(false)
const newListName = ref('')

const addList = async (listName) => {
    console.log(12, listName)
    listName = listName || 'New List'
    try {
        listsStore.addList({name: listName})
        await useListApi().addList({name: listName})
        isAddListModalOpen.value = false
        notification.show({
            type: 'success',
            message: 'List created successfully'
        })
    } catch (error) {
        listsStore.removeList(listsStore.getLists.length - 1)
        isAddListModalOpen.value = false
        console.error('Error adding list:', error)
        notification.show({
            type: 'error',
            message: 'Error adding list'
        })
    }
}

const openAddListModal = () => {
    isAddListModalOpen.value = true
}

</script>

<template>
    <div class="header">
        <button class="bg-blue-500 text-white px-4 py-2 rounded-md" @click="openAddListModal">Add List</button>
        <Modal :show="isAddListModalOpen" @close="isAddListModalOpen = false">
            <div>
                <div><input type="text" class="rounded-md border border-gray-300 px-4 py-2 focus:border-red-400 focus:outline-none" v-model="newListName" placeholder="Add your list name" /></div>
                <div class="mt-4"><button class="bg-blue-500 text-white px-4 py-2 rounded-md" @click="addList(newListName.value)">create</button></div>
            </div>
        </Modal>
    </div>
</template>

<style scoped>  
.header {
   height: 100px;
   width: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
}
</style>