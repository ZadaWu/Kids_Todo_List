<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { notification } from '~/composables/notification'


const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    error.value = ''
    await login(email.value, password.value)
    notification.show({
      type: 'success',
      message: '登录成功'
    })
    await navigateTo('/todos')

  } catch (err) {
    console.log(23, err)
    notification.show({
      type: 'error',
      message: '登录失败，请检查邮箱和密码'
    })
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
      <h2 class="text-3xl font-bold text-center mb-8">登录</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">邮箱</label>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">密码</label>
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
        
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          登录
        </button>
      </form>

      <div class="mt-6 text-center">
        <NuxtLink to="/register" class="text-blue-600 hover:text-blue-800">
          还没有账号？立即注册
        </NuxtLink>
      </div>
    </div>
  </div>
</template> 