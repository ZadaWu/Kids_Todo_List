import redis from '~/server/redis'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const userData = {
      ...body,
      lastLogin: new Date().toISOString()
    }
    
    await redis.hset(`user:${body.uid}`, userData)
    return { status: 'success', data: userData }
  } catch (error: any) {
    console.error('Error saving user data:', error)
    return { status: 'error', message: error?.message || 'Unknown error' }
  }
}) 