<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router'
import { notification } from '~/composables/notification'
const router = useRouter()
const { register } = useAuth()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

const handleRegister = async () => {
  try {
    error.value = ''
    if (password.value !== confirmPassword.value) {
      error.value = '两次输入的密码不一致'
      return
    }
    const res = await register(email.value, password.value)
    console.log(23, res)
    notification.show({
      type: 'success',
      message: '注册成功'
    })
    router.push('/todos')
  } catch (err) {
    notification.show({
      type: 'error',
      message: '注册失败，请稍后重试'
    })
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
      <h2 class="text-3xl font-bold text-center mb-8">注册</h2>
      
      <form @submit.prevent="handleRegister" class="space-y-6">
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

        <div>
          <label class="block text-sm font-medium text-gray-700">确认密码</label>
          <input
            v-model="confirmPassword"
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
          注册
        </button>
      </form>

      <div class="mt-6 text-center">
        <NuxtLink to="/login" class="text-blue-600 hover:text-blue-800">
          已有账号？立即登录
        </NuxtLink>
      </div>
    </div>
  </div>
</template> 