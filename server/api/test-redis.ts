import redis from '~/server/redis'
import { verifyAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // 验证并解析 token
    await verifyAuth(event, { required: true, parseToken: true })
    
    // 现在可以从 context 中获取用户信息
    const userId = event.context.auth?.uid
    console.log('User ID:', userId)

    await redis.set('test', 'Redis connection successful')
    const result = await redis.get('test')
    return { status: 'success', message: result }
  } catch (error: any) {
    console.error('API error:', error)
    return { 
      status: 'error', 
      message: error?.message || 'Unknown error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }
  }
}) 