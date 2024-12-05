<script setup>
import { useAuth } from '~/composables/useAuth'
import { useUserStore } from '~/state/userStore'
import { onMounted, onUnmounted } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'

const { $firebaseAuth } = useNuxtApp()
const userStore = useUserStore()
const router = useRouter()

// 监听用户状态
onMounted(() => {
  const unsubscribe = onAuthStateChanged($firebaseAuth, async (firebaseUser) => {
    console.log('Firebase Auth State Changed:', firebaseUser)
    if (firebaseUser) {
      const token = await firebaseUser.getIdToken()
      userStore.setUser(firebaseUser)
      userStore.setToken(token)
      // 如果在首页、登录页或注册页，重定向到 profile
      const currentPath = window.location.pathname
      if (['/', '/login', '/register'].includes(currentPath)) {
        await router.push('/profile')
      }
    } else {
      userStore.setUser(null)
      userStore.setToken(null)
      // 如果不在允许的页面，重定向到登录页
      const currentPath = window.location.pathname
      if (!['/login', '/register', '/'].includes(currentPath)) {
        await router.push('/login')
      }
    }
  })

  // 组件卸载时取消监听
  onUnmounted(() => {
    unsubscribe()
  })
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
