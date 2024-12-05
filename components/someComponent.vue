<script setup>
import { useUserStore } from '~/state/userStore'

const userStore = useUserStore()
const user = computed(() => userStore.getUser)

// 使用用户信息
console.log('Current user:', user.value)

// 发送请求时会自动带上认证头
const makeRequest = async () => {
  try {
    const response = await useFetch('/api/some-endpoint')
    // ...
  } catch (error) {
    console.error('Request error:', error)
  }
}
</script> 