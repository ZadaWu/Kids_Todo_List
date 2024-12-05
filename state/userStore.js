import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        token: null
    }),
    getters: {
        getUser: (state) => state.user,
        getToken: (state) => state.token
    },
    actions: {
        setUser(user) {
            this.user = user
        },
        setToken(token) {
            this.token = token
        }
    }
})