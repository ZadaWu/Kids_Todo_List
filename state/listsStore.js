import { defineStore } from 'pinia'

export const useListsStore = defineStore('lists', {
    state: () => ({
        lists: []
    }),
    getters: {
        getLists: (state) => state.lists
    },
    actions: {
        setLists(lists) {
            this.lists = lists
        },
        addList(list) {
            this.lists.push(list)
        },
        deleteList(id) {
            this.lists = this.lists.filter((list) => list.id !== id)
        },
        updateList(id, name) {
            const index = this.lists.findIndex((list) => list.id === id)
            if (index !== -1) {
                this.lists[index].name = name
            }
        },
        achieveList(id) {
            const index = this.lists.findIndex((list) => list.id === id)
            if (index !== -1) {
                this.lists[index].is_completed = true
            }
        }
    }
})