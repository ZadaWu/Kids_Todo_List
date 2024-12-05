<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <h1 class="text-xl font-bold">FamilyTodo</h1>
          <div class="flex items-center gap-4">
            <span class="text-gray-600">{{ $user?.email }}</span>
            <button 
              @click="handleSignOut"
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="pt-20">
      <div class="max-w-4xl mx-auto px-4">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center space-x-4">
            <div class="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
              <template v-if="$user?.photoURL">
                <img 
                  :src="$user.photoURL" 
                  :alt="$user?.displayName"
                  class="w-full h-full object-cover"
                >
              </template>
              <template v-else>
                <svg 
                  class="w-full h-full text-gray-400" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </template>
            </div>
            <div>
              <h1 class="text-2xl font-bold">{{ $user?.displayName || '未设置昵称' }}</h1>
              <p class="text-gray-600">{{ $user?.email }}</p>
            </div>
          </div>

          <div class="mt-8">
            <h2 class="text-lg font-semibold mb-4">账号信息</h2>
            <div class="space-y-2">
              <p>登录方式: {{ $user?.providerData[0]?.providerId || '未知' }}</p>
              <p>账号创建时间: {{ $user?.metadata?.creationTime }}</p>
              <p>最后登录时间: {{ $user?.metadata?.lastSignInTime }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '~/state/userStore'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const { signOut } = useAuth()
const router = useRouter()
const user = computed(() => userStore.getUser)
const token = computed(() => userStore.getToken)

const handleSignOut = async () => {
  try {
    await signOut()
    userStore.setUser(null)
    userStore.setToken(null)
    await router.push('/login')
  } catch (error) {
    console.error('退出失败:', error)
  }
}

const { $user, $token } = useNuxtApp()

// 直接使用 $user
console.log('Current user:', $user.value)

// 在 API 请求中使用
const redisTest = ref(null)

watchEffect(async () => {
  if ($token.value) {
    const { data } = await useFetch('/api/test-redis', {
      headers: {
        'Authorization': `Bearer ${$token.value}`
      }
    })
    redisTest.value = data.value
  }
})

</script>