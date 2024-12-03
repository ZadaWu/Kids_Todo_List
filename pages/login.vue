<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { notification } from '~/composables/notification'

const { login, loginWithGoogle, loginWithApple, loginAnonymously } = useAuth()

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

const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle()
    notification.show({
      type: 'success',
      message: '使用Google账号登录成功'
    })
    await navigateTo('/todos')
  } catch (err) {
    notification.show({
      type: 'error',
      message: '使用Google账号登录失败'
    })
  }
}

const handleAppleLogin = async () => {
  try {
    await loginWithApple()
    notification.show({
      type: 'success',
      message: '使用Apple账号登录成功'
    })
    await navigateTo('/todos')
  } catch (err) {
    notification.show({
      type: 'error',
      message: '使用Apple账号登录失败'
    })
  }
}

const handleAnonymousLogin = async () => {
  try {
    await loginAnonymously()
    notification.show({
      type: 'success',
      message: '访客登录成功'
    })
    await navigateTo('/todos')
  } catch (err) {
    notification.show({
      type: 'error',
      message: '访客登录失败'
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

      <div class="mt-8">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">或使用以下方式登录</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-3 gap-3">
          <button
            @click="handleGoogleLogin"
            class="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
          >
            <img src="~/assets/google-icon.svg" class="h-6 w-6" alt="Google logo" />
            <span class="ml-2 text-sm text-gray-600">Google</span>
          </button>

          <!-- <button
            @click="handleAppleLogin"
            class="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
          >
            <img src="~/assets/apple-icon.svg" class="h-6 w-6" alt="Apple logo" />
            <span class="ml-2 text-sm text-gray-600">Apple</span>
          </button> -->

          <button
            @click="handleAnonymousLogin"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <span class="sr-only">访客登录</span>
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div class="mt-6 text-center">
        <NuxtLink to="/register" class="text-blue-600 hover:text-blue-800">
          还没有账号？立即注册
        </NuxtLink>
      </div>
    </div>
  </div>
</template> 