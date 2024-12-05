import redis from '~/server/redis'
import { adminAuth } from '~/server/utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    console.log(1, 'adminAuth')
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'No token provided'
      })
    }

    const token = authHeader.split('Bearer ')[1]
    console.log(2, token)
    if (token && token !== ''){
      const decodedToken = await adminAuth.verifyIdToken(token)
      const userRecord = await adminAuth.getUser(decodedToken.uid)
      console.log('User record:', userRecord)
    }
   
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