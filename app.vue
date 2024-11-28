<script setup>
import { useAuth } from '~/composables/useAuth'
import { onMounted, onUnmounted } from 'vue'
const { $firebaseAuth } = useNuxtApp()
import { onAuthStateChanged } from 'firebase/auth'

const { user } = useAuth()

// 监听用户状态
onMounted(() => {
  // const unsubscribe = onAuthStateChanged($firebaseAuth, (firebaseUser) => {
  //   user.value = firebaseUser
  // })

})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
