import redis from '~/server/redis'

export default defineEventHandler(async (event) => {
  try {
    await redis.set('test', 'Redis connection successful')
    const result = await redis.get('test')
    return { status: 'success', message: result }
  } catch (error: any) {
    console.error('Redis connection error:', error)
    return { status: 'error', message: error?.message || 'Unknown error' }
  }
}) 